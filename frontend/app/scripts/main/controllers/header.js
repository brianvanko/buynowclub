'use strict';

angular.module('BuyNowClub')
  	.controller('HeaderCtrl', function ($scope, $auth) {
		$scope.isAuthenticated = $auth.isAuthenticated;
	});
