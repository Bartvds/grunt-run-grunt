'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var tests = {
	setUp: function (done) {
		done();
	}
};

function fileEqual(test, actualName, expectedName, normalised) {
	var actual = grunt.file.read('test/tmp/' + actualName);
	var expected = grunt.file.read('test/expected/' + expectedName);
	if (normalised) {
		actual = grunt.util.normalizelf(actual);
		expected = grunt.util.normalizelf(expected);
	}
	test.ok(actual, 'actual should be ok: ' + actualName);
	test.ok(expected, 'expected should be ok: ' + expectedName);
	test.deepEqual(actual, expected, 'should match values');
}

function testFileEqual(tests, label, actualName, expectedName) {
	tests[label] = function (test) {
		test.expect(3);
		fileEqual(test, actualName, expectedName);
		test.done();
	};
}
function testFileEqualSet(tests, name, subPath) {
	testFileEqual(tests, name, subPath, subPath);
}
testFileEqualSet(tests, 'dummy-write_xray_one', 'dummy/write_xray_one.txt');
testFileEqualSet(tests, 'logFile-basic', 'logFile/basic.txt');

exports.run_grunt = tests;
