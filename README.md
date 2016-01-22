
[[light-http NPM] (https://www.npmjs.com/package/light-http)]

English Document:
* http://puritys.github.io/lightHttp/dest/en/index.html

中文文件
* http://puritys.github.io/lightHttp/dest/tw/index.html


Travis CI status: [![Unit testing](https://travis-ci.org/puritys/lightHttp.png?branch=master)](https://travis-ci.org/puritys/lightHttp) [![Coverage Status](https://coveralls.io/repos/puritys/lightHttp/badge.png?branch=master)](https://coveralls.io/r/puritys/lightHttp?branch=master)

Light-http is a very light library it could easily make a http & https request, also support asynchronous and synchonrous at the same time.

You can use this library on server side Node.js  and client side JavaScript.

Let's try it !


## How to install light http on server side 
npm install -g light-http

## Example 

### Asynchronous 

    var http = require('light-http');
    var header = {"user-agent": "Mozilla/5.0 xx"};
    var url = "https://www.google.com.tw";
    
    // Method GET
    http.get(url, {"key":"value"}, header, function(response) {
        var html = response;
        var respHeaders = http.getResponseHeaders();
        console.log(respHeaders['set-cookie']);
    });
    
    // Method POST
    http.post(url, {"key":"value"}, header, function(response) {
        xxx
    });


### Synchronous - Using Promise


    var http = require('light-http');
    var header = {"user-agent": "Mozilla/5.0 xx"};
    var url = "https://www.google.com.tw";
    
    // Method GET
    http.get(url, {"key":"value"}, header)
        .then(function(response) {
            xxx
        });
    
    // Method POST
    http.post(url, {"key":"value"}, header)
        .then(function(response) {
            xxx
        });



### Upload file


    var http = require('light-http');
    var header = {"user-agent": "Mozilla/5.0 xx"};
    var url = "https://www.google.com.tw";
    
    http.addFile("fileData", "/var/www/file.txt");
    http.addFile("fileData2", "/var/www/file2.txt");
    http.addFileContent("fileData3", "file3.txt", "The file content");
    
    http.post(baseUrl + "/xxx.php", {"age":"13"}, header, function(response) {
        var resp = JSON.parse(response);
    });


### Make a Raw HTTP request

    var http = require('light-http');
    var host = "www.google.com.tw";
    var port = 80;
    var path = "/";
    var cookie = 'SID=; HSID=; SSID=jjj; APISID=;';
    var msg = [
    "GET " + path + " HTTP/1.1",
    "host: " + host,
    "cookie: " + cookie,
    "\r\n"].join("\r\n");

    http.rawRequest(host, port, msg)
        .then(function (resp) {
            console.log(resp);
        });

    //http.rawRequest(host, port, msg, function (resp) {
    //    console.log(resp);
    //});


### Make a Raw HTTPS request (ssl)

You have two ways to indicate this library to use https protocol

1. Set the port to be "443:ssl".
2. Add https:// before the value of host.

### Example

    var http = require('light-http');
    var host = "www.google.com.tw";
    var url = "https://" + host;
    var port = 443; // or port = "443:ssl"
    var path = "/";
    var cookie = 'SID=; HSID=; SSID=jjj; APISID=;';
    var msg = [
    "GET " + path + " HTTP/1.1",
    "host: " + host,
    "cookie: " + cookie,
    "\r\n"].join("\r\n");
    
    http.rawRequest(url, port, msg)
        .then(function (resp) {
            console.log(resp);
        });


HTTP Request Error Handling
----------------------------

    { [Error: connect ENETUNREACH] code: 'ENETUNREACH', errno: 'ENETUNREACH', syscall: 'connect' }


Using lightHttp library on client side browser
=================================

lightHttp library also support any browser in the world to quickly and easily make a ajax, pjax, jsonp.

There are two minified JavaScript files with lightHttp function  you can use.

One is the "lightHttp.min.js", this file include the promise functions. The flaw of this file is it need 24 KB.

Another one is the "lightHttp-simple.min.js", this file do not include the promise function so it's file size has only 5 KB.

AJAX (GET)
----------

    <html>
    <script src="lightHttp.min.js"></script>
    <script>
    var http = new window.lightHttp();
    http.ajax("test.html", {"count": 20}, function (content) {
        console.log(content);
    });
    </script>
    </html>

AJAX (GET) Promise
----------

    <html>
    <script src="lightHttp.min.js"></script>
    <script>
    var http = new window.lightHttp();
    http.ajax("test.html", {"count": 20})
        .then(function (content) {
            console.log(content);
        });
    </script>
    </html>

AJAX (POST)
----------

    <html>
    <script src="lightHttp.min.js"></script>
    <script>
    var http = new window.lightHttp();
    http.ajaxPost("test.php", {"count": 20}, function (content) {
        console.log(content);
    });
    </script>
    </html>

JSONP
------

    <html>
    <script src="lightHttp.min.js"></script>
    <script>
    var http = new window.lightHttp();
    http.jsonp("testJsonp.php", {"test":1}, function (resp) {
        console.log(resp);
    });

    </script>
    </html>

AJAX (Upload file)
----------

    <html>
    <script src="lightHttp.min.js"></script>
    <input type="file" id="fileInput" />
    <script>
    var http = new window.lightHttp();
    http.addFile("fileData", document.getElementById("fileInput"));
    http.ajaxPost("test.php", {"count": 20}, function (content) {
        console.log(content);
    });
    </script>
    </html>


