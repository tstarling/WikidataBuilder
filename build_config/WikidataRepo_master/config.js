'use strict';

/**
 * Build specific configuration.
 *
 * @type {{
 * NAME_OF_TOP_DIR: string The name of the top level directory of the build,
 * BUILD_DIR: string Directory to place the build into, relative to the application build directory
 * }}
 */
module.exports = {
	NAME_OF_TOP_DIR: 'WikidataRepo',
	BUILD_DIR: 'WikidataRepo_master/' + Math.round((new Date()).getTime() / 1000 ).toString()
};