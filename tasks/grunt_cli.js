/*
 * grunt-run-grunt-cli * https://github.com/Bartvds/grunt-run-grunt-cli *
 * Copyright (c) 2013 Bart van der Schoor
 * Licensed under the MIT license.
 */

'use strict';

function pluralise(count, str) {
	return count + ' ' + str + (count === 1 ? '' : 's');
}
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
var passOptions = {
	cwd: null,
	log: true,
	logFile: null,
	debugCli: false,
	writeShell: null,
	process: null
};

module.exports = function (grunt) {

	var _ = grunt.util._;
	var runGruntfile = require('./lib/runGruntfile').runGruntfile;

	grunt.registerMultiTask('grunt_cli', 'Run grunt-cli from within grunt.', function () {
		var options = this.options(_.defaults({
			concurrent: 2
		}, passOptions));

		//var self = this;
		var done = this.async();
		var self = this;
		var fail = [];
		var pass = [];
		var start = Date.now();

		grunt.util.async.forEachLimit(this.filesSrc, options.concurrent, function (filePath, callback) {
			if (!grunt.file.exists(filePath)) {
				grunt.log.warn('file "' + filePath + '" not found.');
				return false;
			}

			var runOptions = {
				name: self.name,
				target: self.target,
				args: {}
			};

			// loop default keys but read from options
			_.each(passOptions, function (value, key) {
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

			grunt.log.writeln('-> '.cyan + 'starting ' + filePath);

			runGruntfile(grunt, filePath, options.task, runOptions, function (err, result) {

				if (!result) {
					grunt.fail.warn('no result for ' + filePath);
					callback(err);
				}
				else {
					var end = ' ' + filePath + ' (' + (result.duration) + 'ms)';

					if (result.fail) {
						fail.push(result);
						grunt.fail.warn(('failed').red + end);
					} else {
						pass.push(result);
						grunt.log.writeln('-> '.cyan + 'completed' + end);
						callback(err, result);
					}
				}
			});

		}, function (err) {
			grunt.log.writeln('');
			if (err) {
				grunt.fail.warn(' ' + err);
			}
			else {
				var end = ' (' + (Date.now() - start) + 'ms)\n';

				if (fail.length > 0) {
					grunt.fail.warn('' + (pluralise(fail.length, 'gruntfile') + ' failed').red + ' and ' + (pass.length + ' passed ').green + end);
				}
				else {
					grunt.log.ok('' + pluralise(pass.length, 'gruntfile').green + ' executed' + end);
				}
			}
			done();
		});
	});
};