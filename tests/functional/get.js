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

describe("Test HTTPS with self signatured certification", function () {//{{{

    var resp, respHeader;
    before(function (done) {
        var header = {unit: 11};
        lightHttp.disableSslVerification();
        lightHttp.get("https://www.puritys.me/unit.php", {unit: 1}, header)
            .then(function (text) {
                respHeader = lightHttp.getResponseHeaders();
                resp = JSON.parse(text);
                done();
            });
    });
    it("normal case", function () {
        assert.equal(11, resp.unit);
    });

});//}}}

describe("Test HTTPS are passed  by ssl host verification", function () {//{{{
    var resp, respHeader;
    before(function (done) {
        var header = {unit: 11};
        lightHttp.enableSslVerification();
        lightHttp.get("https://www.puritys.me/unit.php", {unit: 1}, header)
            .then(function (text) {
                respHeader = lightHttp.getResponseHeaders();
                resp = JSON.parse(text);
                done();
            })
            .fail(function (err) {
                resp = JSON.parse(err);
                done();
            });
    });
    it("normal case", function () {
        //assert.equal('SELF_SIGNED_CERT_IN_CHAIN', resp.code);
        assert.equal(11, resp.unit);
    });

});//}}}

describe("Test HTTP GET Promise", function () {//{{{
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
        var header = {"cookie": "aaa=vvv", unit: 10};
        lightHttp.get(myUrl + "/unit.php", "", header)
            .then(function (resp, respHeader) {
                resp2Header = lightHttp.getResponseHeaders();
                resp2 = JSON.parse(resp);
                done();
            });
    });

    it("call with the header", function () {
        assert.equal(10, resp2['unit']);
        assert.equal('aaa=vvv', resp2['cookie']);
        assert.equal('text/html; charset=utf-8', resp2Header['content-type']);
        assert.equal(200, resp2Header['status-code']);
        assert.equal('OK', resp2Header['status-message']);
        var i = 0;
        while(resp2Header['set-cookie'][i].indexOf('__cfduid') != -1) i++;
        assert.equal('a=v1', resp2Header['set-cookie'][i++].match(/[^;]+/)[0]);
        assert.equal('b=v2', resp2Header['set-cookie'][i++]);
    });
});//}}}

describe("Test Object cookie", function () {//{{{
    var resp3, resp3Header;
    before(function (done) {
        // Method GET
        var header = {"cookie": {"a":"b", "c":"d"}, unit: 11};
        lightHttp.get(myUrl + "/unit.php", "", header)
            .then(function (resp, respHeader) {
                resp3Header = lightHttp.getResponseHeaders();
                resp3 = JSON.parse(resp);
                done();
            });
    });
    it("call with cookie which format is a JSON object", function () {
        assert.equal('a=b; c=d', resp3['cookie']);
    });
});//}}}

describe("Test Array Cookie", function () {//{{{

    var resp4, resp4Header;
    before(function (done) {
        // Method GET
        var header = {"cookie": ["a=z", "c=d"], unit: 11};
        lightHttp.get(myUrl + "/unit.php", "", header)
            .then(function (resp, respHeader) {
                resp4Header = lightHttp.getResponseHeaders();
                resp4 = JSON.parse(resp);
                done();
            });
    });
    it("call with cookie which format is a array", function () {
        assert.equal('a=z; c=d', resp4['cookie']);
    });

});//}}}

describe("Test following location (promise) - auto redirect to specific location", function () {//{{{

    var resp, respHeader;
    before(function (done) {
        // Method GET
        var header = {unit: 1};
        lightHttp.followLocation = true;
        lightHttp.get(myUrl + "/unit.php", {"redirect": 1}, header)
            .then(function (text) {
                respHeader = lightHttp.getResponseHeaders();
                resp = text;
                done();
            });
    });
    it("case", function () {
        assert.equal('doctype html', resp.match(/doctype html/)[0]);
    });

});//}}}

