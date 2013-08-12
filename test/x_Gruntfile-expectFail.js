'use strict';

// var helper = require('./helper');

module.exports = function (grunt) {

	grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');

	// load run_grunt
	grunt.loadTasks('./../tasks');

	grunt.initConfig({
		run_grunt: {
			warn: {
				task: 'fail_warn',
				options: {
					expectFail: true
				},
				src: ['./fail/Gruntfile-fail.js']
			},
			fatal: {
				task: 'fail_fatal',
				options: {
					expectFail: true
				},
				src: ['./fail/Gruntfile-fail.js']
			}
		}
	});

	grunt.registerTask('default', ['clean', 'run_grunt']);

};
