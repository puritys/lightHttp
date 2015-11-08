"use strict";

var http = require('http');
var https = require('https');
var net = require('net');
var tls = require('tls');
var fs = require('fs');
var Q = require('q');
var debugMode = false;
var lib = require('./lib.js');

function disableDebugMode() {
    debugMode = false;
}

function enableDebugMode() {
    debugMode = true;
}

function merge(obj1, obj2){
    var obj3 = {}, attrname;
    for (attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

function get(url, param, header, callback) {//{{{
    return request('GET', url, param, header, callback);
};//}}}

function post(url, param, header, callback) {//{{{
    return request('POST', url, param, header, callback);
};//}}}

function deleteMethod(url, param, header, callback) {//{{{
    return request('DELETE', url, param, header, callback);
};//}}}

function put(url, param, header, callback) {//{{{
    return request('PUT', url, param, header, callback);
};//}}}



function request(method, url, param, header, callback) {//{{{
    var len, req, options = {}, urlInfo, resp = "", fUrl = "", 
        isSync = false, defer, postData;
    if (typeof(callback) === "undefined" && 
        typeof(header) != "undefined" && 
        ( Object.prototype.toString.call(header) === "[object String]" || 
          Object.prototype.toString.call(header) === "[object Function]")
       ) {
        // User can miss the value of header, transfer header to callback.
        callback = header;
        header = {};
    }
    if (typeof(header) === "undefined") header = {};

    if (typeof(callback) === "undefined" || 
        Object.prototype.toString.call(callback) !== "[object Function]"
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

    if (("POST" === method ||
         "PUT" === method
        ) && 
        typeof(param) != "undefined") {
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

    if ("POST" === method ||
        "PUT" === method) {
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

    if ((host.length > 4 && 
         host.substr(0, 5).toLowerCase() == "https"
        ) ||
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

exports.get = get;
exports.post = post;
exports.delete = deleteMethod;
exports.put = put;
exports.request = request;
exports.rawRequest = rawRequest;
exports.enableDebugMode = enableDebugMode;
exports.disableDebugMode = disableDebugMode;

//if (typeof(UNIT_TEST) != "undefined") {
//    exports.parseUrl = parseUrl;
//}

