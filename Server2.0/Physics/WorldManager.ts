import p2 = require('p2');
import * as physics from './World';
import {PkgWorld}  from '../Redis/PkgWorld';

PkgWorld.initWorld();

var timeStep = 1 / 60;
setInterval(function() {
    physics.world.step(timeStep);
    PkgWorld.setWorld();

}, 1000 * timeStep);

