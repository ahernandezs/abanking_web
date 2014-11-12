'use strict';

angular.module('spaApp')
  .service('transferService', ['$http','$rootScope',function ($http, $rootScope) {
	this.transfer = function(accountIdSource, transferInformation){
		return $http({
				url: $rootScope.restAPIBaseUrl+'/accounts/'+accountIdSource+'/transactions',
				data: JSON.stringify(transferInformation),
				method: 'POST',
				headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	}
}]);