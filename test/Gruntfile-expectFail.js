'use strict';

// var helper = require('./helper');

module.exports = function (grunt) {

	grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');

	// load run_grunt
	grunt.loadTasks('./../tasks');
	grunt.loadTasks('./test_tasks');

	grunt.initConfig({
		run_grunt: {
			options: {
				expectFail: true
			},
			warn: {
				task: 'fail_warn',
				src: ['./fail/Gruntfile-fail.js']
			},
			fatal: {
				task: 'fail_fatal',
				src: ['./fail/Gruntfile-fail.js']
			}
		}
	});

	grunt.registerTask('default', ['run_grunt']);

};
