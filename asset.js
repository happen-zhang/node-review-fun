
/**
 * 处理静态资源
 */

var url = require('url');
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

var mime = require('./mime');
var config = require('./config');

var Asset = function() {

};

Asset.prototype.dispatch = function(request, response) {
    var pathname = null;
    var realPath = null;

    // 设置响应头部
    response.setHeader('Server', 'Node/Nginx');
    response.setHeader('Accept-Ranges', 'bytes');

    // 解析url中的路径
    pathname = url.parse(request.url).pathname;
    if ('/' === pathname.slice(-1)) {
        pathname = pathname + config.welcome.file;
    }
    // 得到文件在磁盘中的真实路径，同时删除..前缀，避免得不到正确地文件路径
    realPath = path.join('assets', path.normalize(pathname.replace(/\.\./g, '')));

    var pathHandle = function(realPath) {
        fs.stat(realPath, function(err, stats) {
            if (err) {
                // 需要访问的文件不存在
                response.writeHead(404, "Not Found", {'Content-Type': 'text/plain'});
                response.write("This request URL " + pathname + " was not found on this server.");
                return response.end();
            }

            if (stats.isDirectory()) {
                // 如果是目录则继续递归
                realPath = path.join(realPath, '/', config.welcome.file);
                console.log(realPath);
                return pathHandle(realPath);
            }

            // 得到文件的扩展名称
            var ext = path.extname(realPath);
            // 为知扩展名
            ext = ext ? ext.slice(1) : 'unknown';
            // 得到响应的mime类型
            var contentType = mime[ext] || 'text.plain';

            // 设置响应头
            response.setHeader('Content-Type', contentType);
            response.setHeader('Content-Length', stats.size);

            // 文件最后修改时间
            var lastModified = stats.mtime.toUTCString();
            var ifModifiedSince = 'If-Modified-Since'.toLowerCase();
            response.setHeader('Last-Modified', lastModified);

            if (ext.match(config.expires.fileMatch)) {
                // 匹配到到需要缓存的资源文件
                var expires = new Date();
                // 设置过期时间
                expires.setTime(expires.getTime() + config.expires.maxAge * 1000);

                // 设置响应头
                response.setHeader('Expires', expires.toUTCString());
                response.setHeader('Cache-Control', 'max-age=' + config.expires.maxAge);
            }

            if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
                response.writeHead(304, "Not Modified");
                return response.end();
            }

            // 资源压缩处理
            var compressHandle = function(raw, statusCode, reasonPhrase) {
                var stream = raw;
                var acceptEncoding = request.headers['accept-encoding'] || '';
                var matched = ext.match(config.compress.match);

                if (matched && acceptEncoding.match(/\bgzip\b/)) {
                    response.setHeader('Content-Encoding', 'gzip');
                    stream = raw.pipe(zlib.createGzip());
                } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                    response.setHeader('Content-Encoding', 'deflate');
                    stream = raw.pipe(zlib.createDeflate());
                }

                response.writeHead(statusCode, reasonPhrase);
                stream.pipe(response);
            }

            if (request.headers['range']) {
                var range = utils.parseRange(require.headers['range'], stats.size);

                if (range) {
                    response.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + stats.size);
                    response.setHeader('Content-Length', (range.end - range.start + 1));

                    var raw = fs.createReadStrem(realPath, {
                        start: range.start,
                        end: range.end
                    });

                    compressHandle(raw, 206);
                } else {
                    response.removeHeader('Content-Length');
                    response.writeHead(416);
                    response.end();
                }

                return ;
            }

            var raw = fs.createReadStream(realPath);
            compressHandle(raw, 200);
        });
    }

    pathHandle(realPath);
};

exports.Asset = Asset;
