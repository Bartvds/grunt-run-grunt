'use strict';

module.exports = function (grunt) {

	grunt.initConfig({
		grunt_cli: {
			basic_help: {
				options: {
					help: true
				},
				src: ['Gruntfile_basic.js']
			}
		}
	});
	grunt.loadTasks('./tasks');
	grunt.loadTasks('../tasks');

	grunt.registerTask('default', ['test']);
	grunt.registerTask('test', ['grunt_cli']);

};
