var assert = require('assert');

var obj = require('./../../index.js');

describe("Test createMultipartData", function () {

    it("normal", function () {
        var ret, reg;
        reg = /Content-Type: image\/png/;
        obj.addFileContent("key", "test.png", "content aaa");
        ret = obj.createMultipartData();
        if (!ret['payload'].match(reg)) {
            assert.equal(true, false, "mime type is wrong : " + ret['payload']);
        } else {
            assert.equal(true, true);
        }
        if (!ret['boundary'].match(/[0-9a-z\-]+/)) {
            assert.equal(true, false, "boundary is wrong : " + ret['boundary']);
        } else {
            assert.equal(true, true);
        }

    });
});

describe("Test createBoundary", function () {

    it("normal case", function () {
        var b = obj.createBoundary(), str;

        assert.equal(42, b.length);
        for (var i = 0; i< 42; i++) {
            str = b.substr(i, 1);
            if (!str.match(/[0-9a-z\-]/)) {
                assert.equal(true, false, "illegal character: " + str);
            } else {
                assert.equal(true, true);
            }
        }
    });

});

describe("Test addFile", function () {

    it("normal case", function () {
        obj.clear();
        obj.addFile("key1", "./fileUploade.js");
        var ret = obj.uploadFiles;
        assert.equal('key1', ret[0].field);
    });

});



