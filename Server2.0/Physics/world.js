var p2 = require('p2');


var world = new p2.World({
	gravity:[0,-9.82]
});

var circleBody = new p2.Body({
	mass:5,
	position:[0,10]
});
var circleShape = new p2.Circle({radius:1});
circleBody.addShape(circleShape);

var groundShape = new p2.Plane();
var groundBody = new p2.Body({
	mass:0
});
groundBody.addShape(groundShape);

world.addBody(circleBody);
world.addBody(groundBody);

var timeStep = 1/60;
setInterval(function(){
	world.step(timeStep);
	//console.log(circleBody.position[1]);
	//console.log(world.bodies[0].position[1]);
},1000 * timeStep);

module.exports = world;