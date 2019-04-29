"use strict";
var Kate = (function () {
    function Kate(__raw, __isTimestamp) {
        var _this = this;
        if (__isTimestamp === void 0) { __isTimestamp = false; }
        this.__interpreters = [
            function (__raw) {
                if (typeof __raw === 'number') {
                    var checkDateObject, __rawString = __raw.toString(), paddedRawString = __rawString;
                    while (paddedRawString.length < 14) {
                        paddedRawString = paddedRawString + "0";
                    }
                    var year = __rawString.slice(0, 4);
                    var month = __rawString.slice(4, 6);
                    var day = __rawString.slice(6, 8);
                    var hour = __rawString.slice(8, 10);
                    var minute = __rawString.slice(10, 12);
                    var second = __rawString.slice(12, 14);
                    checkDateObject = new Date(year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
                    if (!isNaN(checkDateObject.getFullYear())) {
                        return checkDateObject;
                    }
                    else if (!isNaN(new Date(__raw).getFullYear())) {
                        return new Date(__raw);
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            },
            function (__raw) {
                if (typeof __raw === 'string') {
                    if (!isNaN(new Date(__raw).getFullYear())) {
                        return new Date(__raw);
                    }
                    else {
                        __raw = __raw.replace(/\s/g, '')
                            .replace(/(\d*){1,4}.(\d*){1,2}.(\d*){1,2}/, '$1-$2-$3 ')
                            .replace('년', '-').replace('월', '-').replace('일', ' ')
                            .replace(/시$/, '').replace(/시(\d)/, ':$1')
                            .replace(/분$/, '').replace(/분(\d)/, ':$1')
                            .replace(/초$/, '').replace(/초(\d)/, '.$1');
                        if (__raw.match(/오전/)) {
                            __raw = __raw.replace('오전', '') + ' AM';
                        }
                        if (__raw.match(/오후/)) {
                            __raw = __raw.replace('오후', '') + ' PM';
                        }
                        return new Date(__raw);
                    }
                }
                else {
                    return false;
                }
            },
        ];
        this.__replacer = {
            yyyy: function () { return _this.__dateObject ? _this.__dateObject.getFullYear() : ''; },
            yy: function () { return ("" + _this.__replacer.yyyy()).substr(-2); },
            mm: function () { return ("0" + _this.__replacer.m()).substr(-2); },
            m: function () { return _this.__dateObject ? _this.__dateObject.getMonth() + 1 : ''; },
            dd: function () { return ("0" + _this.__replacer.d()).substr(-2); },
            d: function () { return _this.__dateObject ? _this.__dateObject.getDate() : ''; },
            E: function () { return _this.__dateObject ? Kate.__dayLabels[_this.__dateObject.getDay()] : ''; },
            HH: function () { return ("0" + _this.__replacer.H()).substr(-2); },
            H: function () { return _this.__dateObject ? _this.__dateObject.getHours() : ''; },
            hh: function () { return ("0" + _this.__replacer.h()).substr(-2); },
            h: function () {
                var h = _this.__dateObject ? (_this.__dateObject.getHours() % 12) : '';
                return h == 0 ? '12' : h;
            },
            ii: function () { return ("0" + _this.__replacer.i()).substr(-2); },
            i: function () { return _this.__dateObject ? _this.__dateObject.getMinutes() : ''; },
            ss: function () { return ("0" + _this.__replacer.s()).substr(-2); },
            s: function () { return _this.__dateObject ? _this.__dateObject.getSeconds() : ''; },
            ap: function () { return _this.__dateObject ? (_this.__dateObject.getHours() > 12 ? Kate.__meridiemLabels[1] : Kate.__meridiemLabels[0]) : ''; },
        };
        var dateFromRaw;
        if (__isTimestamp) {
            dateFromRaw = new Date(__raw);
        }
        else if (__raw instanceof Date) {
            dateFromRaw = __raw;
        }
        else if (!__raw) {
            dateFromRaw = new Date();
        }
        else {
            for (var index = 0; index < this.__interpreters.length; index++) {
                var interpreter = this.__interpreters[index];
                var result = interpreter(__raw);
                if (result) {
                    dateFromRaw = result;
                    break;
                }
            }
        }
        if (!dateFromRaw || (dateFromRaw && isNaN(dateFromRaw.getFullYear()))) {
            throw new Error('Date Object Not Found.');
        }
        else {
            this.__dateObject = dateFromRaw;
        }
    }
    Kate.prototype.getDateObject = function () {
        return this.__dateObject;
    };
    Kate.setMeridiemLabels = function (__labels) {
        console.log(__labels);
        if (!Array.isArray(__labels) || !__labels.length || __labels.length < 2) {
            throw new Error('meridiem label must be array and have 2 item(AM/PM).');
        }
        this.__meridiemLabels = __labels;
    };
    Kate.setDayLabels = function (__labels) {
        if (!Array.isArray(__labels) || !__labels.length || __labels.length < 7) {
            throw new Error('day label must be array and have 7 item(monday to sunday).');
        }
        this.__dayLabels = __labels;
    };
    Kate.prototype.setYear = function (__year) {
        this.__dateObject.setFullYear(__year);
        return this;
    };
    Kate.prototype.setMonth = function (__month) {
        this.__dateObject.setMonth(__month);
        return this;
    };
    Kate.prototype.setDate = function (__date) {
        this.__dateObject.setDate(__date);
        return this;
    };
    Kate.prototype.setHours = function (__hours) {
        this.__dateObject.setHours(__hours);
        return this;
    };
    Kate.prototype.setMinutes = function (__minute) {
        this.__dateObject.setMinutes(__minute);
        return this;
    };
    Kate.prototype.setSeconds = function (__seconds) {
        this.__dateObject.setSeconds(__seconds);
        return this;
    };
    Kate.prototype.addSeconds = function (__seconds) {
        return new Kate(this.__dateObject.getTime() + (1000 * __seconds), true);
    };
    Kate.prototype.addMinutes = function (__minutes) {
        return new Kate(this.__dateObject.getTime() + (1000 * 60 * __minutes), true);
    };
    Kate.prototype.addHours = function (__hours) {
        return new Kate(this.__dateObject.getTime() + (1000 * 60 * 60 * __hours), true);
    };
    Kate.prototype.addDays = function (__days) {
        return new Kate(this.__dateObject.getTime() + (1000 * 60 * 60 * 24 * __days), true);
    };
    Kate.prototype.addMonths = function (__months) {
        return new Kate(this.__dateObject.getTime() + (1000 * 60 * 60 * 24 * 30 * __months), true);
    };
    Kate.prototype.addYears = function (__years) {
        return new Kate(this.__dateObject.getTime() + (1000 * 60 * 60 * 24 * 365.25 * __years), true);
    };
    Kate.prototype.diffInSeconds = function (__raw) {
        var kate = new Kate(__raw);
        return Math.round((kate.__dateObject.getTime() - this.__dateObject.getTime()) / 1000);
    };
    Kate.prototype.diffInMinutes = function (__raw) {
        return Math.round(this.diffInSeconds(__raw) / 60);
    };
    Kate.prototype.diffInHours = function (__raw) {
        return Math.round(this.diffInSeconds(__raw) / 60 / 60);
    };
    Kate.prototype.diffInDays = function (__raw) {
        var kate = new Kate(__raw);
        return Math.round((kate.__dateObject.getTime() - this.__dateObject.getTime()) / 1000 / 60 / 60 / 24);
    };
    Kate.prototype.diffInMonths = function (__raw) {
        return Math.round(this.diffInDays(__raw) / 30);
    };
    Kate.prototype.diffInYears = function (__raw) {
        return Math.round(this.diffInDays(__raw) / 365.25);
    };
    Kate.prototype.copy = function () {
        return new Kate(this.format('yyyy-mm-dd HH:ii:ss'));
    };
    Kate.prototype.format = function (__format) {
        var _this = this;
        return __format.replace(/(yyyy|yy|mm|m|dd|d|E|HH|H|hh|h|ii|i|ss|s|ap)/gi, function ($1) {
            return _this.__replacer[$1] ? _this.__replacer[$1]() : $1;
        });
    };
    Kate.__dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
    Kate.__meridiemLabels = ['오전', '오후'];
    return Kate;
}());
module.exports = Kate;
