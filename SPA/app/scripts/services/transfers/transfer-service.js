'use strict';

angular.module('spaApp')
  .service('transferService', ['$q','$http','$rootScope',function ($q, $http, $rootScope) {
	this.transfer = function(accountIdSource, transferInformation){
		var deferred = $q.defer();
		$http({
				url: $rootScope.restAPIBaseUrl+'/accounts/'+accountIdSource+'/transactions',
				data: JSON.stringify(transferInformation),
				method: 'POST',
				headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		})
		.success(function(data, status, headers) {
            deferred.resolve(data);
          })
		.error(function(data, status) {
            deferred.reject('Error transfering found');
         });
		return deferred.promise;
	}
}]);