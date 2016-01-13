var assert = require('assert');

require('./mock/window.js');
require('./mock/formData.js');
require('./mock/XMLHttpRequest.js');
var lib = require('./../../lib.js');
var lightHttp = require('./../../lightHttp.js');
var obj = new window.lightHttp();

describe("Test Browser Get", function () {

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
        //assert.equal("test?name=Joe%20Johnson&age=13", window.location.href);
    });
});

describe("Test composeFormData", function () {

    it("Normal Case", function () {
        var inputFiles, param;
        inputFiles = [{
            "field": "fileData",
            "input": {"files": ["element"]}
        }];
        param = {
            "a": "b",
            "obj": {"a": "b"}
        };
        var ret = obj.composeFormData(inputFiles, param);
        console.log(ret);
        assert.equal("fileData", ret.files[0].field);
        assert.equal("a", ret.files[1].field);
        assert.equal("obj[a]", ret.files[2].field);
    });

});

describe("Test request", function () {
    var resp1;
    before(function (done) {
        var name, type, url, param, ret;
        name = "ajax";
        type = "GET";
        url = "http://www.puritys.me/";
        param = {};
        ret = obj.request(name, type, url, param, function (response) {
            resp1 = response;
            done();
        });
    }); 

    it("Promise", function () {
        var name, type, url, param, ret;
        name = "ajax";
        type = "GET";
        url = "http://www.puritys.me/";
        ret = obj.request(name, type, url);
        assert.equal("[object Promise]", ret.toString());
    });

    it("Asynchonous ajax", function () {
        assert.equal("GET", resp1.type);
        assert.equal("http://www.puritys.me/", resp1.url);

    });

});


