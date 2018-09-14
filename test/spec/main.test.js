'use strict';

const assert = require('chai').assert;
const helper = require('../helper');
const grunt = require('grunt');

// chai-fs needs this
function fileEqual(normalised, actualName, expectedName) {
  let actual = grunt.file.read('test/tmp/' + actualName);
  let expected = grunt.file.read('test/expected/' + expectedName);

  if (normalised) {
    actual = helper.toUnixNewline(actual);
    expected = helper.toUnixNewline(expected);
  }

  assert.ok(actual, 'actual should be ok: ' + actualName);
  assert.ok(expected, 'expected should be ok: ' + expectedName);

  assert.strictEqual(actual, expected, 'should match content');
}

function testFileEqualPair(normalised, subPath) {
  it(subPath, () => {
    fileEqual(normalised, subPath, subPath);
  });
}

function fileEqualJSON(actualName, expectedName) {
  const actual = grunt.file.readJSON('test/tmp/' + actualName);
  const expected = grunt.file.readJSON('test/expected/' + expectedName);

  assert.ok(actual, 'actual should be ok: ' + actualName);
  assert.ok(expected, 'expected should be ok: ' + expectedName);

  assert.deepEqual(actual, expected, 'should match JSON');
}

function testFileEqualJSONPair(subPath) {
  it(subPath, () => {
    fileEqualJSON(subPath, subPath);
  });
}

describe('grunt-run-grunt', () => {
  describe('task output', () => {
    testFileEqualPair(true, 'dummy/write_file_one.txt');

    testFileEqualPair(true, 'logFile/basic.txt');
    testFileEqualPair(true, 'task/echo.txt');

    testFileEqualPair(true, 'process/result_valid.txt');
    testFileEqualPair(true, 'process/replace.txt');
  });

  describe('json equality', () => {
    testFileEqualJSONPair('parser/dummy_help.json');
  });
});
