'use strict';

const path = require('path');
const _ = require('lodash');
const gruntKnownOptions = require('grunt-known-options');
const conf = require('./lib');
const parsers = require('./parsers');

// write shell scripts
function writeShell(grunt, options, src, cwd, argArr) {
  let dir = options.writeShell;

  if (grunt.file.isFile(options.writeShell)) {
    dir = path.dirname(options.writeShell);
  }

  const gf = path.basename(src.toLowerCase(), path.extname(src));
  const base = path.join(dir, options.target + '__' + gf);

  const _ = grunt.util._;
  const gruntCli = (_.isUndefined(options.gruntCli) || _.isNull(options.gruntCli)) ? 'grunt' : options.gruntCli;

  // beh
  const shPath = base + '.sh';
  const shContent = [
    '#!/bin/bash',
    '',
    'cd ' + path.resolve(cwd),
    gruntCli + ' ' + argArr.join(' '),
    ''
  ].join('\n');
  grunt.file.write(shPath, shContent);

  //TODO chmod the shell-script?

  // semi broken
  const batPath = base + '.bat';
  const batContent = [
    'set PWD=%~dp0',
    'cd ' + path.resolve(cwd),
    gruntCli + ' ' + argArr.join(' '),
    'cd "%PWD%"',
    ''
  ].join('\r\n');
  grunt.file.write(batPath, batContent);

  console.log('argArr: ' + argArr.join(' '));
}

function hasValue(value) {
  return value !== true && !(value === null || typeof value === 'undefined');
}

function runGruntfile(grunt, src, tasks, options, callback) {
  const mixedStdIO = [];
  const taskList = [];

  const cwd = (_.isUndefined(options.cwd) || _.isNull(options.cwd) ? path.dirname(src) : options.cwd);
  const gruntCli = (_.isUndefined(options.gruntCli) || _.isNull(options.gruntCli)) ? 'grunt' : options.gruntCli;
  const knownOpts = _.flatMap(gruntKnownOptions, (value, opt) => value.short ? [opt, value.short] : [opt]);

  //return value
  const result = {
    error: null,
    res: null,
    code: '',

    fail: false,
    output: '',

    src: src,
    gruntfile: path.basename(src, path.extname(src)),
    cwd: '',

    tasks: taskList,
    options: options,

    // timing
    start: Date.now(),
    end: Date.now(),
    duration: 0,

    // parsed data
    parsed: {}
  };

  const useArgs = options.args;

  // apply defaults
  const argHash = _.defaults({
    gruntfile: path.resolve(src)
  }, useArgs);

  if (tasks) {
    if (_.isArray(tasks)) {
      _.forEach(tasks, (target) => {
        taskList.push(target);
      });
    }
    else {
      taskList.push(tasks);
    }
  }

  // serialise named args
  const argArr = [];
  _.each(argHash, (value, opt) => {
    if (opt.length === 0) {
      argArr.push(value);
    }
    else if (knownOpts.indexOf(opt) > -1) {
      argArr.push((opt.length === 1 ? '-' : '--') + opt);
      if (hasValue(value)) {
        argArr.push(value);
      }
    }
    else if (hasValue(value)) {
      argArr.push('--' + opt + '=' + value);
    }
    else {
      argArr.push('--' + opt);
    }
  });

  // append task names
  _.each(taskList, function (task) {
    argArr.push(task);
  });

  // for debugging print repeatable cli commands
  if (options.debugCli) {
    grunt.log.writeln([
      'cd ' + path.resolve(cwd),
      gruntCli + ' ' + argArr.join(' '),
      'cd ' + process.cwd()
    ].join('\n'));

    grunt.log.writeln('');
  }

  // experimental
  if (options.writeShell) {
    writeShell(grunt, options, src, cwd, argArr);
  }

  // spawn cli options
  const param = {
    cmd: gruntCli,
    args: argArr,
    opts: {
      cwd: cwd,
      env: grunt.util._.extend({}, process.env, (options.env || {}))
    }
  };

  // make a child
  const child = grunt.util.spawn(param, (err, res, code) => {
    grunt.log.writeln(conf.nub + 'reporting' + ' "' + src + '"');

    // *everything*
    result.error = err;
    result.res = res;
    result.code = code;
    result.output = mixedStdIO.join('');
    result.end = Date.now();
    result.duration = (result.end - result.start);

    // basic check
    if (err || code !== 0) {
      result.fail = true;
    }
    else {
      result.fail = false;
    }

    if (options.parser) {
      if (parsers.hasOwnProperty(options.parser)) {
        const parseOutput = parsers[options.parser];
        result.parsed[options.parser] = parseOutput(result.output);
      }
    }

    // process the result object
    if (options.process) {
      const ret = options.process(result);
      /*jshint -W035 */
      if (_.isUndefined(ret)) {
        // no return value: leaves as-is
      }
      else if (ret === true) {
        // boolean true mean it passes
        result.fail = false;
      }
      else {
        // anythings else mean fail
        result.fail = true;

        const label = 'grunt_cli(' + [tasks].join(' / ') + ')';

        grunt.log.writeln(conf.nub + ('grunt process forced failure').yellow + ' for ' + label);

        if (ret !== false) {
          // only log if not a boolean
          grunt.log.writeln(conf.nub + ret);
        }
      }
      /*jshint -W035 */
    }

    // log the log
    if (options.log && mixedStdIO.length > 0) {
      if (_.isString(options.indentLog) && options.indentLog !== '') {
        //TODO optimise this
        grunt.log.writeln(options.indentLog + result.output.replace(/\r\n|\r|\n/g, '\n' + options.indentLog));
      }
      else {
        grunt.log.writeln(result.output);
      }
    }

    // file the log
    if (options.logFile) {
      let tmp = options.logFile;
      if (grunt.file.isDir(tmp)) {
        tmp = path.join(tmp, 'run-grunt-log.txt');
      }
      grunt.log.writeln(conf.nub + 'saving data' + ' to "' + tmp + '"');
      grunt.file.write(tmp, result.output);
    }

    // bye
    callback(null, result);
  });

  // mix output (this wise?)
  child.stdout.on('data', (data) => {
    mixedStdIO.push(data);
  });

  child.stderr.on('data', (data) => {
    mixedStdIO.push(data);
  });
}

module.exports = {
  runGruntfile: runGruntfile
};
