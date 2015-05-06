var theapp = angular.module('MovieApp', ['ionic']);

    theapp.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider,
                      $compileProvider, $httpProvider) {

        $httpProvider.interceptors.push('myinterceptors');

        $compileProvider.debugInfoEnabled(true);
        $ionicConfigProvider.views.transition('none');

        //ionic.Platform.setPlatform('android');
        //$ionicConfigProvider.navBar.alignTitle('left');
        //$ionicConfigProvider.navBar.positionPrimaryButtons('right');
        //$ionicConfigProvider.navBar.positionSecondaryButtons('right');

        //$ionicConfigProvider.setPlatformConfig('win32', {
        //    views: { transition: 'win32-transition'},
        //    navBar: { alignTitle: 'right', alignButtons: 'left', backButtonIcon: 'ion-win32-arrow-back', transition: 'win32-nav-bar'},
        //    menus: { transition: 'win32-menu'}
        //});

        $urlRouterProvider.otherwise('/tplSettings');

        $stateProvider
            .state('tplSettings', {
                url: '/tplSettings'
                , cache: false
                , templateUrl: 'templates/tplSettings.html'
                , controller: 'MovieMainController'
                , onEnter: function () {
                    console.log("tplSettings onenter");
                }
                , onExit: function () {
                    console.log("tplSettings onexit");
                }
                , resolve: {

                    getZip: function (GeoService) {
                        return GeoService.getZip();
                    }
                    //getLatLong: function (GeoService) {
                    //    return GeoService.getPosition()
                    //},
                    //
                    //getZip: function (GeoService, getLatLong) {
                    //    return GeoService.getZipFromPosition(getLatLong.position);
                    //}

                }
            })
            .state('tplMovieTimes', {
                url: '/tplMovieTimes',
                templateUrl: 'templates/tplMovieTimes.html',
                controller: 'MovieTimesController',
                cache: false,
                resolve: {
                    getMovies: function (GeoService) {
                        return GeoService.getSettingsAndMovies();
                    }
                },
                onEnter: function () {
                    console.log("tplMovieTimes onenter");
                },
                onExit: function () {
                    console.log("tplMovieTimes onexit");
                }

            })
            .state('tplMovieTimesHor', {
                url: '/tplMovieTimesHor',
                templateUrl: 'templates/tplMovieTimesHor.html',
                controller: 'MovieTimesControllerHor',
                resolve: {
                    getMovies: function (GeoService) {
                        return GeoService.getSettingsAndMovies();
                    }
                },
                onEnter: function () {
                    console.log("tplMovieTimesHor onenter");
                },
                onExit: function () {
                    console.log("tplMovieTimesHor onexit");
                }

            })
            .state('tplMovieTheaters', {
                url: '/tplMovieTheaters',
                templateUrl: 'templates/tplMovieTheaters.html',
                controller: 'MovieTheaterController',
                //resolve: {
                //    getTheaters: function (GeoService) {
                //        return GeoService.getTheaters();
                //    }
                //},
                onEnter: function () {
                    console.log("tplMovieTheaters onenter");
                },
                onExit: function () {
                    console.log("tplMovieTheaters onexit");
                }

            });


    });

theapp.controller('MovieTheaterController', function($scope, $localstorage ) {

    var xx = $localstorage.getObject("tsTheaters" );
    var theaters = xx.theaters;

    $scope.theaterList = theaters;

    $scope.saveExclusion = function()
    {
        var xx = $scope.theaterList;
        var exclusionList = _.where(xx, { include : false} );

        $localstorage.setObject("tsExcluded", {ts: Date.now(), excluded : exclusionList});
    }


});

