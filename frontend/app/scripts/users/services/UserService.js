'use strict';

angular.module('BuyNowClub').factory('User', function($http, API_URL) {
	
	var userFactory = {};

	userFactory.saveToStash = function(userId, itemId) {
		return $http.put(API_URL + 'users/' + userId + '/items/' + itemId)
	};

	userFactory.removeFromStash = function(userId, itemId) {
		console.log('remove from stash service');
		return $http.delete(API_URL + 'users/' + userId + '/items/' + itemId)
	};

	return userFactory;

});