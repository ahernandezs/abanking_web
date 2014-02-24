'use strict'

app.run(function ($rootScope, PubNub, accountsService) {
    //conectando a PubNub
    $rootScope.joinPubNub = function () {
        console.log('joining PubNub...');
        PubNub.init({
            subscribe_key: 'sub-c-74d472c2-894a-11e3-a56b-02ee2ddab7fe',
            publish_key: 'pub-c-d49c709c-8d0c-40ed-aaa6-66cbc20683d0'
        });
    }

    //suscribiendo a canal
    $rootScope.suscribePubNub = function (channel) {
        $rootScope.pubNubChannel = channel;
        PubNub.ngSubscribe({
            channel: $rootScope.pubNubChannel
        });
        console.log('subscribed to ' + $rootScope.pubNubChannel);
        alert('PUBNUB activated');
        
        //creando callback
        $rootScope.$on(PubNub.ngMsgEv($rootScope.pubNubChannel), function (event, payload) {
            // payload contains message, channel, env...
            console.log('got a message event:', payload);

            var messageType = payload.message.messageType;

            if(messageType == 'transaction'){
                accountsService.addNewTransaction(payload.message.user, payload.message.transaction, payload.message.account);
            }

        });
    }

    //iniciando
    $rootScope.initPubNub = function () {
        $rootScope.joinPubNub();

        //aqui deberá ir el X-AUTH-TOKEN
        $rootScope.suscribePubNub('my_channel_anzen666_common');
    }

});