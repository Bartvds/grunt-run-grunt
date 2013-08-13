/*
 * grunt-run-grunt * https://github.com/Bartvds/grunt-run-grunt *
 * Copyright (c) 2013 Bart van der Schoor
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.loadTasks('tasks');

	grunt.initConfig({
		clean: {
			tmp: ['tmp/**/*', 'test/tmp/**/*', 'test/shell/**/*']
		},
		jshint: {
			options: {
				reporter: './node_modules/jshint-path-reporter',
				jshintrc: '.jshintrc'
			},
			all: [ 'Gruntfile.js', 'tasks/**/*.js', 'lib/**/*.js', 'test/**/*.js']
		},
		mochaTest: {
			options: {
				reporter: 'mocha-unfunk-reporter'
			},
			all: {
				src: ['test/init.js', 'test/spec/**/*.test.js']
			}
		},
		// dogfooding
		run_grunt: {
			options: {
				concurrent: 2
			},
			all_tests: {
				options: {
					debugCli: true,
					// writeShell: 'test/shell/',
					stack: true,

					// keep this updated
					minimumFiles: 6
				},
				src: ['test/Gruntfile*.js']
			},
			task: {
				src: ['test/Gruntfile-task.js']
			},
			process: {
				src: ['test/Gruntfile-process.js']
			},
			help: {
				src: ['test/Gruntfile-help.js']
			}
		}
	});

	grunt.registerTask('prep', ['clean', 'jshint']);

	grunt.registerTask('test', ['prep', 'run_grunt:all_tests', 'mochaTest']);

	grunt.registerTask('default', ['test']);

	grunt.registerTask('dev', ['prep', 'run_grunt:task']);
	grunt.registerTask('edit_01', ['mochaTest']);
	grunt.registerTask('edit_02', ['prep', 'run_grunt:process']);
	grunt.registerTask('edit_03', ['prep', 'run_grunt:help']);

};
