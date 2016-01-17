var assert = require('assert');

require('./mock/window.js');
require('./mock/formData.js');
require('./mock/XMLHttpRequest.js');
require('./mock/document.js');

var lib = require('./../../lib.js');
var lightHttp = require('./../../lightHttp.js');
var obj = new window.lightHttp();

describe("Test Browser Get", function () {//{{{

    it("without parameters", function () {
        obj.get("test");
        assert.equal("test", window.location.href);
    });

    it("Url with hash tag", function () {
        obj.get("test#index", {"a":"b"});
        assert.equal("test?a=b", window.location.href);
    });


    it("simple parameters", function () {
        obj.get("test", {"age":13, "name": "Joe"});
        assert.equal("test?age=13&name=Joe", window.location.href);
    });

    it("include space at parameter", function () {
        obj.get("test", {"age":13, "name": "Joe Johnson"});
        assert.equal("test?age=13&name=Joe%20Johnson", window.location.href);
    });

    it("include space at url paramater(Not handle)", function () {
        obj.get("test?name=Joe Johnson", {"age":13});
        assert.equal("test?name=Joe Johnson&age=13", window.location.href);
    });

    it("Set array into parameter", function () {
        obj.get("test", {"a":[1,2,3]});
        assert.equal("test?a[0]=1&a[1]=2&a[2]=3", window.location.href);
    });

    it("Set object into parameter", function () {
        obj.get("test", {"a": {"b":"c"}});
        assert.equal("test?a[b]=c", window.location.href);
    });

    it("Set boolean into parameter", function () {
        obj.get("test", {"a": true});
        assert.equal("test?a=true", window.location.href);
    });

    it("Set complicate data into parameter", function () {
        obj.get("test", {"a": ["b", {"c":"d"}]});
        assert.equal("test?a[0]=b&a[1][c]=d", window.location.href);
    });

});//}}}

describe("Test composeFormData", function () {//{{{

    it("Normal Case", function () {
        var inputFiles, param;
        inputFiles = [{
            "field": "fileData",
            "input": {"files": ["element"]}
        }];
        param = {
            "a": "b",
            "obj": {"a": "b"},
            "ay": [1,2,3]
        };
        var ret = obj.composeFormData(inputFiles, param);
        console.log(ret);
        assert.equal("fileData", ret.files[0].field);
        assert.equal("a", ret.files[1].field);
        assert.equal("obj[a]", ret.files[2].field);
        assert.equal("ay[0]", ret.files[3].field);
    });

});//}}}

describe("Test request", function () {//{{{
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

    it("Asynchonous ajax", function () {
        assert.equal("GET", resp1.type);
        assert.equal("http://www.puritys.me/", resp1.url);

    });

    it("Promise Normal", function () {
        var name, type, url, param, ret;
        name = "ajax";
        type = "GET";
        url = "http://localhost/";
        ret = obj.request(name, type, url);
        assert.equal("[object Promise]", ret.toString());
    });



});//}}}

describe("Test ajax request with query string", function () {//{{{
    var resp1;
    before(function (done) {
        var name, type, url, param, ret, header;
        url = "http://localhost/?a=b&c=d";
        param = {"zz":"1"};
        header = {"cookie": "test cookie"};
        ret = obj.ajax(url, param, header, function (response) {
            resp1 = response;
            done();
        });
    }); 
    it("Promise with query string", function () {
        assert.equal("http://localhost/?a=b&c=d&zz=1", resp1.url);
        assert.equal("test cookie", resp1.headers.cookie);

    });

});//}}}

