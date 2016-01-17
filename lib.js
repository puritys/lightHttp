"use strict";
(function() {

    var lib = {
        parseUrl: function(url) {//{{{
            var i, n, pm, pos, key, value;
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

        addParams: function (url, params) 
        {//{{{
            var paramStr;
            if (!url) return "";
            if (url.indexOf('#') != -1) {
                url = url.replace(/\#.*/, '');
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
        }//}}}

    };

    module = module.exports = lib;
}());


