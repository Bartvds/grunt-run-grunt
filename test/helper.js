var util = require('util');
var miniSuite = require('./lib/miniSuite');

var assertResult = miniSuite.getSuite('assertResult', {
	'defined': function (result, assert) {
		assert.ok(result, 'result');
		assert.isObject(result, 'result');
	},
	'timing': function (result, assert) {
		assert.isNumber(result.start, 'start');
		assert.isNumber(result.end, 'end');
		assert.isNumber(result.duration, 'duration');
	},
	'paths': function (result, assert) {
		assert.isString(result.cwd, 'cwd');
		assert.isString(result.src, 'src');
	},
	'output': function (result, assert) {
		assert.isObject(result.res, 'res');
		assert.isString(result.output, 'output');
		assert.isObject(result.parsed, 'parsed');
	},
	'tasks': function (result, assert) {
		assert.isArray(result.tasks, 'tasks');
	},
	'options': function (result, assert) {
		assert.isObject(result.options, 'options');
	}
});

function toUnixNewline(str) {
	return str.replace(/\r\n|\r/g, "\n");
}
function toWindowNewLine(str) {
	return str.replace(/\r\n|\r|\n/g, "\r\n");
}
function inspect(value, depth){
	console.log(util.inspect(value, false, depth || 10));
}

module.exports = {
	toWindowNewLine: toWindowNewLine,
	toUnixNewline: toUnixNewline,
	inspect: inspect,
	assertResult: assertResult
};