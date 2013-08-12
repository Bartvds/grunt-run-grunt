'use strict';

// var helper = require('./helper');

module.exports = function (grunt) {

	grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');

	// load run_grunt
	grunt.loadTasks('./../tasks');

	grunt.initConfig({
		clean: {
			tests: ['tmp/logFile/**/*']
		},
		run_grunt: {
			logWrite: {
				options: {
					help: true,
					logFile: 'tmp/logFile/basic.txt',
					process: function (result) {
						result.output = '[logFile output replaced]';
					}
				},
				src: ['Gruntfile-dummy.js']
			}
		}
	});

	grunt.registerTask('default', ['clean', 'run_grunt']);

};
