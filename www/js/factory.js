var app = angular.app('MovieApp')
.factory('$localstorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}])

.factory('GeoService', function ($q) {
    console.log("geoservice factory" );
    function _getLocation() {

        var q = $q.defer();

        var geoOptions = {enableHighAccuracy: false, timeout: 3000, maximumAge: 0};

        console.log("getlocation");

        navigator.geolocation.getCurrentPosition(
            function (position) {
                console.log("getlocation success: " + position);
                q.resolve(position);
            },
            function (error) {
                console.log("getlocation error: " + error);
                q.reject(error);
            }
            , geoOptions
        );

        return q.promise;
    }

    function _reverseGeocode(position) {

        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        var q = $q.defer();

        var geocoder = new google.maps.Geocoder();
        console.log("reverseGeocdoe:" + position);

        geocoder.geocode({
                'latLng': new google.maps.LatLng(lat, lng)
            },
            function (geoResults, status) {

                var zip = "99999";

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

                            zip = aAddrCompo.short_name;
                            //$("#viewzip").val(zip);

                            break;

                        }

                    } //end for loop over geoResults

                    console.log('Reverse', zip);
                    //$scope.$apply(function() {
                    //    $scope.viewzip = zip;

                    //});
                    q.resolve(zip);

                } //end if geocoder ok

                //return q.promise;

            } //end function result,status
        ); //end geocode

        return q.promise;
    }

    return {
        reverseGeo: _reverseGeocode,

        getZip: function () {

            console.log("factory getzip");

            var aprom1 = _getLocation();

            var aprom2 = aprom1.then(_reverseGeocode);


            return aprom2;
            //.then(function(xxx) {
            //     console.log("getlocation then sucess: " + xxx);
            //     return xxx;
            // })
            //.catch(function(reason) {
            //        console.log("getlocation error: " + reason);
            //    });
            //.finally(function(xxx) {
            //    console.log("getlocation finally: " + xxx);
            //    return xxx;
            //})
        }
    }
})
.factory("getMoviesService", ['$q', '$http',
        function($q, $http) {

            //var mtURL = "http://" + window.location.host + "/api/values";
            var mtURL = "http://emptywebapiazure.azurewebsites.net/api/values?callback=JSON_CALLBACK";

            return {

                getMovies: function (obj) {
                    return $http.jsonp(mtURL,  {
                        method: "GET",
                        //data: obj,
                        params: obj
                        //transformRequest: function(data, headersGetter) {
                        //    console.log("here");
                        //},
                        //transformResponse: function(data, headersGetter) {
                        //    console.log('here');
                        //}
                    });
                    //.success(function(data, status, headers, config) {
                    //        console.log('here');
                    //})
                    //.error(function(data, status, headers, config) {
                    //        console.log('here');
                    //});
                }
            }
        }
    ]);/**
 * Created by ira on 4/5/2015.
 */
