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
                controller: 'MovieTimesController1',
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

            });

    });

    theapp.controller('MovieTimesControllerHor', function($scope, $localstorage, getMovies, $ionicScrollDelegate) {


        var setingsObj = $localstorage.getObject('settings');

        var allMovieTimes = getMovies;
        var rc = allMovieTimes.Status;

        if ( rc == "fail" ) {

            angular.forEach(allMovieTimes.ErrMessage, function(value, key) {
                console.log(key);
            });
            $scope.navTitle = 'Movie Times -- error';
        }
        else {

            var movieData = allMovieTimes.MovieTimes;
            var x = createTable(movieData);
            $scope.moviesAtSpecificTimes = createBaseTable(x);

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

    theapp.controller("MovieTimesController1", function ($scope, $localstorage, getMovies) {

        var setingsObj = $localstorage.getObject('settings');

        var allMovieTimes = getMovies;
        var rc = allMovieTimes.Status;

        if ( rc == "fail" ) {

            angular.forEach(allMovieTimes.ErrMessage, function(value, key) {
                console.log(key);
            });
            $scope.navTitle = 'Movie Times -- error';
        }
        else {

            var movieData = allMovieTimes.MovieTimes;
            var x = createTable(movieData);
            $scope.moviesAtSpecificTimes = createBaseTable(x);

        }

        $scope.navTitle = 'Movie Times';
        $scope.movieCount = allMovieTimes.MovieTimes.length;
        $scope.data = { showDelete: false, showReorder: false };

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
            return rc
        };

    });

    theapp.controller("MovieMainController", function ($scope, $localstorage, getZip) {

        console.log("main controller");
        var settingsObj = getZip;

        $scope.navTitle = 'Set Setting';
        $scope.settingsObj = settingsObj;

    });

    theapp.controller('MainCtrl', function ($scope, $ionicPopup, $ionicActionSheet) {

        $scope.defaultPrimaryButtonClick = function () {
            $ionicPopup.show({
                template: '<input type="password" ng-model="data.wifi">',
                title: 'Enter Wi-Fi Password',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'},
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive'
                    }
                ]
            });
        };

        $scope.defaultSecondaryButtonClick = function () {
            $ionicActionSheet.show({
                titleText: 'Nav Bar Default Secondary',
                cancelText: 'Cancel Nav Bar Default Secondary'
            });
        };
    });


function createTable(movies) {
    var allMovies = [];
    angular.forEach(movies,
        function (aval, idx) {
            var i = 0;
            var arow = {
                cnt: idx + 1
                , time: aval.d
                , runtime: aval.r
                , title: aval.t
                , theater: aval.h
            };
            allMovies.push(arow);
        });

    return allMovies;

}

function createBaseTable(movies) {

    //$("#content").append("<div style='float:left;'>"
    //+ "<table id='basetable' rules='all' border='1'>"
    //+ "<tr><th>#</th><th>Time</th><th>Movies</th></tr>"
    //+ "</table></div>");
    moviesByTime = _.groupBy(movies, function (amovie) {
        return amovie.time;
    });

    var cnt = 1;
    var x = [];

    angular.forEach(moviesByTime, function (moviesAtTime, keyTime, allMovies) {
        //var arow = "<tr key='" + keyTime + "' >"
        //    + "<td>" + cnt + "</td>"
        //    + "<td>" + keyTime + "</td>"
        //    + "<td>" + moviesAtTime.length + " movies at this time</td>"
        //    + "</tr>";
        var i = 0;
        var arow = {

            cnt: cnt
            , keyTime: keyTime
            , moviesAtTime: moviesAtTime
        };
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