describe("Test ajaxPOST request with query string", function () {//{{{
    var resp1;
    before(function (done) {
        var name, type, url, param, ret, header;
        url = "http://localhost/?a=b&c=d";
        param = {"zz":"1", "a":[1,2,3], "obj": {"z":"z"}};
        header = {"cookie": "test cookie"};
        ret = obj.ajaxPost(url, param, header, function (response) {
            resp1 = response;
            done();
        });
    }); 
    it("Promise with query string", function () {
        assert.equal("http://localhost/?a=b&c=d", resp1.url);
        assert.equal("application/x-www-form-urlencoded", resp1.headers['Content-type']);
        assert.equal("test cookie", resp1.headers['cookie']);
        assert.equal("zz=1&a[0]=1&a[1]=2&a[2]=3&obj[z]=z", resp1.postData);
    });

});//}}}

describe("Test post request", function () {//{{{
    it("Normal query string", function () {
        var url, param, ret;
        url = "http://localhost/";
        param = {"a":"b"};
        ret = obj.post(url, param);
        assert.equal("form", ret.tagName);
        assert.equal("http://localhost/", ret.action);
        assert.equal("a", ret.child[0].name);
        assert.equal("b", ret.child[0].value);
    });

    it("Query string with array", function () {
        var url, param, ret;
        url = "http://localhost/";
        param = {"a": [1,2,3]};
        ret = obj.post(url, param);
        assert.equal("a[0]", ret.child[0].name);
        assert.equal("1", ret.child[0].value);
        assert.equal("a[1]", ret.child[1].name);
        assert.equal("2", ret.child[1].value);
    });

    it("Query string with object", function () {
        var url, param, ret;
        url = "http://localhost/";
        param = {"a": {"b": "c"}};
        ret = obj.post(url, param);
        assert.equal("a[b]", ret.child[0].name);
        assert.equal("c", ret.child[0].value);
    });

    it("Query string with complicate", function () {
        var url, param, ret;
        url = "http://localhost/";
        param = {"a": {"b": ["c", {"d":"e"}]}};
        ret = obj.post(url, param);
        assert.equal("a[b][0]", ret.child[0].name);
        assert.equal("c", ret.child[0].value);
        assert.equal("a[b][1][d]", ret.child[1].name);
        assert.equal("e", ret.child[1].value);


    });

});//}}}

describe("Test jsonp request", function () {//{{{
    it("With Callback function", function () {
        var url, param, header, ret;
        url = "http://localhost/";
        param = {"a":"b"};
        obj.jsonp(url, param, header, function (resp) {
            return resp;
        });
        for (var key in obj.jsonpCallbackList) break;
        if (!key.match(/jsonp/)) {
            assert.equal(true, false, 'The jsonp miss jsonpCallbackList');
        } else {
            assert.equal(true, true);
        }
    });

    it("Without the header parameter", function () {
        var url, param, header, ret;
        url = "http://localhost/";
        obj.jsonp(url, param, function (resp) {
            return resp;
        });
        for (var key in obj.jsonpCallbackList) break;
        if (!key.match(/jsonp/)) {
            assert.equal(true, false, 'The jsonp miss jsonpCallbackList');
        } else {
            assert.equal(true, true);
        }
    });

    it("Call jsonp callback and cleanJsonpCallback", function () {
        var url, param, header, ret;
        url = "http://localhost/";
        obj.jsonp(url, param, function (resp) {
            return resp;
        });
        obj.jsonp(url, param, function (resp) {
            return resp;
        });
        for (var key in obj.jsonpCallbackList) {
            window[key]();
        }

        for (var key in obj.jsonpCallbackList) {
            assert.equal(1, obj.jsonpCallbackList[key]);
            assert.equal("function", typeof(window[key]));
        }
        obj.cleanJsonpCallback();
        for (var key in obj.jsonpCallbackList) {
            assert.equal("undefined", typeof(window[key]));
        }
    });

});//}}}


describe("Test addFile", function () {//{{{
    it("Normal case", function () {
        var ret;
        ret = obj.addFile("key", {"a":"b"});
        assert.equal("key", obj.uploadFiles[0].field);
        assert.equal("b", obj.uploadFiles[0].input['a']);
    });

    it("empty", function () {
        var ret;
        ret = obj.addFile("key");
        assert.equal(false, ret);
    });
});//}}}


