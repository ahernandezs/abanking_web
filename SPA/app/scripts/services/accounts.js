'use strict';

/**
 * api initializer factory
 */

angular.module('spaApp').factory('accountsService', function ($rootScope) {

    return {
        setAccounts: function (accounts) {
            $rootScope.accounts = accounts;
        },
        getAccountIndex: function (account) {
            for (var i = 0; i < $rootScope.accounts.length; i++) {
                if ($rootScope.accounts[i]._account_id == account.accountID) {
                    return i;
                }
            }
            return -1;
        },
        getAccounts: function () {
            return $rootScope.accounts;
        },
        addNewTransaction: function (user, transaction, account) {

            var newbalance = account.balance;
/*
            console.log('PAYLOAD');
            console.log('user > ' + user.bankID);
            console.log('transactionID > ' + transaction.transactionID);
            console.log('balance > ' + newbalance);
*/

            //alert("Usando SERVICE\nCuenta : " + accountName + "\nBalance actual : " + balance + "\nNuevo Balance : " + newbalance);

            var index = this.getAccountIndex(account);
            if (index > -1) {
                $rootScope.$apply(function () {
                    $rootScope.accounts[index].balance.current = newbalance;
                });
            }
        }
    };
});