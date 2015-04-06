angular.module('MovieApp', ['ionic'])

    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider, $httpProvider) {

        $httpProvider.interceptors.push(function($rootScope, $q) {
            return {
                request: function(config) {
                    console.log("request interceptor:" + config.url);
                    $rootScope.$broadcast('loading:show');
                    return config;

                },
                requestError: function(rejection) {
                    console.log("requesterror interceptor:" + rejection);
                    return $q.reject(rejection);
                },
                response: function(response) {
                    console.log("response interceptor:" + response.config.url /*+ "," + response.data*/ );
                    $rootScope.$broadcast('loading:hide');
                    return response;
                },
                responseError: function(rejection) {
                    console.log("response error interceptor:" + rejection);
                    return $q.reject(rejection);
                }

            }
        });

        $compileProvider.debugInfoEnabled(true);
        //ionic.Platform.setPlatform('android');
        $ionicConfigProvider.views.transition('none');

        //$ionicConfigProvider.navBar.alignTitle('left');
        //$ionicConfigProvider.navBar.positionPrimaryButtons('right');
        //$ionicConfigProvider.navBar.positionSecondaryButtons('right');

        //$ionicConfigProvider.setPlatformConfig('win32', {
        //    views: { transition: 'win32-transition'},
        //    navBar: { alignTitle: 'right', alignButtons: 'left', backButtonIcon: 'ion-win32-arrow-back', transition: 'win32-nav-bar'},
        //    menus: { transition: 'win32-menu'}
        //});

        $stateProvider
            .state('root1', {
                url: '/root1'
               ,templateUrl: 'templates/root1.html'
               ,controller: 'MovieMainController'
               ,onEnter: function () {
                    console.log("root1 onenter");
               }
               ,onExit: function () {
                    console.log("root1 onexit");
               }
               //,resolve: {
               //             getZip: function (GeoService) {
               //                 return GeoService.getZip()
               //             }
               //         }


            })
            .state('root2', {
                url: '/root2',
                        templateUrl: 'templates/root2.html',
                        controller: 'MovieTimesController1',
                        //resolve: {getMovies: "getMoviesService"},
                        onEnter: function () {
                            console.log("root2 onenter");
                        },
                        onExit: function () {
                            console.log("root2 onexit");
                        }

            });

        $urlRouterProvider.otherwise('/root1');
    })
    .run(function($ionicPlatform, $rootScope, $ionicLoading) {

        $rootScope.$on('loading:show', function() {
            console.log("loading show");
            $ionicLoading.show({template: "Loading..."})
        });

        $rootScope.$on('loading:hide', function() {
            console.log("loading hide");
            $ionicLoading.hide()
        });

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams)
            {
               console.log("here");
            });

        $rootScope.$on('$stateNotFound',
            function(event, unfoundState, fromState, fromParams){
                console.log("here"); // "lazy.state"

            });

        $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams)
            {
                console.log("here");
            });

        $rootScope.$on('$stateChangeError',
            function(event, toState, toParams, fromState, fromParams, error)
            {
               console.log('here');
            });


        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar)
                StatusBar.styleDefault();
            })
    })

    .controller('MainCtrl', function($scope, $ionicPopup, $ionicActionSheet) {
        $scope.defaultPrimaryButtonClick = function() {
            $ionicPopup.show({
                template: '<input type="password" ng-model="data.wifi">',
                title: 'Enter Wi-Fi Password',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive'
                    }
                ]
            });
        };
        $scope.defaultSecondaryButtonClick = function() {
            $ionicActionSheet.show({
                titleText: 'Nav Bar Default Secondary',
                cancelText: 'Cancel Nav Bar Default Secondary'
            });
        };
    })

    .controller("MovieTimesController1", function($scope, $ionicLoading, $ionicPopup,
                                                $ionicActionSheet, GeoService, getMoviesService,
                                                $localstorage    )
    {
         $scope.navTitle = 'Root 2';
         var setingsObj = $localstorage.getObject('settings');
        var i = 0;

        /*     var d = new Date();
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
         */

/*
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

            //$ionicLoading.show({template: "Loading...."});

            getMoviesService.getMovies(o)
                .success(function(data, status, headers, config) {
                    console.log('here');
                    //$ionicLoading.hide();
                })
                .error(function(data, status, headers, config) {
                    console.log('here');
                    //$ionicLoading.hide();
                });

        };
*/

       /* GeoService.getLocation()
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
        );*/
    })

    .controller("MovieMainController", function($scope, $ionicLoading, $ionicPopup, $q,$window,
                                                $ionicActionSheet, GeoService, getMoviesService
                                                , $localstorage        )
    {
        console.log("main controller");
        var d = new Date();
        var n = d.getTimezoneOffset();
        var adate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        var lat, lng, zip;

        $scope.navTitle = 'Root 1';
        //var aZip = GeoService.getZip();
        var settingsObj = {
            viewdate : adate,
        //$scope.viewzip = aZip;
            viewmiles : "10",
            viewbegintime : "",
            viewendtime : "",
            viewLat :"",
            viewLon : "",
            viewstartsWith : ""
        };


        _getLocation();
        //var promise1 = GeoService.getZip();
        //promise1.then(
        //   function(azip) {
        //       $scope.viewzip = azip;
        //   },
        //   function(error) {
        //       $scope.viewzip = "99999";
        //   } );

        function _getLocation() {

            //var q = $q.defer();

            var geoOptions = {enableHighAccuracy: false, timeout: 3000, maximumAge: 0};

            console.log("getlocation");

            $window.navigator.geolocation.getCurrentPosition(
                function (position) {
                    console.log("getlocation success: " + position);
                    var apromise = GeoService.reverseGeo(position);
                    apromise.then(function(azip) {
                        settingsObj.viewzip = azip;
                        $scope.viewzip = azip;
                        $localstorage.setObject('settings', settingsObj);
                    }, function(error) {
                        console.log('here');
                    });


              //      q.resolve(position);
                },
                function (error) {
                    console.log("getlocation error: " + error);
                //    q.reject(error);
                }
                , geoOptions
            );

            //return q.promise;
        }




    })
   /*     GeoService.getLocation()
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
        );*/

/*        $scope.btnSubmit = function() {
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

            //$ionicLoading.show({template: "Loading...."});

            getMoviesService.getMovies(o)
                .success(function(data, status, headers, config) {
                    console.log('here');
                    //$ionicLoading.hide();
                 })
                .error(function(data, status, headers, config) {
                    console.log('here');
                    //$ionicLoading.hide();
                });

        };*/



