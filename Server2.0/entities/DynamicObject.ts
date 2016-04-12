import Vector2D = Physics.Vector2D;
import Vector3D = Physics.Vector3D;
import Quaternion = Physics.Quaternion;

namespace Physics{
    export class DynamicObject{
        id:number;
        type:string;
        ownedBy:string = null;
        position:Vector2D = new Vector2D(0,0);
        rotation:Quaternion = new Quaternion(0,0,0,0);
        linearVelocity:Vector3D = new Vector3D(0,0,0);
        angularVelocity:number = 0;
    }
}