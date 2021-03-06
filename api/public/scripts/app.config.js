'use strict';

angular
  .module('BuyNowClub').config(function ($urlRouterProvider, $stateProvider, $httpProvider, $authProvider, API_URL, $locationProvider) {

  	$urlRouterProvider.otherwise('/');

  	$stateProvider

    //ITEM CATEGORIES
    

  	.state('main', {
  		url: '/',
      controller: 'ItemCtrl',
      controllerAs: 'vm',
  		templateUrl: '/scripts/main/views/main.html'
  	})

    .state('categoryListing', {
      url: '/:categoryName',
      controller: 'itemCategoryController',
      controllerAs: 'vm',
      templateUrl: '/scripts/items/views/category_listing.html', 
      resolve: {
        items: function(Item, $stateParams) {
          return Item.filterByCategory($stateParams.categoryName)
            .then(function(response){
              return response.data;
            })
        }
      }
    })

    .state('categoryListing.subcategoryListing', {
      url: '/:subcategoryName',
      views: {
        '@': {
          templateUrl: '/scripts/items/views/category_listing.html',
           controller: 'itemSubcategoryController',
           controllerAs: 'vm'
        }
      }
    })

    .state('favorites', {
      url: '/favorites',
      controller: 'userFavoritesCtrl',
      controllerAs: 'vm',
      templateUrl: '/scripts/items/views/favorites.html'
    })


    .state('itemDetail', {
      url: '/items/:id',
      controller: 'itemViewController',
      controllerAs: 'item',
      templateUrl: '/scripts/items/views/details.html'
    })

    //DASHBOARD / ITEM MANAGEMENT ROUTES
    .state('adminItems', {
      url: '/admin/items',
      controller: 'ItemCtrl',
      controllerAs: 'vm',
      templateUrl: '/scripts/admin/views/dashboard.html'
    })

    .state('editItem', {
      url: '/admin/items/edit/:id',
      controller: 'itemEditController',
      controllerAs: 'item',
      templateUrl: '/scripts/items/views/edit.html'
    })

    .state('itemCreate', {
      url: '/admin/items/create',
      controller: 'itemCreateController',
      controllerAs: 'item',
      templateUrl: '/scripts/items/views/edit.html'
    })

    //USER AUTHENTICATION
    .state('register', {
      url: '/register',
      templateUrl: '/scripts/users/views/register.html',
      controller: 'RegisterCtrl'
    })

    .state('login', {
      url: '/login',
      templateUrl: '/scripts/users/views/login.html',
      controller: 'LoginCtrl'
    })

    .state('logout', {
      url: '/logout',
      controller: 'LogoutCtrl'
    })

    $authProvider.loginUrl = API_URL + 'login';
    $authProvider.signupUrl = API_URL + 'register';

    $authProvider.google({
      clientId: '1062416984167-jq1ac1ot2qqq59vlhktkqkrlk63otuvo.apps.googleusercontent.com',
      url: API_URL + 'auth/google'
    });

   $authProvider.facebook({
     clientId: '732824336836013',
     url: API_URL + 'auth/facebook'
   })

    $httpProvider.interceptors.push('authInterceptor');

    $locationProvider.html5Mode(true);

    $httpProvider.defaults.useXDomain=true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.cache = true;
  })

//.constant('API_URL', 'http://localhost:3000/') 
.constant('API_URL', 'https://buynowclub.herokuapp.com/')

.run(function ($window, $rootScope) {

  var params = $window.location.search.substring(1);

  if (params && $window.opener && $window.opener.location.origin === $window.location.origin) {
    var pair = params.split('=');
    var code = decodeURIComponent(pair[1]);

    $window.opener.postMessage(code, $window.location.origin);
  }
});