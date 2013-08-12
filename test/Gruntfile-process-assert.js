'use strict';

var helper = require('./helper');

var assertResult = helper.getMiniSuite('assertResult', {
	'defined': function (assert, result) {

		// TESTING 1 2
		assert.notOk(result, 'result');


		assert.isObject(result, 'result');
	},
	'timing': function (assert, result) {
		assert.isNumber(result.start, 'result.start');
		assert.isNumber(result.end, 'result.end');
		assert.isNumber(result.duration, 'result.duration');
	},
	'paths': function (assert, result) {
		assert.isString(result.cwd, 'result.cwd');
		assert.isString(result.src, 'result.src');
	},
	'output': function (assert, result) {
		assert.isObject(result.res, 'result.res');
		assert.isString(result.output, 'result.output');
		assert.isArray(result.mixiedStdIO, 'result.mixiedStdIO');
	},
	'tasks': function (assert, result) {
		assert.isArray(result.tasks, 'result.tasks');
	},
	'options': function (assert, result) {
		assert.isObject(result.options, 'result.options');
	}
});

module.exports = function (grunt) {

	grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');

	// load run_grunt
	grunt.loadTasks('./../tasks');

	grunt.initConfig({
		run_grunt: {
			result: {
				options: {
					help: true,
					log: false,
					process: function (result) {
						assertResult('run_grunt:result', result, function (ctx) {
							console.inspect(result);
							console.inspect(ctx);
							grunt.log.writeln(ctx.log);
							if (ctx.fail){
								result.fail = ctx.fail;
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
