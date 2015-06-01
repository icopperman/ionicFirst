(function() {

    angular
        .module('MovieApp', ['ionic'])
        .value('constants',
            {  serviceURL: 'http://emptywebapiazure.azurewebsites.net/api/values?callback=JSON_CALLBACK' })

})();


