var client = require('../redisClient.js');
var p2 = require('p2');
var q = require('q');
var physics = require('../Physics/world.js');
var D_object = require('../schemas/d_object_schema.js');



module.exports = {

    initWorld: function() {
        return q.Promise(function(resolve, reject) {
            var result = Array();
            client.hvals('d_object', function(err, obj) {
                if (err) {
                    reject(err);
                } else {
                    var tmp;
                    obj.forEach(function(o) {
                        tmp = JSON.parse(o);
                        var boxBody = new p2.Body({
                            mass: 5,
                            position: [tmp.position.x, tmp.position.y]
                        });
                        var boxShape = new p2.Box();
                        boxBody.addShape(boxShape);
                        physics.world.addBody(boxBody);
                        physics.map[tmp.id] = physics.world.bodies.length;

                    });
                    resolve();
                }
            });
        });
    },

    setWorld: function() {
        return q.Promise(function(resolve, reject) {
            physics.map.forEach(function(world_id) {
                if (world_id != undefined) {
                    var object = new D_object({
                        id: physics.map.indexOf(world_id),
                        position: {
                            x: physics.world.bodies[world_id - 1].position[0],
                            y: physics.world.bodies[world_id - 1].position[1]
                        }
                    });

                    client.hset("d_object", object.id, JSON.stringify(object));
                }
            });
            resolve();
        });
    }


}