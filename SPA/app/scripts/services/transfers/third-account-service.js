'use strict';

angular.module('spaApp')
  .service('thirdAccountService', ['$http','$rootScope',function ($http, $rootScope) {
	this.getThirdAcounts = function(){
		return $http({
				url: $rootScope.restAPIBaseUrl+'/externalaccounts',
				method: 'GET',
				headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	},

	this.setBeneficiary = function(name, clabe, amount, email, phone){
		return $http({
				url: $rootScope.restAPIBaseUrl+'/externalaccounts',
				method: 'POST',
				data: JSON.stringify({
					'name':name,
					'clabe':clabe,
					'amount':amount,
					'email':email,
					'phone':phone
				})
				//,headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	},

	this.deleteThirdAccount = function(thirdAccountID){
		return $http({
				url: $rootScope.restAPIBaseUrl+'/'+thirdAccountID,
				method: 'DELETE'
				//,headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	},

	this.deleteThirdAccount = function(thirdAccountID){
		return $http({
				url: $rootScope.restAPIBaseUrl+'/'+thirdAccountID,
				method: 'PUT'
				//,headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN']}
		});
	},

  this.thirdAccountPayment = function(data) {
    return $http({
      url: $rootScope.restAPIBaseUrl + '/externalaccounts/' + data.target + '/payments',
      method: 'POST',
      data: JSON.stringify({
					account: data.origin,
					amount: parseFloat(data.amount),
          description: 'Transferencia terceros',
          credential_id: '',
					dynamic_password: data.otp
				})
    });
  },

  this.thirdAccountPaymentVerify = function(data) {
    return $http({
      url: $rootScope.restAPIBaseUrl + '/externalaccounts/' + data.target + '/payments/verify',
      method: 'POST',
      data: JSON.stringify({
					account: data.origin,
					amount: parseFloat(data.amount),
          description: 'Transferencia terceros verificacion'
				})
    });
  }
}]);
