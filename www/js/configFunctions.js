(function () {

    'use strict';

    angular
        .module('MovieApp')
        .config(configFunctions);

    configFunctions.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
        '$compileProvider', '$httpProvider', '$provide'];

    decExceptionHandler.$inject = ['$delegate'];

    function decExceptionHandler($delegate) {

        return function(exception, cause) {
            $delegate(exception, cause)
            alert(exception.message);
        }
    }

    function configFunctions($stateProvider, $urlRouterProvider, $ionicConfigProvider,
                             $compileProvider, $httpProvider, $provide) {

        $provide.decorator('$exceptionHandler', decExceptionHandler);

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
                url        : '/tplSettings',
                cache      : true,
                templateUrl: 'templates/tplSettings1.html',
                controller : 'SettingsController as vm',
                //controllerAs: 'vm',
                onEnter    : function () {
                    console.log("tplSettings onenter");
                },
                onExit     : function () {
                    console.log("tplSettings onexit");
                },
                resolve    : {

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
                url        : '/tplMovieTimes',
                templateUrl: 'templates/tplMovieTimes.html',
                controller : 'MovieTimesController as vm',
                //controllerAs: 'movieTimes',
                cache      : false,
                resolve    : {
                    getMovies: function (GetMovieData) {
                        return GetMovieData.getMovies();
                    }
                },
                onEnter    : function () {
                    console.log("tplMovieTimes onenter");
                },
                onExit     : function () {
                    console.log("tplMovieTimes onexit");
                }

            })
            .state('tplMovieTimesHor', {
                url        : '/tplMovieTimesHor',
                templateUrl: 'templates/tplMovieTimesHor.html',
                controller : 'MovieTimesController as vm',
                //controllerAs: 'movieTimesHor',
                cache      : false,
                resolve    : {
                    getMovies: function (GetMovieData) {
                        return GetMovieData.getMovies();
                    }
                },
                onEnter    : function () {
                    console.log("tplMovieTimesHor onenter");
                    //var els = jQuery('.outerdiv');

                    //angular.forEach(els, function (el) {
                    //
                    //    //    console.log('here');
                    //});
                },
                onExit     : function () {
                    console.log("tplMovieTimesHor onexit");
                }

            })
            .state('tplMovieTheaters', {
                url        : '/tplMovieTheaters',
                templateUrl: 'templates/tplMovieTheaters.html',
                controller : 'MovieTheaterController as vm',
                //controllerAs: 'theaters',
                //resolve: {
                //    getTheaters: function (GetMovieData) {
                //        return GetMovieData.getTheaters();
                //    }
                //},
                onEnter    : function () {
                    console.log("tplMovieTheaters onenter");
                },
                onExit     : function () {
                    console.log("tplMovieTheaters onexit");
                }

            });

    }

})();