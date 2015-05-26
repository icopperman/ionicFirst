(function () {

    'use strict';

    angular
        .module('MovieApp')
        .controller("SettingsController", SettingsController);

    function SettingsController($scope, $localstorage, $state, getZip) {

        console.log("main controller");

        $scope.tsOptions = [{name: 'none', value: 0},
            {name: '15 min', value: 15},
            {name: '30 min', value: 30},
            {name: '1 hour', value: 60}
        ];

        var settingsObj = getZip;

        $scope.navTitle = 'v2 ' + 'Change movie search criteria';
        $scope.settingsObj = settingsObj;
        var prevObj1 = settingsObj;

        $scope.handleClick = function (orientation) {

            var d = new Date();

            if (settingsObj.viewDateChar.toLowerCase() == "tomorrow") {

                d.setDate(d.getDate() + 1);

            }

            var adate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            settingsObj.viewdate = adate;

            //get saved settings
            var prev = $localstorage.getObject("settings");
            var curr = $scope.settingsObj;
            var invalidateCache = false;

            if (( prev.viewdate != curr.viewdate )
                || ( prev.viewzip != curr.viewzip )
                || ( prev.viewmiles != curr.viewmiles )) {
                var tsZip = {ts: Date.now(), tsZip: curr.viewzip};
                $localstorage.setObject("tsZip", tsZip);
                invalidateCache = true;
            }


            //has user changed it?
            //var rc1 = _.isEqual($scope.settingsObj, prevObj1); //note: when $scope.settings changes, so does prevOjb1
            //var rc2 = _.isEqual($scope.settingsObj, prevObj2);

            $localstorage.setObject("settings", $scope.settingsObj);

            if (invalidateCache == true) {
                //user changed search parms, so save it now
                //and clear out any cached objects
                //$localstorage.deleteObject("tsZip");
                //$localstorage.deleteObject("tsLatLon");
                //$localstorage.deleteObject("tsMovieNames");
                //$localstorage.deleteObject("tsMoviesIdx");
                $localstorage.deleteObject("tsTheaterNames");
                $localstorage.deleteObject("tsExcluded");
            }

            var sfx = "";
            if (orientation == 'hor') sfx = "Hor";
            $state.go("tplMovieTimes" + sfx);

        }

    }

})();
/**
 * Created by ira on 5/25/2015.
 */
