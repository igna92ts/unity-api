"use strict";
var Male = require('./Male');
var maleArr = new Array();
for (var index = 0; index < 10; index++) {
    maleArr.push(new Male("macho " + index, 50, 50));
}
for (var index = 0; index < maleArr.length; index++) {
    maleArr[index].die();
}
//# sourceMappingURL=test.js.map