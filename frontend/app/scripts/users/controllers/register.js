'use strict';

angular.module('BuyNowClub').controller('RegisterCtrl', function ($scope, alert, $auth) {
	$scope.submit = function () {

		$auth.signup({email: $scope.email, password: $scope.password})
			.then(function(res) {
				alert('success', 'Account Created!', 'Welcome, ' + res.data.user.email +"! Please email activate your account in the next few days.");
				$rootScope.currentUser = res.data.user;
			})
			.catch(function(err){
				alert('warning', 'Oops!', 'Could not register');
			});
	 };
});