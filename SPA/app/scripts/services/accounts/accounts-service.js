'use strict';

/**
 * api initializer factory
 */

angular.module('spaApp')
    .service('accountsService', ['$http','$rootScope', function ($http, $rootScope) {

		this.getAccounts = function () {
            return $http.get($rootScope.restAPIBaseUrl+'/accounts');
        };
        
        this.getAccount = function (accountId,numPage, size) {
        	return $http.get($rootScope.restAPIBaseUrl+'/accounts/'+accountId+'/transactions?page='+numPage+'&size='+size);
        };

}]);
