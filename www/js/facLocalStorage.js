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

            var tsObj = {ts: Date.now(), objToCache: value};

            $window.localStorage[key] = JSON.stringify(tsObj);
        }

        function getObjectFn(key) {

            var xx = $window.localStorage[key];

            if ( xx == undefined ) return;

            var theObj    = JSON.parse(xx); // || '{}');

            if ( key == 'settings') return theObj;

            var cachedObj = _isCached(theObj);

            return cachedObj;

        }

        function _isCached(theObj) {

            //var cacheObj = $localstorage.getObject(cacheName);

            if (theObj == undefined) return;

            var xx       = theObj.ts;
            var prevDate = new Date(xx);
            var currTime = Date.now();
            var diff     = (currTime - prevDate) / ( 1000 * 60 * 60 );

            if (diff < 4) return theObj.objToCache;
        }

    }

})();



