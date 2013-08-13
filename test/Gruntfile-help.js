'use strict';

// var helper = require('./helper');

module.exports = function (grunt) {

	grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');

	// load run_grunt
	grunt.loadTasks('./../tasks');

	grunt.initConfig({
		clean: {
			tests: ['tmp/help/**/*']
		},
		run_grunt: {
			dummy_help: {
				options: {
					'no-color': true,
					help: true,
					logFile: 'tmp/help/dummy_help.txt'
				},
				src: ['Gruntfile-dummy.js']
			}
		}
	});

	grunt.registerTask('default', ['clean', 'run_grunt']);

};
