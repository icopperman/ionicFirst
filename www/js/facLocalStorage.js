(function () {

    'use strict';

    angular
        .module('MovieApp')
        .factory('$localstorage', localStoreFns);

    localStoreFns.$inject = ['$window'];

    function localStoreFns($window) {

        console.log("localstorage factory");

        var obj = {
            init        : initSettings,
            set         : setFn,
            get         : getFn,
            setObject   : setObjectFn,
            getObject   : getObjectFn,
            deleteObject: deleteObjectFn
        };

        return obj;

        function initSettings() {

            //var n     = d.getTimezoneOffset();
            var settings = getObjectFn("settings");

            if (settings != undefined) {
                return settings;
            }

            var d1;//  = new Date();
            var d     = new Date();
            var adate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            var d2    = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 0,0);

            if ( d2.getHours() + 3  < 24) {

                d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 0,0);
                d1.setHours(d1.getHours() + 3);

            }

            return {

                viewDateChar  : "today",
                viewdate      : adate,
                viewzip       : "99999",
                viewmiles     : "10",
                //viewbegintime : d.getHours(),
                viewbegintime : d2, //.toTimeString().substr(0, 8),

                viewendtime   : d1,
                viewstartsWith: "",
                viewLat       : "",
                viewLon       : "",
                viewTimeSpan  : "0",
                viewCacheTime : "4"
            };

        }

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

            if ( key == 'settings') {
                var i = 0;
            }
            var tsObj = {ts: Date.now(), objToCache: value};

            $window.localStorage[key] = JSON.stringify(tsObj);
        }

        function getObjectFn(key) {

            var xx = $window.localStorage[key];

            if ( xx == undefined ) return;

            var theObj    = JSON.parse(xx); // || '{}');

            //if ( key == 'settings') return theObj;

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



