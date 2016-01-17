/* globals FormData */
/*
 *
 * */
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
        this.uploadFiles = [];
    }//}}}

    var o = lightHttp.prototype;
    o.uploadFiles = [];

    o.addFile = function (field, input) 
    {//{{{
        if (!input) {
            return false;
        }
        this.uploadFiles.push({
            field: field,
            input: input
        });
    };//}}}

    o.clear = function ()
    {//{{{
        this.uploadFiles = [];
    };//}}}

    o.composeFormData = function (uploadFiles, param)
    {//{{{
        var f, i ,n, it, key;
        f = new FormData();
        n = uploadFiles.length;
        for (i = 0; i < n; i++) {
            it = uploadFiles[i];
            f.append(it.field, it.input.files[0]);
        }
        for (key in param) {
            this.paramToFormData(f, key, param[key]);
        }
        return f;
    };//}}}

    o.paramToFormData = function (formData, key ,value, isHtmlForm)
    {//{{{
        var i ,n, k;
        if (value instanceof Array) {
            n = value.length;
            for (i = 0; i < n; i++) {
                this.paramToFormData(formData, key + "["+i+"]", value[i], isHtmlForm);
            }
        } else if (value instanceof Object) {
            for (k in value) {
                this.paramToFormData(formData, key+"["+k+"]", value[k], isHtmlForm);
            }
        } else {
            if (isHtmlForm) {
                var input = document.createElement('input');
                input.name = key;
                input.value = value;
                formData.appendChild(input);
            } else {
                formData.append(key, value);
            }
        }
    };//}}}

    o.get = function (url, param) 
    {//{{{
        url = this.lightHttpLib.addParams(url, param);
        window.location.href = url;
    };//}}}

    o.post = function (url, param)
    {//{{{
        var form, key, input, isHtmlForm;
        isHtmlForm = true;
        form = document.createElement('form');
        form.action = url;
        form.method = "POST";
        for (key in param) {
            if (!param.hasOwnProperty(key)) continue;
            this.paramToFormData(form, key, param[key], isHtmlForm);
        }
        document.body.appendChild(form);
        form.submit();
        return form;
    };//}}}

    /**
     * ajax: make a ajax request
     * @param string url
     * @param object param
     * @param object header
     * @param function callback
     */
    o.ajax = function ()
    {//{{{
        var args = ["ajax", "GET"];
        for (var i = 0, len = arguments.length; i< len; i++) args.push(arguments[i]);
        return this.request.apply(this, args);
    };//}}}

    o.ajaxpost = o.ajaxPost = function ()
    {//{{{
        var args = ["ajaxPost", "POST"];
        for (var i = 0, len = arguments.length; i< len; i++) args.push(arguments[i]);
        return this.request.apply(this, args);
    };//}}}

    o.pajax = function () 
    {//{{{
        var args = ["pjax", "GET"];
        for (var i = 0, len = arguments.length; i< len; i++) args.push(arguments[i]);
        return this.request.apply(this, args);
    };//}}}

    o.jsonp = function (url, param, header, callback)
    {//{{{
        var script, jsonpCallback, self;
        self = this;
        if (!param) param = {};
        this.cleanJsonpCallback();
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
     * name, type, url, param, header, callback
    */
    o.request = function () 
    {//{{{
        var type = "GET", xhr, url, param, header, name,
            callback, postData = "", async = true, 
            defer, isPromise = false, formData,
            options = {}, args = {};
        var respHandler, timeoutHandler;
        // Handle Arguments
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

        // Handle XML HTTP Request object
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

        // Handle HTTP payload
        if (this.uploadFiles.length > 0) {
            formData = this.composeFormData(this.uploadFiles, param);
        } else {
            postData = this.lightHttpLib.stringifyParam(param);
        }

        if (type === "POST") {
            xhr.open(type, url, async);
            this.setHeaders(xhr, header);
            if (formData) {
                xhr.send(formData);
            } else {
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(postData);
            }
        } else {
            if (postData) {
                if (url.match(/\?/)) {
                    url += "&" + postData;
                } else {
                    url += "?" + postData;
                }
            }
            xhr.open(type, url, async);
            this.setHeaders(xhr, header);
            xhr.send();
        }
        this.clear();
        if (true === isPromise) {
            return defer.promise;
        }
    };//}}}

    o.instantiateRequest = function ()
    {//{{{
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

    o.responseHandler = function(args)
    {//{{{
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

    o.setHeaders = function (xhr, headers)
    {//{{{
        for (var key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }

    };//}}}

    o.timeoutHandler = function (args)
    {//{{{
        //var respInfo = {};
        //console.log("timeout");
        //args.isTimeout = true;
        //respInfo.errMsg = "timeout";
        //respInfo.status = 408;
        //if (args.callback) args.callback("", respInfo);
    };//}}}

    o.jsonpHandler = function () 
    {

    };

    /**
     * remove jsonp callback function from window to prevent memory leak.
     */
    o.cleanJsonpCallback = function ()
    {//{{{
        var func;
        for (func in this.jsonpCallbackList) {
            if (this.jsonpCallbackList[func] === 1) {
                //console.log("delete  jsonp callback = " + func);
                try {
                    delete window[func];
                } catch (e) {}
            }
        }
    };//}}}

    window.lightHttp = lightHttp;
}());
