var lightHttp = require('./../../index.js');
var baseUrl = "https://www.google.com.tw";
var assert = require('assert');
var myUrl = "http://www.puritys.me";

describe("Test HTTP GET", function () {
    var resp, header;
    header = {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85"
    };
    before(function (done) {
        lightHttp.request('get', baseUrl + "/", {"key":"value"}, header, function(response) {
            resp = response;
            done();
        });

    }); 

    it("call request function", function () {
        // Method GET
        var str = resp.match(/doctype html/)[0];
        assert.equal("doctype html", str);
    });
});

describe("Test HTTP GET Promise", function () {

    it("call get function", function () {
        // Method GET
        lightHttp.get(baseUrl)
            .then(function (resp) {
                var str = resp.match(/doctype html/)[0];
                assert.equal("doctype html", str);
            });
    });

    it("call with the header", function () {
        // Method GET
        lightHttp.get(myUrl + "/unit.php", "", {unit: 10})
            .then(function (resp) {
                var data = JSON.parse(resp);
                assert.equal(10, data['unit']);
            });
    });



});

