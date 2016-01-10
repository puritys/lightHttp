var lightHttp = require('./../../index.js');
var baseUrl = "http://www.puritys.me";
//baseUrl = "http://localhost:8080/";
var assert = require('assert');

describe("Test file upload", function () {
    var resp, header;
    header = {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85"
    };
    before(function (done) {
        //lightHttp.addFile("key1", filePath);
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
