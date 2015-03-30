;// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller("SettingsController", function($scope, $ionicLoading, GeoService, getMoviesService) {

        var d = new Date();
        var n = d.getTimezoneOffset();
        var adate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        var lat, lng, zip;

        $scope.viewdate = adate;
        $scope.viewzip = "11111";
        $scope.viewmiles = "10";
        $scope.viewbegintime = "";
        $scope.viewendtime = "";
        $scope.viewLat = $scope.viewLon = "";
        $scope.viewstartsWith = "";

        $scope.btnSubmit = function() {
            var o = {
                viewDate:        $scope.viewdate,
                viewZip:         $scope.viewzip,
                viewmiles:       $scope.viewmiles,
                viewbegintime:   $scope.viewbegintime,
                viewendtime:     $scope.viewendtime,
                titlestartswith: $scope.viewstartsWith,
                viewLat:         $scope.viewLat,
                viewLon:         $scope.viewLon

            };

            $ionicLoading.show({template: "Loading...."});

            getMoviesService.getMovies(o)
                .success(function(data, status, headers, config) {
                    console.log('here');
                    $ionicLoading.hide();
                 })
                .error(function(data, status, headers, config) {
                    console.log('here');
                    $ionicLoading.hide();
                });

        };

        GeoService.getLocation()
            .then(
                function(position) {
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;
                    GeoService.reverseGeocode(lat, lng)
                        .then(
                            function (locString) {
                                console.log(locString);
                                $scope.viewzip = locString;

                            },
                            function (error) {
                                console.log(error);
                            })

                },
                function(error) {
                    console.log(error);
                    zip = "10522";
                }
            );
    })

    .factory('GeoService', function ($q) {
        return {
            getLocation: function () {
                var q = $q.defer();
                var geoOptions = {enableHighAccuracy: false, timeout: 300000, maximumAge: 0};

                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        q.resolve(position);
                    },
                    function (error) {
                        q.reject(error);
                    }
                    , geoOptions
                );

                return q.promise;
            },
            reverseGeocode: function (lat, lng) {

                var q = $q.defer();

                var geocoder = new google.maps.Geocoder();

                geocoder.geocode({
                        'latLng': new google.maps.LatLng(lat, lng)
                    },
                    function (geoResults, status) {

                        var zip;

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
                            q.resolve(zip);

                        } //end if geocoder ok
                    } //end function result,status
                ); //end geocode

                return q.promise;
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
                        params: obj,
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
    ]);

