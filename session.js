
var Session = function(sessionId) {
    this.sessionId = sessionId;
    this._map = {};
};

Session.prototype.set = function(key, value) {
    this._map[key] = value;
};

Session.prototype.get = function(key) {
    return this._map[key];
};

Session.prototype.remove = function(key) {
    delete this._map[key];
};

Session.prototype.removeAll = function() {
    delete this._map;
    this._map = {};
}

Session.prototype.updateTime = function() {
    this._updateTime = new Date().getTime();
};

var SESSION_KEY = exports.SESSION_KEY = 'session_id';

var SessionManager = function(timeout) {
    this.timeout = timeout;
    this._sessions = {};
};

SessionManager.prototype.renew = function(response) {
    var clientTimeout = 30 * 24 * 60 * 60 * 1000;
    var cookie = null;
    // 得到session ID
    var sessionId = [new Date().getTime(), Math.round(Math.random() * 1000)].join('');
    var session = new Session(sessionId);
    session.updateTime();
    this._sessions[sessionId] = session;

    // 设置cookie
    cookie = {
        key: SESSION_KEY,
        value: sessionId,
        path: '/',
        expires: new Date().getTime + clientTimeout
    };
    response.setCookie(cookie);

    return session;
};

SessionManager.prototype.get = function(sessionId) {
    return this._sessions[sessionId];
};

SessionManager.prototype.remove = function(sessionId) {
    delete this._sessions[sessionId];
};

SessionManager.prototype.isTimeout = function (session) {
    return (session._updateTime + this.timeout) < new Date().getTime();
};

exports.Session = Session;
exports.SessionManager = SessionManager;
