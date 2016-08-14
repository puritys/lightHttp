var assert = require('assert');

var obj = require('./../../index.js');

describe("Test merge", function() {

    it("normal case", function() {
        var ret, ay1, ay2;
        ay1 = {"k": "v1"};
        ay2 = {"z": "v2"}
        ret = obj.merge(ay1, ay2);
        assert.equal("v2", ret['z']);
    });
});

describe('Test merge buffer', function() {
    it('normal case', function() {
        var bufs = [], buf1, buf2, res;
        buf1 = new Buffer(3);
        buf1.write("abc");
        buf2 = new Buffer(3)
        buf2.write("def");
        bufs.push(buf1); bufs.push(buf2);
        res = obj.mergeBuffer(bufs);

        assert.equal(97, res[0]);
        assert.equal(102, res[5]);

    });
});
