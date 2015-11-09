var assert = require('assert');
var http = require('./../../index.js');
var host = "www.google.com.tw";
var port = 80;
var path = "/";
var cookie = 'SID=; HSID=; SSID=jjj; APISID=;';
var msg = [
"GET " + path + " HTTP/1.1",
"host: " + host,
"cookie: " + cookie,
"\r\n"].join("\r\n");

describe("Test asynchronous Raw Request", function () {
    var content;
    before(function(done) {
        http.enableDebugMode();
        http.rawRequest(host, port, msg, function (resp) {
            content = resp;
            done();
        });
        http.disableDebugMode();
    });
    it("normal", function () {
        var reg = /<\!DOCTYPE[\s]+html>/i;
        var match = content.match(reg);

        assert.equal('<!doctype html>', match);
    });
});

describe("Test synchronous Raw Request", function () {
    var content;
    it("normal", function () {
        http.rawRequest(host, port, msg)
            .then(function (content) {
                var reg = /<\!DOCTYPE[\s]+html>/i;
                var match = content.match(reg);
                assert.equal('<!doctype html>', match);
             });
    });
});


