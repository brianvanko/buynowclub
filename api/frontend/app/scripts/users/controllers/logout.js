'use strict';

angular.module('BuyNowClub')
  .controller('LogoutCtrl', function ($auth, $state) {
    $auth.logout();
    $state.go('main');
  });
