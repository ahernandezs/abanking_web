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
      $rootScope.restAPIBaseUrl = " http://localhost:8080/Abanking-Core";
      //$rootScope.restAPIBaseUrl = "https://www.demobank.mx/api";
      //$rootScope.restAPIBaseUrl = "https://prototype.mx/api";
      //$rootScope.restAPIBaseUrl = "http://projects.anzen.com.mx:8081/Abanking-Core/rest";
      $rootScope.subscribeKey = "sub-c-74d472c2-894a-11e3-a56b-02ee2ddab7fe";
      $rootScope.publishKey = "pub-c-d49c709c-8d0c-40ed-aaa6-66cbc20683d0";
    }
  };
}]);
