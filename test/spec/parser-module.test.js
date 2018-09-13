var assert = require('chai').assert;
var grunt = require('grunt');
var parsers = require('../../lib/parsers');


describe('parser-module', function () {

  function testParse(subPath) {
    it(subPath, function () {
      var input = grunt.file.read('test/fixtures/' + subPath + '.txt');
      var expected = grunt.file.readJSON('test/expected/' + subPath + '.json');

      assert.isString(input, 'input');
      assert.isObject(expected, 'expected');

      var result = parsers.parseHelp(input);

      assert.isObject(result, 'result');
      assert.isObject(result.task, 'task');
      assert.isObject(result.alias, 'alias');

      //console.log(JSON.stringify(result, null, 2));
      grunt.file.write('test/tmp/' + subPath + '.json', JSON.stringify(result, null, 2));

      assert.deepEqual(result, expected, 'result, expected');
    });
  }

  describe('parseHelp', function () {
    it('should exist', function () {
      assert.isFunction(parsers.parseHelp, 'parsers.parseHelp');
    });

    describe('should parse', function () {
      testParse('parser-module/help/dummy_help');
      testParse('parser-module/help/dummy_help-alias_only');
      testParse('parser-module/help/dummy_help-no_start');
      testParse('parser-module/help/dummy_help-task_only');
      testParse('parser-module/help/gtx-soundCheck');
    });
  });
});
