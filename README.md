# grunt-run-grunt

> Grunt task to run grunt as child process.

:warning: The project is pre-alpha.

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

> *"Yo dawg, I heard you like grunt, so I put some grunt in your grunt so you can grunt while you grunt."*

Use the `run_grunt` task to spawn new processes that run `grunt-cli` and optionally work on the various result data. It will use the global `$ grunt` command.

Main use-case is testing your gruntfile or grunt-plugins, but it is also suited for creative use of gruntfiles and grunt-cli output.

If you need something like this to run grunt in a production build environment or don't care about the content of the cli output then you are probably looking for [grunt-hub](https://github.com/shama/grunt-hub).

### Options

In your project's Gruntfile, add a section named `run_grunt` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  run_grunt: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

# History

* 0.0.1 - First!

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License

Copyright (c) 2013 Bart van der Schoor

Licensed under the MIT license.