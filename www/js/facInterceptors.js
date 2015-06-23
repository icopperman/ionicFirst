(function () {

    'use strict';

    angular
        .module('MovieApp')
        .factory('myinterceptors', interceptorFn);

    interceptorFn.$inject = ['$rootScope', '$q', 'constants'];

    function interceptorFn($rootScope, $q, constants) {

        console.log("interceptor factory");

        return {

            request      : requestFn,
            requestError : requestErrorFn,
            response     : responseFn,
            responseError: responseErrorFn
        };

        function requestFn(config) {

            console.log("request interceptor:" + config.url);

            //only broadcast event if request is to backend (i.e., not for loading templates)
            var mtURL = constants.serviceURL;
            if ( mtURL.substr(0, 10) == config.url.substr(0,10) ) {

                $rootScope.$broadcast('loading:show');

            }

            return config;
        }

        function requestErrorFn(rejection) {
            console.log("requesterror interceptor:" + rejection);
            return $q.reject(rejection);
        }

        function responseFn(response) {
            console.log("response interceptor:" + response.config.url /*+ "," + response.data*/);

            //only broadcast event if request is to backend (i.e., not for loading templates)
            var mtURL = constants.serviceURL;
            if ( mtURL.substr(0, 10) == response.config.url.substr(0,10) ) {

                $rootScope.$broadcast('loading:hide');

            }

            return response;
        }

        function responseErrorFn(rejection) {
            console.log("response error interceptor: " + rejection.statusText);
            return $q.reject(rejection);
        }

    }

})();

