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
    toDestroy:boolean;
    hasCollided:boolean;
    lastMovements:Array<string>;
    constructor(playerName:string,position:Vector2D,direction:string,speed:number,color:string,largo:number,state:string,roomName:string,maxX:number,maxY:number){
        
        this.playerName = playerName;
        this.position = position;
        this.direction = direction;
        this.speed = speed;
        this.color = color;
        this.largo = largo;
        this.state = state;
        this.roomName = roomName;
        this.maxX = maxX-1;
        this.maxY = maxY-1;
        this.toDestroy = false;
        this.hasCollided = false;
        this.lastMovements = new Array();
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
        },3000);
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
                        if(_this.largo < _this.lastMovements.push(_this.direction))
                            _this.lastMovements.shift();
                        _this.direction = p.direction;
                        
                    }
                }
            });
        },(200-_this.speed*5))
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
    onCollision(){
        var _this = this;
        this.position.x =  Math.floor(Math.random() * (40));
        this.position.y =  Math.floor(Math.random() * (80));
        var _this = this;
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
                    clearInterval(_this.movingInterval);
                    scriptManager.run("PKG_PLAYER",[_this.playerName,_this.roomName],["changeInvulState()"],function(err:Error,result:any){
                        if(err)
                            console.log("hola2" + err);
                        else{
                            _this.state = result;
                            setTimeout(function(){
                                scriptManager.run("PKG_PLAYER",[_this.playerName,_this.roomName],["changeInvulState()"],function(err:Error,result:any){
                                    if(err)
                                        console.log("hola2" + err);
                                    else{
                                        _this.state = result;
                                        _this.hasCollided = false;
                                        _this.largo = 1;
                                        _this.speed = 1;
                                        _this.startMoving();
                                    }
                                });
                            },3500);
                        }
                    });
                }
            }
        });
    }
    eat(){
        var _this = this;
        scriptManager.run("PKG_PLAYER",[_this.playerName,_this.roomName],["eat()"],function(err:Error,result:any){
            if(err)
                console.log("Error eating by player " + err);
            else{
                var res = JSON.parse(result);
                _this.speed = res.speed;
                _this.largo = res.largo;
                _this.startMoving();
            }
        });
    }
    getTailArray(){
        var posArr:Array<Vector2D> = new Array<Vector2D>();
        posArr.push(this.position);
        for(var i =0;i < this.lastMovements.length; i++){
            switch(this.lastMovements[i]) {
            case "up":
                if(posArr[i].y + 1 > this.maxY)
                    posArr.push(new Vector2D(posArr[i].x,0))
                else
                    posArr.push(new Vector2D(posArr[i].x,posArr[i].y + 1))
                break;
            case "down":
                if(posArr[i].y - 1 < 0)
                    posArr.push(new Vector2D(posArr[i].x,this.maxY))
                else
                    posArr.push(new Vector2D(posArr[i].x,posArr[i].y - 1))
                break;
            case "left":
                if(posArr[i].x + 1 > this.maxX)
                    posArr.push(new Vector2D(0,posArr[i].y))
                else
                    posArr.push(new Vector2D(posArr[i].x + 1,posArr[i].y))
                break;
            case "right":
                if(posArr[i].x - 1 < 0)
                    posArr.push(new Vector2D(this.maxX,posArr[i].y))
                else
                    posArr.push(new Vector2D(posArr[i].x - 1,posArr[i].y))
                break;
            default:
                break;
            }
        }
        return posArr;
    }
}