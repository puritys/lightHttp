var http = require('http');
var https = require('https');
var net = require('net');
var tls = require('tls');
var fs = require('fs');
var Q = require('q');
var debugMode = false;
var lib = require('./lib.js');

//function parseUrl(url) {//{{{
//    var i, n, pm, pos, key, value;
//    var regUrl, matches, ret, param = {};
//    regUrl = /(https?):\/\/([a-z0-9][a-z0-9\-\.]+[a-z0-9])(:[0-9]+)?(\/[^\?]*)\??(.*)/i;
//    ret = {
//        port: 80,
//        protocol: "",
//        host: "",
//        path: "",
//        param: ""
//    };
//    matches = url.match(regUrl);
//    if (matches && matches[2]) {
//        ret['protocol'] = matches[1].toLowerCase();
//        ret['host'] = matches[2];
//    }
//
//    if (matches && matches[3] && matches[3] != "undefined") {
//        ret['port'] = parseInt(matches[3].substr(1), 10);
//    } else {
//        if ("https" === ret.protocol) {
//            ret['port'] = 443;
//        }
//    }
//
//    if (matches && !matches[4]) {
//        ret['path'] = "/";
//    } else {
//        ret['path'] = matches[4];
//
//    }
//
//    if (matches && matches[5]) {
//        pm = matches[5].split(/&/);
//        n = pm.length;
//        for (i = 0; i < n; i++) {
//            pos = pm[i].indexOf("=");
//            key = pm[i].substr(0, pos);
//            value = pm[i].substr(pos + 1, pm[i].length - pos - 1);
//            if (param[key]) {
//                if (Object.prototype.toString.call(param[key]) === '[object Array]') {
//                    param[key].push(value);
//                } else {
//                    param[key] = [param[key], value];
//                }
//            } else {
//                param[key] = value;
//            }
//        }
//        ret['param'] = param;
//    }
//
//    return ret;
//}//}}}

function disableDebugMode() {
    debugMode = false;
}

function enableDebugMode() {
    debugMode = true;
}

function merge(obj1, obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

function request(method, url, param, header, callback) {//{{{
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
    urlInfo = lib.parseUrl(url);
    fUrl += urlInfo.path;
    if (typeof(param) === "undefined") {
        param = {};
    }

    if (urlInfo.param) {
        param = merge(param, urlInfo.param);
    }

    if ("POST" === method && typeof(param) != "undefined") {
        postData = lib.stringifyParam(param);
        header['content-type'] = 'application/x-www-form-urlencoded';
        header['content-length'] = postData.length; 
    } else {
        fUrl += "?" + lib.stringifyParam(param);
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
    });
    q.on("error", function(err) {
        err = JSON.stringify(err);
        if (true === isSync) {
            defer.reject(err);
        } else {
            callback(err);
        }
    });

    if ("POST" === method) {
        q.write(postData);
    }
    q.end();

    if (true === isSync) return defer.promise;
    return true;
}//}}}

function rawRequest(host, port, content, callback) {//{{{
    var defer, client, response = "", isSync = false, isSSL = false, socket = net, options = {};

    if (typeof(callback) === "undefined") {
        isSync = true;
    }

    if ((host.length > 4 
        && host.substr(0, 5).toLowerCase() == "https")
        ||
        (port.toString().match(/:ssl/))
       ) {
        isSSL = true;
        socket = tls;
        port = parseInt(port, 10);
    }

    host = host.replace(/^https?:\/\//, '');
    host = host.replace(/\/.*$/, '');

    if (true === debugMode) console.log("Request content: \r\n" + content);

    if (true === isSync) defer = Q.defer();

    client = socket.connect({host: host, port: port}, options, function (data) {
        client.write(content);
    });

    client.on("data", function (resp) {
        response += resp;
        client.end();
    });

    client.on("end", function () {
        if (true === isSync) defer.resolve(response);
        else callback(response);
    });

    client.on("error", function(err) {
        if (true === isSync) {
            defer.reject(err);
        } else {
            callback(err);
        }
    });


    if (true === isSync) return defer.promise;

}//}}}

var publicMethods = ['request'];
var privateMethods = ['parseUrl'];

exports.request = request;
exports.rawRequest = rawRequest;
exports.enableDebugMode = enableDebugMode;
exports.disableDebugMode = disableDebugMode;

if (typeof(UNIT_TEST) != "undefined") {
    exports.parseUrl = parseUrl;
}

