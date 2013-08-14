'use strict';

// var helper = require('./helper');
var path = require('path');

module.exports = function (grunt) {

	grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');

	// load run_grunt
	grunt.loadTasks('./../tasks');

	grunt.initConfig({
		run_grunt: {
			options: {
			},
			error: {
				task: 'fail_warn',
				src: ['./Gruntfile-missing-task']
			}
		},
		echo: {
			before: {
				options: {
					echo: 'before: ' + path.basename(__filename)
				}
			},
			after: {
				options: {
					echo: 'after: ' + path.basename(__filename)
				}
			}
		}
	});

	grunt.registerTask('default', ['clean', 'echo:before', 'run_grunt', 'echo:after']);

};
