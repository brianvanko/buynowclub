var jwt = require('jwt-simple');
var Item = require('../models/item.js');

exports.isAuthorizedFeed = function (req, res) {
	// var token = req.headers.authorization.split(' ')[1];
	// var payload = jwt.decode(token, "shhh..");

	// if (!payload.sub) {
	// 	res.status(401).send({
	// 		message: 'Authentication failed'
	// 	});
	// }

	// if (!req.headers.authorization) {
	// 	return res.status(401).send({
	// 		message: 'You are not authorized'
	// 	});
	// }
	//res.json(resource);
};

exports.createItem = function(req, res){
	var item = new Item();

	item.name = req.body.name;
	item.description = req.body.description;
	item.link = req.body.link;
	item.thumb = req.body.thumb;
	item.lg_img = req.body.lg_img;
	item.categories = req.body.categories;
	item.subcategory = req.body.subcategory;
	item.price = req.body.price;
	item.short_name = req.body.short_name;

	item.save(function (err) {
		if (err) res.send(err);

		res.json({msg: 'item created'});
	});
};

exports.getAll = function(req, res){
	Item.find(function (err, items) {
		if (err) res.send(err);

		res.json(items);
	});
};

exports.findItem = function(req, res){
	Item.findById(req.params.item_id, function (err, item) {
		if (err) res.send(err);

		res.json(item);
	});
};

exports.editItem = function(req, res){
	Item.findById(req.params.item_id, function (err, item) {
		if (err) res.send(err);

		if (req.body.name) item.name = req.body.name;
		if (req.body.description) item.description = req.body.description;
		if (req.body.link) item.link = req.body.link;
		if (req.body.thumb) item.thumb = req.body.thumb;
		if (req.body.lg_img) item.lg_img = req.body.lg_img;
		if (req.body.categories) item.categories = req.body.categories;
		if (req.body.subcategory) item.subcategory = req.body.subcategory;
		if (req.body.price) item.price = req.body.price;
		if (req.body.short_name) item.short_name = req.body.short_name;

		item.save(function (err) {
			if (err) res.send(err);

			res.json({msg: 'Item updated'});
		});
	});	
};

exports.deleteItem = function(req, res){
    Item.remove({
        _id: req.params.item_id
	}, function(err, item) {
		if (err) res.send(err);
        res.json({ msg: 'Successfully deleted' });
	}); 
};

exports.getItemsByCategory = function(req, res){
	console.log('name', req.params.name)
	var cat = String(req.params.name).toUpperCase();
	Item.find({categories: cat}, function (err, items) {
		if (err) res.send(err);
		console.log('items', items)
	 	res.json(items);
	});	
};
