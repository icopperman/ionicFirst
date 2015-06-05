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
        vm.settingsObj.viewbegintime = new Date(settingsObj.viewbegintime);
        vm.settingsObj.viewendtime = new Date(settingsObj.viewendtime);

        //vm.showDates = [ {val:0, txt:'Today', checked: true}, {val:1, txt: 'Tomorrow', checked: false}];
        vm.clZip = { inError: false};
        vm.phZip = 'Enter zip';

        vm.clMiles = { inError: false};
        vm.phMiles = 'Enter miles';

        vm.whichDate = whichDate;
        vm.whichOrient = whichOrient;
        vm.whichInterval = whichInterval;

        vm.selectedDate       = "button button-small selectedDate";
        vm.notSelectedDate    = "button button-small notSelectedDate";
        vm.selectedOrient     = "button button-small selectedDate";
        vm.notSelectedOrient  = "button button-small notSelectedDate";
        vm.selectedInterval0  = "button button-small selectedDate";
        vm.selectedInterval15 = vm.selectedInterval30 = vm.selectedInterval60 = 'button button-small notSelectedDate';

        vm.direction = "";
        vm.showDate = "today";
        vm.showInterval = "none";

        function whichOrient(direction)
        {
            vm.direction = direction;

            if ( direction == '') {
                vm.selectedOrient = "button button-small selectedDate";
                vm.notSelectedOrient = "button button-small notSelectedDate";

            }
            else {
                vm.selectedOrient = "button button-small notSelectedDate";
                vm.notSelectedOrient = "button button-small selectedDate";
            }

        }

        function whichDate(theDate) {

            vm.showDate = theDate;

            if ( theDate == 'today') {
                vm.selectedDate = "button button-small selectedDate";
                vm.notSelectedDate = "button button-small notSelectedDate";

            }
            else {
                vm.selectedDate = "button button-small notSelectedDate";
                vm.notSelectedDate = "button button-small selectedDate";
            }

        }
        function whichInterval(theInterval) {

            vm.showInterval = theInterval;
            switch (theInterval) {
                case 'none':
                    vm.selectedInterval0 = 'button button-small selectedDate';
                    vm.selectedInterval15 = vm.selectedInterval30 = vm.selectedInterval60 = 'button button-small notSelectedDate';
                    break;
                case '15':
                    vm.selectedInterval15 = 'button button-small selectedDate';
                    vm.selectedInterval0 = vm.selectedInterval30 = vm.selectedInterval60 = 'button button-small notSelectedDate';
                    break;
                case '30':
                    vm.selectedInterval30 = 'button button-small selectedDate';
                    vm.selectedInterval0 = vm.selectedInterval15 = vm.selectedInterval60 = 'button button-small notSelectedDate';
                    break;
                case '60':
                    vm.selectedInterval60 = 'button button-small selectedDate';
                    vm.selectedInterval0 = vm.selectedInterval15 = vm.selectedInterval30 = 'button button-small notSelectedDate';
                    break;
            }

        }

        function validateInput(form) {

            var rc = true;

            if (form.$invalid == false) return rc;

            rc = false;

            if (form.viewzip.$error.required == true) {

                //vm.viewzip = 'Required';
                vm.clZip = {inError: true};
                vm.phZip = 'Zip required';

            }

            if (form.viewzip.$error.pattern == true) {

                vm.clZip = {inError: true};
                vm.settingsObj.viewzip = "";
                vm.phZip = 'Must be 5 digits';

            }

            if (form.viewmiles.$error.required == true) {

                //vm.viewzip = 'Required';
                vm.clMiles = {inError: true};
                vm.phMiles = 'Miles required';

            }

            if (form.viewmiles.$error.pattern == true) {

                vm.clMiles = {inError: true};
                vm.settingsObj.viewmiles = "";
                vm.phMiles = 'Must be 1,2 digits';

            }

            return rc;


        }

        function handleClick(orientation, form) {

            var rc = validateInput(form);
            if (rc == false) return;

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

            //var sfx = "";
            //if (orientation == 'hor') sfx = "Hor";

            $state.go("tplMovieTimes" + vm.direction);

        }

        //vm.tsOptions   = [{name: 'none', value: 0},
        //    {name: '15 min', value: 15},
        //    {name: '30 min', value: 30},
        //    {name: '1 hour', value: 60}
        //];
    }

})();

