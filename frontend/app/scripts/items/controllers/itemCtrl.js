'use strict';

angular.module("BuyNowClub")

.controller("ItemCtrl", function($http, $filter, $rootScope, $location, API_URL, Item, $stateParams, User) {

	var vm = this;
	vm.categoryFilter = '';

	vm.fb_share = function(item){
		
		// FB.ui({
		//   method: 'feed',
		//   name: item.name,
		//   caption: 'New on Buy Now Club',
		//   description: item.description,
		//   picture: "https://buynowclub.herokuapp.com/images/thumb/" + item.thumb,
		//   link: 'https://buynowclub.herokuapp.com/#/items?id=' + itemId
		  
		// }, function(response){});
	}


	vm.saveToStash = function(itemId) {
		console.log('clicked save to stash')
		User.saveToStash($rootScope.currentUser._id, itemId)
		.success(function(data, status, headers, config) {
    		$rootScope.currentUser.favorites.push(data.itemId);
		  })
	}

	vm.filterCategory = function(searchReq) {
		console.log('cat searchReq: ' + searchReq);
		vm.categoryFilter = searchReq;
		
	}

	vm.clearFilter = function() {
		console.log('clearFilter');
		vm.categoryFilter = '';
	}

	vm.categoryFilter = function(searchReq) {
		console.log('searchReq: ' + searchReq, vm.items);
		//vm.searchText = searchReq;

		//vm.items = vm.items | filter: {{categories:searchReq}};
	}
	
	vm.deleteItem = function(id) {
		console.log('deleting: ' + id)

		Item.delete(id)
			.success(function(data) {
				console.log('successfully deleted item')
				$http.get(API_URL + 'items')
					.success(function(data) {
						vm.items = data;
					});

		});
	};

	vm.onSearch = function () {
		console.log('searching...')
	}

	if ( vm.items ) { return };
		Item.all()
			.success(function(data) {
				console.log('success all')
				vm.items = data;
			});
})

.controller("userFavoritesCtrl", function(Item, API_URL, $rootScope, $state, User) {
	console.log('in user favorites');
	var vm = this;
	var favorites = [];

	function isInArray(value, array) {
	  return array.indexOf(value) > -1;
	}

	Item.all()
		.success(function(items) {
			console.log('success favorites')
			angular.forEach(items, function(item){
				if (isInArray(item._id, $rootScope.currentUser.favorites)){
					favorites.push(item);
				}
			})

			vm.items = favorites;
			console.log('favorites:' + favorites);
		});

	vm.removeFromStash = function(itemId) {
		console.log('clicked remove from stash');
		User.removeFromStash($rootScope.currentUser._id, itemId)
		.success(function(data, status, headers, config) {
			console.log('successfully removed from stash promise');
			var itemPos =  $rootScope.currentUser.favorites.indexOf(itemId);
    		$rootScope.currentUser.favorites.splice(itemPos, 1);
    		$state.go('main');
		  })
	}
})

.controller("itemCategoryController", function(Item, $routeParams, API_URL) {
	console.log('-----------ITEM CATEGORY', $routeParams.category)

	var vm = this;
	Item.filterByCategory($routeParams.category)
		.success(function(data) {
			console.log('success category controller')
			vm.items = data;
		});
})

.controller('itemViewController', function($stateParams, API_URL, Item) {
	console.log('$stateParams.id:' + $stateParams.id)
	var item = this;

	Item.findItem($stateParams.id)
		.success(function(data) {
			console.log('found data')
			item.itemData = data;
		});
})


.controller('itemEditController', function(API_URL, Item, $stateParams, $state) {
	console.log('hit item edit controller: ' + $stateParams.id);
	var item = this;
	item.type = 'edit';

	var id = $stateParams.id;

	Item.findItem(id)
		.success(function(data) {
			console.log('item data found successfull');
			item.itemData = data;
		});

	item.saveItem = function() {
		console.log('saving edited item')
		item.message = '';

		Item.update(id, item.itemData)
			.success(function(data) {
				//item.itemData = {};
				//item.message = data.msg;
				$state.go('adminItems');
			});
	};

})

.controller('itemCreateController', function(API_URL, Item){

	var item = this;
	item.type = 'create';

	item.saveItem = function() {
		Item.create(item.itemData)
			.success(function(data) {
				item.itemData = {};
				item.message = data.msg;
			})
	}
})

