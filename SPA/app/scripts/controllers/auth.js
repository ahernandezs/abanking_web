'use strict';

/**
 * login controller
 * inject a login function in the scope
 */
angular.module('spaApp')
.controller('LoginCtrl', ['$scope', '$http', '$location', 'api', '$rootScope', function ($scope,$http,$location, api, $rootScope) {
  /**
   * the login function connect the Rest-API: if the response status is OK, redirect to route "accounts",
   * else put an error message in the scope
   */
  $scope.login=function(){
    $http({
      url: $scope.restAPIBaseUrl+'/login',
      method: 'POST',
      data: JSON.stringify({'username':$scope.username, 'password':$scope.password,'access_media': 'SPA'})
    }).
      success(function(data, status, headers) {
      //get the session token from the response and store it in rootScope
      var token = headers('X-AUTH-TOKEN');

      $rootScope.session_token = token;
      $rootScope.last_access_date = data.last_access_date;
      $rootScope.last_access_media = data.last_access_media;

      api.init();

      $scope.initPubNub();

      $location.path( '/accounts' );
    }).
      error(function(data, status) {
      //put an error message in the scope
      $scope.errorMessage = data;
      $scope.status = status;
    });

  };

  $scope.logout = function() {
    $http({
      url: $scope.restAPIBaseUrl+'/logout',
      method: 'GET'
    }).
      success(function(data, status, headers) {
      // removes token in the rootScope
      $scope.message = 'logout successful';
      $scope.status = status;
      $rootScope.session_token = null;
      $location.path( '/login' );
    }).
      error(function(data, status) {
      //put an error message in the scope
      $scope.errorMessage = 'logout failed';
      $scope.status = status;
      $rootScope.session_token = null;
      $location.path( '/login' );
    });
  }
}]);


