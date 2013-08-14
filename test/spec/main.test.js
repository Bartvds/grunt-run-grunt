var assert = require('chai').assert;
var helper = require('../helper');
var grunt = require('grunt');

// chai-fs needs this
function fileEqual(normalised, actualName, expectedName) {
	var actual = grunt.file.read('test/tmp/' + actualName);
	var expected = grunt.file.read('test/expected/' + expectedName);
	if (normalised) {
		actual = helper.toUnixNewline(actual);
		expected = helper.toUnixNewline(expected);
	}
	assert.ok(actual, 'actual should be ok: ' + actualName);
	assert.ok(expected, 'expected should be ok: ' + expectedName);

	assert.strictEqual(actual, expected, 'should match content');
}

function testFileEqualPair(normalised, subPath) {
	it(subPath, function () {
		fileEqual(normalised, subPath, subPath);
	});
}

function fileEqualJSON(actualName, expectedName) {
	var actual = grunt.file.readJSON('test/tmp/' + actualName);
	var expected = grunt.file.readJSON('test/expected/' + expectedName);
	assert.ok(actual, 'actual should be ok: ' + actualName);
	assert.ok(expected, 'expected should be ok: ' + expectedName);

	assert.deepEqual(actual, expected, 'should match JSON');
}

function testFileEqualJSONPair(subPath) {
	it(subPath, function () {
		fileEqualJSON(subPath, subPath);
	});
}

describe('grunt-run-grunt', function () {

	describe('task output', function () {

		testFileEqualPair(true, 'dummy/write_file_one.txt');

		testFileEqualPair(true, 'logFile/basic.txt');
		testFileEqualPair(true, 'task/echo.txt');

		testFileEqualPair(true, 'process/result_valid.txt');
		testFileEqualPair(true, 'process/replace.txt');
	});

	describe('json equality', function () {
		testFileEqualJSONPair('parser/dummy_help.json');
	});
});


