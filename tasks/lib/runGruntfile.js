function runGruntfile(grunt, src, tasks, options, callback) {
	var start = Date.now();

	var path = require('path');
	//var os = require('os');
	//var assert = require('assert');
	var _ = grunt.util._;

	var mixiedStdIO = [];
	var taskList = [];

	var cwd = (_.isUndefined(options.cwd) || _.isNull(options.cwd) ? path.dirname(src) : options.cwd);

	console.dir(options);

	var useArgs = options.args;
	if (options.help) {
		//override
		useArgs = {
			help: true
		};
	}

	// apply defaults
	var argHash = _.defaults({
		'gruntfile': path.resolve(src)
	}, useArgs);

	if (tasks) {
		if (!_.isArray(tasks)) {
			_.forEach(tasks, function (target) {
				taskList.push(target);
			});
		}
		else {
			taskList.push(tasks);
		}
	}
	else {
		// do not force it, will mess with -h options etc
		//tasks = ['default'];
	}

	// serialise named args
	var argArr = [];
	_.each(argHash, function (value, opt) {
		if (opt.length === 0) {
			argArr.push(value);
		}
		else {
			argArr.push((opt.length === 1 ? '-' : '--') + opt);
			if (value !== true && !(_.isNull(value) && _.isUndefined(value))) {
				argArr.push(value);
			}
		}
	});
	// append task names
	_.each(taskList, function (task) {
		argArr.push(task);
	});

	// for debugging

	// print repeatable
	if (options.debugCli) {

		grunt.log.writeln([
			'cd ' + path.resolve(cwd),
			'grunt ' + argArr.join(' '),
			'cd ' + process.cwd()
		].join('\n'));

		grunt.log.writeln('');
	}

	//return value
	var result = {
		cwd: cwd,
		src: src,
		output: '',
		tasks: taskList,
		options: options,
		res: null
	};

	if (options.writeShell) {
		var dir = options.writeShell;
		if (grunt.file.isFile(options.writeShell)) {
			dir = path.dirname(options.writeShell);
		}

		var gf = path.basename(src, path.extname(src).toLowerCase());
		var base = path.join(dir, options.target + '__' + gf);

		var shPath = base + '.sh';
		var shContent = [
			'#!/bin/bash',
			'',
			'cd ' + path.resolve(cwd),
			'grunt ' + argArr.join(' '),
			''
		].join('\n');
		grunt.file.write(shPath, shContent);

		//TODO chmod the shellscript?

		var batPath = base + '.bat';
		var batContent = [
			'cd ' + path.resolve(cwd),
			'grunt ' + argArr.join(' '),
			''
		].join('\r\n');
		grunt.file.write(batPath, batContent);
	}

	// spawn cli options
	var param = {
		cmd: 'grunt',
		args: argArr,
		opts: {
			cwd: cwd
		}
	};

	console.dir(param);

	var child = grunt.util.spawn(param,
		function (err, res, code) {
			grunt.log.writeln('-> '.cyan + 'reporting ' + src);

			// *everything*
			result.error = err;
			result.res = res;
			result.code = code;
			result.mixiedStdIO = mixiedStdIO.join('');
			result.duration = (Date.now() - start);

			// basic check
			if (err || code !== 0) {
				result.fail = true;
			}
			else {
				result.fail = false;
			}

			// process the result object
			if (options.process) {
				var ret = options.process(result);
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

					var label = 'grunt_cli(' + [tasks].join(' / ') + ')';

					grunt.log.writeln('-> ' + ('grunt process fail').red + ' for ' + label);

					if (ret !== false) {
						// only log if not a boolean
						grunt.log.writeln('-> ' + ret);
					}
				}
			}

			// log the log
			if (options.log) {
				grunt.log.writeln(result.mixiedStdIO);
			}
			if (options.logFile) {
				var tmp = options.logFile;
				if (path.dirname(tmp)) {
					tmp = path.join(tmp, 'grunt-log.txt');
				}
				grunt.log.writeln('-> '.cyan + 'saving data to ' + tmp);
				grunt.file.write(tmp, result.mixiedStdIO);

				result.logFile = tmp;
			}

			// bye
			callback(err, result);
		}
	);
	// mix output
	child.stdout.on('data', function (data) {
		mixiedStdIO.push(data);
	});
	child.stderr.on('data', function (data) {
		mixiedStdIO.push(data);
	});
}

module.exports = {
	runGruntfile: runGruntfile
};