var path = require('path');
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
	assert.strictEqual(actual, expected, 'should match values');
}

describe('grunt-run-grunt', function () {

	describe('file equality', function () {

		function testFileEqual(normalised, label, actualName, expectedName) {
			it(label, function () {
				fileEqual(normalised, actualName, expectedName);
			});
		}

		function testFileEqualPair(normalised, subPath) {
			var name = path.dirname(subPath) + ' - ' + path.basename(subPath, path.extname(subPath));
			testFileEqual(normalised, name, subPath, subPath);
		}

		testFileEqualPair(true, 'dummy/write_xray_one.txt');
		testFileEqualPair(true, 'logFile/basic.txt');
		testFileEqualPair(true, 'task/echo.txt');
		testFileEqualPair(true, 'process/result_valid.txt');
		testFileEqualPair(true, 'process/replace.txt');
		testFileEqualPair(true, 'help/dummy_help.txt');
	});
});