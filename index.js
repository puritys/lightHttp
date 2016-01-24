/*
 * http://www.w3.org/Protocols/rfc1341/7_2_Multipart.html
 * 
 * */

"use strict";
var http = require('http');
var https = require('https');
var net = require('net');
var tls = require('tls');
var fs = require('fs');
var Q = require('q');
var debugMode = false;
var lib = require('./lib.js');
var mime = require('mime'); 

function lightHttp() {
    this.uploadFiles = [];
    this.respHeaders = {};
    this.httpsAgent = "";
    this.followLocation = true;
}

var o = lightHttp.prototype;
o.uploadFiles = [];
o.respHeaders = {};
o.httpsAgent = "";
o.followLocation = true;

o.enableSslVerification = function () 
{
    this.httpsAgent = new https.Agent({"rejectUnauthorized": true});
};

o.disableSslVerification = function () 
{
    this.httpsAgent = new https.Agent({"rejectUnauthorized": false});
};

o.disableDebugMode = function () 
{
    debugMode = false;
};

o.enableDebugMode = function()
{
    debugMode = true;
};

o.merge = function (obj1, obj2)
{//{{{
    var obj3 = {}, attrname;
    for (attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
};//}}}

o.addFile = function (field, filePath) 
{//{{{
    var fileName, content, mat;
    if (!fs.existsSync(filePath)) {
        return false;
    }
    mat = filePath.split(/[\/\\]/);
    fileName = mat[mat.length - 1];
    content = fs.readFileSync(filePath);
    this.addFileContent(field, fileName, content);
};//}}}


o.addFileContent = function (field, fileName, content) 
{//{{{
    this.isMultipart = true;
    this.uploadFiles.push({
        field: field,
        fileName: fileName,
        content: content
    });
};//}}}

o.createMultipartData = function (param) 
{//{{{
    var payload = "", boundary, i ,n, 
        file, mimeType, key;
    boundary = this.createBoundary();
    n = this.uploadFiles.length;
    for(i = 0; i < n; i ++) {
        file = this.uploadFiles[i];
        mimeType = mime.lookup(file.fileName);
        payload += "--" + boundary + "\n";
        payload += "Content-Disposition: form-data; name=\"" +file.field+ "\"; filename=\""+file.fileName+"\"\n";
        payload += "Content-Type: " +mimeType+"\n\n";
        payload += file.content + "\n";
    }

    if (param) {
        for (key in param) {
            payload += "--" + boundary + "\n";
            payload += "Content-Disposition: form-data; name=\"" + key + "\"\n\n";
            payload += param[key] + "\n";
        }
    }

    payload += "--" + boundary + "--\n";
    return {
        "payload": payload,
        "boundary": boundary
    };
};//}}}

o.createBoundary = function () 
{//{{{
    var b, i, r, chars;
    chars = "0123456789abcdefghijklmnopqrstuvwxyz";
    b = "------------------------------";
    for (i = 0; i < 12; i++) {
        r = Math.floor(Math.random()*36);
        b += chars.substr(r, 1);
    }
    return b;
};//}}}

// clear setting
o.clear = function () 
{
    this.isMultipart = false;
    this.uploadFiles = [];
    this.respHeaders = {};
};

o.setResponseHeaders = function (headers)
{
    this.respHeaders = headers;
};

o.appendResponseHeader = function (key, value)
{
    this.respHeaders[key] = value;
};

o.getResponseHeaders = function () 
{
    return this.respHeaders;
};

o.redirectToLocation = function (headers, defer, callback, isSync) 
{//{{{
    var url =  (headers.location) ? headers.location : headers.Location;

    if (true === isSync) {
        this.get(url, {}, {})
            .then(function (text) {
                defer.resolve(text);
            });
    } else {
        this.get(url, {}, {})
            .then(function (text) {
                callback(text);
            });
    }
}//}}}

o.get = function(url, param, header, callback) 
{//{{{
    return this.request('GET', url, param, header, callback);
};//}}}

o.post = function (url, param, header, callback) 
{//{{{
    return this.request('POST', url, param, header, callback);
};//}}}

o.deleteMethod = function (url, param, header, callback) 
{//{{{
    return this.request('DELETE', url, param, header, callback);
};//}}}

o.put = function (url, param, header, callback) 
{//{{{
    return this.request('PUT', url, param, header, callback);
};//}}}

o.request = function (method, url, param, header, callback) 
{//{{{
    var len, req, options = {}, urlInfo, resp = "", fUrl = "", self,
        isSync = false, defer, postData;
    self = this;
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
    if (header.cookie && 
        (header.cookie instanceof Object ||
         header.cookie instanceof Array
        )) {
        header.cookie = lib.cookieToString(header.cookie);
    }
 
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
        if (param instanceof Object) {
            param = this.merge(param, urlInfo.param);
        } else {
            param += '&' + lib.stringifyParam(urlInfo.param);
        }
    }

    if (("POST" === method ||
         "PUT" === method
        ) && 
        typeof(param) != "undefined") {
        if (this.isMultipart) {
            var b = this.createMultipartData(param);
            header["content-type"] = "multipart/form-data; boundary=" + b['boundary'];
            postData = b['payload'];
        } else {
            if (param instanceof Array || param instanceof Object) {
                postData = lib.stringifyParam(param);
            } else {
                postData = param;
            }
            header['content-type'] = 'application/x-www-form-urlencoded';
            header['content-length'] = postData.length; 
        }
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
        if (this.httpsAgent) options.agent = this.httpsAgent;
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
            if (r.headers) self.setResponseHeaders(r.headers);
            self.appendResponseHeader("status-code", r.statusCode);
            self.appendResponseHeader("status-message", r.statusMessage);
            if (self.followLocation === true &&
                (r.statusCode === 301 || r.statusCode === 302)) {
                self.redirectToLocation(r.headers, defer, callback, isSync);
            } else {
                if (true === isSync) {
                    defer.resolve(resp);
                } else {
                    callback(resp);
                }
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
    this.clear();
    if (true === isSync) return defer.promise;
    return true;
};//}}}

o.rawRequest = function (host, port, content, callback) 
{//{{{
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

};//}}}

var publicMethods = ['request'];
var privateMethods = ['parseUrl'];

var obj = new lightHttp();
module = module.exports = obj;

