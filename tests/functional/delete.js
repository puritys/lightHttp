var lightHttp = require('./../../index.js');
var baseUrl = "http://www.puritys.me";
var assert = require('assert');
describe("Test HTTP DELETE", function () {
    var resp, header;
    header = {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85"
    };
    before(function (done) {
        lightHttp.request('DELETE', baseUrl + "/unit.php", {"key":"value"}, header, function(response) {
            resp = response;
            done();
        });

    }); 

    it("call request function", function () {
        var data;
        data = JSON.parse(resp);
        //assert.equal([], data);
    });
});

