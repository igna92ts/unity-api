import scriptManager = require('../Redis/ScriptManager');

export class Connection{
    constructor(host:string,port:string);
    constructor(host:string,port:string,deviceId:string);
    constructor(host:string,port:string,deviceId?:any)
    {
        this.host = host;
        this.port = port;
        this.deviceId = deviceId;
        this.timeOut = false;
        this.watchingAd = false;
        scriptManager.run("PKG_SESSION",[this.deviceId],["startSession()"],function(err:Error,result:any){
            if(err)
                console.log(err);
        });
    }
    host:string;
    port:string;
    deviceId:string;
    timeOut:boolean;
    secondsForTimeout:number;
    timeOutTimer:number;
    interval:any;
    watchingAd:boolean;
    informDisconnect(reason:string){
        console.log(this.deviceId + "   disconnected:   "+reason);
    }
    checkTimeout(){
        if(!this.watchingAd){
            this.timeOutTimer--;
            if(this.timeOutTimer <= 0){
                this.timeOut = true;
                this.informDisconnect("TIMEOUT");
                scriptManager.run("PKG_SESSION",[this.deviceId],["killSession()"],function(err:Error,result:any){
                    if(err)
                        console.log(err);
                });
                clearInterval(this.interval);
            }
        }
    }
    setTimer(seconds:number){
        this.secondsForTimeout = seconds;
        this.timeOutTimer = seconds;
        var _this = this;//cosas de JS nose bien porque hay que hacer esto
        this.interval = setInterval(function(){
            _this.checkTimeout();
        },1000); //cada un segundo vaja el timer y si llega a 0 tira timeout
    }
    refreshTimer(){
        this.timeOutTimer = this.secondsForTimeout;
    }
}