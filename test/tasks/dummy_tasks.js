'use strict';

module.exports = function (grunt) {


	function dummy(scope) {
		var task = scope.name + ':' + scope.target;
		grunt.log.ok('-> dummy task ' + task);
	}

	function write(scope) {
		var task = scope.name + ':' + scope.target;
		grunt.log.writeln(task);

		var options = scope.options({});
		if (!options.path) {
			grunt.fail.warn('-> missing path option');
			return;
		}
		if (grunt.file.exists(options.path)) {
			grunt.fail.warn('path exists ' + options.path);
			return;
		}
		grunt.file.write(options.path, task);
		grunt.log.ok('write task ' + task);
	}

	grunt.registerMultiTask('dash-victor', 'cli test dash-victor task', function () {
		dummy(this);
	});
	grunt.registerMultiTask('dummy_tango', 'cli test dummy_tango task', function () {
		var done = this.async();
		var self = this;
		setTimeout(function () {
			dummy(self);
			done();
		}, 100);
	});
	grunt.registerMultiTask('write_xray', 'cli test write_xray task', function () {
		write(this);
	});
};
