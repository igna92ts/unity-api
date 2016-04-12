import client = require('./redisClient');
import p2 = require('p2');
import q = require('q');
import * as physics from '../Physics/world';
import DynamicObject = Physics.DynamicObject;
var D_object = require('../schemas/d_object_schema.js');



export module pkg_world  {

    export function initWorld() {
        return q.Promise(function(resolve, reject) {
            var result = Array();
            client.hvals('d_object', function(err:Error, obj:any) {
                if (err) {
                    reject(err);
                } else {
                    var tmp:DynamicObject;
                    obj.forEach(function(o:any) {
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
                    resolve({});
                }
            });
        });
    }

    export function setWorld() {
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
            resolve({});
        });
    }


}