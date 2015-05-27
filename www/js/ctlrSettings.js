(function () {

    'use strict';

    angular
        .module('MovieApp')
        .controller("SettingsController", SettingsController);

    SettingsController.$inject = ['$localstorage', '$state', 'getZip'];

    function SettingsController($localstorage, $state, getZip) {

        console.log("main controller");

        var vm          = this;
        var settingsObj = getZip;

        vm.handleClick = handleClick;
        vm.navTitle    = 'v2 ' + 'Change movie search criteria';
        vm.settingsObj = settingsObj;
        vm.tsOptions   = [{name: 'none', value: 0},
            {name: '15 min', value: 15},
            {name: '30 min', value: 30},
            {name: '1 hour', value: 60}
        ];

        function handleClick(orientation) {

            var d = new Date();

            if (settingsObj.viewDateChar.toLowerCase() == "tomorrow") {

                d.setDate(d.getDate() + 1);

            }

            var adate            = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            settingsObj.viewdate = adate;

            //get saved settings
            var prev            = $localstorage.getObject("settings");
            var curr            = vm.settingsObj;
            var invalidateCache = false;

            if (( prev.viewdate != curr.viewdate  )
                || ( prev.viewzip != curr.viewzip   )
                || ( prev.viewmiles != curr.viewmiles )) {
                //var tsZip = {ts: Date.now(), tsZip: curr.viewzip};
                $localstorage.setObject("tsZip", curr.viewzip);
                invalidateCache = true;
            }

            $localstorage.setObject("settings", vm.settingsObj);

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

