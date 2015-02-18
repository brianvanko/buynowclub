var _ = require('underscore');
var fs = require('fs');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var config = require('./../../config.js');
var User = require('../models/User.js');


var model = {
	verifyUrl: 'http://localhost:3000/auth/verifyEmail?token=',
	title: 'Buy Now Club',
	subtitle: 'Thanks for signing up!',
	body: 'Please verify your email address by clicking the button below'
}

exports.send = function (email) {
	var payload = {
		sub: email
	}

	var token = jwt.encode(payload, config.EMAIL_SECRET);
	model.verifyUrl += token;

	console.log("logged from the send function: " + getHtml(token));

	var transporter = nodemailer.createTransport(smtpTransport({
		service: 'Gmail',
    auth: {
        user: config.ADMIN_EMAIL,
        pass: config.ADMIN_EMAIL_PASS
    }
		// host: 'smtpout.secureserver.net',
		// secure: true,
		// auth: {
		// 	user: 'user@user.com',
		// 	pass: config.SMTP_PASS
		// }
	}));

	var mailOptions = {
		from: 'Accounts <brianvanko@gmail.com>',
		to: email,
		subject: 'Buy Now Club Account Verification',
		html: getHtml(token)
	};

	transporter.sendMail(mailOptions, function (err, info) {
		if (err) return res.status(500, err);

		console.log('email sent ', info.response);
	})
}

exports.handler = function (req, res) {
	console.log('token from email verification handler: ' + req.query.token)
	var token = req.query.token;

	console.log('from decode handler: ' + token);

	var payload = jwt.decode(token, config.EMAIL_SECRET);

	console.log('from payload handler: ' + payload);

	var email = payload.sub;

	if (!email) return handleError(res);

	User.findOne({
		email: email
	}, function (err, foundUser) {
		if (err) return res.status(500);

		if (!foundUser) return handleError(res);

		if (!foundUser.active)
			foundUser.active = true;

		foundUser.save(function (err) {
			if (err) return res.status(500);

			return res.redirect(config.APP_URL);
		})
	})
}

function getHtml(token) {
	var path = './views/emailVerification.html';
	var html = fs.readFileSync(path, encoding = 'utf8');

	var template = _.template(html);

	console.log('email template token: ' + token);

	
	console.log('model.verifyUrl: ' + model.verifyUrl)

	return template(model);
}

function handleError(res) {
	return res.status(401).send({
		message: 'Authentication failed, unable to verify email'
	});
}


_.templateSettings = {
	interpolate: /\{\{(.+?)\}\}/g
};