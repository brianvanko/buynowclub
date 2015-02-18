var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
	name: String,
	description: String,
	link: String,
	thumb: String,
	lg_img: String,
	categories: String,
	subcategory: String,
	price: String,
	short_name: String
});

module.exports = mongoose.model('Item', ItemSchema);