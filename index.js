var http = require('http');
var https = require('https');
var Q = require('q');

function parseUrl(url) {//{{{
    var i, n, pm, pos, key, value;
    var regUrl, matches, ret, param = {};
    regUrl = /(https?):\/\/([a-z0-9][a-z0-9\-\.]+[a-z0-9])(:[0-9]+)?(\/[^\?]*)\??(.*)/i;
    ret = {
        port: 80,
        protocol: "",
        host: "",
        path: "",
        param: ""
    };
    matches = url.match(regUrl);
    if (matches && matches[2]) {
        ret['protocol'] = matches[1].toLowerCase();
        ret['host'] = matches[2];
    }

    if (matches && matches[3] && matches[3] != "undefined") {
        ret['port'] = parseInt(matches[3].substr(1), 10);
    } else {
        if ("https" === ret.protocol) {
            ret['port'] = 443;
        }
    }

    if (matches && !matches[4]) {
        ret['path'] = "/";
    } else {
        ret['path'] = matches[4];

    }

    if (matches && matches[5]) {
        pm = matches[5].split(/&/);
        n = pm.length;
        for (i = 0; i < n; i++) {
            pos = pm[i].indexOf("=");
            key = pm[i].substr(0, pos);
            value = pm[i].substr(pos + 1, pm[i].length - pos - 1);
            if (param[key]) {
                if (Object.prototype.toString.call(param[key]) === '[object Array]') {
                    param[key].push(value);
                } else {
                    param[key] = [param[key], value];
                }
            } else {
                param[key] = value;
            }
        }
        ret['param'] = param;
    }

    return ret;
}//}}}

function stringifyParam(param) {
    var str = "";
    for (pro in param) {
        str += pro + "=" + param[pro] + "&";
    }
    return str;
}

function merge(obj1, obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

function request(method, url, param, header, callback) {
    var len, req, options = {}, urlInfo, resp = "", fUrl = "", isSync = false, defer;
    if (typeof(callback) === "undefined"
        && typeof(header) != "undefined" 
        && ( Object.prototype.toString.call(header) === "[object String]" 
        || Object.prototype.toString.call(header) === "[object Function]")
       ) {
        // User can miss the value of header, transfer header to callback.
        callback = header;
    }
    if (typeof(callback) === "undefined"
        || Object.prototype.toString.call(callback) !== "[object Function]"
       ) {
        isSync = true;
        defer = Q.defer();
    }
    method = method.toUpperCase();
    urlInfo = parseUrl(url);
    fUrl += urlInfo.path;
    if (typeof(param) === "undefined") {
        param = {};
    }

    if (urlInfo.param) {
        param = merge(param, urlInfo.param);
    }

    if ("POST" === method && typeof(param) != "undefined") {
        postData = stringifyParam(param);
        header['content-type'] = 'application/x-www-form-urlencoded';
        header['content-length'] = postData.length; 
    } else {
        fUrl += "?" + stringifyParam(param);
    }
    options = {
        hostname: urlInfo.host,
        port: urlInfo.port,
        method: method,
        path: fUrl
    };

    if ("https" === urlInfo['protocol']) {
        req = https;
    } else {
        req = http;
    }
    if (typeof(header) === "undefined") {
        header = {};
    }
    //console.log(options);

    options.headers = header;
    try {
        var q = req.request(options, function (r) {
            r.on("data", function (chunk) {
                resp += chunk;
            });
            r.on("end", function () {
                if (true === isSync) {
                    defer.resolve(resp);
                } else {
                    callback(resp);
                }
            });
            r.on("error", function(err) {
                if (true === isSync) {
                    defer.reject(err);
                } else {
                    callback(err);
                }
            });
        });

        if ("POST" === method) {
            q.write(postData);
        }
        q.end();
    } catch (E) {
        console.log("simpleHTTP Got exception when it try to connect to a web service.");
        console.log(E);
        if (true === isSync) {
            defer.reject(E);
        } else {
            callback(E);
        }

    }

    if (true === isSync) return defer.promise;
    return true;
}

var publicMethods = ['request'];
var privateMethods = ['parseUrl'];

exports.request = request;
if (typeof(UNIT_TEST) != "undefined") {
    exports.parseUrl = parseUrl;
}

