
var path = require('path');
var fs = require('fs');
var footprint = require('footprint');

var Context = function(request, response, session, framework) {
    this.request = request;
    this.response = response;
    this.session = session;
    this.framework = framework;
};

Context.prototype.none = function() {
    this.response.writeHead(204);
    this.response.end();
};

Context.prototype.renderJSON = function(jsonObj) {
    this.response.setHeader("Content-Type", "application/json");
    this.response.writeHead(200);
    this.response.end(JSON.stringify(jsonObj));
};

Context.prototype.redirect = function(url) {
    this.response.setHeader('Location', url);
    this.response.writeHead(301);
    this.response.end();
};

Context.prototype._renderView = function(viewEngine, template, data) {
    var framework = this.framework;
    var request = this.request;
    var response = this.response;

    try {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.write(viewEngine.template(template, data));
        response.end();
    } catch(e) {
        console.log(ex.message);
        console.log(ex.stack);
        framework.handler500(request, response, "Parse template error.");
    }
};

Context.prototype.renderView = function (view, data) {
    var context = this;
    var framework = context.framework;
    var request = context.request;
    var response = context.response;

    var viewEngine = footprint;

    viewEngine._cache = viewEngine._cache || {};
    var template = viewEngine._cache[view];

    if (template) {
        return context._renderView(viewEngine, template, data);
    }

    var filePath = path.join(__dirname, 'views/', view);
    path.exists(filePath, function(exists) {
        if (!exists) {
            return framework.handler500(request, response, "This template file doesn't exist.");
        }

        fs.readFile(filePath, 'utf8', function(err, file) {
            if (err) {
                framework.handler500(request, response, err);
            } else {
              viewEngine._cache[view] = file;
              context._renderView(viewEngine, file, data);
            }
        });
    });
};

Context.prototype.renderPartial = Context.prototype.renderView;

exports.Context = Context;
