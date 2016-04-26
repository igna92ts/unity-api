export class Response{
    constructor(status:boolean,message:string){
        this.status = status;
        this.message = message;
    }
    status:boolean;
    message:string;
}