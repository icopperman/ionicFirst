var theappRun = angular.module('MovieApp');

theappRun.run(function ($ionicPlatform, $rootScope, $ionicLoading) {

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
