class Kate {
    private __dateObject: Date;
    private __interpreters: Array<any> = [
        // number 타입 raw 인터프리터
        // 허용범위 : yyyymmdd, yyyymmddhh, yyyymmddhhmm, yyyymmddhhmmss
        (__raw: any) => {
            if (typeof __raw === 'number') {
                var checkDateObject,
                    __rawString = __raw.toString(),
                    paddedRawString = __rawString;

                while (paddedRawString.length < 14) {
                    paddedRawString = `${paddedRawString}0`;
                }

                var year = __rawString.slice(0, 4);
                var month = __rawString.slice(4, 6);
                var day = __rawString.slice(6, 8);
                var hour = __rawString.slice(8, 10);
                var minute = __rawString.slice(10, 12);
                var second = __rawString.slice(12, 14);
                
                checkDateObject = new Date(`${year}-${month}-${day} ${hour}:${minute}:${second}`);
                if (!isNaN(checkDateObject.getFullYear())) {
                    return checkDateObject;
                } else if (!isNaN(new Date(__raw).getFullYear())) {
                    return new Date(__raw);
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },

        // string 타입 raw 인터프리터
        (__raw: any) => {
            if (typeof __raw === 'string') {
                if (!isNaN(new Date(__raw).getFullYear())) {
                    return new Date(__raw);
                } else {
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
            } else {
                return false;
            }
        },
    ];

    private __replacer: any = {
        yyyy: () => this.__dateObject ? this.__dateObject.getFullYear() : '',
        yy: () => `${this.__replacer.yyyy()}`.substr(-2),
        mm: () => `0${this.__replacer.m()}`.substr(-2),
        m: () => this.__dateObject ? this.__dateObject.getMonth() + 1 : '',
        dd: () => `0${this.__replacer.d()}`.substr(-2),
        d: () => this.__dateObject ? this.__dateObject.getDate() : '',
        E: () => this.__dateObject ? Kate.__dayLabels[this.__dateObject.getDay()] : '',
        HH: () => `0${this.__replacer.H()}`.substr(-2),
        H: () => this.__dateObject ? this.__dateObject.getHours() : '',
        hh: () => `0${this.__replacer.h()}`.substr(-2),
        h: () => {
            var h = this.__dateObject ? (this.__dateObject.getHours() % 12) : ''
            return h == 0 ? '12' : h;
        },
        ii: () => `0${this.__replacer.i()}`.substr(-2),
        i: () => this.__dateObject ? this.__dateObject.getMinutes() : '',
        ss: () => `0${this.__replacer.s()}`.substr(-2),
        s: () => this.__dateObject ? this.__dateObject.getSeconds() : '',
        ap: () => this.__dateObject ? (this.__dateObject.getHours() > 12 ? Kate.__meridiemLabels[1] : Kate.__meridiemLabels[0]) : '',
    };

    static __dayLabels: Array<string> = ['일', '월', '화', '수', '목', '금', '토'];
    static __meridiemLabels: Array<string> = ['오전', '오후'];

    constructor(__raw?: any, __isTimestamp: boolean = false) {
        var dateFromRaw;
        if (__isTimestamp) {
            dateFromRaw = new Date(__raw);
        } else if (__raw instanceof Date) {
            dateFromRaw = __raw;
        } else if (!__raw) {
            dateFromRaw = new Date();
        } else {
            for (let index = 0; index < this.__interpreters.length; index++) {
                const interpreter = this.__interpreters[index];
                const result = interpreter(__raw);
                if (result) {
                    dateFromRaw = result;
                    break;
                }
            }
        }

        if (!dateFromRaw || (dateFromRaw && isNaN(dateFromRaw.getFullYear()))) {
            throw new Error('Date Object Not Found.');
        } else {
            this.__dateObject = dateFromRaw;
        }
    }

    getDateObject(): Date | undefined {
        return this.__dateObject;
    }

    // 오전/오후 구분 라벨 세터
    static setMeridiemLabels(__labels: Array<string>) {
        console.log(__labels);
        if (!Array.isArray(__labels) || !__labels.length || __labels.length < 2) {
            throw new Error('meridiem label must be array and have 2 item(AM/PM).');
        }
        // this.__meridiemLabels = __labels;
        this.__meridiemLabels = __labels;
        // return this;
    }

    // 요일 구분 라벨 세터(월요일 ~ 일요일 순서)
    static setDayLabels(__labels: Array<string>) {
        if (!Array.isArray(__labels) || !__labels.length || __labels.length < 7) {
            throw new Error('day label must be array and have 7 item(monday to sunday).');
        }
        this.__dayLabels = __labels;
        // return this;
    }

    setYear(__year: number): Kate {
        this.__dateObject.setFullYear(__year);
        return this;
    }

    setMonth(__month: number): Kate {
        this.__dateObject.setMonth(__month);
        return this;
    }

    setDate(__date: number): Kate {
        this.__dateObject.setDate(__date);
        return this;
    }

    setHours(__hours: number): Kate {
        this.__dateObject.setHours(__hours);
        return this;
    }

    setMinutes(__minute: number): Kate {
        this.__dateObject.setMinutes(__minute);
        return this;
    }

    setSeconds(__seconds: number): Kate {
        this.__dateObject.setSeconds(__seconds);
        return this;
    }

    // 초 변경
    addSeconds(__seconds: number): Kate {
        return new Kate(this.__dateObject.getTime() + (1000 * __seconds), true);
    }

    // 분 변경
    addMinutes(__minutes: number): Kate {
        return new Kate(this.__dateObject.getTime() + (1000 * 60 * __minutes), true);
    }

    // 시 변경
    addHours(__hours: number): Kate {
        return new Kate(this.__dateObject.getTime() + (1000 * 60 * 60 * __hours), true);
    }

    // 일자 변경
    addDays(__days: number): Kate {
        return new Kate(this.__dateObject.getTime() + (1000 * 60 * 60 * 24 * __days), true);
    }

    // 월 변경
    addMonths(__months: number): Kate {
        return new Kate(this.__dateObject.getTime() + (1000 * 60 * 60 * 24 * 30 * __months), true);
    }

    // 년 변경
    addYears(__years: number): Kate {
        return new Kate(this.__dateObject.getTime() + (1000 * 60 * 60 * 24 * 365.25 * __years), true);
    }

    diffInSeconds(__raw: any): number {
        var kate = new Kate(__raw);
        return Math.round((kate.__dateObject.getTime() - this.__dateObject.getTime()) / 1000);
    }

    diffInMinutes(__raw: any): number {
        return Math.round(this.diffInSeconds(__raw) / 60);
    }

    diffInHours(__raw: any): number {
        return Math.round(this.diffInSeconds(__raw) / 60 / 60);
    }

    diffInDays(__raw: any): number {
        var kate = new Kate(__raw);
        return Math.round((kate.__dateObject.getTime() - this.__dateObject.getTime()) / 1000 / 60 / 60 / 24);
    }

    diffInMonths(__raw: any): number {
        return Math.round(this.diffInDays(__raw) / 30);
    }

    diffInYears(__raw: any): number {
        return Math.round(this.diffInDays(__raw) / 365.25);
    }

    // 복사
    copy() {
        return new Kate(this.format('yyyy-mm-dd HH:ii:ss'));
    }

    // 포맷팅 함수
    format(__format: string): string {
        return __format.replace(/(yyyy|yy|mm|m|dd|d|E|HH|H|hh|h|ii|i|ss|s|ap)/gi, ($1) => {
            return this.__replacer[$1] ? this.__replacer[$1]() : $1;
        });
    }
}

export = Kate;