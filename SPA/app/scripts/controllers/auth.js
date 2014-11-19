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
  if($rootScope.session_token && $location.$$path === '/login') {
    $location.path('/accounts');
  }

  $scope.buttonStatus = function(text, status) {
    $scope.loginButtonStatus = {
      text: text,
      disabled: status
    }
  };

  $scope.buttonStatus("Entrar", false);

  $scope.login=function(){
    $scope.buttonStatus("Entrando ...", true);

    $http({
      url: $scope.restAPIBaseUrl+'/login',
      method: 'POST',
      data: JSON.stringify({'user_login':$scope.username, 'password':$scope.password,'client_application_id': 'SPA'})
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
      $scope.errorMessage = data.message;
      $scope.status = status;
      $scope.buttonStatus("Entrar", false);
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
      //delete all the rootScope attributes
      delete $rootScope.thirdAccounts
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


