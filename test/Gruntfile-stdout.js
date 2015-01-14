'use strict';

module.exports = function (grunt) {

	// load run_grunt
	grunt.loadTasks('./../tasks');

	var out = false;
	var err = false;

	grunt.initConfig({
		run_grunt: {
			stdout: {
				options: {
					stdout: function(data) {
						out = true;
						grunt.log.write('>>>>>' + data);
					},
					process: function (result) {
						if (!out) {
							grunt.log.fail('stdout has not been called');
							result.fail = true;
						}
					}
				},
				src: ['Gruntfile-dummy.js']
			},
			stderr: {
				options: {
					stderr: function(data) {
						err = true;
						grunt.log.write('>>>>>' + data);
					},
					process: function (result) {
						if (!err) {
							grunt.log.fail('stderr has not been called');
							result.fail = true;
						}
					}
				},
				src: ['Gruntfile-dummy.js']
			}
		}
	});

	grunt.registerTask('default', ['run_grunt']);

};
