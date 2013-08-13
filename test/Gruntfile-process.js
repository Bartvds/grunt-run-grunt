'use strict';

var helper = require('./helper');
var path = require('path');

module.exports = function (grunt) {

	grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');

	// load run_grunt
	grunt.loadTasks('./../tasks');
	grunt.loadTasks('./test_tasks');

	grunt.initConfig({
		clean: {
			tests: ['tmp/process/**/*']
		},
		run_grunt: {
			result_valid: {
				options: {
					help: true,
					log: false,
					'no-color': true,
					process: function (result) {
						helper.assertResult('run_grunt:result', result, function (ctx) {
							ctx.assertion();

							if (ctx.fail){
								result.fail = ctx.fail;
								grunt.file.write('tmp/process/result_valid.txt', 'result assertion failed');
							}
							else {
								grunt.file.write('tmp/process/result_valid.txt', 'result assertion passed');
							}
						});
					}
				},
				src: ['Gruntfile-dummy.js']
			},
			replace: {
				options: {
					help: true,
					log: false,
					'no-color': true,
					process: function (result) {
						helper.assertResult('run_grunt:result', result, function (ctx) {
							ctx.assertion();

							result.output = '[output replaced]';
							grunt.file.write('tmp/process/replace.txt', 'new content');
						});
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

	grunt.registerTask('default', ['clean', 'echo:before', 'run_grunt', 'echo:after']);

};
