(function () {

    'use strict';

    angular
        .module('MovieApp')
        .controller("MainCtrl", MainCtrl);

    MainCtrl.$inject = ['$scope', '$ionicModal', '$ionicPopup', '$ionicActionSheet', '$state', 'refreshCache'];

    function MainCtrl($scope, $ionicModal, $ionicPopup, $ionicActionSheet, $state, refreshCache) {

        console.log("MainCtlr entering");
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
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.refreshMovies = refreshMovies;

        $scope.defaultSecondaryButtonClick = function () {
            $scope.modal.show();
            //$ionicActionSheet.show({
            //    titleText: 'Nav Bar Default Secondary',
            //    cancelText: 'Cancel Nav Bar Default Secondary'
            //});
        };

        function refreshMovies() {

            console.log("main controller, starting refresh");
            //refreshCache.refresh = true;
            $state.go("tplSettings",{}, { reload: true});


        }
    }

})();

