var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema({
	user_name : { type: String, required: true},
	password : {type: String, required: true}
}),

User = mongoose.model('user',userSchema);

module.exports = User;