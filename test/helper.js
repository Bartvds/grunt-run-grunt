var miniSuite = require('./lib/miniSuite');

var assertResult = miniSuite.getSuite('assertResult', {
	'defined': function (assert, result) {
		assert.ok(result, 'result');
		assert.isObject(result, 'result');
	},
	'timing': function (assert, result) {
		assert.isNumber(result.start, 'start');
		assert.isNumber(result.end, 'end');
		assert.isNumber(result.duration, 'duration');
	},
	'paths': function (assert, result) {
		assert.isString(result.cwd, 'cwd');
		assert.isString(result.src, 'src');
	},
	'output': function (assert, result) {
		assert.isObject(result.res, 'res');
		assert.isString(result.output, 'output');
	},
	'tasks': function (assert, result) {
		assert.isArray(result.tasks, 'result.tasks');
	},
	'options': function (assert, result) {
		assert.isObject(result.options, 'result.options');
	}
});

function toUnixNewline(str) {
	return str.replace(/\r\n|\r/g, "\n");
}
function toWindowNewLine(str) {
	return str.replace(/\r\n|\r|\n/g, "\r\n");
}

module.exports = {
	toWindowNewLine: toWindowNewLine,
	toUnixNewline: toUnixNewline,
	assertResult: assertResult
};