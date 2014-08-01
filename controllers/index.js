
var get = exports.get = {};

get.index = function() {
    console.log('asdasds');
    var response = this.response;
    response.setHeader('Content-Type', 'text/html');
    response.writeHead('200');
    response.end('<h1>Hello Node.</h1>\n');
};

get.none = function () {
    this.none();
};

get.json = function () {
    var obj = {'Hello': 'world!'};
    this.renderJSON(obj);
};

get.redirect = function () {
    this.redirect('https://www.google.com.hk');
};

get.render = function () {
    var obj = {'title': 'Node'};
    this.renderView('index.html', obj);
};
