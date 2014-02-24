'use strict';

/**
 * The accounts controller. Gets accounts passing auth parameters
 */
angular.module('spaApp').controller('AccountsCtrl', function ($scope,$http,$location, accountsService) {
  $http({
    url: $scope.restAPIBaseUrl+'/accounts',
    method: 'GET'
  }).
    success(function(data, status, headers) {
    //$scope.accounts = data.accounts;
    accountsService.setAccounts(data.accounts);
  }).
    error(function(data, status) {
    console.log(data, status);
    $location.path( '/login' );
  });
});
