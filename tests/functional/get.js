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
    var resp1, resp1Header;
    before(function (done) {
        // Method GET
        lightHttp.get(baseUrl)
            .then(function (resp) {
                resp1 = resp.match(/doctype html/)[0];
                done();
            });
    });

    it("call get function", function () {
        assert.equal("doctype html", resp1);
    });

    var resp2, resp2Header;
    before(function (done) {
        // Method GET
        lightHttp.get(myUrl + "/unit.php", "", {unit: 10})
            .then(function (resp, respHeader) {
                resp2Header = lightHttp.getResponseHeaders();
                resp2 = JSON.parse(resp);
                done();
            });
    });
    it("call with the header", function () {
        assert.equal(10, resp2['unit']);
        assert.equal('text/html; charset=utf-8', resp2Header['content-type']);
        assert.equal(200, resp2Header['status-code']);
        assert.equal('OK', resp2Header['status-message']);

    });



});

