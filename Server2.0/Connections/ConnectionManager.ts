import {Connection} from '../Entities/Connection'; 
import {configTimeout} from "../config";
import {protocolID} from "../config";
import {Response} from "../Entities/Response";

export class ConnectionManager{
    connectionList:utils.Map<Connection>;
    addConnection(deviceId:string,rinfo:any){
        console.log(deviceId + "   connected");
        if(this.connectionList == undefined)
            this.connectionList = {};
        this.connectionList[deviceId] = new Connection(rinfo.address,rinfo.port,deviceId);
        this.connectionList[deviceId].setTimer(configTimeout);
        
    }
    checkConnection(deviceId:string,rinfo:any,server:any){

        if(this.connectionList !== undefined && this.connectionList[deviceId] != null){
            if(!this.connectionList[deviceId].timeOut){
                this.connectionList[deviceId].refreshTimer();
                return "OK";
            }else{
                delete  this.connectionList[deviceId];
                //TODO llamar procedure que lo marque como desconectado para todos
                var response:Response = new Response(false,"TIMEOUT");
                server.send(protocolID+"&"+"CONNECTION_TIMEOUT"+"&"+JSON.stringify(response),rinfo.port,rinfo.address);//lo necesito por si no salen sus dgrams pero le llegan los mios
            }
        }else{
            server.send(protocolID,rinfo.port,rinfo.address);
            this.addConnection(deviceId,rinfo);
        }
    }
}

export var connectionManager:ConnectionManager = new ConnectionManager();

