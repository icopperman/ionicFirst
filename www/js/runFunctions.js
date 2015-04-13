var theappRun = angular.module('MovieApp');

theappRun.run(function ($ionicPlatform, $rootScope, $ionicLoading) {

    function logViewEvent(viewevent, data) {
        console.log(viewevent.name
        + "," + data.historyId
        + "," + data.stateId
        + "," + data.stateName );
    }

    $rootScope.$on('$ionicView.loaded',
        function(viewevent, data) { logViewEvent (viewevent,data)});
    $rootScope.$on('$ionicView.enter',
        function(viewevent, data) { logViewEvent (viewevent,data)});

    $rootScope.$on('$ionicView.leave', function(viewevent, data) { logViewEvent (viewevent,data)});

    $rootScope.$on('$ionicView.beforeEnter', function(viewevent, data) { logViewEvent (viewevent,data)});

    $rootScope.$on('$ionicView.beforeLeave', function(viewevent, data) { logViewEvent (viewevent,data)});

    $rootScope.$on('$ionicView.afterEnter', function(viewevent, data) { logViewEvent (viewevent,data)});

    $rootScope.$on('$ionicView.afterLeave', function(viewevent, data) { logViewEvent (viewevent,data)});

    $rootScope.$on('$ionicView.unloaded', function(viewevent, data) { logViewEvent (viewevent,data)});


    $rootScope.$on('loading:show', function () {
        console.log("loading show");
        $ionicLoading.show({template: "Loading..."})
    });

    $rootScope.$on('loading:hide', function () {
        console.log("loading hide");
        $ionicLoading.hide()
    });

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            console.log("start change start here");
        });

    $rootScope.$on('$stateNotFound',
        function (event, unfoundState, fromState, fromParams) {
            console.log("state not found here"); // "lazy.state"
        });

    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
            console.log("state change success here");
        });

    $rootScope.$on('$stateChangeError',
        function (event, toState, toParams, fromState, fromParams, error) {
            console.log('state change error here');
        });


    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar)
            StatusBar.styleDefault();
    })
});
