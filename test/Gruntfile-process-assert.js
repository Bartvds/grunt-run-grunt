'use strict';

var helper = require('./helper');

module.exports = function (grunt) {

	grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');

	// load run_grunt
	grunt.loadTasks('./../tasks');

	grunt.initConfig({
		run_grunt: {
			result_valid: {
				options: {
					help: true,
					log: false,
					'no-color': true,
					process: function (result) {
						helper.assertResult('run_grunt:result', result, function (ctx) {
							if (ctx.fail){
								result.fail = ctx.fail;
								grunt.file.write('tmp/process-assert/result_valid.txt', 'result assertion failed');
							}
							else {
								grunt.file.write('tmp/process-assert/result_valid.txt', 'result assertion passed');
							}
						});
					}
				},
				src: ['Gruntfile-dummy.js']
			}
		}
	});

	grunt.registerTask('default', ['run_grunt']);

};
