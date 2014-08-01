
exports.expires = {
    fileMatch: /^(gif|png|jpg|js|css)$/ig,
    maxAge: 60*60*24*365
};

exports.compress = {
    match: /css|html/ig
};

exports.welcome = {
    file: 'index.html'
}

exports.timeout = 20 * 60 * 1000;
exports.secure = null;
