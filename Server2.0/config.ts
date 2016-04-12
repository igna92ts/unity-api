import {Connection} from './Entities/Connection'; 

var redis = new Connection("localhost","6379"); 
var seaport = new Connection("localhost","7999");


let config: utils.Map<Connection> = {};
config["redis"] = redis;
config ["seaport"] = seaport;

export = config
