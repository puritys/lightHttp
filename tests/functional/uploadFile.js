var lightHttp = require('./../../index.js');
var baseUrl = "http://www.puritys.me";
//baseUrl = "http://localhost:8080/";
var assert = require('assert');

describe("Test file upload : addFileContent", function () {
    var resp, header;
    header = {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85"
    };
    before(function (done) {
        lightHttp.addFileContent("fileData", "fileName.txt","content");
        lightHttp.addFileContent("fileData2", "fileName2.txt","content2");

        lightHttp.post(baseUrl + "/unit.php", {"age":"13"}, header, function(response) {
            resp = JSON.parse(response);
            done();
        });

    });
    it("upload file", function () {
        assert.equal("fileData", resp['files'][0]['key']);
        assert.equal("fileName.txt", resp['files'][0]['name']);
        assert.equal("fileData2", resp['files'][1]['key']);
        assert.equal("fileName2.txt", resp['files'][1]['name']);

        assert.equal("content", resp['files'][0]['content']);

    }); 
});

describe("Test file upload - multi request", function () {
    var resp1, resp2, header, respNum = 0;
    header = {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85"
    };
    before(function (done) {
        lightHttp.addFileContent("fileData", "fileName.txt","content");

        lightHttp.post(baseUrl + "/unit.php", {"age":"13"}, header, function(response) {
            resp1 = JSON.parse(response);
            respNum++;
            if (respNum == 2) done();
        });

        lightHttp.addFileContent("fileData2", "fileName2.txt","content2");

        lightHttp.post(baseUrl + "/unit.php", {"age":"13"}, header, function(response) {
            resp2 = JSON.parse(response);
            respNum++;
            if (respNum == 2) done();
        });

    });
    it("upload file", function () {
        assert.equal("fileData", resp1['files'][0]['key']);
        assert.equal("fileName.txt", resp1['files'][0]['name']);
        assert.equal("fileData2", resp2['files'][0]['key']);
        assert.equal("fileName2.txt", resp2['files'][0]['name']);

        assert.equal("content", resp1['files'][0]['content']);

    }); 
});

describe("Test file upload - addFile -", function () {
    var resp, header;
    header = {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85"
    };
    before(function (done) {
        lightHttp.addFile("fileData", "./uploadFile.js");

        lightHttp.post(baseUrl + "/unit.php", {"age":"13"}, header, function(response) {
            resp = JSON.parse(response);
            done();
        });

    });
    it("upload file", function () {
        assert.equal("fileData", resp['files'][0]['key']);
        assert.equal("uploadFile.js", resp['files'][0]['name']);
        if (!resp['files'][0]['content'].match(/lightHttp/)) {
            assert.equal(true, false, "file content is wrong.");
        } else {
            assert.equal(true, true);
        }

    }); 
});
