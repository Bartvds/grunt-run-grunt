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
    gruntOptions: {
      dummy: {

      }
    },
    run_grunt: {
      log_opts: {
        options: {
          task: 'gruntOptions:dummy',
          log: false,
          gruntOptions: {
            'dummyOption': 'dummyValue'
          },
          process: function (result) {
            if (!result.options.gruntOptions) {
              grunt.log.fail('missing gruntOptions in returned options');
              result.fail = true;
            }
            if (!result.options.gruntOptions.dummyOption) {
              grunt.log.fail('missing gruntOptions dummyOption in returned options');
              result.fail = true;
            }

            //check if it is logged
            if (result.res.stdout.indexOf('gruntOptions.dummyOption: dummyValue') < 0) {
              grunt.log.fail('missing dummyOption in gruntOptions');
              result.fail = true;
            }
            else {
              grunt.log.ok('found dummyOption in gruntOptions');
            }
          }
        },
        src: ['Gruntfile-options.js']
      }
    }
  });

  grunt.registerTask('default', ['clean', 'run_grunt']);

};
