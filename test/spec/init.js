'use strict';

const mkdirp = require('mkdirp');
const grunt = require('grunt');
const chai = require('chai');

chai.Assertion.includeStack = true;
chai.should();

const assert = chai.assert;
chai.use(require('chai-fs'));

before(() => {
  // create some empty dirs (cannot check-in empty dirs to git)
  mkdirp.sync('./test/tmp');
  mkdirp.sync('./tmp');
});

describe('grunt-run-grunt', () => {
  it('exports module', () => {
    const run_grunt = require('../../tasks/run_grunt');
    assert.isFunction(run_grunt, 'run_grunt');

    chai.run_grunt = run_grunt;
  });

  it('module main is linked in package.json', () => {
    const pkg = grunt.file.readJSON('package.json');
    assert.isObject(pkg, 'pkg');

    assert.property(pkg, 'main', 'pkg.main');
    assert.isFile(pkg.main, 'pkg.main');
  });
});
