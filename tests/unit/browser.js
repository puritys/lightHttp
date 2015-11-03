var assert = require('assert');

require('./mock/window.js');
var lib = require('./../../lib.js');
var lightHttp = require('./../../lightHttp.js');
var obj = new window.lightHttp();

describe("get", function () {

    it("without parameters", function () {
        obj.get("test");
        assert.equal("test", window.location.href);
    });

    it("simple parameters", function () {
        obj.get("test", {"age":13, "name": "Joe"});
        assert.equal("test?age=13&name=Joe", window.location.href);
    });

    it("include space at parameter", function () {
        obj.get("test", {"age":13, "name": "Joe Johnson"});
        assert.equal("test?age=13&name=Joe%20Johnson", window.location.href);
    });

    it("include space at url paramater", function () {
        obj.get("test?name=Joe Johnson", {"age":13});
        assert.equal("test?name=Joe%20Johnson&age=13", window.location.href);
    });



});
