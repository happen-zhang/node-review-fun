
var http = require('http');
var https = require('https');
var config = require('./config');

exports.createServer = function(framework, options) {
    var server = null;

    options = options || config.secure;
    server = options ? https.createServer(options) : http.createServer();

    server.on('request', function(request, response) {
        framework.dispatch(request, response);
    });

    return server;
}
