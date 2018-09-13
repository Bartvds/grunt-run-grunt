'use strict';

const path = require('path');

module.exports = function (grunt) {

  // load test tasks
  grunt.loadTasks('./test_tasks');

  grunt.initConfig({
    clean: {
      tests: ['tmp/dummy/**/*']
    },
    dummy_tango: {
      tango_one: {},
      'tango-two': {}
    },
    'dash-victor': {
      victor_one: {},
      'victor-two': {}
    },
    echo: {
      before: {
        options: {
          echo: 'before: ' + path.basename(__filename)
        }
      },
      after: {
        options: {
          echo: 'after: ' + path.basename(__filename)
        }
      },
      echo: {
        options: {
          echo: 'echo'
        }
      }
    }
  });

  grunt.registerTask('default', ['echo:before', 'dummies', 'echo:after']);

  grunt.registerTask('dummies', [
    'dummy_tango:tango_one',
    'dummy_tango:tango-two',
    'echo:echo',
    'dash-victor:victor_one',
    'dash-victor:victor-two'
  ]);

  grunt.registerTask('tangos', ['dummy_tango:tango_one', 'dummy_tango:tango_two']);
  grunt.registerTask('victors', ['dash-victor:victor_one', 'dash-victor:victor-two']);

  grunt.registerTask('multi', ['echo:before', 'echo:echo', 'echo:after']);
};
