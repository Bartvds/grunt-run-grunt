'use strict';

// var helper = require('./helper');

module.exports = function (grunt) {

	// load run_grunt
	grunt.loadTasks('./../tasks');

	grunt.initConfig({
		run_grunt: {
			basic_help: {
				options: {
					'no-color': true,
					help: true
				},
				src: ['Gruntfile-dummy.js']
			}
		}
	});

	grunt.registerTask('default', ['run_grunt']);

};
