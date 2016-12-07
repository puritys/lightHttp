var lightHttp = require('./../../index.js');
var baseUrl = "http://www.puritys.me";
//baseUrl = "http://localhost:8080/";
var assert = require('assert');

describe("Test HTTP POST", function () {
    var resp, header;
    header = {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85"
    };
    before(function (done) {
        lightHttp.request('post', baseUrl + "/unit.php", {"key":"value"}, header, function(response) {
            resp = response;
            done();
        });

    }); 

    it("call request function", function () {
        var data;
        data = JSON.parse(resp);
        assert.equal("value", data.key);

    });
});

describe("Test HTTP POST Promise", function () {
    var resp1;
    before(function (done) {
        lightHttp.post(baseUrl + "/unit.php", {"age": 13})
            .then(function (resp) {
                resp1 = JSON.parse(resp);
                done();
            });

    });

    it("call post function", function () {
        assert.equal(13, resp1.age);
    });
});

describe("Test HTTP POST Promise2", function () {
    var resp1;
    before(function (done) {
        lightHttp.post(baseUrl + "/unit.php", {}, {"unit": 10})
            .then(function (resp) {
                resp1 = JSON.parse(resp);
                done();
            });

    });

    it("post with the header", function () {
        assert.equal(10, resp1.unit);
    });


});

describe("Test HTTP POST a raw parameter string", function () {
    var resp;
    before(function (done) {
        lightHttp.post(baseUrl + "/unit.php?z=p&c=1&c=2", 'a[0]=b&a[1]=c&z=a')
            .then(function (response) {
                resp = response;
                done();
            });
    }); 

    it("handle a JSON string", function () {
        var data;
        data = JSON.parse(resp);
        //console.log(data);
        assert.equal('[\"b\",\"c\"]', data.a);
        assert.equal('a', data.z);
        //assert.equal('["1","2"]', data.c);
    });

});


describe("Test HTTP POST a raw JSON string", function () {
    var resp;
    before(function (done) {
        lightHttp.post(baseUrl + "/unit.php?rawJson=1", '{"a":["b","c"],"z":"a"}')
            .then(function (response) {
                resp = response;
                done();
            });
    }); 

    it("handle a JSON string", function () {
        var data;
        data = JSON.parse(resp);
        assert.equal("b", data.a[0]);
        assert.equal('a', data.z);
    });

});

