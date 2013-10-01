'use strict';

var path = require('path');

var WikidataBuilder = require('./src/WikidataBuilder');
var ConfigResolver = require('./src/ConfigResolver');

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['integrate']);

	grunt.initConfig({
		nodeunit: {
			quick: {
				src: ['test/quick/**/*Test.js']
			},
			slow: {
				src: ['test/slow/**/*Test.js']
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			projectBase: {
				src: ['*.js', '*.json']
			},
			all: {
				src: [
					'src/**/*.js',
					'test/**/*.js',
					'*.json'
				]
			}
		},

		watch: {
			all: {
				files: '<%= jshint.all.src %>',
				tasks: ['quick']
			},
			projectBase: {
				files: '<%= jshint.projectBase.src %>',
				tasks: ['jshint:projectBase']
			}
		}
	});

	grunt.task.registerTask(
		'test',
		['jshint', 'nodeunit']
	);

	grunt.task.registerTask(
		'integrate',
		['test']
	);

	grunt.task.registerTask(
		'quick',
		['jshint', 'nodeunit:quick']
	);

	grunt.task.registerTask(
		'build',
		'Create a new build',
		function(build) {
			var done = this.async();

			new ConfigResolver(require('./appConfig')).getConfigForBuild(
				build,
				function(config) {
					var builder = new WikidataBuilder(
						grunt,
						config
					);

					builder.once(
						'done',
						function(error) {
							done(error===null);
						}
					);

					builder.build();
				}
			);
		}
	);

	grunt.task.registerTask(
		'mkconf',
		'Create default new configuration',
		function(configName) {
			if ( !configName ) {
				grunt.fail.fatal('Need to provide a config name');
			}
			var done = this.async();

			var ConfigDirCreator = require('./src/ConfigDirCreator');
			var dirCreator = new ConfigDirCreator(require('./appConfigappConfig').BUILD_CONFIG_DIR);

			dirCreator.once('done', function() {
				done();
			});

			dirCreator.create(configName);
		}
	);

	grunt.task.registerTask(
		'clean',
		'Remove all resources generated by this app, including builds',
		function() {
			var done = this.async();
			var exec = require('child_process').exec;

			exec(
				'rm -rf ' + require('./appConfig').BUILD_DIR,
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
