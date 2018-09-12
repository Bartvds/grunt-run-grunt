'use strict';

module.exports = function (grunt) {

  grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');

  // load run_grunt
  grunt.loadTasks('./../tasks');

  grunt.initConfig({
    clean: {
      tests: ['tmp/task/**/*']
    },
    run_grunt: {
      echo: {
        options: {
          task: 'echo:echo',
          'no-color': true,
          logFile: 'tmp/task/echo.txt'
        },
        src: ['Gruntfile-dummy.js']
      }
    }
  });

  grunt.registerTask('default', ['clean', 'run_grunt']);

};
