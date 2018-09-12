'use strict';

// var helper = require('./helper');

module.exports = function (grunt) {

  // load run_grunt
  grunt.loadTasks('./../../tasks');

  grunt.initConfig({
    fail_warn: {
      options: {

      }
    },
    fail_fatal: {
      options: {

      }
    }
  });

  grunt.registerTask('default', ['fail_warn']);

};
