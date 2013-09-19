'use strict';

var path = require('path');
var WikidataBuilder = require('./src/WikidataBuilder');

var BUILD_DIR = path.resolve(process.cwd(), 'build');
var RESOURCE_DIR = path.resolve(process.cwd(), 'build_resources');
var COMPOSER_COMMAND = 'php ' + path.resolve(process.cwd(), 'bin/composer.phar');

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jshint']);

	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			projectBase: {
				src: ['*.js', '*.json']
			}
		},

		watch: {
			all: {
				files: ['**/*.js', '*.json'],
				tasks: ['default']
			},
			projectBase: {
				files: '<%= jshint.projectBase.src %>',
				tasks: ['jshint:projectBase']
			}
		}
	});

	grunt.task.registerTask(
		'build',
		'Create a new build',
		function() {
			var builder = new WikidataBuilder(
				grunt,
				this.async(),
				{
					'buildDir': BUILD_DIR,
					'buildName': Math.round((new Date()).getTime() / 1000 ).toString(),
					'resourceDir': RESOURCE_DIR,
					'composerCommand': COMPOSER_COMMAND
				}
			);

			builder.build();
		}
	);

	grunt.task.registerTask(
		'clean',
		'Remove all resources generated by this app, including builds',
		function() {
			var done = this.async();
			var exec = require('child_process').exec;

			exec(
				'rm -rf ' + BUILD_DIR,
				function(error, stdout, stderr) {
					done(error===null);

					if (stdout !== '') {
						grunt.log.writeln(stdout);
					}

					if (stderr !== '') {
						grunt.log.writeln(stderr);
					}
				}
			);
		}
	);

};
