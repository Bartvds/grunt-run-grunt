var mkdirp = require('mkdirp');
//var _ = require('underscore');

var grunt = require('grunt');
var chai = require('chai');
chai.Assertion.includeStack = true;
chai.should();
//var expect = chai.expect;
var assert = chai.assert;
chai.use(require('chai-fs'));

var run_grunt;

before(function () {
	// create some empty dirs (cannot check-in empty dirs to git)
	mkdirp.sync('./test/tmp');
	mkdirp.sync('./tmp');
});
describe('grunt-run-grunt', function () {
	it('exports module', function () {
		run_grunt = require('../../tasks/run_grunt');
		assert.isFunction(run_grunt, 'run_grunt');

		chai.run_grunt = run_grunt;

	});
	it('module main is linked in package.json', function () {
		var pkg = grunt.file.readJSON('package.json');
		assert.isObject(pkg, 'pkg');

		assert.property(pkg, 'main', 'pkg.main');
		assert.isFile(pkg['main'], 'pkg.main');
	});
});