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
.controller("SettingsController", function($scope, Geo) {

        var d = new Date();
        var n = d.getTimezoneOffset();
        var adate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        var lat, lng, zip;

        Geo.getLocation()
            .then(
                function(position) {
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;
                    Geo.reverseGeocode(lat, lng)
                        .then(
                            function (locString) {
                                console.log(locString);
                                zip = locString;
                                $scope.viewzip = zip;
                            },
                            function (error) {
                                console.log(error);
                            })

                },
                function(error) {
                    console.log(error);
                    zip = "10522";
                });

        $scope.viewdate = adate;
        $scope.viewzip = "11111";
        $scope.viewmiles = "10";

    })

    .factory('Geo', function ($q) {
        return {
            getLocation: function () {
                var q = $q.defer();
                var geoOptions = { enableHighAccuracy: false, timeout: 300000, maximumAge: 0 };

                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        q.resolve(position);
                    },
                    function (error)    {
                        q.reject(error);
                    }
                    ,geoOptions
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

                        if (status != google.maps.GeocoderStatus.OK)
                        {
                            console.log('reverse fail', geoResults, status);
                            q.reject(geoResults);
                        }
                        else
                        {
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

        };
    });
