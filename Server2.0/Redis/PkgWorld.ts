import client = require('../Redis/Client');
import p2 = require('p2');
import q = require('q');
import * as physics from '../Physics/World';
import {DynamicObject} from "../Entities/DynamicObject";




export module PkgWorld  {

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
                    var object = new DynamicObject();
                    object.id = physics.map.indexOf(world_id);
                    object.position.x = physics.world.bodies[world_id - 1].position[0];
                    object.position.y = physics.world.bodies[world_id - 1].position[1];

                    client.hset("d_object", object.id, JSON.stringify(object));
                }
            });
            resolve({});
        });
    }


}