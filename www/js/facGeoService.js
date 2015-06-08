(function () {

    angular
        .module('MovieApp')
        .factory('GeoService', geoFunctions);

    geoFunctions.$inject = ['$q', '$timeout', '$localstorage'];

    function geoFunctions($q, $timeout, $localstorage) {

        console.log("geoservice factory");

        //var settingsObj = $localstorage.init();
        var theLocation = null;

        return {
            getZip            : getZipFn,
            getPosition       : getPositionFn,
            getZipFromPosition: getZipFromPositionFn
        };

        function getZipFn() {

            console.log("factory getzip");

            if ( theLocation != null) {

               return $q.when(theLocation);

            }

            theLocation = {};
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


        function _getLocation() {

            console.log("getlocation");

            // $localstorage.getObject("tsLatLon");
            if ( theLocation != undefined) {

                if (theLocation.hasOwnProperty('tsPos') == true) {
                    return $q.when(theLocation.tsPos);
                }
            }

            //if we recompute lat, long we will have to recompute zip
            //$localstorage.deleteObject("tsZip");

            var q = $q.defer();
            var geoOptions = {enableHighAccuracy: false, timeout: 3000, maximumAge: 0};

            navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);

            var to = $timeout(geoLocateTO, 4000);

            return q.promise;

            function geoLocateTO()
            {
                console.log("geoLocate timeout");
                //q.reject("geoLocate timeout");
                theLocation.status = "error";
                theLocation.errMsg = "geoLocate timeout";
                q.resolve(theLocation);
            }

            function geoSuccess(position) {

                console.log("getlocation success: " + position);

                //note: google canary and firefor do not stringify position object, but regular chrome does
                //so, to be careful, create my own object
                var tsPos = { tsLat: position.coords.latitude, tsLon: position.coords.longitude};

                theLocation = {};
                theLocation.tsPos = tsPos;

                //$localstorage.setObject("tsLatLon", tsPos);
                //$localstorage.setObject("tsLatLon", position.coords);

                //settingsObj.viewLat = position.coords.latitude;
                //settingsObj.viewLon = position.coords.longitude;

                $timeout.cancel(to);
                q.resolve(tsPos);

            }

            function geoError(error) {

                console.log("getlocation error: " + error);
                $timeout.cancel(to);
                //q.reject(error);
                theLocation.status = "error";
                theLocation.errMsg = "geoLocate error:" + error;
                q.resolve(theLocation);
            }
        }

        function _reverseGeocode(tsPos) {

            var tsZip = theLocation.tsZip;//.getObject("tsZip");

            if (tsZip != undefined) {

                //settingsObj.viewzip = tsZip;
                //$localstorage.setObject("settings", settingsObj);

                return $q.when(theLocation);
            }

            if ( theLocation.status == 'error') {

                return $q.when(theLocation);
            }

            var lat = theLocation.tsPos.tsLat;
            var lon = theLocation.tsPos.tsLon;

            var q = $q.defer();

            console.log("reverseGeocode:" + lat + ", " + lon);
            //$localstorage.setObject('settings', settingsObj);

            var geocoder = new google.maps.Geocoder();
            var geoReq = {'latLng': new google.maps.LatLng(lat, lon)};

            geocoder.geocode(geoReq, geoResults);

            return q.promise;

            function geoResults(geoResults, status) {

                var zip = "66666";

                if (status != google.maps.GeocoderStatus.OK) {

                    console.log('reverse fail', geoResults, status);
                    q.reject(geoResults);
                    theLocation.status = "error";
                    theLocation.errMsg = "reverse geocode error: " + status;
                    q.resolve(theLocation);
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

                            zip = aAddrCompo.short_name;
                            //var xx = $localstorage.getObject("settings");
                            //settingsObj.viewzip =
                            //$localstorage.setObject("settings", settingsObj);
                            theLocation.tsZip = zip;

                            break;

                        }

                    } //end for loop over geoResults

                    console.log('Reverse', zip);

                    //var tsZip = {ts: Date.now(), tsZip: zip};
                    //$localstorage.setObject("tsZip", tsZip);
                    //$localstorage.setObject("tsZip", zip);
                    theLocation.tsZip = zip;
                    theLocation.status = "ok";

                    q.resolve(theLocation);


                } //end if geocoder ok

                //return q.promise;

            } //end function result,status
        }
    }

})();

