import scriptManager = require('./Redis/ScriptManager');
import {Player} from './Entities/Player';
import {Vector2D} from "./Physics/Types"

// un 1 es cuerpo o obstaculo, un 2 es una cabeza un 3 es una cola y un 0 esta libre

export class Room{
    constructor(roomName:string,widthInTiles:number,heightInTiles:number){
        this.roomName = roomName;
        this.heightInTiles = heightInTiles;
        this.widthInTiles = widthInTiles;
        var _this = this;
        setInterval(function(){
            _this.checkCollisions();
            _this.addPlayers();
        },1000/60)
    }
    roomName:string;
    players:utils.Map<Player> = {};
    widthInTiles:number;
    heightInTiles:number;
    addPlayers(){
        var _this = this;
        scriptManager.run("PKG_PLAYER",[_this.roomName],["getPlayers()"],function(err:Error,result:any){
            if(err)
                console.log("HOLA" + err);
            else{
                for(var p in _this.players){
                    if(_this.players[p].toDestroy){
                        console.log("deleted" + _this.players[p].toString());
                        delete _this.players[p];
                    }
                }
                var currPlayers = JSON.parse(result);
                for(var i = 0; i < currPlayers.length; i++){
                    if(_this.players[currPlayers[i].playerName] === undefined)
                        _this.players[currPlayers[i].playerName] = new Player(currPlayers[i].playerName,new Vector2D(currPlayers[i].position.x,currPlayers[i].position.y),
                                                                            currPlayers[i].direction,currPlayers[i].speed,currPlayers[i].color,
                                                                            currPlayers[i].largo,currPlayers[i].state,_this.roomName,_this.widthInTiles,_this.heightInTiles);
                }
                
            }
        });
    }
    checkCollisions(){
        for(var p in this.players){
            for(var other in this.players){
                if(other != p){
                    if(this.players[p].position.x == this.players[other].position.x && this.players[p].position.y == this.players[other].position.y)
                        console.log("Collided");
                }
            }
        }
    }
  
}

export class World{
    map:number[][];
    rooms:utils.Map<Room> = {};
    
    constructor(widthInTiles:number,heightInTiles:number){
        this.map = [];
        for(var y:number = 0;y < heightInTiles;y++){
            this.map[y] = [];
            for(var x:number = 0;x < widthInTiles;x++){
                this.map[y][x] = 0;
            }
        }
        var _this = this;
        setInterval(function(){
            scriptManager.run("PKG_ROOM",[],["getRooms()"],function(err:Error,result:any){
                if(err)
                    console.log(err);
                else{
                    var currRooms = JSON.parse(result);
                    
                    for(var i = 0; i < currRooms.length; i++){
                        if(_this.rooms[currRooms[i].room_name] === undefined)
                            _this.rooms[currRooms[i].room_name] = new Room(currRooms[i].room_name,widthInTiles,heightInTiles);
                    }
                }
            });
        },1000);
    }
    addPlayerToRoom(roomName:string){
        this.rooms[roomName].addPlayers();
    }

}

export var world:World = new World(45,80);