var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	email: String,
	password: String,
	googleId: String,
	facebookId: String,
	displayName: String,
	active: Boolean,
	favorites: { type: Array, index: { unique: true }}
})

UserSchema.methods.toJSON = function() {
	var user = this.toObject();
	delete user.password;
	console.log('from user model: ' + user);
	return user;
}

UserSchema.methods.comparePasswords = function(password, callback) {
	console.log(password + " " + this.password);
	bcrypt.compare(password, this.password, callback);
}

UserSchema.pre('save', function(next){
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(10, function(err, salt){
		if (err) return next(err);

		bcrypt.hash(user.password, salt, null, function(err, hash){
			if (err) return next(err);

			user.password = hash;
			next();
		})
	})
})

module.exports = mongoose.model('User', UserSchema);



