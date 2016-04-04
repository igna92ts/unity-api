var p2 = require('p2');
var pkg_world = require('../redis_pkgs/pkg_world.js');

var redisObjectMap = new Array(); // redis_id - world_id

var world = new p2.World({
	gravity:[0,-9.82]
});

//el piso
var groundShape = new p2.Plane();
var groundBody = new p2.Body({
	mass:0
});
groundBody.addShape(groundShape);
world.addBody(groundBody);

initWorld = pkg_world.initWorld(world); //traigo el estado inicial de redis
initWorld.done(function(){
	redisObjectMap = initWorld.valueOf();
});

var timeStep = 1/60;
setInterval(function(){
	world.step(timeStep);
	pkg_world.setWorld(world,redisObjectMap);
/*	console.log(world.bodies[0].id);
	console.log(world.bodies.length);*/


},1000 * timeStep);

module.exports = world;
