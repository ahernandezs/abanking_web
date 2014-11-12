'use strict'

app.run(['$rootScope', '$timeout', 'PubNub', 'accountsProvider', function ($rootScope, $timeout, PubNub, accountsProvider) {

    //conectando a PubNub
    var joinPubNub = function () {
        console.log('joining PubNub...');

        PubNub.init({
            subscribe_key: $rootScope.subscribeKey,
            publish_key: $rootScope.subscribeKey
        });
    }

    //subscribing to channel
    var suscribePubNub = function (channel) {
        $rootScope.pubNubChannel = channel;
        PubNub.ngSubscribe({
            channel: $rootScope.pubNubChannel
        });
        console.log('subscribed to ' + $rootScope.pubNubChannel);
   
        //making callback
        $rootScope.$on(PubNub.ngMsgEv($rootScope.pubNubChannel), function (event, payload) {
            var messageType = payload.message.messageType;
            console.log('Payload =>', payload);
            if (messageType == 'transaction') {
               accountsProvider.addNewTransaction(payload.message.user, payload.message.transaction, payload.message.account);
            }
            if (messageType == 'online') {
              $rootScope.$broadcast('pubnubMessageReceived', payload.message); 
              //if(payload.message.status === 'ACCEPTED') {
              //  $rootScope.$broadcast('pubnubMessageReceived', payload.message); 

              //  //$timeout.cancel($rootScope.onlineTransaction);
              //  //console.log("Try to broadcast");
              //} else {
              //  console.log("Operation was rejected");
              //}
            }

        });
    }

    $rootScope.initPubNub = function () {
        joinPubNub();

        //change channel to X-AUTH-TOKEN
        //suscribePubNub('my_channel_anzen666_common');
        suscribePubNub($rootScope.session_token);
        console.log("Channel => " + $rootScope.session_token);
    }

    if($rootScope.session_token) {
      $rootScope.initPubNub();
    }
}]);
