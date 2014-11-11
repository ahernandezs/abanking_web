'use strict';

angular.module('spaApp').controller('TransactionsCtrl', ['$rootScope', '$scope', '$location', '$routeParams', '$timeout', 'accountsProvider','thirdAccountProvider',
                                    function($rootScope, $scope, $location, $routeParams, $timeout, accountsProvider, thirdAccountProvider) {

  try{
    var index = accountsProvider.getAccountIndex($routeParams.accountId);
  }catch(err){
    $location.path( '/accounts' );
  }
  //set the rootScope current account
  $rootScope.currentAccount = $rootScope.accounts[index];

  $scope.selection = "";
  $scope.currentTransaction = undefined;

  //manage pagination
  var paginationBusy = false;
  var prefetchBusy = false;
  var error = false;
  $scope.numPage = 0;  
  $rootScope.transactions = new Array();
  $rootScope.currentAccount.allTransactionsLoaded = false;

  //invoked by the infinite-scroller component
  var numberOfAttemptsForPrefetch = 0; 
  var MAX_NUMBER_OF_ATTEMPTS_FOR_PREFETCH = 2;

  /**
  * reinitialize the user-transactions' load-status
  */
  function reinitLoadStatusToFalse(){
    paginationBusy = false;
    error=false;
    prefetchBusy = false;
  };

  /**
  * return true if the server did not answer yet or if the transaction
  * prefetch asynchronous-task has ended on the server-side. In this last case, we may retry after
  * having waiting a bit
  */
  $scope.clientOrServerBusy = function(){
    return paginationBusy || prefetchBusy;
  }

  /**
  * return true if an error occurrd while getting the user's transactions
  */
  $scope.error = function(){
    return error;
  }

  /**
  * load a page: this function is automatically called by the infinite-scrolling component when user
  * reached the transactions at the page's bottom
  */
  $scope.nextPage = function() {

    if (paginationBusy) return;
    
    paginationBusy = true;
    accountsProvider.getAccountTransactions($routeParams.accountId,$scope.numPage,10).then(
      function(data) {
        //everything went fine: we increment the page number for further request
        $scope.numPage=$scope.numPage+1;
        reinitLoadStatusToFalse();
      },
      function(data) {
        reinitLoadStatusToFalse();
        if(data.status == 404){
          //if the maximum number of attempts has not been reached
          if(numberOfAttemptsForPrefetch < MAX_NUMBER_OF_ATTEMPTS_FOR_PREFETCH){
            numberOfAttemptsForPrefetch++;
            prefetchBusy = true;
            $timeout( function() {
              $scope.nextPage();
            },2000);

          }
          //the maximum number of attempts has been reached, the user will be notified with an error
          else{
            error=true;
          }
        }
        //if another error (different from prefetch) is encountered
        else{
          error=true;
        }
        console.log(data);
      }
    );
  };

  $scope.showTransactionDetail = function(transaction) {
    if($scope.currentTransaction && $scope.currentTransaction._transaction_id === transaction._transaction_id) {
      $scope.selection = undefined;
      $scope.currentTransaction = undefined;
    } else {
      $scope.selection = 'transaction';
      $scope.currentTransaction = transaction;
    }
  }

  $scope.close = function() {
    $scope.selection = undefined;
    $scope.currentTransaction = undefined;
  }

  $scope.showServices = function() {
    $scope.selection = "services";
    $scope.currentTransaction = undefined;
  }

  $scope.showServicePayment = function() {
    $scope.selection = 'servicespayment';
  }

  $scope.showServicePaymentToken = function() {
    $scope.selection = 'servicespaymenttoken';
    $scope.token = undefined;

    $timeout( function() {
      $scope.token = true;
    },2000);
  }

  $scope.applyServicePayment = function() {
    $scope.selection = 'applyservicespayment';
  }

  $scope.selectedCard = null;

  $scope.showCards = function() {
    $scope.selection = "cards";
    $scope.currentTransaction = undefined;

    $scope.card = {
      current : null
    };

    $scope.cards =
      [
        {id: 1, name: "Roberto Rivera López", lastdigits: "**123"},
        {id: 2, name: "Luis López Pérez", lastdigits: "**234"},
        {id: 3, name: "Alejandro García Gómez", lastdigits: "**345"},
        {id: 4, name: "Alicia Rubinstein", lastdigits: "**456"}
    ];

  }

  $scope.updateCard = function() {
    $scope.selection = "cardspayment";
  }

  $scope.showCardPaymentToken = function() {
    $scope.selection = 'cardspaymenttoken';
    $scope.token = undefined;

    $timeout( function() {
      $scope.token = true;
    },2000);
  }

  $scope.applyCardPayment = function() {
    $scope.selection = 'applycardpayment';
  }

  $scope.showTransfers = function() {
    $scope.selection = "transfers";
    $scope.currentTransaction = undefined;

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = dd+'/'+mm+'/'+yyyy;

    $scope.beneficiary = {
      current : null
    };

    $scope.transfer = {
      amount: "",
      date: today,
      sendmail: false,
      message: ""
    };

    thirdAccountProvider.getThirdAccounts().then(
      function(data){
        $scope.thirdAccounts = $rootScope.thirdAccounts;
      }
    );

  }

  $scope.showAddBeneficiary = function(){
    $scope.selection="addbeneficiary";
  }

  $scope.updateTransfer = function() {
    $scope.selection = "transferspayment";
  }    

  $scope.authorize = function(nombre, clabe1, importe, correo, telefono){
     console.log($scope.names);
     $scope.names=nombre;
     $scope.clabe=clabe1;
     $scope.amount=importe;
     $scope.email=correo;
     $scope.number=telefono;
     $scope.selection = "addbeneficiaryconfirm";
  }

  $scope.test = function(){
    console.log ("begin invoke function");
  }
  
  $scope.showTransferPaymentToken = function() {
    $scope.selection = 'transferspaymenttoken';
    $scope.token = undefined;

    $timeout( function() {
      $scope.token = true;
    },2000);
  }

  $scope.applyTransferPayment = function() {
    $scope.selection = 'applytransferpayment';
  }

  $scope.showAddBeneficiary = function() {
    $scope.selection = "addbeneficiary";
    $scope.benef={
      name:'',
      clabe:'',
      amount:'',
      email:'',
      phone:''
    };
  }

  $scope.confirmBeneficiary = function(name, clabe, amount, email, phone) {
    thirdAccountProvider.setBeneficiary(name, clabe, amount, email, phone);
    $scope.selection="addbeneficiaryconfirm";
  }

  $scope.showAddCard = function() {
    $scope.selection = "addcard";
    $scope.benef={
      name:'',
      card:'',
      amount:''
    };
  }

  $scope.confirmCard = function() {
    $scope.selection="addcardconfirm";
  }

  $scope.sorting = {
    column : 'created_at',
    descending : true
  };

  $('.account-menu-buttons.pull-right .btn').click(function(){
    $('.account-menu-buttons.pull-right .btn').removeClass('active');
    $(this).addClass('active');
  });

  $scope.selectSortingClass = function(column){
    return column == $scope.sorting.column && 'glyphicon-chevron-'+($scope.sorting.descending?'down':'up');
  }

  $scope.changeSorting = function(column) {
    var sort = $scope.sorting;
    if (sort.column == column) {
      sort.descending = !sort.descending;
    } else {
      sort.column = column;
      sort.descending = false;
    }
  }

 
}]);
