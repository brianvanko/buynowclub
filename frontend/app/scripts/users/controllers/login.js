'use strict';

angular.module('BuyNowClub').controller('LoginCtrl', function ($scope, alert, auth, $auth, $rootScope) {
	$scope.submit = function () {
		console.log('logging in...');
		$auth.login({
			email: $scope.email,
			password: $scope.password
		}).then(function (res) {
			console.log(res.data.user);
	
			$rootScope.currentUser = res.data.user;

			var message = 'Thanks for coming back ' + res.data.user.email + '!';

			if (!res.data.user.active)
				message = 'Just a reminder, please activate your account soon.';

			alert('success', 'Welcome! ', message);
		}).catch(handleError);
	};

	$scope.authenticate = function (provider) {
		$auth.authenticate(provider).then(function (res) {
			alert('success', 'Welcome! ', 'Thanks for coming back ' + res.data.user.displayName + '!');
			$rootScope.currentUser = res.data.user;
		}, handleError);
	}

	function handleError(err) {
		alert('warning', 'Something went wrong...', err.message);
	}
});