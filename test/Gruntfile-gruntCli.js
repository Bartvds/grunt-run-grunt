'use strict';

const path = require('path');

module.exports = function (grunt) {

  grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');

  // load run_grunt
  grunt.loadTasks('./../tasks');
  grunt.loadTasks('./test_tasks');

  grunt.initConfig({
    clean: {
      tests: ['tmp/task/**/*']
    },
    run_grunt: {
      options: {
        gruntCli: path.join(__dirname, '../node_modules/.bin/grunt')
      },
      echo: {
        options: {
          task: 'echo:echo',
          logFile: 'tmp/task/echo.txt'
        },
        src: ['Gruntfile-dummy.js']
      }
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
      }
    }
  });

  grunt.registerTask('default', ['clean', 'echo:before', 'run_grunt', 'echo:after']);

};
