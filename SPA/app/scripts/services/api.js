'use strict';

/**
 * api initializer factory
 */

angular.module('spaApp').factory('api', function ($http, $cookieStore,$rootScope) {
  var hasBeenConfigured = false;
  return {  	
    init: function (token) {
      // this is the token of the bank
      $http.defaults.headers.common['X-BANK-TOKEN'] = 1;
      $http.defaults.headers.common['X-AUTH-TOKEN'] = token || $cookieStore.get('token');
    },
    config: function(){
    	$http.get('spa.properties').then(function (response) {
        	$rootScope.restAPIBaseUrl = response.data.restAPBaseIUrl;
      	});     	
    }
  };
});