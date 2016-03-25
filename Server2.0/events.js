var eventMap = new Array();
var counter = 0;

eventMap["JSON"] = function(msg){
	counter++;
};


eventMap["NEW_PLAYER"] = function(msg){
	console.log(counter);
};

module.exports = eventMap;