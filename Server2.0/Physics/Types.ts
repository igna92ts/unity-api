
     
        export class Vector2D{
            constructor();
            constructor(x:number,y:number);
            constructor(x?:number,y?:number){
                if(x !== undefined && y !== undefined){
                    this.x = x;
                    this.y = y;
                }
            } 
            x:number = 0;
            y:number = 0;
        }

        export class Vector3D{
            constructor();
            constructor(x:number,y:number,z:number);
            constructor(x?:number,y?:number,z?:number){
                if(x !== undefined && y !== undefined && z !== undefined){
                    this.x = x;
                    this.y = y;
                    this.z = z;
                }
            } 
            x:number = 0;
            y:number = 0;
            z:number = 0;
        }

        export class Quaternion{
            constructor();
            constructor(x:number,y:number,z:number,w:number);
            constructor(x?:number,y?:number,z?:number,w?:number){
                if(x !== undefined && y !== undefined && z !== undefined && w !== undefined){
                    this.x = x;
                    this.y = y;
                    this.z = z;
                    this.w = w;
                }
                
            }
            x:number = 0;
            y:number = 0;
            z:number = 0;
            w:number = 0;
        }
    
