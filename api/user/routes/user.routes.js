var passport = require('passport');
var createSendToken = require('../services/jwt.js');
var googleAuth = require('../services/googleAuth.js');
var facebookAuth = require('../services/facebookAuth.js');
var localStrategy = require('../services/localStrategy.js');
var emailVerification = require('../services/emailVerification.js');
var User = require('../models/User');

module.exports = function (app, express) {
	app.use(passport.initialize());

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.use('local-register', localStrategy.register);
	passport.use('local-login', localStrategy.login);

	app.post('/register', passport.authenticate('local-register'), function (req, res) {
		emailVerification.send(req.user.email);
		createSendToken(req.user, res);
	});

	app.post('/login', passport.authenticate('local-login'), function (req, res) {
		createSendToken(req.user, res);
	});

	app.put('/users/:userId/items/:itemId', function (req, res){
		console.log('users endpoint')
		User.update(
			{_id: req.params.userId}, 
			{$push: { favorites: req.params.itemId }},
			function (err, numUpdated) {
				console.log(err);
				if (err) res.send(err);

				console.log('numUpdated: ' + numUpdated);
				if (numUpdated > 0) {
					res.json({ itemId: req.params.itemId });
				} else {
					res.json({msg: 'user not updated'});
				}
				//res.json({msg: 'user updated'});
			}
		);
	})

	app.delete('/users/:userId/items/:itemId', function (req, res){
		console.log('users delete endpoint')
		User.update(
			{_id: req.params.userId}, 
			{$pull: { favorites: req.params.itemId }},
			function (err, numUpdated) {
				console.log(err);
				if (err) res.send(err);

				console.log('numUpdated: ' + numUpdated);
				if (numUpdated > 0) {
					res.json({ itemId: req.params.itemId });
				} else {
					res.json({msg: 'user not updated'});
				}
				//res.json({msg: 'user updated'});
			}
		);
	})

	app.get('/auth/verifyEmail', emailVerification.handler);
	app.post('/auth/facebook', facebookAuth);
	app.post('/auth/google', googleAuth);
}