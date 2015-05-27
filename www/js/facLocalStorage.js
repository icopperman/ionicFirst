(function () {

    'use strict';

    angular
        .module('MovieApp')
        .factory('$localstorage', localStoreFns);

    localStoreFns.$inject = ['$window'];

    function localStoreFns($window) {

        var obj = {
            set         : setFn,
            get         : getFn,
            setObject   : setObjectFn,
            getObject   : getObjectFn,
            deleteObject: deleteObjectFn
        };

        return obj;

        function setFn(key, value) {
            $window.localStorage[key] = value;
        }

        function getFn(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        }

        function deleteObjectFn(key) {
            $window.localStorage.removeItem(key);
        }

        function setObjectFn(key, value) {

            var tsObj = {ts: Date.now(), theObj: value};

            $window.localStorage[key] = JSON.stringify(value);
        }

        function getObjectFn(key) {

            var theObj    = JSON.parse($window.localStorage[key] || '{}');

            if ( key != 'settings') {

                var cachedObj = _isCached(theObj);

            }

            return cachedObj;

        }

        function _isCached(theObj) {

            //var cacheObj = $localstorage.getObject(cacheName);

            if (theObj.ts == undefined) return;

            var xx       = theObj.ts;
            var prevDate = new Date(xx);
            var currTime = Date.now();
            var diff     = (currTime - prevDate) / ( 1000 * 60 * 60 );

            if (diff < 4) return theObj.theObj;
        }

    }

})();



