var express = require('express'),
	port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
 	mongoose = require('mongoose'),
 	jwt = require('jwt-simple'),
 	passport = require('passport'),
    morgan = require('morgan'),
    config = require('./config'),
 	app = express(),
 	userRoutes,
 	apiRoutes;

////// CONFIG //////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

////// CORS //////
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

	next();
});

////// CONNECT TO DB //////
mongoose.connect(config.DB_URL);

////// ROUTES //////
itemRoutes = require('./item/routes/item.routes')(app, express);
userRoutes = require('./user/routes/user.routes')(app, express);


app.use('/items', itemRoutes);

////// CREATE SERVER //////
var server = app.listen(port, function () {
	console.log('api listening on ', server.address().port);
	//require('./document')(app._router.stack, 'express');
});