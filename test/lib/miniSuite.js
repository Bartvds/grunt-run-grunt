//
// Simple synchronous mini test suite
//
// Can be uses as either a pre-baked complex test assertion or a non-throwing reporter
//

var assert = require('chai').assert;

// actual Assertion
function assertResult(res) {
	assert.isObject(res, 'assertResult: result');
	assert.isBoolean(res.fail, 'assertResult: res.fail');
	assert.isString(res.message, 'assertResult: res.message');

	assert(!res.fail, res.log);
}

// subroutine
function reportSuiteResult(res) {
	assert.isObject(res, 'reportSuiteResult:result');

	var log = [];
	//log.push(res.header);

	var summary = '';
	var start = '"' + res.name + '"' + ' ';

	var end = '';

	if (!res.fail) {
		summary = start + 'passed ' + res.all.length + ' / ' + res.all.length + end + ' in ' + '"' + res.label + '"';
		log.push(summary);
	}
	else {
		summary = start + 'failed ' + res.failed.length + ' / ' + res.all.length + end + ' in ' + '"' + res.label + '"';
		log.push(summary);

		res.failed.forEach(function (res) {
			log.push('- ' + res.name + '\n   ' + (res.err.message ? res.err.message : res.err));
		});
	}
	// override
	res.log = log.join('\n');
	res.message = summary;
	res.assertion = function () {
		assertResult(res);
	};
	res.report(res);
}

function hasOwnProp(obj, name) {
	return Object.prototype.hasOwnProperty.call(obj, name);
}

/*
	{
		"label" : function(topic, assert){
			assert.ok(topic, 'top ok');
			assert.ok(topic.prop, 'top.prop ok');
		}
	}
*/
function getSuite(testName, tests, report) {

	var func = function (caseLabel, topic) {

		var res = {
			name: testName,
			tests: tests,
			// default to throwing
			report: report || function () {
				assertResult(res);
			},

			label: caseLabel,
			topic: topic,
			failed: [],
			all: [],
			log: [],
			fail: false
		};

		// lazy loop
		for (var name in tests) {
			if (!hasOwnProp(tests, name)) {
				continue;
			}
			var testCase = tests[name];
			var item = {
				name: name,
				err: null,
				call: testCase
			};

			try {
				testCase.call(null, topic, assert);
			}
			catch (e) {
				item.err = e;
				res.failed.push(item);
			}
			res.all.push(item);
		}

		res.fail = res.failed.length > 0;

		reportSuiteResult(res);
	};
	func.name = testName;
	return func;
}

module.exports = {
	getSuite: getSuite
};
