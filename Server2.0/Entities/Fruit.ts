import {Vector2D} from "../Physics/Types";
import {Player} from '../Entities/Player';
import scriptManager = require('../Redis/ScriptManager');


export class Fruit{
    position:Vector2D;
    constructor(roomName:string){
        this.position = new Vector2D(100,100);
        this.spawn(roomName);
    }
    spawn(roomName:string){
        var _this = this;
        scriptManager.run("PKG_FRUIT",[roomName,Date.now()],["spawnFruit()"],function(err:Error,result:any){
            if(err)
                console.log("hola5" + err);
            else{
                var resFruit = JSON.parse(result);
                _this.position.x = resFruit.position.x;
                _this.position.y = resFruit.position.y;
            }
        });
    }
}