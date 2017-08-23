/*
 * grunt-run-grunt * https://github.com/Bartvds/grunt-run-grunt *
 * Copyright (c) 2017 Bart van der Schoor
 * Licensed under the MIT license.
 */

'use strict';

var lib = require('./../lib/lib');
var _ = require('lodash');
var async = require('async');

var runGruntfile = require('./../lib/runGruntfile').runGruntfile;

// with flag type
var cliParams = {
	help: 'flag',
	base: 'string',
	'no-color': 'flag',
	debug: 'flag',
	stack: 'flag',
	force: 'flag',
	tasks: 'string',
	npm: 'string',
	'no-write': 'flag',
	verbose: 'flag',
	version: 'flag'
};

// with default values
var baseOptions = {
	cwd: null,
	log: true,
	logFile: null,
	//noAnsi: true,
	debugCli: false,
	writeShell: null,
	indentLog: lib.indentLog,
	process: null,
	minimumFiles: 1,
	maximumFiles: 10,
	concurrent: require('os').cpus().length,
	expectFail: false,
	parser: null,
	env: {},
	gruntOptions: {},
	stdout: null,
	stderr: null
};

module.exports = function (grunt) {

	// experimental inversions
	var warnReal = grunt.fail.warn;
	var warnFake = function () {
		arguments[0] = 'Warning '.cyan + arguments[0];
		grunt.log.writeln.apply(null, arguments);
	};

	// main task
	grunt.registerMultiTask('run_grunt', 'Run grunt-cli from within grunt.', function () {

		var options = this.options(baseOptions);
		options.concurrent = Math.max(1, options.concurrent);

		var warnIsCalled = false;
		var warnFail = warnReal;

		if (options.expectFail) {
			warnFail = function () {
				warnIsCalled = true;
				arguments[0] = '<ignored> '.yellow + String(arguments[0]);
				warnFake.apply(null, arguments);
			};
		}

		//var self = this;
		var done = this.async();
		var self = this;
		var failed = [];
		var passed = [];
		var start = Date.now();
		var counter = 0;

		var files = [];
		_.forEach(this.filesSrc, function (filePath) {
			if (!grunt.file.exists(filePath)) {
				grunt.log.writeln(lib.nub + 'not found "' + filePath + '"'.yellow);
				return false;
			}
			files.push(filePath);
		});

		if (_.isNumber(options.minimumFiles) && options.minimumFiles > 0 && files.length < options.minimumFiles) {
			grunt.fail.warn('expected at least ' + lib.pluralise(options.minimumFiles, 'gruntfile') + ' but ' + ('found only ' + files.length).red);
			done();
			return;
		}
		if (_.isNumber(options.maximumFiles) && options.maximumFiles > 0 && files.length > options.maximumFiles) {
			grunt.fail.warn('expected at most ' + lib.pluralise(options.maximumFiles, 'gruntfile') + ' but ' + ('found ' + files.length).red);
			done();
			return;
		}

		// loop gruntfiles
		async.forEachLimit(files, options.concurrent, function (filePath, callback) {
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

			//import grunt options
			_.assign(runOptions.args, options.gruntOptions);

			grunt.log.writeln(lib.nub + 'starting ' + ' "' + filePath + '"');

			// run it
			runGruntfile(grunt, filePath, options.task, runOptions, function (err, result) {

				if (!result) {
					callback(err || new Error('no result for ' + filePath));
				}
				else {
					var end = ' "' + filePath + '" (' + (result.duration) + 'ms)';
					if (result.fail) {
						failed.push(result);
						grunt.log.writeln(lib.nub + 'failed' + end);
					} else {
						passed.push(result);
						grunt.log.writeln(lib.nub + 'finished ' + end);
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

				//var total = passed.length + failed.length;

				if (failed.length > 0) {
					_.each(failed, function (res) {
						grunt.log.writeln('--> failed '.red + res.options.target + ' @ "' + res.src + '"');
					});
					grunt.log.writeln('');

					warnFail((lib.pluralise(failed.length, 'gruntfile') + ' failed').red + ' and ' + ('completed ' + passed.length).green + end);
				}
				else {
					grunt.log.writeln('');
					if (passed.length === 0) {
						grunt.log.ok('completed ' + lib.pluralise(passed.length, 'gruntfile').yellow + '' + end);
					}
					else {
						grunt.log.ok('completed ' + lib.pluralise(passed.length, 'gruntfile').green + '' + end);
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
