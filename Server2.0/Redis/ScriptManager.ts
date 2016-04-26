import Scripto = require('redis-scripto');
import redisClient = require('../Redis/Client');
var scriptManager = new Scripto(redisClient);
scriptManager.loadFromDir('../RedisScripts');


export = scriptManager;