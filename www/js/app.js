(function() {

    angular
        .module('MovieApp', ['ionic','ngCordova'])
        .value('constants',
            {  serviceURL: 'http://emptywebapiazure.azurewebsites.net/api/values?callback=JSON_CALLBACK' })
        .value('refreshCache' , {
            refresh: false
        })



})();


