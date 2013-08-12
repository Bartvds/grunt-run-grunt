# grunt-run-grunt

[![Build Status](https://secure.travis-ci.org/Bartvds/grunt-run-grunt.png?branch=master)](http://travis-ci.org/Bartvds/grunt-run-grunt) [![Dependency Status](https://gemnasium.com/Bartvds/grunt-run-grunt.png)](https://gemnasium.com/Bartvds/grunt-run-grunt) [![NPM version](https://badge.fury.io/js/grunt-run-grunt.png)](http://badge.fury.io/js/grunt-run-grunt)

> Grunt task to run grunt as child process.

:warning: This project is pre-alpha. Use with care until 0.1.0

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

> *"Yo dawg! I herd you like grunt, so I put some grunt in your grunt so you can grunt while you grunt."*

Use the `run_grunt` task to spawn new processes that run `grunt-cli` and optionally work on the various result data. It will use the global `$ grunt` command.

Main use-case is testing your gruntfile or grunt-plugins, but it is also suited for creative use of gruntfiles and grunt-cli output.

If you need something like this to run grunt in a production build environment or don't care about the content of the cli output then you are probably looking for [grunt-hub](https://github.com/shama/grunt-hub).

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

Snake_cased instead of default-dashes.
 
```
help: boolean,
base: 'string',
no_color: boolean,
debug: boolean,
stack: boolean,
force: boolean,
tasks: boolean,
npm: 'string',
no_write: boolean,
verbose: boolean,
version: boolean
```

#### Custom options
```
// pass the tasks to run: either a string or array-of-strings
task: ['clean', 'jshint:strictTarget', 'mocha:subTarget']

// process the result data object
process: function(res){
	// see below for result structure
},

// log child console output
log: true,

// indent child console output with this string
indentLog: '  |  ',

// save raw output to file
logFile: null,

// how many parallel grunts to run
concurrent: 4,

// expect at least this many files
minimumFiles: 1,

// change the cwd of the gruntfile
cwd: null,

//--- experimental options

// generate cli command
debugCli: false,

// save .bat and shellscripts
writeShell: null,

// experimental
expectFail: false
```

#### Process result object

```
// status, can override
fail: false,
output: 'string',

// raw grunt.util.spawn callback arguments
error,
res,
code,

// used parameters
src: 'Gruntfile.js',
cwd: 'string',
tasks: [],
options: {},

// timing
start: Date.now(),
end: 0,
duration: 0
```

# History

* 0.0.x -Pre-alpha prototype

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License

Copyright (c) 2013 Bart van der Schoor

Licensed under the MIT license.