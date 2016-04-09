import Male = require('./Male');

var maleArr:Array<Male> = new Array<Male>();

for (let index = 0; index < 10; index++) {
    maleArr.push(new Male("macho "+ index,50,50));    
}

for (let index = 0; index < maleArr.length; index++) {
    maleArr[index].die();
}

