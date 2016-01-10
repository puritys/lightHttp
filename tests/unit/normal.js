var assert = require('assert');

var obj = require('./../../index.js');

describe("Test merge", function () {

    it("normal case", function () {
        var ret, ay1, ay2;
        ay1 = {"k": "v1"};
        ay2 = {"z": "v2"}
        ret = obj.merge(ay1, ay2);
        assert.equal("v2", ret['z']);
    });
});

