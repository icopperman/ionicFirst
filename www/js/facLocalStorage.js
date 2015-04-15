/**
 * Created by irc9012 on 4/10/2015.
 */
var appLS = angular.module('MovieApp');

appLS.factory('$localstorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },

        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },

        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },

        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },

        deleteObject: function (key) {
            $window.localStorage.removeItem(key);
        }


    }

}
]);

