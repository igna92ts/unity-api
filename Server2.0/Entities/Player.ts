import {Vector2D} from "../Physics/Types"
import scriptManager = require('../Redis/ScriptManager');

export class Player{
    playerName:string;
    position:Vector2D;
    direction:string;
    speed:number;
    color:string;
    largo:number;
    state:string;
    movingInterval:any;
    roomName:string;
    maxX:number;
    maxY:number;
    toDestroy:boolean
    constructor(playerName:string,position:Vector2D,direction:string,speed:number,color:string,largo:number,state:string,roomName:string,maxX:number,maxY:number){
        
        this.playerName = playerName;
        this.position = position;
        this.direction = direction;
        this.speed = speed;
        this.color = color;
        this.largo = largo;
        this.state = state;
        this.roomName = roomName;
        this.maxX = maxX;
        this.maxY = maxY;
        this.toDestroy = false;
        var _this = this;
        setTimeout(function(){
            scriptManager.run("PKG_PLAYER",[_this.playerName,_this.roomName],["changeInvulState()"],function(err:Error,result:any){
                if(err)
                    console.log("hola2" + err);
                else{
                    _this.state = result;
                    _this.startMoving();
                }
            });
        },3500);
    }
    startMoving(){
        clearInterval(this.movingInterval);
        var _this = this;
    
        this.movingInterval = setInterval(function(){
            _this.adjustPosition();
            scriptManager.run("PKG_PLAYER",[_this.playerName,_this.roomName, _this.position.x,_this.position.y],["movePlayer()"],function(err:Error,result:any){
                if(err)
                    console.log("ERROR DE FORRO     "+ err);
                else{
                    if(result == "ERROR"){
                        _this.toDestroy = true;
                        clearInterval(_this.movingInterval);
                    }else{
                        var p:any = JSON.parse(result);
                        _this.direction = p.direction;
                    }
                }
            });
        },200/_this.speed)
    }
    adjustPosition(){
        switch(this.direction) {
            case "down":
                if(this.position.y + 1 > this.maxY)
                    this.position.y = 0;
                else
                    this.position.y += 1;
                break;
            case "up":
                if(this.position.y - 1 < 0)
                    this.position.y = this.maxY;
                else
                    this.position.y -= 1;
                break;
            case "right":
                if(this.position.x + 1 > this.maxX)
                    this.position.x = 0;
                else
                    this.position.x += 1;
                break;
            case "left":
                if(this.position.x - 1 < 0)
                    this.position.x = this.maxX;
                else
                    this.position.x -= 1;
                break;
            default:
                break;
        }
    }
    
}