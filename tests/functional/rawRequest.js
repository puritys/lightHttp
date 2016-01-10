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

describe("Test asynchronous Raw Request", function () {//{{{
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
});//}}}

describe("Test synchronous Raw Request", function () {//{{{
    var content;
    it("normal", function () {
        http.rawRequest(host, port, msg)
            .then(function (content) {
                var reg = /<\!DOCTYPE[\s]+html>/i;
                var match = content.match(reg);
                assert.equal('<!doctype html>', match);
             });
    });
});//}}}

describe("Test asynchronous Raw Request: POST", function () {//{{{
    var content, postLength;
    before(function(done) {
        http.enableDebugMode();
        host = "www.puritys.me";
        var post = "a=b";
        postLength = post.length;
        var msg = [
        "POST /unit.php HTTP/1.1",
        "host: " + host,
        "content-type: application/x-www-form-urlencoded",
        "content-length: " + postLength,
        "Connection: close",
        ""].join("\r\n");
        msg += "\r\n" +post + "\r\n\r\n";
        http.rawRequest(host, port, msg, function (resp) {
            content = resp;
            done();
        });
        http.disableDebugMode();
    });

    it("normal", function () {
        var reg = /{"a":"b"}/i;
        var match = content.match(reg);
        assert.equal('{"a":"b"}', match);
    });
});//}}}

describe("Test asynchronous Raw Request: file upload", function () {
    var content, postLength;
    before(function(done) {
        http.enableDebugMode();
        var boundary = "------------------------------uppyumd8mxt2";
        host = "www.puritys.me";
//host = "localhost";
//port = 8080;
//
//        var post = [
//            "Content-Disposition: form-data; name=\"fileData\"; filename=\"fileName.png\"",
//            "Content-Type: image/png",
//            "",
//            "content",
//        ].join("\r\n");
//        postLength = post.length;
//        post = "--ikvrjxlrs6gc\n" + post + "\n--ikvrjxlrs6gc--";
        var post = [
            "--" + boundary,
            "Content-Disposition: form-data; name=\"fileData\"; filename=\"fileName.png\"",
            "Content-Type: text/plain",
            "",
            "content",
            "--" + boundary,
            "Content-Disposition: form-data; name=\"age\"",
            "",
            "13",
            "--" + boundary + "--",
        ].join("\r\n");
        postLength = post.length;
        postLength = postLength.toString(16);
        post += "\r\n0\n\n";

        var msg = [
        "POST /unit.php HTTP/1.1",
        "host: " + host,
        "content-type: multipart/form-data; boundary=" + boundary,
        "Connection: close",
        "Transfer-Encoding: chunked",
        "",
        postLength].join("\r\n");
        msg += "\r\n" +post;
        http.rawRequest(host, port, msg, function (resp) {
            content = resp;
            done();
        });
        http.disableDebugMode();
    });

    it("normal", function () {
        var reg = /"name":"fileName.png"/i;
        var match = content.match(reg);
console.log("content = " + content);
        assert.equal('"name":"fileName.png"', match);
    });
});

