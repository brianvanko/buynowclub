var bodyParser = require('body-parser'); 	
var Item       = require('../models/item');
var itemService = require('../services/itemService.js');

module.exports = function(app, express) {
	app.get('/api/items', itemService.getAll);
	app.post('/api/items', itemService.createItem);

	app.get('/api/items/:item_id', itemService.findItem);
	app.put('/api/items/:item_id', itemService.editItem);
	app.delete('/api/items/:item_id', itemService.deleteItem);

	app.get('/api/category/:name', itemService.getItemsByCategory);


	// var itemRouter = express.Router();

	// itemRouter.route('/items/')
	// 	.get(itemService.getAll)
	// 	.post(itemService.createItem);

	// itemRouter.route('/items/:item_id')
	// 	.get(itemService.findItem)
	// 	.put(itemService.editItem)
	// 	.delete(itemService.deleteItem);

	// itemRouter.route('/category/:name') 
	// 	.get(itemService.getItemsByCategory);

	// return itemRouter;
};