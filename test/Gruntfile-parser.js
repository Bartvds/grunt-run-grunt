'use strict';

const helper = require('./helper');
const path = require('path');

module.exports = function (grunt) {

  grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');

  // load run_grunt
  grunt.loadTasks('./../tasks');
  grunt.loadTasks('./test_tasks');

  grunt.initConfig({
    clean: {
      tests: ['tmp/parser/**/*']
    },
    run_grunt: {
      dummy_help: {
        options: {
          help: true,
          log: false,
          'no-color': true,
          parser: 'parseHelp',
          process: function (result) {
            helper.assertResult('run_grunt:dummy_help', result, function (ctx) {
              ctx.assertion();

              if (ctx.fail) {
                result.fail = ctx.fail;
              }
              else {
                helper.inspect(result.parsed);
                grunt.file.write('tmp/parser/dummy_help.json', JSON.stringify(result.parsed, null, 2));
              }
            });
          }
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
