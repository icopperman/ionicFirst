(function () {

    'use strict';

    angular
        .module('MovieApp')
        .factory('$localstorage', ['$window', localStoreFns]);

    function localStoreFns($window) {

        var obj = {
            set: setFn,
            get: getFn,
            setObject: setObjectFn,
            getObject: getObjectFn,
            deleteObject: deleteObjectFn
        };

        return obj;

        function setFn(key, value) {
            $window.localStorage[key] = value;
        }

        function getFn(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        }

        function setObjectFn(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        }

        function getObjectFn(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }

        function deleteObjectFn(key) {
            $window.localStorage.removeItem(key);
        }

    }

})();



