
//TRAIGO PAQUETES
import {PkgPlayer} from '../Redis/PkgPlayer';
import {PkgObjects} from '../Redis/PkgObjects';
import {Response} from "../Entities/Response";
import {protocolID} from "../config";
import scriptManager = require('../Redis/ScriptManager');


export var eventMap:utils.Map<Function> = {};

eventMap["GET_UPDATES"] = function(msg:string,rinfo:any,server:any){
	var gameState = PkgObjects.getGameState();
	gameState.done(function(){
		server.send("UPDATES" +"&"+JSON.stringify(gameState.valueOf()),rinfo.port,rinfo.address);
	});
};

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

eventMap["LOGIN_REQ"] = function(userData:any,rinfo:any,server:any){
    scriptManager.run("PKG_USER",[userData.username,userData.password],["login()"],function(err:Error,result:any){
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


