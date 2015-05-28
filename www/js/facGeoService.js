(function () {

    angular
        .module('MovieApp')
        .factory('GeoService', geoFunctions);

    geoFunctions.$inject = ['$q', '$localstorage'];

    function geoFunctions($q, $localstorage) {

        console.log("geoservice factory");

        var settingsObj = _init();

        return {
            getZip            : getZipFn,
            getPosition       : getPositionFn,
            getZipFromPosition: getZipFromPositionFn
        };

        function getZipFn() {

            console.log("factory getzip");

            var aprom1 = _getLocation();                //returns promise with tsPos: lat, lon
            var aprom2 = aprom1.then(_reverseGeocode);  //returns settingsObj

            return aprom2;

        }

        function getPositionFn() {

            console.log("factory getPosition");

            var aprom1 = _getLocation();

            return aprom1;

        }

        function getZipFromPositionFn(position) {

            console.log("factory getzipfromposotion");

            var aprom1 = _reverseGeocode(position);

            return aprom1;

        }

        function _init() {

            var settings = $localstorage.getObject("settings");
            if (settings != undefined) {
                return settings;
            }

            var d     = new Date();
            var n     = d.getTimezoneOffset();
            var adate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

            return {

                viewDateChar  : "today",
                viewdate      : adate,
                viewzip       : "99999",
                viewmiles     : "10",
                viewbegintime : d.getHours(),
                viewendtime   : "",
                viewstartsWith: "",
                viewLat       : "",
                viewLon       : "",
                viewTimeSpan  : "60",
                viewCacheTime : "4"
            };

        }

        function _getLocation() {

            console.log("getlocation");

            var tsPos = $localstorage.getObject("tsLatLon");
            if (tsPos != undefined) {
                return $q.when(tsPos);
            }

            //if we recompute lat, long we will have to recompute zip
            $localstorage.deleteObject("tsZip");

            var q = $q.defer();
            var geoOptions = {enableHighAccuracy: false, timeout: 3000, maximumAge: 0};

            navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);

            return q.promise;

            function geoSuccess(position) {

                console.log("getlocation success: " + position);

                //note: google canary and firefor do not stringify position object, but regular chrome does
                //so, to be careful, create my own object
                var tsPos = {ts: Date.now(), tsLat: position.coords.latitude, tsLon: position.coords.longitude};

                //$localstorage.setObject("tsLatLon", tsPos);
                $localstorage.setObject("tsLatLon", position.coords);

                settingsObj.viewLat = position.coords.latitude;
                settingsObj.viewLon = position.coords.longitude;

                q.resolve(tsPos);

            }

            function geoError(error) {

                console.log("getlocation error: " + error);
                q.reject(error);
            }
        }

        function _reverseGeocode(tsPos) {

            var tsZip = $localstorage.getObject("tsZip");

            if (tsZip != undefined) {

                settingsObj.viewzip = tsZip.tsZip;
                $localstorage.setObject("settings", settingsObj);

                return $q.when(settingsObj);
            }

            var lat = tsPos.tsLat;
            var lon = tsPos.tsLon;

            var q = $q.defer();

            console.log("reverseGeocode:" + lat + ", " + lon);
            $localstorage.setObject('settings', settingsObj);

            var geocoder = new google.maps.Geocoder();
            var geoReq = {'latLng': new google.maps.LatLng(lat, lon)};

            geocoder.geocode(geoReq, geoResults);

            return q.promise;


            function geoResults(geoResults, status) {

                var zip = "66666";

                if (status != google.maps.GeocoderStatus.OK) {

                    console.log('reverse fail', geoResults, status);
                    q.reject(geoResults);
                }
                else {

                    console.log('Reverse', geoResults);

                    for (var i = 0; i < geoResults.length; i++) {

                        var ageoResult = null;

                        for (var j = 0; j < geoResults[i].types.length; j++) {

                            if (geoResults[i].types[j] == "postal_code") {
                                ageoResult = geoResults[i];
                                break;
                            } //end for loop over a georesult type array
                        }

                        if (ageoResult == null) continue;

                        for (var k = 0; k < ageoResult.address_components.length; k++) {

                            var aAddrCompo = null;

                            for (var l = 0; l < ageoResult.address_components[k].types.length; l++) {

                                if (ageoResult.address_components[k].types[l] == "postal_code") {
                                    aAddrCompo = ageoResult.address_components[k];
                                    break;
                                }
                            } //end for loop over a georesult type array

                            if (aAddrCompo == null) continue;

                            var xx = $localstorage.getObject("settings");
                            settingsObj.viewzip = zip = aAddrCompo.short_name;
                            $localstorage.setObject("settings", settingsObj);

                            break;

                        }

                    } //end for loop over geoResults

                    console.log('Reverse', zip);

                    //var tsZip = {ts: Date.now(), tsZip: zip};
                    //$localstorage.setObject("tsZip", tsZip);
                    $localstorage.setObject("tsZip", zip);

                    q.resolve(settingsObj);


                } //end if geocoder ok

                //return q.promise;

            } //end function result,status
        }
    }

})();

