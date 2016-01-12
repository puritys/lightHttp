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

    it("call post function", function () {
        lightHttp.post(baseUrl + "/unit.php", {"age": 13})
            .then(function (resp) {
                var data;
                data = JSON.parse(resp);
                assert.equal(13, data.age);
            });
    });

    it("post with the header", function () {
        lightHttp.post(baseUrl + "/unit.php", {}, {"unit": 10})
            .then(function (resp) {
                var data;
                data = JSON.parse(resp);
                assert.equal(10, data.unit);
            });
    });


});

describe("Test HTTP POST a raw string", function () {
    var resp;
    before(function (done) {
        lightHttp.post(baseUrl + "/unit.php", 'a[0]=b&a[1]=c')
            .then(function (response) {
                resp = response;
                done();
            });
    }); 

    it("post a JSON string", function () {
        var data;
        data = JSON.parse(resp);
        assert.equal('[\"b\",\"c\"]', data.a);

    });

});

