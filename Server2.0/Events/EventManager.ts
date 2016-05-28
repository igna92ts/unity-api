
//TRAIGO PAQUETES
import {PkgPlayer} from '../Redis/PkgPlayer';
import {PkgObjects} from '../Redis/PkgObjects';
import {Response} from "../Entities/Response";
import {protocolID} from "../config";
import scriptManager = require('../Redis/ScriptManager');
import {world} from "../World";



export var eventMap:utils.Map<Function> = {};

eventMap["SIGNUP_REQ"] = function(userData:any,rinfo:any,server:any){
    scriptManager.run("PKG_USER",[userData.username,userData.password],["signup()"],function(err:Error,result:any){
        var response:Response;
        if(err)
            response = new Response(false,err.message);
        else{
            if(result == "USER_CREATED")
                response = new Response(true,result);
            else
                response = new Response(false,result);
        }
        server.send(protocolID+"&"+"SIGNUP_RES"+"&"+JSON.stringify(response),rinfo.port,rinfo.address);
    });
};

eventMap["LOGIN_REQ"] = function(userData:any,rinfo:any,server:any,deviceId:any){
    scriptManager.run("PKG_USER",[userData.username,userData.password,deviceId],["login()"],function(err:Error,result:any){
        var response:Response;
        if(err)
            response = new Response(false,err.message);
        else{
            if(result == 'LOGIN_OK')
                response = new Response(true,result);
            else
                response = new Response(false,result);
        }
        server.send(protocolID+"&"+"LOGIN_RES"+"&"+JSON.stringify(response),rinfo.port,rinfo.address);
    });
};

eventMap["DISCONNECT"] = function(payload:any,rinfo:any,server:any,deviceId:any){
    console.log("USER: "+deviceId+" DISCONNECTED");
    scriptManager.run("PKG_SESSION",[deviceId],["killSession()"],function(err:Error,result:any){
        if(err)
            console.log(err);
    });
};

eventMap["GET_ROOMS"] = function(payload:any,rinfo:any,server:any){
    scriptManager.run("PKG_ROOM",[],["getRooms()"],function(err:Error,result:any){
        if(err)
            console.log(err);
        else{
            var response = new Response(true,JSON.parse(result));
            server.send(protocolID+"&"+"ROOMS_DATA"+"&"+JSON.stringify(response),rinfo.port,rinfo.address);
        }
    });
};

eventMap["ENTER_ROOM"] = function(playerRoom:any,rinfo:any,server:any,deviceId:any){
    scriptManager.run("PKG_ROOM",[playerRoom.playerName,playerRoom.roomName,deviceId],["addPlayerToRoom()"],function(err:Error,result:any){
        if(err)
            console.log("ENTER  " + err);
        else{
            var response = new Response(true,result);
            server.send(protocolID+"&"+"ROOM_ENTERED"+"&"+JSON.stringify(response),rinfo.port,rinfo.address);
            console.log("User: "+deviceId+" entered room with name: "+playerRoom.roomName);
            world.addPlayerToRoom(playerRoom.roomName);
        }
    });
}

eventMap["CREATE_ROOM"] = function(roomData:any,rinfo:any,server:any,deviceId:any){
    console.log("User: "+deviceId+" created room with name: "+roomData.roomName);
    scriptManager.run("PKG_ROOM",[roomData.roomName,roomData.size,deviceId],["createRoom()"],function(err:Error,result:any){
        if(err)
            console.log(err);
        else{
            var response = new Response(true,result);
            server.send(protocolID+"&"+"ROOM_CREATED"+"&"+JSON.stringify(response),rinfo.port,rinfo.address);
        }
            
    });  
};

eventMap["GET_PLAYER_DATA"] = function(roomData:any,rinfo:any,server:any,deviceId:any){
    scriptManager.run("PKG_PLAYER",[roomData.roomName],["getPlayers()"],function(err:Error,result:any){
        if(err)
            console.log(err);
        else{
            var response = new Response(true,JSON.parse(result));
            server.send(protocolID+"&"+"PLAYER_DATA"+"&"+JSON.stringify(response),rinfo.port,rinfo.address);
        }
    });  
};

eventMap["INPUT"] = function(inputData:any,rinfo:any,server:any,deviceId:any){
    scriptManager.run("PKG_PLAYER",[inputData.newDirection,deviceId],["changeDirection()"],function(err:Error,result:any){
        if(err)
            console.log(err);
    });  
};

/*eventMap["GET_UPDATES"] = function(msg:string,rinfo:any,server:any){
	var gameState = PkgObjects.getGameState();
	gameState.done(function(){
		server.send("UPDATES" +"&"+JSON.stringify(gameState.valueOf()),rinfo.port,rinfo.address);
	});
};*/


