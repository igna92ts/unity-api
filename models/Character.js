var mongoose = require('mongoose');
var Schema = mongoose.Schema;

characterSchema = new Schema({
	name: {type: String,required:true},
	level:{type:Number,required:true}
});

Character = mongoose.model('character',characterSchema);

module.exports = Character;