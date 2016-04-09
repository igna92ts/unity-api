import Animal = require('./Animal');

class Male implements Animal{
    name:string;
    height:number;
    weight:number;
    constructor(name:string,height:number,weight:number){
        this.name = name;
        this.height = height;
        this.weight = weight;
    }
    makeSound():void{
        console.log("manly sound");
    }
    eat():void{
        console.log(this.name + " is eating");
    }
    run():void{
        console.log(this.name + " is running");
    }
    die():void{
        console.log(this.name + " just died");
    }
}

export = Male;