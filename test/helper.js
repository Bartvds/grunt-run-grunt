/*function isArray() {
	return Object.prototype.toString.call(o) === "[object Array]"
}*/
var assert = require('chai').assert;

function assertRes(ctx) {
	assert.isObject(ctx, 'assertRes: ctx');
	assert.isBoolean(ctx.fail, 'assertRes: ctx.fail');
	assert.isString(ctx.message, 'assertRes: ctx.message');

	assert(ctx.fail, ctx.message);
}

function reportResult(ctx) {
	assert.isObject(ctx, 'reportResult:ctx');
	var log = [];
	log.push(ctx.header);
	var summary = '';
	if (!ctx.fail) {
		summary = ctx.label + ' ' + 'passed ' + ctx.all.length + ' of ' + ctx.all.length;
		log.push(summary);
	}
	else {
		summary = ctx.label + ' ' + 'failed ' + ctx.fail.length + ' of ' + ctx.all.length;
		log.push(summary);

		ctx.failed.forEach(function (res) {
			log.push('"' + res.name + '":\n   ' + (res.err.message ? res.err.message : res.err));
		});
	}
	log = log.join('\n');
	ctx.message = summary;
	ctx.assertion = function () {
		assertRes(ctx);
	};
	ctx.report(ctx);
}

function getMiniSuite(testName, tests, report) {

	var func = function (label, topic) {
		// lazy loop
		var ctx = {
			header: 'minitest "' + testName + '"',
			name: testName,
			tests: tests,
			report: report || function () {
				assertRes(ctx);
			},

			label: label,
			topic: topic,
			failed: [],
			all: [],
			fail: false
		};

		for (var name in tests) {
			if (!tests.hasOwnProperty(name)) {
				continue;
			}
			var testCase = tests[name];
			var res = {
				name: name,
				err: null,
				call: testCase
			};

			try {
				testCase.call(null, assert, topic);
			}
			catch (e) {
				res.err = e;
				ctx.failed.push(res);
			}
			ctx.all.push(res);
		}

		ctx.fail = ctx.failed.length > 0;
		reportResult(ctx);
	};
	func.name = testName;
	return func;
}

module.exports = {
	assertRes: assertRes,
	getMiniSuite: getMiniSuite,
	reportResult: reportResult,
	assert: assert
};