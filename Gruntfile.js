'use strict';

var WikidataBuilder = require('./src/WikidataBuilder');
var config = require('./config');

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['integrate']);

	grunt.initConfig({
		nodeunit: {
			files: ['test/**/*Test.js']
		},

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
		'integrate',
		['jshint', 'nodeunit']
	);

	grunt.task.registerTask(
		'build',
		'Create a new build',
		function() {
			var builder = new WikidataBuilder(
				grunt,
				{
					'buildDir': config.BUILD_DIR,
					'buildName': Math.round((new Date()).getTime() / 1000 ).toString(),
					'resourceDir': config.RESOURCE_DIR,
					'composerCommand': config.COMPOSER_COMMAND
				}
			);

			var done = this.async();

			builder.once(
				'done',
				function(error) {
					done(error===null);
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
				'rm -rf ' + config.BUILD_DIR,
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
