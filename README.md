# grunt-run-grunt

[![Build Status](https://secure.travis-ci.org/Bartvds/grunt-run-grunt.png?branch=master)](http://travis-ci.org/Bartvds/grunt-run-grunt) [![Dependency Status](https://gemnasium.com/Bartvds/grunt-run-grunt.png)](https://gemnasium.com/Bartvds/grunt-run-grunt) [![NPM version](https://badge.fury.io/js/grunt-run-grunt.png)](http://badge.fury.io/js/grunt-run-grunt)

> Grunt task to run Gruntfiles in a child process. Gruntception!

Console output capture is not reliable on Windows as Node.js there doesn't always flush buffers before exiting. Until this is fixed Windows users should use the Vagrantfile instead (see below). :bangbang:

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-run-grunt --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-run-grunt');
```

## The "run_grunt" task

> *"Yo dawg! I herd you like grunt, so I put some grunt in your grunt so you can grunt while you grunt."* :laughing:

Use the `run_grunt` task to spawn new processes that run `grunt-cli` and optionally do work on the result data. It will use the global `$ grunt` command, just like when you'd run grunt manually.

Main use-case is testing your gruntfile or grunt-plugins, but it is also suited for creative use of gruntfiles and grunt-cli output. 

For example use it to verify the final output of various reporters and formatters. Alternately parse the output of the "$grunt --help" command and work with the list of tasks and aliases (without instrumenting the gruntfile in any way).

If you need something similar to run grunt in a production build environment or don't really care about the content of the cli output then you are probably looking for [grunt-hub](https://github.com/shama/grunt-hub) instead. If you need to run tasks from one Gruntfile concurrently use [grunt-concurrent](https://github.com/sindresorhus/grunt-concurrent) or [grunt-parallel](https://github.com/iammerrick/grunt-parallel).

In the future there will also be a way to use this as a standard Node.js module, so you can run grunt from inside standard scripts. *Why?* Who knows?

### Usage

In your project's Gruntfile, add a section named `run_grunt` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
	run_grunt: {
		options: {
			minimumFiles: 2
		},
		simple_target: {
			options: {
				log: false,
				process: function(res){
					if (res.fail){
						res.output = 'new content'
						grunt.log.writeln('bork bork');
					}
				}
			},
			src: ['Gruntfile.js', 'other/Gruntfile.js']
		},
	},
})
```
### Options

#### grunt-cli options 

```
help: boolean,
base: 'string',
'no-color': boolean,
debug: boolean,
stack: boolean,
force: boolean,
tasks: boolean,
npm: 'string',
'no-write': boolean,
verbose: boolean,
version: boolean
```

#### Custom options
```
// pass the tasks to run: either a string or array-of-strings
task: ['clean', 'jshint:strictTarget', 'mocha:subTarget']

// process the result data object
process: function(result){
	// see below for result structure
},

// log child console output
log: true,

// indent child console output with this string
indentLog: '  |  ',

// save raw output to file
logFile: null,

// modify env variables
env: {},

// apply an output parser (see below for values)
parser: '',

// how many parallel grunts to run
concurrent: <number> cpu-cores,

// expect at least this many files
minimumFiles: 1,

// change the cwd of the gruntfile
cwd: null,

//--- experimental options

// generate cli command
debugCli: false,

// save .bat and shellscripts
writeShell: null,

// don't fail
expectFail: false

// pass options that will be available in the executed gruntfile with grunt.option('myOption')
// NOTE: will overwrite cli options with the same name!
gruntOptions: {}
```

#### Process result object

```
// status, can override
fail: false,
output: 'string',

// parsed data
parsed: {
	'parseHelp' : {}
	..
},

// raw grunt.util.spawn callback arguments
error,
res,
code,

// used parameters
src: 'path/to/Gruntfile.js',
cwd: 'string',
tasks: [],
options: {},

//cleaned src
gruntfile: 'Gruntfile',

// timing
start: Date.now(),
end: 0,
duration: 0
```

### Parsers

**parseHelp**

Parse `grunt -h` output

* Use the `process` option to access the data.
* Returns `result.parsed.parseHelp` object with task and alias names.
* Requires `help` option (in a later version this will be forced)

# History

* 0.1.2 - Added env option
* 0.1.1 - Changed error behaviour.
* 0.0.4 - NPM push.
* 0.0.3 - Various construction work.
* 0.0.2 - Solidifying and added parsing helper to extract tasks and aliases.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Vagrant

There is a Vagrantfile and set of Chef cookbooks to use with [Vagrant](http://www.vagrantup.com) for easy testing on a Linux VM. It will install a node.js from package, install the dependencies and enable grunt.

## License

Copyright (c) 2013 Bart van der Schoor

Licensed under the MIT license.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/Bartvds/grunt-run-grunt/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

