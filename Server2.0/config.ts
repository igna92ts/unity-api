import {Connection} from './Entities/Connection'; 

var redis = new Connection("localhost","6379"); 
var seaport = new Connection("localhost","7999");


export let connectionConfig: utils.Map<Connection> = {};
connectionConfig["redis"] = redis;
connectionConfig ["seaport"] = seaport;

export var protocolID:string = 'ARMSRACE'
