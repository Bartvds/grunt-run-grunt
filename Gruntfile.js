/*
 * grunt-run-grunt-cli * https://github.com/Bartvds/grunt-run-grunt-cli *
 * Copyright (c) 2013 Bart van der Schoor
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.loadTasks('tasks');

	grunt.initConfig({
		jshint: {
			options: {
				reporter: './node_modules/jshint-path-reporter',
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'tasks/**/*.js',
				'lib/**/*.js',
				'test/**/*.js'
			]
		},
		clean: {
			// << lol.. 'tmpception' >>
			tests: ['tmp/**/*', 'test/tmp/**/*', 'test/*/tmp/**/*'],
			shell: ['test/shell/**/*']
		},
		grunt_cli: {
			options: {
				debugCli: true,
				writeShell: 'test/shell/'
			},
			all_tests: {
				src: ['test/**/Gruntfile*.js']
			}
		},
		nodeunit: {
			tests: ['test/**/*_test.js']
		}
	});

	grunt.registerTask('test', ['clean', 'jshint', 'grunt_cli', 'nodeunit']);

	grunt.registerTask('default', ['test']);

};