describe("Test following location - auto redirect to specific location", function () {//{{{

    var resp, respHeader;
    before(function (done) {
        // Method GET
        var header = {unit: 1};
        lightHttp.followLocation = true;
        lightHttp.get(myUrl + "/unit.php", {"redirect": 1}, header, function (text) {
                respHeader = lightHttp.getResponseHeaders();
                resp = text;
                done();
            });
    });
    it("case", function () {
        assert.equal('doctype html', resp.match(/doctype html/)[0]);
    });

});//}}}

describe("Test following location (promise) - no redirect", function () {//{{{

    var resp, respHeader;
    before(function (done) {
        // Method GET
        var header = {unit: 1};
        lightHttp.followLocation = false;
        lightHttp.get(myUrl + "/unit.php", {"redirect": 1}, header)
            .then(function (text) {
                respHeader = lightHttp.getResponseHeaders();
                done();
            });
    });
    it("case", function () {
        assert.equal('http://www.google.com.tw/', respHeader.location);    
    });

});//}}}

describe("Test following location - no redirect", function () {//{{{

    var resp, respHeader;
    before(function (done) {
        // Method GET
        var header = {unit: 1};
        lightHttp.followLocation = false;
        lightHttp.get(myUrl + "/unit.php", {"redirect": 1}, header, function (text) {
                respHeader = lightHttp.getResponseHeaders();
                done();
            });
    });
    it("case", function () {
        assert.equal('http://www.google.com.tw/', respHeader.location);    
    });

});//}}}

describe('Test 404 error callback', function() {//{{{
    var error;
    before(function(done) {
        lightHttp.get("http://fawfawf", "", "", function(text, err) {
            error = err;
            done(text, err);
        });
       
    })
    it('test', function() {
        console.log(error);
        assert.equal("getaddrinfo", error.syscall);
    });
});//}}}

describe('Test 404 error promise', function() {//{{{
    var error;
    before(function (done) {
        lightHttp.get("http://fawfawf", "", "")
        .then(function(text) {
            console.log(text);
        }, function (err) {
            error = err;
            done();
        });
    });

    it('test', function() {
        assert.equal("getaddrinfo", error.syscall);
    });
});//}}}

describe('Test binary callback', function() {//{{{
    var error, res;
    before(function (done) {
        lightHttp.get("http://www.puritys.me/unit.php", "", "", function(text, err, obj) {
            res = obj;
            done();
        });
    });

    it('test', function() {
        assert.equal(200, res.headers['status-code']);
        assert.equal(true, res.binary instanceof Buffer);
    });
});//}}}

describe('Test binary promise', function() {//{{{
    var res;
    before(function (done) {
        lightHttp.get("http://www.puritys.me/unit.php", "", "")
        .then(function(text, err, obj) {
            res = lightHttp.getResponseDetail();
            done();
        }, function (err) {
        });
    });

    it('test', function() {
        assert.equal(200, res.headers['status-code']);
        assert.equal(true, res.binary instanceof Buffer);
    });
});//}}}

describe('Test get binary image callback', function() {//{{{
    var res;
    before(function (done) {
        lightHttp.get("https://www.puritys.me/templates/static/images/btn/fbShare.png", {}, {}, function (resp, err, respObj) {
            res = respObj.binary;
            done();
        });
    });
    it('png', function() {
        assert.equal(1850, res.length);
        assert.equal(0x89, Number(res[0]));
        assert.equal(0x82, res.readUInt8(1849));
    });
});//}}}

describe('Test get binary image promise', function() {//{{{
    var res;
    before(function (done) {
        lightHttp.get("https://www.puritys.me/templates/static/images/btn/fbShare.png", {}, {})
        .then(function (resp) {
            res = lightHttp.getResponseDetail();
            res = res.binary;
            done();
        });
    });
    it('png', function() {
        assert.equal(1850, res.length);
        assert.equal(0x89, Number(res[0]));
        assert.equal(0x82, res.readUInt8(1849));
    });
});//}}}

describe("Test special cases", function () {//{{{
    var ret, url, content;
    before(function (done) {
        url = "http://www.puritys.me/\n";
        ret = lightHttp.get(url, "", function (resp, err, obj) {
            if (err) content = err;
            else  content = obj.headers['status-code'];
            done();
        });
       
    });
    it("A break line", function () {
        console.log(content);
        assert.equal(200, content);
    });
});


