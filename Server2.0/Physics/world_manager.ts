import p2 = require('p2');
import * as physics from './world';
import {pkg_world}  from '../redis_pkgs/pkg_world';

pkg_world.initWorld();

var timeStep = 1 / 60;
setInterval(function() {
    physics.world.step(timeStep);
    pkg_world.setWorld();

}, 1000 * timeStep);

