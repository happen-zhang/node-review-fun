
var qixi = require('./qixi');
var Asset = require('./asset').Asset;
var Framework = require('./framework').Framework;

var asset = new Asset();
qixi.createServer(asset).listen(8005);
console.log('Static file server is running at 8005 port.');

var framework = new Framework();
qixi.createServer(framework).listen(8006);
console.log('Static file server is running at 8006 port.');
