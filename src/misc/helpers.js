// window._ENV = require('./../env.js');

export default {    
    toJson(json, res = {}) {
        if (this.isJson(json)) {
            return json;
        } else if (typeof json == 'string') {
            try {
                return JSON.parse(json);
            } catch (e) {
    
            }
        }
        return res;
    },
    
    isJson(json) {
        return typeof json == 'object';
    },

    getSubdomain(){        
        let host =  window.location.host;
        return ((host.replace(this.getEnv('HOST'),"")).replace(/:[0-9]*/g,'')).replace(/^[.]+|[.]+$/gm,'');
    },

    inArray(needle, haystack) {
        for (var i = 0; i < haystack.length; i++) {
            if (haystack[i] == needle) {
                return true;
            }
        }
        return false;
    },

    isPath(needle, haystack) {
        needle = needle.trim().toLowerCase();
        for (var i = 0; i < haystack.length; i++) {
            let patt = new RegExp(haystack[i].trim().toLowerCase());
            if (patt.test(needle)) {
                return true;
            }
        }
        return false;
    },
    
    isAssoc(arr) {
        for (var i = 0; i < Object.keys(arr).length; i++) {
            if (typeof arr[i] == 'undefined') {
                return 1;
            }
        }
        return 0;
    },
    
    capitalize(string) {
        return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },

    getHost(subdomain){
        if(subdomain){
            return location.protocol + '//' + subdomain + '.'  + this.getEnv('HOST');
        }
        return location.protocol + '//' + this.getEnv('HOST');
    },
    
    getApiURL(){
        return this.getEnv('API_URL') + '/' + this.getEnv('API_VERSION');
    },
    
    getEnv(value, _default){
        _default = (typeof _default == 'undefined')? '' : _default;
        return (typeof _ENV[value] == 'undefined')? _default:_ENV[value];
    },

    blockCard($elem){
        $($elem).block({
            message: '<div class="ft-refresh-cw icon-spin font-medium-4"></div>',
            overlayCSS: {
                backgroundColor: '#fff',
                opacity: 0.9,
                cursor: 'wait'
            },
            css: {
                border: 0,
                padding: 0,
                backgroundColor: 'transparent'
            }
        });
    }, 

    unblockCard($elem){
        $($elem).unblock()
    },

    blockPage(){
        $('#page-spinner').css('display','block');
    }, 

    unBlockPage(time){
        time = (time != 'undefined')? time: 0;
        setTimeout(function(){
            $('#page-spinner').css('display','none');
        },time);
    }, 

    guidGenerator() {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+ Date.now());
    }, 

    unknownError(error){
        return {
            'status': 0,
            'errors':[
                'Connection Error!'
            ],
            'data':error
        };
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getValue(obj, key, _default) {
        _default = (typeof _default == 'undefined')? '' : _default;
        return key.split(".").reduce(function(o, x) {
            return (typeof o[x] == "undefined" || o[x] === null || o[x] == null) ? _default : o[x];
        }, obj);
    }, 

    has(obj, key) {
        return key.split(".").every(function(x) {
            if(typeof obj != "object" || obj === null || ! x in obj)
                return false;
            obj = obj[x];
            return true;
        });
    },
    uploadImages(formData, callBackHandler){
        axios({
            method: 'post',
            url: '/upload/images',
            data: formData,
        }).then(function (response) {
            callBackHandler(response.data);
        }.bind(this)).catch(function (error) {
            callBackHandler(Helpers.unknownError(error));
        })
    },
        
    validateEmail(email) {
        email = email.trim().toLowerCase();
        var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
        var result = emailRegExp.test(email);
        return result;
    },
    validateCVV(cvv) {
        var cvvRegExp = /^[0-9]{3,4}$/g;
        var result = cvvRegExp.test(cvv);
        return result;
    },
    validateExpDate(ExpDate) {
        var ExpdateRegExp = /^(0[1-9]|1[0-2])\/?(([0-9]{4}|[0-9]{2})$)/g;
        var result = ExpdateRegExp.test(ExpDate);
        return result;
    },
    validateCCNumber(ccn) {
        var ccnRegExp_MasterCard = /^5[1-5]\d{14}/g;
        var ccnRegExp_Visa = /^4\d{12}(\d{3})?/g;
        var ccnRegExp_Amex = /^3[47]\d{13}/g;
        var ccnRegExp_Discover = /^6011\d{14}/g;
        if (ccnRegExp_MasterCard.test(ccn) || ccnRegExp_Visa.test(ccn) ||
            ccnRegExp_Amex.test(ccn) || ccnRegExp_Discover.test(ccn)) {

            return true;
        }
        return false;
    },
    
    setTitle(title) {
        if (window.jQuery) {
            $('#html-head-title').html(title);
        }
    },

    bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },

    sizeToBytes(val, unit) {
        var sizes = {'Bytes':0, 'KB':1, 'MB':2, 'GB':3, 'TB':4};
        return Math.round(val * Math.pow(1024, sizes[unit]), 2);
    }
}