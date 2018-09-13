'use strict';

module.exports = function (grunt) {

  grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');

  // load run_grunt
  grunt.loadTasks('./../tasks');
  grunt.loadTasks('./test_tasks');

  grunt.initConfig({
    clean: {
      tests: ['tmp/help/**/*']
    },
    env: {
      dummy: {

      }
    },
    run_grunt: {
      log_env: {
        options: {
          task: 'env:dummy',
          log: false,
          env: {
            'GRUNT_ENV_TEST_FLAG': 'abc'
          },
          process: function (result) {
            if (!result.options.env) {
              grunt.log.fail('missing env in returned options');
              result.fail = true;
            }
            if (!result.options.env.GRUNT_ENV_TEST_FLAG) {
              grunt.log.fail('missing env test flag in returned options');
              result.fail = true;
            }

            //check if it is logged
            if (result.res.stdout.indexOf('GRUNT_ENV_TEST_FLAG: \'abc\'') < 0) {
              grunt.log.fail('missing env test flag in dumped env');
              result.fail = true;
            }
            else {
              grunt.log.ok('found test flag in dumped env');
            }
          }
        },
        src: ['Gruntfile-env.js']
      }
    }
  });

  grunt.registerTask('default', ['clean', 'run_grunt']);

};
