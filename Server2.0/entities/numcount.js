var initTime = Date.now()/1000;
var cantPares = 0;

for(var i = 0;i < 100000; i++){
	for(var j = 0;j < 100000;j++){
		if((i+j) % 2 == 0)
			cantPares++;
	}
} 

var endTime = Date.now()/1000;

console.log("cantPARES: " + cantPares);
console.log("init: " + initTime);
console.log("end: " + endTime);
console.log("time diff is : "+(endTime-initTime));
