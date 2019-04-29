# Kate

> Very Simple Date data manage Module(javascript)

[![NPM Version][npm-image]][npm-url]

## Install

```bash
npm i @owneul/kate
```

## Usage

```javascript
var kate = new Kate('2019년 4월 18일');
var formatted = kate.format('yyyy.mm.dd ap h시 i분 s초');
console.log(formatted); // 2019.04.18 오전 12시 0분 0초

// add~ methods return copy of Kate Object. (new Instance)
var copied = kate.addDays(10);
console.log(copied.format('yy/m/d HH:ii:ss')); // 19/4/28 00:00:00

// set~ methods return original Kate Object. (not create new Instance)
kate.setHours(23).setMinutes(59).setSeconds(59); // 2019.04.18 오후 11시 59분 59초
console.log(kate.format('yyyy.mm.dd ap h시 i분 s초'));

var dateIntervalFrom1991_02_01 = kate.diffInDays('1991-02-01');
console.log(dateIntervalFrom1991_02_01); // -10303
```

### format() arguments
| replace | to | result | 
|--------|-------|------|
|   yyyy    |   Full Year(4)    |   1991    |
|yy|Simple Year(2)|91|
|mm|zerofilled month|02|
|m|non-zerofill month|2|
|dd|zerofilled date|01|
|d|non-zerofill date|1|
|E|day label|금(Fri)|
|HH|zerofilled hours(24H)|17|
|H|non-zerofill hours(24H)|5|
|hh|zerofilled hours(12H)|05|
|h|non-zerofill hours(12H)|5|
|ii|zerofilled minutes|09|
|i|non-zerofill minutes|9|
|ss|zerofilled minutes|01|
|s|non-zerofill minutes|1|
|ap|meridiem label|오전(AM)|

### set custom labels
```javascript
Kate.setMeridiemLabels(['AM', 'PM']);
Kate.setDayLabels(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']); // start with sunday
```


## License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://img.shields.io/npm/v/live-xxx.svg
[npm-url]: https://npmjs.org/package/live-xxx