theapp.controller('MovieTimesControllerHor', function($scope, $localstorage, getMovies, $ionicScrollDelegate) {

        //var setingsObj = $localstorage.getObject("settings");

        var allMovieTimes = getMovies;
        var rc = allMovieTimes.Status;

        if ( rc == "fail" ) {

            angular.forEach(allMovieTimes.ErrMessage, function(value, key) {
                console.log(key);
            });
            $scope.navTitle = 'Movie Times -- error';
        }
        else {

            var movieData = allMovieTimes.MovieTimesNew;
            //var x = expandPropNames(movieData);
            $scope.moviesAtSpecificTimes = moviesAtSpecificTimes(movieData);

        }

        $scope.navTitle = 'Movie Times';
        $scope.movieCount = allMovieTimes.MovieTimes.length;

        $scope.noMoreItemsAvailable = false;
        $scope.number = 10;
        $scope.items = [];


        $scope.loadMore = function() {
            for(var i=0; i<$scope.number; i++){
                $scope.items.push({
                    id: $scope.items.length});
            }

            if ( $scope.items.length > 99 ) {

                $scope.noMoreItemsAvailable = true;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

        };

        $scope.goToPage= function(){

            $location.url('/event/attendees');
        };
    });

    theapp.controller("MovieTimesController", function ($scope, $state, $localstorage, getMovies) {

        //var setingsObj = $localstorage.getObject("settings");

        var allMovieTimes = getMovies;
        var rc = allMovieTimes.Status;

        $scope.totMovies = 0;
        $scope.totTheaters = 0;
        $scope.totExcludedMovies = 0;
        $scope.totExcludedTheaters = 0;

        if ( rc == "fail" ) {

            angular.forEach(allMovieTimes.ErrMessage, function(value, key) {
                console.log(key);
            });

            $scope.navTitle = 'Movie Times -- error';
        }
        else {

            var movieData = allMovieTimes.MovieTimesNew;
            //var movieData = expandPropNames(x);

            var exList = $localstorage.getObject("tsExcluded");
            var filteredMovieData = [];

            if ( exList.ts == undefined) {

                filteredMovieData = movieData;
            }
            else {

                filteredMovieData =  _.filter(movieData, function(amovie) {

                            var atheater = amovie.theater;

                            var rc = _.find(exList.excluded, function(exTheater) {
                                if ( exTheater.theaterName == atheater) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });

                            return !rc;

                    });

                $scope.totExcludedTheaters = exList.excluded.length;
                $scope.totExcludedMovies = movieData.length - filteredMovieData.length;
            }

            $scope.moviesAtSpecificTimes = moviesAtSpecificTimes(filteredMovieData);

            var theaters = [];

            var moviesByTheater = _.groupBy(filteredMovieData, function(amovie) {

                var atheater = amovie.theater;

                theaters.push({ theaterName: atheater, include: true });

                return atheater;

            });

            var uniqList1 = _.keys(moviesByTheater);
            var uniqList2 = _.uniq(theaters, "theaterName");
            $localstorage.setObject("tsTheaters", {ts: Date.now(), theaters: uniqList2 } );
            $scope.totMovies = movieData.length;
            $scope.totTheaters = uniqList1.length;
        }


        $scope.navTitle = 'Movie Times';
        $scope.movieCount = allMovieTimes.MovieTimes.length;
        $scope.data = { showDelete: false, showReorder: false };

        $scope.showTheaters = function() {
            $state.go("tplMovieTheaters");
        };

        $scope.edit = function(item) {
            console.log('Edit Item: ' + item.keyTime);
        };
        $scope.share = function(item) {
            console.log('Share Item: ' + item.keyTime);
        };

        $scope.moveItem = function(item, fromIndex, toIndex) {
            $scope.moviesAtSpecificTimes.splice(fromIndex, 1);
            $scope.moviesAtSpecificTimes.splice(toIndex, 0, item);
        };

        $scope.onItemDelete = function(item) {
            $scope.moviesAtSpecificTimes.splice($scope.moviesAtSpecificTimes.indexOf(item), 1);
        };

        $scope.toggleGroup = function(group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function(group) {
            var rc = $scope.shownGroup === group;
            return rc;
        };

    });

    theapp.controller("MovieMainController", function ($scope, $localstorage, $state, getZip) {

        console.log("main controller");
        var settingsObj = getZip;


        $scope.navTitle = 'Change movie search criteria';
        $scope.settingsObj = settingsObj;
        var prevObj1 = settingsObj;

        $scope.handleClick = function()
        {
            //get saved settings
            var prevObj2 = $localstorage.getObject("settings");

            //has user changed it?
            var rc1 = _.isEqual($scope.settingsObj, prevObj1); //note: when $scope.settings changes, so does prevOjb1
            var rc2 = _.isEqual($scope.settingsObj, prevObj2);

            if ( rc2 == false ) {
                //user changed search parms, so save it now
                $localstorage.setObject("settings", $scope.settingsObj);
                //and clear out any cached objects
                $localstorage.deleteObject("tsZip");
                $localstorage.deleteObject("tsLatLon");
                $localstorage.deleteObject("tsMovies")
            }

            $state.go("tplMovieTimes");

        }

    });

    theapp.controller('MainCtrl', function ($scope, $ionicModal, $ionicPopup, $ionicActionSheet) {

        //$scope.defaultPrimaryButtonClick = function () {
        //    $ionicPopup.show({
        //        template: '<input type="password" ng-model="data.wifi">',
        //        title: 'Enter Wi-Fi Password',
        //        subTitle: 'Please use normal things',
        //        scope: $scope,
        //        buttons: [
        //            {text: 'Cancel'},
        //            {
        //                text: '<b>Save</b>',
        //                type: 'button-positive'
        //            }
        //        ]
        //    });
        //};
        $ionicModal.fromTemplateUrl('templates/tplModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.defaultSecondaryButtonClick = function () {
            $scope.modal.show();
            //$ionicActionSheet.show({
            //    titleText: 'Nav Bar Default Secondary',
            //    cancelText: 'Cancel Nav Bar Default Secondary'
            //});
        };
    });




function moviesAtSpecificTimes(movies) {

    //create array like this [time, [moviesAtTime]]
    var moviesByTime = _.groupBy(movies, function (amovie) {
        return amovie.time;
    });


    var cnt = 1;
    var x = [];

    //create array of objects with named properties
    angular.forEach(moviesByTime, function (moviesAtTime, keyTime, allMovies) {

        var arow = { cnt: cnt, keyTime: keyTime, moviesAtTime: moviesAtTime};

        x.push(arow);
        cnt++;
    });

    return x;
}


//            //$("#basetable").append(arow);
//
//
//    $("#content").on("click", "tr", function () {
//        var thetr = this;
//        var key = $(thetr).attr('key');
//        var data = moviesByTime[key];
//        createSideTable(data, key);
//        console.log('here');
//    });
//
//    $("#content").on("mouseenter", "tr", function () {
//        var thetr = this;
//        var key = $(thetr).attr('key');
//        var data = moviesByTime[key];
//        createSideTable(data, key);
//        console.log('here');
//    });
//    $("#content").on("mouseleave", "tr", function () {
//        $("#sidetable").remove();
//        console.log('here');
//    })
//}
//
//function createSideTable(movies, key) {
//    $("#sidetable").remove();
//    $("#content").append("<div  style='float:left; margin-left: 10px;' >"
//    + "<table id='sidetable' rules='all' border='1'>"
//    + "<tr><th>#</th>"
//    + "<th id='hdrTitle' width=400>" + movies.length + " movies at " + key
//    + "</th><th id='hdrTheater'>theater</th><th>rt</th></tr>"
//    + "</table></div>");
//    $.each(movies,
//        function (idx, aval) {
//            idx++;
//            var arow = "<tr>"
//                + "<td>" + idx + "</td>"
//                + "<td>" + aval.t + "</td>"
//                + "<td>" + aval.h + "</td>"
//                + "<td>" + aval.r + "</td>"
//                + "</tr>";
//            $("#sidetable").append(arow);
//
//        });
//}
//$ionicLoading, $ionicPopup,  $ionicActionSheet, GeoService, getMoviesService, $localstorage ,    )
//$ionicLoading, $ionicPopup, $q, $window,  $ionicActionSheet, GeoService, getMoviesService,   )

//.run(function($ionicPlatform, $rootScope, $ionicLoading) {
//
//    $rootScope.$on('loading:show', function() {
//        console.log("loading show");
//        $ionicLoading.show({template: "Loading..."})
//    });
//
//    $rootScope.$on('loading:hide', function() {
//        console.log("loading hide");
//        $ionicLoading.hide()
//    });
//
//    $rootScope.$on('$stateChangeStart',
//        function(event, toState, toParams, fromState, fromParams)
//        {
//            console.log("here");
//        });
//
//    $rootScope.$on('$stateNotFound',
//        function(event, unfoundState, fromState, fromParams){
//            console.log("here"); // "lazy.state"
//        });
//
//    $rootScope.$on('$stateChangeSuccess',
//        function(event, toState, toParams, fromState, fromParams)
//        {
//            console.log("here");
//        });
//
//    $rootScope.$on('$stateChangeError',
//        function(event, toState, toParams, fromState, fromParams, error)
//        {
//           console.log('here');
//        });
//
//
//    $ionicPlatform.ready(function() {
//        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//        // for form inputs)
//        if(window.cordova && window.cordova.plugins.Keyboard) {
//            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//        }
//        if(window.StatusBar)
//            StatusBar.styleDefault();
//        })
//})
//function _getLocation() {
//
//    //var q = $q.defer();
//
//    var geoOptions = {enableHighAccuracy: false, timeout: 3000, maximumAge: 0};
//
//    console.log("getlocation");
//
//    $window.navigator.geolocation.getCurrentPosition(
//        function (position) {
//            console.log("getlocation success: " + position);
//            var apromise = GeoService.reverseGeo(position);
//            apromise.then(function(azip) {
//                settingsObj.viewzip = azip;
//                $scope.viewzip = azip;
//                $localstorage.setObject('settings', settingsObj);
//            }, function(error) {
//                console.log('here');
//            });
//
//
//      //      q.resolve(position);
//        },
//        function (error) {
//            console.log("getlocation error: " + error);
//        //    q.reject(error);
//        }
//        , geoOptions
//    );
//
//    //return q.promise;
//}


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

//var d = new Date();
//var n = d.getTimezoneOffset();
//var adate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
//
////var aZip = GeoService.getZip();
//var settingsObj = {
//    viewdate : adate,
//    viewzip : "99999",
//    viewmiles : "10",
//    viewbegintime : d.getHours(),
//    viewendtime : "",
//    viewLat :"",
//    viewLon : "",
//    viewstartsWith : ""
//};

//_getLocation();
//var promise1 = GeoService.getZip();
//promise1.then(
//   function(azip) {
//       $scope.viewzip = azip;
//   },
//   function(error) {
//       $scope.viewzip = "99999";
//   } );

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

//    function($rootScope, $q) {
//    return {
//        request: function(config) {
//            console.log("request interceptor:" + config.url);
//            $rootScope.$broadcast('loading:show');
//            return config;
//
//        },
//        requestError: function(rejection) {
//            console.log("requesterror interceptor:" + rejection);
//            return $q.reject(rejection);
//        },
//        response: function(response) {
//            console.log("response interceptor:" + response.config.url /*+ "," + response.data*/ );
//            $rootScope.$broadcast('loading:hide');
//            return response;
//        },
//        responseError: function(rejection) {
//            console.log("response error interceptor:" + rejection);
//            return $q.reject(rejection);
//        }
//
//    }
//}


