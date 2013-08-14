'use strict';

// var helper = require('./helper');

module.exports = function (grunt) {

	grunt.initConfig({
		non_existing_task: {
			options: {

			},
			non_target: {

			}
		}
	});

	grunt.registerTask('default', ['non_existing_task']);

};
