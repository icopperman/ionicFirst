(function () {

    'use strict';

    angular
        .module('MovieApp')
        .factory('facSettings', settingsFn);

    settingsFn.$inject = ["refreshCache", "GeoService"];

    function settingsFn(refreshCache, GeoService) {

        console.log("settings factory");

        var settingsObj1 = null;

        return {

            getSettingsObj: getSettingsFn,
            setSettingsObj: setSettingsFn

        };

        function setSettingsFn(asettingObj) {

            console.log("settings factory set, current zip, new zip = " + settingsObj1.viewzip + "," + asettingObj.viewzip);
            //have to be careful here, settingsObj1 = asettingObj does not work
            angular.copy(asettingObj, settingsObj1);

        }

        function getSettingsFn() {

            //var n     = d.getTimezoneOffset();
            //var settings = getObjectFn("settings");

            //if (refreshCache.refresh == true) {
            //
            //    settingsObj1 = null;
            //}
            console.log("settings factory get");

            if (settingsObj1 != null) {
                console.log("settings factory get from cache");
                return settingsObj1;
            }

            var d         = new Date();
            var adate     = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            var startTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 0, 0);
            var endTime   = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 0, 0);

            var endHour = (startTime.getHours() + 3 >= 24) ? 24 :  startTime.getHours() + 3;

            endTime.setHours(endHour);

            var geoZip = "";
            var geoErr = "";

            console.log("settings factory: getting zip from geoservice");

            GeoService.getZip().then(
                function(theLocation) {
                    console.log("settings factory: got zip = " + theLocation.tsZip );
                    geoZip = theLocation.tsZip;

            },
                function(theLocation) {
                    console.log("settings factory: getzip error = " + theLocation.errMsg);
                    geoErr = theLocation.errMsg;

            });

            console.log("settings factory creating new settings");

            settingsObj1 = {

                viewDateChar: "today",
                viewdate: adate,
                viewzip: geoZip,
                viewzipuser: "",
                viewmiles: "10",
                //viewbegintime : d.getHours(),
                viewbegintime: startTime, //.toTimeString().substr(0, 8),

                viewendtime: endTime,
                viewstartsWith: "",
                viewLat: "",
                viewLon: "",
                viewTimeSpan: "0",
                viewCacheTime: "4",
                viewOrientation: 'Ver'
            };

            return settingsObj1;

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

            if (key == 'settings') {
                var i = 0;
            }
            var tsObj = {ts: Date.now(), objToCache: value};

            $window.localStorage[key] = JSON.stringify(tsObj);
        }

        function getObjectFn(key) {

            var xx = $window.localStorage[key];

            if (xx == undefined) return;

            var theObj = JSON.parse(xx); // || '{}');

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




