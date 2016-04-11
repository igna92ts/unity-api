import {Vector2D} from "../Physics/physics_type";
import {Vector3D} from "../Physics/physics_type";
import {Quaternion} from "../Physics/physics_type";

export class DynamicObject{
    id:number;
    type:string;
    ownedBy:string = null;
    position:Vector2D = new Vector2D(0,0);
    rotation:Quaternion = new Quaternion(0,0,0,0);
    linearVelocity:Vector3D = new Vector3D(0,0,0);
    angularVelocity:number = 0;
}