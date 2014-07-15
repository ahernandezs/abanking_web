'use strict';

angular.module('spaApp')
  .factory('thirdAccountProvider', ['$q','$rootScope','thirdAccountService',function ($q, $rootScope, thirdAccountService) {

    return {
      getThirdAccounts: function () {

        var deferred = $q.defer();

        if(!$rootScope.thirdAccounts) {
          thirdAccountService.getThirdAcounts().success(function(data, status, headers) {
            console.log(data);
            $rootScope.thirdAccounts = data;
            deferred.resolve();
          }).error(function(data, status) {
            return deferred.reject('Error getting third accounts');
          });
        } else {
          deferred.resolve();
        }
      return deferred.promise;
      },

      setBeneficiary: function(name, clabe, amount, email, phone){

        var deferred = $q.defer();
        thirdAccountService.setBeneficiary(name, clabe, amount, email, phone).success(function(data, status, headers){
            deferred.resolve();
        }).error(function(data, status){
            return deferred.reject('Error setting beneficiary');
        })
        return deferred.promise;
      },

      deleteThirdAccount:function (thirdAccountID){
        var deferred = $q.defer();
        thirdAccountService.deleteThirdAccount(thirdAccountID).success(function(data, status, headers){
            deferred.resolve();
        }).error(function(data, status){
            return deferred.reject('Error deleting third account');
        })
        return deferred.promise;
      },

      updateThirdAccount: function(thirdAccountID){
        var deferred = $q.defer();
        thirdAccountService.updateThirdAccount(thirdAccountID).success(function(data, status, headers){
            deferred.resolve();
        }).error(function(data, status){
            return deferred.reject('Error updating third account');
        })
        return deferred.promise;
      }

    }
  }]);
