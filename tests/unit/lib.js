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
});

