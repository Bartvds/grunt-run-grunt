'use strict';

const assert = require('chai').assert;
const grunt = require('grunt');
const parsers = require('../../lib/parsers');

describe('parser-module', () => {

  function testParse(subPath) {
    it(subPath, () => {
      const input = grunt.file.read('test/fixtures/' + subPath + '.txt');
      const expected = grunt.file.readJSON('test/expected/' + subPath + '.json');

      assert.isString(input, 'input');
      assert.isObject(expected, 'expected');

      const result = parsers.parseHelp(input);

      assert.isObject(result, 'result');
      assert.isObject(result.task, 'task');
      assert.isObject(result.alias, 'alias');

      //console.log(JSON.stringify(result, null, 2));
      grunt.file.write('test/tmp/' + subPath + '.json', JSON.stringify(result, null, 2));

      assert.deepEqual(result, expected, 'result, expected');
    });
  }

  describe('parseHelp', () => {
    it('should exist', () => {
      assert.isFunction(parsers.parseHelp, 'parsers.parseHelp');
    });

    describe('should parse', () => {
      testParse('parser-module/help/dummy_help');
      testParse('parser-module/help/dummy_help-alias_only');
      testParse('parser-module/help/dummy_help-no_start');
      testParse('parser-module/help/dummy_help-task_only');
      testParse('parser-module/help/gtx-soundCheck');
    });
  });
});
