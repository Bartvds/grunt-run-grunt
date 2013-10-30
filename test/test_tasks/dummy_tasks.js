'use strict';

module.exports = function (grunt) {

	var util = require('util');

	function dummy(scope) {
		var task = scope.name + ':' + scope.target;

		grunt.log.writeln('dummy task: ' + task);
		grunt.log.ok('done');
	}

	function echo(scope) {
		var task = scope.name + ':' + scope.target;

		var options = scope.options({
			echo: 'echo echo'
		});
		grunt.log.writeln(options.echo);

		grunt.log.writeln('echo task: ' + task);
		grunt.log.ok('done');
	}

	function fail(scope, fatal) {
		var task = scope.name + ':' + scope.target;

		if (fatal) {
			grunt.log.writeln('fail task error: ' + task);
			grunt.fail.fatal('done');
		}
		else {
			grunt.log.writeln('fail task warn: ' + task);
			grunt.fail.warn('done');
		}
	}

	function write(scope) {
		var task = scope.name + ':' + scope.target;
		grunt.log.writeln(task);

		var options = scope.options({
			data: ''
		});
		if (!options.path) {
			grunt.fail.warn('-> missing path option');
			return;
		}
		if (grunt.file.exists(options.path)) {
			grunt.fail.warn('path exists ' + options.path);
			return;
		}
		grunt.file.write(options.path, task);
		// plain write
		grunt.log.write(options.data);

		grunt.log.writeln('write task: ' + task);
		grunt.log.ok('done');
	}

	function logEnv(scope) {
		var task = scope.name + ':' + scope.target;

		grunt.log.writeln('options.env: ' + util.inspect(process.env));

		grunt.log.writeln('env task: ' + task);
		grunt.log.ok('done');
	}

	grunt.registerMultiTask('dash-victor', 'cli test "dash-victor" task', function () {
		dummy(this);
	});
	grunt.registerMultiTask('dummy_tango', 'cli test "dummy_tango" task', function () {
		var done = this.async();
		var self = this;
		setTimeout(function () {
			dummy(self);
			done();
		}, 100);
	});
	grunt.registerMultiTask('write_file', 'cli test "write_file" task', function () {
		write(this);
	});
	grunt.registerMultiTask('echo', 'cli test "echo" task', function () {
		echo(this);
	});

	grunt.registerMultiTask('fail_warn', 'cli test "fail_warn" task', function () {
		fail(this, false);
	});
	grunt.registerMultiTask('fail_fatal', 'cli test "fail_fatal" task', function () {
		fail(this, true);
	});
	grunt.registerMultiTask('env', 'cli test "env" task', function () {
		logEnv(this);
	});
};
