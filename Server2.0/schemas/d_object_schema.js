
Schema = require('schema-object');

var d_objectSchema = new Schema({
	"id": { type: Number},
	"type": { type: String},
	"ownedBy": {type:String,default:""},
	"position": {
		"x": {type:Number,default:0},
		"y": {type:Number,default:0}
	},
	"rotation":{
		"x": {type:Number,default:0.0},
		"y": {type:Number,default:0.0},
		"z": {type:Number,default:0.0},
		"w": {type:Number,default:0.0}
	},
	"linearVelocity":{
		"x": {type:Number,default:0.0},
		"y": {type:Number,default:0.0},
		"z": {type:Number,default:0.0}
	},
	"angularVelocity": {type: Number,default:0.0}
});


module.exports = d_objectSchema;