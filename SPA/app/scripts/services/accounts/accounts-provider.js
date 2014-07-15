'use strict';

/**
 * api initializer factory
 */

angular.module('spaApp').factory('accountsProvider', ['$rootScope', 'accountsService', '$q', function ($rootScope, accountsService, $q) {

  return {
    getAccountIndex: function (accountId) {
      for (var i = 0; i < $rootScope.accounts.length; i++) {
        if ($rootScope.accounts[i]._account_id == accountId) {
          return i;
        }
      }
      throw new Error("account does not exist");
    },

    getAccounts: function () {
      var deferred = $q.defer();

      if(!$rootScope.accounts) {
        console.log('getting accounts');
        accountsService.getAccounts().success(function(data, status, headers) {
          $rootScope.accounts = data.accounts;
          deferred.resolve();
        }).error(function(data, status) {
          console.log(data, status);
          return deferred.reject("Error getting accounts");
        });
      } else {
        deferred.resolve();
      }

      return deferred.promise;
    },

    getAccountTransactions: function (accountId, numPage, size) {
      var index = this.getAccountIndex(accountId);
      var currentAccount = $rootScope.accounts[index];
      var deferred = $q.defer();
      //we already have all the transactions
      if(currentAccount.allTransactionsLoaded == true){
        deferred.resolve();
      }else{
        //if accounts has undefinied transactions get transactions from API
          console.log('getting transactions for account ' + accountId + ' from page ' + numPage);
          accountsService.getAccount(accountId,numPage, size).success(function(data, status, headers) {
            
            if(data.transactions){
              var items = data.transactions;
              for (var i = 0; i < items.length; i++) {
                $rootScope.transactions.push(items[i]);
              }
              //if it is the last page
              if(items.length < size){
                currentAccount.allTransactionsLoaded=true;
              }
            }//no transaction returned, we are not willing to invoke the service no more?
            else{
              currentAccount.allTransactionsLoaded=true;
            }
            deferred.resolve();
          }).error(function(data, status) {
            console.log(data, status);
            return deferred.reject({"status": status, "mesage": "Error getting transactions"});
          });
      }
      //fill currentAccount with rootScope data

      return deferred.promise;
    },

    addNewTransaction: function (user, transaction, account) {
      var index = this.getAccountIndex(account._account_id);

      if (index < 0) {
        return;
      }
      //if there is no transactions just update account
      if($rootScope.currentAccount && $rootScope.currentAccount._account_id == account._account_id && !$rootScope.accounts[index].transactions){
        $rootScope.$apply(function () {
          $rootScope.accounts[index].balance = account.balance;
        });
      } else
        //update account and add new transaction
        {
          //getting account transactions
          if(!$rootScope.accounts[index].transactions) {
            $rootScope.accounts[index].transactions = [transaction];
          } else {
            //adding new transaction on index 0
            $rootScope.accounts[index].transactions.splice(0,0,transaction)
          }

          $rootScope.$apply(function () {
            $rootScope.accounts[index].balance = account.balance;

            //updating current transaction if necesary
            if($rootScope.currentAccount && $rootScope.currentAccount._account_id === account._account_id){
              $rootScope.currentAccount.balance = account.balance;
            }
          });
        }
    }
  };
}]);
