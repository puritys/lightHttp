"use strict";
Function.prototype.bind=Function.prototype.bind||function(b){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");}var a=Array.prototype.slice,f=a.call(arguments,1),e=this,c=function(){},d=function(){return e.apply(this instanceof c?this:b||window,f.concat(a.call(arguments)));};c.prototype=this.prototype;d.prototype=new c();return d;};

var lib = require('./lib.js');
var Q = require('q');

(function () {
/****
* obj.ajax("testGet", {"test":1}, function (content) {});
* obj.ajaxPost("testPost.php", {"test": 1, "test2": 2},{}, function (content) {});

//Redirect to another url.
* obj.get("testGet", {"test":1}); 
* obj.post("testPost.php", {"test":1});

*****/
    function lightHttp() {//{{{
        if (!lib) {
            console.log("Missing library named lightHttpLib");
        }
        this.jsonpIndex = 1;
        this.lightHttpLib = lib; //window.lightHttpLib;
        this.timeout = 15000; //15 seconds
        this.jsonpCallbackList = {};
    }//}}}
    var o = lightHttp.prototype;

    o.get = function (url, param) {//{{{
        url = this.lightHttpLib.addParams(url, param);
        window.location.href = url;
    };//}}}

    o.post = function (url, param) {//{{{
        var form, key, input;
        form = document.createElement('form');
        form.action = url;
        form.method = "POST";
        for (key in param) {
            if (!param.hasOwnProperty(key)) continue;
            input = document.createElement('input');
            input.name = key;
            input.value = param[key];
            form.appendChild(input);
        }
        document.body.appendChild(form);
        form.submit();
    };//}}}

    /**
     * ajax: make a ajax request
     * @param string url
     * @param object param
     * @param object header
     * @param function callback
     */
    o.ajax = function () {//{{{
        var args = ["ajax", "GET"];
        for (var i = 0, len = arguments.length; i< len; i++) args.push(arguments[i]);
        return this.request.apply(this, args);
    };//}}}

    o.ajaxpost = o.ajaxPost = function () {//{{{
        var args = ["ajaxPost", "POST"];
        for (var i = 0, len = arguments.length; i< len; i++) args.push(arguments[i]);
        return this.request.apply(this, args);
    };//}}}

    o.pajax = function () {//{{{
        var args = ["pjax", "GET"];
        for (var i = 0, len = arguments.length; i< len; i++) args.push(arguments[i]);
        return this.request.apply(this, args);
    };//}}}

    o.jsonp = function (url, param, header, callback) {//{{{
        var script, jsonpCallback, self;
        if (!param) param = {};
        this.cleanJsonpCallback();
        self = this;
        jsonpCallback = "lightHttp_jsonp_" + this.jsonpIndex + "_" + (new Date()).getTime();
        param['callback'] = jsonpCallback;
        window[jsonpCallback] = function(data) {
            callback(data, {});
            self.jsonpCallbackList[jsonpCallback] = 1;
        };
        this.jsonpCallbackList[jsonpCallback] = 0;
        url = this.lightHttpLib.addParams(url, param);
        if (typeof(header) == "function") callback = header;
        script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
        this.jsonpIndex++;
    };//}}}

    /*
     * type, url, param, header, callback
    */
    o.request = function () {//{{{
        var type = "GET", xhr, url, param, header, name,
            callback, postData = "", async = true, defer, isPromise = false,
            options = {}, args = {};
        var respHandler, timeoutHandler;
        if (!arguments) return "";
        if (typeof(arguments[0]) != "undefined") name = arguments[0];
        if (typeof(arguments[1]) != "undefined") type = arguments[1];
        if (typeof(arguments[2]) != "undefined") url = arguments[2];
        if (typeof(arguments[3]) != "undefined") param = arguments[3];
        if (typeof(arguments[4]) != "undefined") {
            if (typeof(arguments[4]) == "function") {
                callback = arguments[4];
            } else {
                header = arguments[4];
            }
        }
        if (typeof(arguments[5]) != "undefined") {
            if (typeof(arguments[5]) == "function") {
                callback = arguments[5];
            } else {
                options = arguments[5];
            }
        }
        if (typeof(arguments[6]) != "undefined") callback = arguments[6];

        if (callback) {
            args.callback = callback;
        } else {
            isPromise = true;
            defer = Q.defer();
            args.defer = defer;
        }

        args.isPromise = isPromise;
        if (param) args.param = param;

        xhr = this.instantiateRequest();
        args.xhr = xhr;
        respHandler = this.responseHandler.bind(this, args);
        timeoutHandler = this.timeoutHandler.bind(this, args);

        if (xhr.timeout) {
            if (options.timeout) {
                xhr.timeout = options.timeout;
            } else {
                xhr.timeout = this.timeout;
            }
            xhr.ontimeout = timeoutHandler;
        }
        xhr.onreadystatechange = respHandler;


        postData = this.lightHttpLib.stringifyParam(param);
        if (type === "POST") {
            xhr.open(type, url, async);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(postData);
        } else {
            if (url.match(/\?/)) {
                url += "&" + postData;
            } else {
                url += "?" + postData;
            }
            xhr.open(type, url, async);
            xhr.send();
        }
        if (true === isPromise) {
            return defer.promise;
        }
    };//}}}

    o.instantiateRequest = function () {//{{{
        var xhr;
        if (window.XMLHttpRequest) {
           xhr = new XMLHttpRequest();
           if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/xml');
           }
        } else if (window.ActiveXObject) {
           try {
              xhr = new ActiveXObject("Msxml2.XMLHTTP");
           } catch (e) {
              try {
                 xhr = new ActiveXObject("Microsoft.XMLHTTP");
              } catch (e2) {}
           }
        }
        return xhr;
    };//}}}

    o.responseHandler = function(args) {//{{{
        var resp = "", respInfo = {}, xhr;
        xhr = args.xhr;
        //xhr.getResponseHeader("Connection")
        //header = xhr.getAllResponseHeaders();
        if (xhr.readyState == 4) {
            respInfo = xhr;
            resp = xhr.responseText;
            if (true === args.isPromise) {
                args.defer.resolve(resp, respInfo);
            } else if (args.callback) {
                args.callback(resp, respInfo);
            }
        }
    };//}}}

    o.timeoutHandler = function (args) {//{{{
        //var respInfo = {};
        //console.log("timeout");
        //args.isTimeout = true;
        //respInfo.errMsg = "timeout";
        //respInfo.status = 408;
        //if (args.callback) args.callback("", respInfo);
    };//}}}

    o.jsonpHander = function () {

    };

    /**
     * remove jsonp callback function from window to prevent memory leak.
     */
    o.cleanJsonpCallback = function () {
        var func;
        for (func in this.jsonpCallbackList) {
            if (this.jsonpCallbackList[func] === 1) {
                //console.log("delete  jsonp callback = " + func);
                try {
                    delete window[func];
                } catch (e) {}
            }
        }
    };

    window.lightHttp = lightHttp;
}());
