import {Vector2D} from "../Physics/Types"
import {Vector3D} from "../Physics/Types"
import {Quaternion} from "../Physics/Types"



    export class DynamicObject{
        id:number;
        type:string;
        ownedBy:string = null;
        position:Vector2D = new Vector2D(0,0);
        rotation:Quaternion = new Quaternion(0,0,0,0);
        linearVelocity:Vector3D = new Vector3D(0,0,0);
        angularVelocity:number = 0;
    }
