import p2 = require('p2');

export var map:Array<number> = new Array(); // redis_id - world_id
export var world = new p2.World({
    gravity: [0, -9.82]
});

var groundShape = new p2.Plane();
var groundBody = new p2.Body({
    mass: 0
});
groundBody.addShape(groundShape);
world.addBody(groundBody);


// world.on('postStep', function(event){
//     console.log(world.bodies.length);
// });
