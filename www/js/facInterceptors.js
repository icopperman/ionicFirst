var theappInt = angular.module('MovieApp');

theappInt.factory('myinterceptors', function ($rootScope, $q) {

    return {
        request: function (config) {
            console.log("request interceptor:" + config.url);
            $rootScope.$broadcast('loading:show');
            return config;
        }

        , requestError: function (rejection) {
            console.log("requesterror interceptor:" + rejection);
            return $q.reject(rejection);
        }

        , response: function (response) {
            console.log("response interceptor:" + response.config.url /*+ "," + response.data*/);
            $rootScope.$broadcast('loading:hide');
            return response;
        }

        , responseError: function (rejection) {
            console.log("response error interceptor:" + rejection);
            return $q.reject(rejection);
        }

    }

});
/**
 * Created by ira on 4/9/2015.
 */
