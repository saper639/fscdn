const options = {};

// options.ip = '127.0.0.1';
// options.port = parseInt(process.argv[2]);
// options.unixsocket = require('path').join(require('os').tmpdir(), 'app_name');
// options.config = { name: 'Total.js' };
// options.sleep = 3000;
// options.inspector = 9229;
// options.watch = ['private'];
// options.livereload = 'https://yourhostname';

// For development:
var type = process.argv.indexOf('--release', 1) !== -1 || process.argv.indexOf('release', 1) !== -1 ? 'release' : 'debug';
require('total4/' + type)(options);
