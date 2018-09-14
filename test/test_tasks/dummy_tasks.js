'use strict';

const util = require('util');

module.exports = function (grunt) {

  function dummy(scope) {
    const task = scope.name + ':' + scope.target;

    grunt.log.writeln('dummy task: ' + task);
    grunt.log.ok('done');
  }

  function echo(scope) {
    const task = scope.name + ':' + scope.target;
    const options = scope.options({
      echo: 'echo echo'
    });

    grunt.log.writeln(options.echo);
    grunt.log.writeln('echo task: ' + task);
    grunt.log.ok('done');
  }

  function fail(scope, fatal) {
    const task = scope.name + ':' + scope.target;

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
    const task = scope.name + ':' + scope.target;
    const options = scope.options({
      data: ''
    });

    grunt.log.writeln(task);

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
    const task = scope.name + ':' + scope.target;

    grunt.log.writeln('options.env: ' + util.inspect(process.env));
    grunt.log.writeln('env task: ' + task);
    grunt.log.ok('done');
  }

  function logGruntOptions(scope) {
    const task = scope.name + ':' + scope.target;

    grunt.log.writeln('options.gruntOptions.dummyOption: ' + grunt.option('dummyOption'));
    grunt.log.writeln('env task: ' + task);
    grunt.log.ok('done');
  }

  grunt.registerMultiTask('dash-victor', 'cli test "dash-victor" task', function () {
    dummy(this);
  });

  grunt.registerMultiTask('dummy_tango', 'cli test "dummy_tango" task', function () {
    const done = this.async();

    setTimeout(() => {
      dummy(this);
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

  grunt.registerMultiTask('gruntOptions', 'cli test "gruntOptions" task', function () {
    logGruntOptions(this);
  });
};
