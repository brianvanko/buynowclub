var bodyParser = require('body-parser'); 	
var Item       = require('../models/item');
var itemService = require('../services/itemService.js');

module.exports = function(app, express) {

	var itemRouter = express.Router();

	// itemRouter.use(function (req, res, next) {
	// 	console.log(req.method, req.url);
	// 	next();
	// });

	itemRouter.route('/')
		.get(itemService.getAll)
		.post(itemService.createItem);

	itemRouter.route('/:item_id')
		.get(itemService.findItem)
		.put(itemService.editItem)
		.delete(itemService.deleteItem);

	itemRouter.route('/category/:name') 
		.get(itemService.getItemsByCategory);

	return itemRouter;
};