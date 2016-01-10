var assert = require('assert');

var obj = require('./../../lib.js');

describe("Test parseUrl", function () {

    it("url with paramter", function () {
        var url, ret;
        url = "http://localhost/index.js?key=value";
        ret = obj.parseUrl(url);
        assert.equal('localhost', ret.host);
        assert.equal(80, ret.port);
        assert.equal('/index.js', ret.path);
        assert.equal('http', ret.protocol);
        assert.equal('value', ret.param.key);
    });

    it("url with array paramter", function () {
        var url, ret;
        url = "http://localhost/index.js?key=v1&key=v2&key=v3";
        ret = obj.parseUrl(url);
        assert.equal('v1', ret.param.key[0]);
        assert.equal('v2', ret.param.key[1]);
        assert.equal('v3', ret.param.key[2]);

    });

    it("url with port", function () {
        var url, ret;
        url = "http://localhost:8080/";
        ret = obj.parseUrl(url);
        assert.equal(8080, ret.port);


    });




});

