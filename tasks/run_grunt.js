/*
 * grunt-run-grunt * https://github.com/Bartvds/grunt-run-grunt *
 * Copyright (c) 2013 Bart van der Schoor
 * Licensed under the MIT license.
 */

'use strict';

function pluralise(count, str) {
	return count + ' ' + str + (count === 1 ? '' : 's');
}
var conf = require('./lib/conf');

// with flag type
var cliParams = {
	help: 'flag',
	base: 'string',
	no_color: 'flag',
	debug: 'flag',
	stack: 'flag',
	force: 'flag',
	tasks: 'string',
	npm: 'string',
	no_write: 'flag',
	verbose: 'flag',
	version: 'flag'
};

// with default values
var baseOptions = {
	cwd: null,
	log: true,
	logFile: null,
	debugCli: false,
	writeShell: null,
	indentLog: conf.indentLog,
	process: null,
	minimumFiles: 1,
	concurrent: 4,
	expectFail: false
};

var runGruntfile = require('./lib/runGruntfile').runGruntfile;

module.exports = function (grunt) {

	var _ = grunt.util._;

	var warnReal = grunt.fail.warn;
	var warnFake = function () {
		arguments[0] = 'Warning '.cyan + arguments[0];
		grunt.log.writeln.apply(null, arguments);
	};

	grunt.registerMultiTask('run_grunt', 'Run grunt-cli from within grunt.', function () {
		var options = this.options(baseOptions);
		options.concurrent = Math.max(1, options.concurrent);

		var warnIsCalled = false;
		var warnFail = warnReal;
		if (options.expectFail) {
			warnFail = function () {
				warnIsCalled = true;
				arguments[0] = 'Warning: '.yellow + '<ignored> '.green + String(arguments[0]);
				warnFake.apply(null, arguments);
			};
		}

		//var self = this;
		var done = this.async();
		var self = this;
		var fail = [];
		var pass = [];
		var start = Date.now();
		var counter = 0;

		grunt.util.async.forEachLimit(this.filesSrc, options.concurrent, function (filePath, callback) {
			if (!grunt.file.exists(filePath)) {
				grunt.log.writeln(conf.nub + 'not found "' + filePath + '"'.yellow);
				return false;
			}
			counter++;

			var runOptions = {
				target: self.target,
				task: options.task,
				args: {}
			};

			// loop default keys but read from options
			_.each(baseOptions, function (value, key) {
				runOptions[key] = options[key];
			});

			// import grunt-cli params
			_.each(cliParams, function (value, key) {
				if (!_.isUndefined(options[key])) {
					if (cliParams[key] === 'flag') {
						runOptions.args[key] = true;
					}
					else {
						runOptions.args[key] = options[key];
					}
				}
			});

			grunt.log.writeln(conf.nub + 'starting ' + ' "' + filePath + '"');

			// run it
			runGruntfile(grunt, filePath, options.task, runOptions, function (err, result) {

				if (!result) {
					callback(err || 'no result for ' + filePath);
				}
				else {
					var end = ' "' + filePath + '" (' + (result.duration) + 'ms)';
					if (result.fail) {
						fail.push(result);
						grunt.log.writeln(conf.nub + 'failed'.yellow + end);
					} else {
						pass.push(result);
						grunt.log.writeln(conf.nub + 'finished ' + end);
					}
					callback(err, result);
				}
			});

		}, function (err) {
			if (err) {
				console.dir(err);
				grunt.fail.fatal(err);
			}
			else {
				// fancy report
				var end = ' (' + (Date.now() - start) + 'ms)\n';
				var fail = false;

				var total = pass.length + fail.length;
				if (_.isNumber(options.minimumFiles) && options.minimumFiles > 0 && total < options.minimumFiles) {
					grunt.fail.warn('expected at least ' + pluralise(options.minimumFiles, 'gruntfile') + ' but ' + ('found only ' + total).red + end);
				}

				if (fail.length > 0) {
					_.each(fail, function (res) {
						grunt.log.writeln('-> failed '.red + res.options.target + ' @ "' + res.src + '"');
					});
					grunt.log.writeln('');
					warnFail((pluralise(fail.length, 'gruntfile') + ' failed').red + ' and ' + ('completed ' + pass.length).green + end);
				}
				else {
					grunt.log.writeln('');
					if (pass.length === 0) {
						grunt.log.ok('completed ' + pluralise(pass.length, 'gruntfile').yellow + '' + end);
					}
					else {
						grunt.log.ok('completed ' + pluralise(pass.length, 'gruntfile').green + '' + end);
					}
				}

				if (options.expectFail) {
					if (warnIsCalled) {
						grunt.log.ok('ignoring expected fail');
					}
					else {
						grunt.fail.warn('expected failure but got success');
					}
				}

			}
			done();
		});
	});
};