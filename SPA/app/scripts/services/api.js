'use strict';

/**
 * api initializer factory
 */

angular.module('spaApp').factory('api', ['$http', '$rootScope', function ($http, $rootScope) {
  var hasBeenConfigured = false;
  return {
    init: function (token) {
      // this is the token of the bank
      $http.defaults.headers.common['X-BANK-TOKEN'] = 2;
      $http.defaults.headers.common['X-AUTH-TOKEN'] = token || $rootScope.session_token;

      console.log("Executes init & token = " + $rootScope.session_token);
    },
    config: function(){
      //$rootScope.restAPIBaseUrl = "http://abanking-api.herokuapp.com";
      $rootScope.restAPIBaseUrl = "http://localhost:9001";
      $rootScope.publishKey = "pub-c-90b1707f-26e4-4c7a-bbe4-79e695283d79";
      $rootScope.subscribeKey = "sub-c-439ead5e-8935-11e3-baad-02ee2ddab7fe";
    }
  };
}]);
