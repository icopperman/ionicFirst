(function () {

    angular
        .module('MovieApp')
        .factory('GeoService', geoFunctions);

    geoFunctions.$inject = ['$q', '$localstorage', '$http'];

    function geoFunctions($q, $localstorage, $http) {

        console.log("geoservice factory");

        var settingsObj = _init();

        return {
            getZip: getZipFn,
            getMovies: getMoviesFn,
            getPosition: getPositionFn,
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

        function getMoviesFn() {

            var tsMovies = _isCached("tsMovies");
            if (tsMovies != undefined) {
                return $q.when(tsMovies.movies);
            }

            var q = $q.defer();

            var mtURL = "http://emptywebapiazure.azurewebsites.net/api/values?callback=JSON_CALLBACK";
            var xx = settingsObj;

            var config = {
                method: "JSONP"
                , url: mtURL
                , params: xx
                , timeout: 5000
            };

            $http(config).then(
                function (response) {

                    console.log('response from jsonp');

                    var errs = response.data.ErrMessage;
                    var movieTimes = response.data.MovieTimes;
                    var movieTimesIdx = response.data.movieTimesIdx;
                    var theaterNames = response.data.theaterNames.sort();
                    var movieNames = response.data.movieNames.sort();

                    var movieTimesNew = [];

                    for (var i = 0; i < movieTimesIdx.length; i++) {
                        var movieTimeIdx = movieTimesIdx[i];

                        var movieIdx = movieTimeIdx.m;
                        var theaterIdx = movieTimeIdx.t;
                        var showTime = movieTimeIdx.s;

                        var movieName = movieNames[movieIdx].m;
                        var runTime = movieNames[movieIdx].r;
                        var theaterName = theaterNames[theaterIdx];

                        var obj = {
                            cnt: i + 1,
                            time: showTime,
                            theater: theaterName,
                            runtime: runTime,
                            title: movieName
                        };

                        movieTimesNew.push(obj);
                    }

                    response.data.MovieTimesNew = movieTimesNew;

                    var tsMovies = {ts: Date.now(), movies: response.data};
                    //var tsMoviesIdx    = { ts: Date.now(), movieTimesIdx: movieTimesIdx};
                    //var tsMovieNames   = { ts: Date.now(), movieNames: movieNames };
                    var tsTheaterNames = {ts: Date.now(), theaterNames: theaterNames};

                    $localstorage.setObject("tsMovies", tsMovies);
                    //$localstorage.setObject("tsMoviesIdx", tsMoviesIdx);
                    //$localstorage.setObject("tsMovieNames", tsMovieNames);
                    $localstorage.setObject("tsTheaterNames", tsTheaterNames);

                    q.resolve(response.data);
                },

                function (err) {
                    console.log('error response from jsonp');
                    q.reject(err);
                }
            );

            return q.promise;
        }


        function _init() {

            var settings = $localstorage.getObject("settings");
            if (settings.viewdate != undefined) {
                return settings;
            }

            var d = new Date();
            var n = d.getTimezoneOffset();
            var adate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

            return {

                viewDateChar: "today",
                viewdate: adate,
                viewzip: "99999",
                viewmiles: "10",
                viewbegintime: d.getHours(),
                viewendtime: "",
                viewstartsWith: "",
                viewLat: "",
                viewLon: "",
                viewTimeSpan: "60",
                viewCacheTime: "4"
            };

        }

        function _isCached(cacheName) {

            var cacheObj = $localstorage.getObject(cacheName);

            if (cacheObj.ts == undefined) return;

            var xx = cacheObj.ts;
            var prevDate = new Date(xx);
            var currTime = Date.now();
            var diff = (currTime - prevDate) / ( 1000 * 60 * 60 );

            if (diff < 4) return cacheObj;

        }

        function _getLocation() {

            console.log("getlocation");

            var tsPos = _isCached("tsLatLon");
            if (tsPos != undefined) {
                return $q.when(tsPos);
            }

            //if we recompute lat, long we will have to recompute zip
            $localstorage.deleteObject("tsZip");

            var q = $q.defer();
            var geoOptions = {enableHighAccuracy: false, timeout: 3000, maximumAge: 0};

            navigator.geolocation.getCurrentPosition(
                function (position) {

                    console.log("getlocation success: " + position);

                    //note: google canary and firefor do not stringify position object, but regular chrome does
                    //so, to be careful, create my own object
                    var tsPos = {ts: Date.now(), tsLat: position.coords.latitude, tsLon: position.coords.longitude};

                    $localstorage.setObject("tsLatLon", tsPos);
                    settingsObj.viewLat = position.coords.latitude;
                    settingsObj.viewLon = position.coords.longitude;

                    q.resolve(tsPos);

                },
                function (error) {
                    console.log("getlocation error: " + error);
                    q.reject(error);
                }
                , geoOptions
            );

            return q.promise;
        }

        function _reverseGeocode(tsPos) {

            var tsZip = _isCached("tsZip");

            if (tsZip != undefined) {

                settingsObj.viewzip = tsZip.tsZip;
                $localstorage.setObject("settings", settingsObj);

                return $q.when(settingsObj);
            }

            var lat = tsPos.tsLat;
            var lon = tsPos.tsLon;

            var q = $q.defer();

            var geocoder = new google.maps.Geocoder();
            console.log("reverseGeocode:" + lat + ", " + lon);
            $localstorage.setObject('settings', settingsObj);

            geocoder.geocode(
                {
                    'latLng': new google.maps.LatLng(lat, lon)
                },
                function (geoResults, status) {

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
                                //$("#viewzip").val(zip);

                                break;

                            }

                        } //end for loop over geoResults

                        console.log('Reverse', zip);
                        //$scope.$apply(function() {
                        //    $scope.viewzip = zip;

                        //});
                        var tsZip = {ts: Date.now(), tsZip: zip};
                        $localstorage.setObject("tsZip", tsZip);
                        q.resolve(settingsObj);


                    } //end if geocoder ok

                    //return q.promise;

                } //end function result,status
            ); //end geocode

            return q.promise;
        }
    }
    
})();

