'use strict';

var helper = require('./helper');

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
					'no-color': true,
					process: function (result) {
						console.dir(result);

						helper.assertResult('run_grunt:result', result, function (ctx) {
							console.dir(ctx);
							grunt.log.writeln(ctx.log);

							if (ctx.fail){
								console.log(ctx);
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
