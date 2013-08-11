'use strict';

module.exports = function (grunt) {

	grunt.initConfig({
		dummy_tango: {
			tango_one: {},
			"tango-two": {}
		},
		"dash-victor": {
			victor_one: {},
			"victor-two": {}
		},
		write_xray: {
			one: {
				options: {
					path: 'tmp/write_xray_one.txt'
				}
			}
		}
	});
	grunt.loadTasks('./tasks');

	grunt.registerTask('default', ['test']);

	grunt.registerTask('test', ['dummy_tango', 'dash-victor', 'write_xray']);

	grunt.registerTask('dummies', ['dummy_tango:tango_one', 'dummy_tango:tango-two', 'dash-victor:victor_one', 'dash-victor:victor-two']);
};
