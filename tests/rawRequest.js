var http = require('../index.js');
var host = "www.google.com.tw";
var port = 80;
var path = "/";
var cookie = 'SID=; HSID=; SSID=jjj; APISID=;';
var msg = [
"GET " + path + " HTTP/1.1",
"host: " + host,
"cookie: " + cookie,
"\r\n"].join("\r\n");

//http.enableDebugMode();
//http.rawRequest(host, port, msg, function (resp) {
//    console.log(resp);
//});

//http.rawRequest(host, port, msg)
//.then(function (resp) {
//    console.log(resp);
//});

var url = "https://www.google.com.tw/";
http.request('GET', url, {}, {})
.then(function (resp) {
    console.log(resp);
});
