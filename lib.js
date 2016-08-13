"use strict";
(function() {

    var lib = {
        parseUrl: function(url) {//{{{
            var regUrl, matches, ret, param = {};
            // (https) (host) (port) (path) (param)
            regUrl = /(https?):\/\/([a-z0-9][a-z0-9\-\.]+[a-z0-9])(:[0-9]+)?(\/[^\?]*)?\??(.*)/i;
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
                ret['param'] = this.stringToParam(matches[5]);
            }

            return ret;
        },//}}}

        stringifyParam: function(param)
        {//{{{
            var ret = [];
            for (var pro in param) {
                this.paramToString(ret, pro, param[pro]);
            }
            return ret.join('&');
        },//}}}

        paramToString: function (ret, key, value) 
        {//{{{
            var i, n, k;
            if (value instanceof Array) {
                n = value.length;
                for (i = 0; i < n; i++) {
                    this.paramToString(ret, key + "["+i+"]", value[i]);
                }
            } else if (value instanceof Object) {
                for (k in value) {
                    this.paramToString(ret, key + "["+k+"]", value[k]);
                }
            } else {
                ret.push(key + "=" + encodeURIComponent(value));
            }
        },//}}}

        stringToParam: function (string) 
        {//{{{
            var pm, i, n, value, pos, key, param = {};
            pm = string.split(/&/);
            n = pm.length;
            for (i = 0; i < n; i++) {
                pos = pm[i].indexOf("=");
                key = pm[i].substr(0, pos);
                value = pm[i].substr(pos + 1, pm[i].length - pos - 1);
                value = decodeURIComponent(value);
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
            return param;
        },//}}}


        addParams: function (url, params) 
        {//{{{
            var paramStr, matches, urlParam;
            if (!url) return "";
            if (!params) params = {};
            if (url.indexOf('#') != -1) {
                url = url.replace(/\#.*/, '');
            }
            matches = url.match(/\?(.+)/);
            if (matches && matches[1]) {
                urlParam = this.stringToParam(matches[1]);
                if (urlParam) {
                    params = this.mergeTwoParamters(urlParam, params);
                    url = url.replace(/\?.+/, '');
                }
            }
            paramStr = this.stringifyParam(params);
            if (!paramStr) return url;
            if (url.match(/\?/)) {
                url += "&";
            } else {
                url += "?";
            }
            url += paramStr;
            return url;
        },//}}}

        cookieToString: function (cookies)
        {
            var str = [], key;
            if (cookies instanceof Array) {
                return cookies.join('; ');
            } else {
                for (key in cookies) {
                    str.push(key + '=' + cookies[key]);
                }
            }
            return str.join('; ');
        },
        mergeTwoParamters: function (obj1, obj2)
        {//{{{
            var obj3 = {}, attrname;
            for (attrname in obj1) { obj3[attrname] = obj1[attrname]; }
            for (attrname in obj2) { obj3[attrname] = obj2[attrname]; }
            return obj3;
        }//}}}

    };

    module = module.exports = lib;
}());


