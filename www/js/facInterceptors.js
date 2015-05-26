(function () {

    'use strict';

    angular
        .module('MovieApp')
        .factory('myinterceptors', interceptorFn);

    function interceptorFn($rootScope, $q) {

        return {

            request: requestFn,
            requestError: requestErrorFn,
            response: responseFn,
            responsError: responseErrorFn
        };

        function requestFn(config) {
            console.log("request interceptor:" + config.url);
            $rootScope.$broadcast('loading:show');
            return config;
        }

        function requestErrorFn(rejection) {
            console.log("requesterror interceptor:" + rejection);
            return $q.reject(rejection);
        }

        function responseFn(response) {
            console.log("response interceptor:" + response.config.url /*+ "," + response.data*/);
            $rootScope.$broadcast('loading:hide');
            return response;
        }

        function responseErrorFn(rejection) {
            console.log("response error interceptor:" + rejection);
            return $q.reject(rejection);
        }

    }

})();

