interface Animal{
    name:string;
    height:number;
    weight:number;
    makeSound():void;
    eat():void;
    run():void;
    die():void;
}

export = Animal;