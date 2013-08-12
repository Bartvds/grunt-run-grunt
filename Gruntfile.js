/*
 * grunt-run-grunt * https://github.com/Bartvds/grunt-run-grunt *
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
			tmp: ['tmp/**/*', 'test/tmp/**/*', 'test/shell/**/*']
		},
		// dogfooding
		run_grunt: {
			options: {
				//debugCli: true,
				//writeShell: 'test/shell/',

				//update this
				minimumFiles: 6
			},
			all_tests: {
				src: ['test/Gruntfile*.js']
			}
		},
		nodeunit: {
			tests: ['test/**/*.test.js']
		}
	});

	grunt.registerTask('test', ['clean', 'jshint', 'run_grunt', 'nodeunit']);

	grunt.registerTask('default', ['test']);

};
