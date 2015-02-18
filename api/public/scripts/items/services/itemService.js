'use strict';

angular.module('BuyNowClub').factory('Item', function($http, API_URL) {
	
	var itemFactory = {};

	itemFactory.findItem = function(id) {
		return $http.get(API_URL + 'items/' + id);
	};

	itemFactory.all = function() {
		return $http.get(API_URL + 'items');
	};

	itemFactory.filterByCategory = function(category) {
		return $http.get(API_URL + 'items/category/' + category);
	};

	itemFactory.create = function(itemData) {
		return $http.post(API_URL + 'items/', itemData);
	};

	itemFactory.update = function(id, itemData) {
		return $http.put(API_URL + 'items/' + id, itemData);
	};

	itemFactory.delete = function(id) {
		return $http.delete(API_URL + 'items/' + id);
	};

	return itemFactory;

});