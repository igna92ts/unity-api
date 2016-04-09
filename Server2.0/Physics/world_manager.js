var p2 = require('p2');
var physics = require('./world.js');
var pkg_world = require('../redis_pkgs/pkg_world.js');

pkg_world.initWorld();

var timeStep = 1 / 60;
setInterval(function() {
    physics.world.step(timeStep);
    pkg_world.setWorld();

}, 1000 * timeStep);

