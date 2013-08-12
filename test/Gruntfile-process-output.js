'use strict';

// var helper = require('./helper');
 var path = require('path');

module.exports = function (grunt) {

	grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');

	// load run_grunt
	grunt.loadTasks('./../tasks');
	grunt.loadTasks('./test_tasks');

	grunt.initConfig({
		run_grunt: {
			replace: {
				options: {
					help: true,
					log: true,
					'no-color': true,
					process: function (result) {
						result.output = '[output replaced]';
					}
				},
				src: ['Gruntfile-dummy.js']
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

	grunt.registerTask('default', ['echo:before', 'run_grunt', 'echo:after']);

};
