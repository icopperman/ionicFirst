(function () {

    'use strict';

    angular
        .module('MovieApp')
        .run(runFunctions);

    runFunctions.$inject = ['$ionicPlatform', '$rootScope', '$ionicLoading'];

    function runFunctions($ionicPlatform, $rootScope, $ionicLoading) {

        function logViewEvent(viewevent, data) {
            console.log(viewevent.name
                + "," + data.historyId
                + "," + data.stateId
                + "," + data.stateName);
        }

        $rootScope.$on('$ionicView.loaded', logViewEvent);
        $rootScope.$on('$ionicView.enter', logViewEvent);
        $rootScope.$on('$ionicView.leave', logViewEvent);
        $rootScope.$on('$ionicView.beforeEnter', logViewEvent);
        $rootScope.$on('$ionicView.beforeLeave', logViewEvent);
        $rootScope.$on('$ionicView.afterEnter', logViewEvent);
        $rootScope.$on('$ionicView.afterLeave', logViewEvent);
        $rootScope.$on('$ionicView.unloaded', logViewEvent);

        $rootScope.$on('loading:show', loadingShow);
        $rootScope.$on('loading:hide', loadingHide);
        $rootScope.$on('$stateNotFound', stateNotFound);
        $rootScope.$on('$stateChangeStart', stateChangeStart);
        $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);
        $rootScope.$on('$stateChangeError', stateChangeError);
        $ionicPlatform.ready(platformReady);

        function platformReady() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar)
                StatusBar.styleDefault();
        }

        function loadingShow() {
            console.log("loading show");
            $ionicLoading.show({template: "Loading..."})
        }

        function loadingHide() {
            console.log("loading hide");
            $ionicLoading.hide()
        }

        function stateChangeStart(event, toState, toParams, fromState, fromParams) {
            console.log("start change start here");
        }

        function stateNotFound(event, unfoundState, fromState, fromParams) {
            console.log("state not found here"); // "lazy.state"
        }

        function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
            console.log("state change success here");
        }

        function stateChangeError(event, toState, toParams, fromState, fromParams, error) {
            console.log('state change error here');
        }
    }

})();
