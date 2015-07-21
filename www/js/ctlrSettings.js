(function () {

    'use strict';

    angular
        .module('MovieApp')
        .controller("SettingsController", SettingsController);

    SettingsController.$inject = ['$localstorage', '$state', 'getZip', 'GeoService', 'GetMovieData', 'facSettings', 'refreshCache', '$ionicLoading'];

    function SettingsController($localstorage, $state, getZip, GeoService, GetMovieData, facSettings, refreshCache, $ionicLoading) {

        console.log("settings controller entering");

        var vm            = this;
        var savedSettings = facSettings.getSettingsObj();

        vm.handleClick = handleClick;
        vm.navTitle    = 'Change movie search criteria';
        vm.settingsObj = angular.copy(savedSettings);

        vm.settingsObj.viewbegintime = new Date(savedSettings.viewbegintime);
        vm.settingsObj.viewendtime   = new Date(savedSettings.viewendtime);
        vm.errMsg       = "";

        //if user typed in a zip, use it; otherwise use geolocated zip
        if ( savedSettings.viewzipuser == "") {
            vm.settingsObj.viewzip = getTheZip();
        }
        else {
            vm.settingsObj.viewzip = savedSettings.viewzipuser;
        }

        //vm.showDates = [ {val:0, txt:'Today', checked: true}, {val:1, txt: 'Tomorrow', checked: false}];
        vm.clZip = {inError: false};
        vm.phZip = 'Enter zip';

        vm.clMiles = {inError: false};
        vm.phMiles = 'Enter miles';

        vm.whichDate     = whichDate;
        vm.whichOrient   = whichOrient;
        vm.whichInterval = whichInterval;
        vm.refreshMovies = refreshMovies;

        var selected    = "button button-small selectedDate";
        var notSelected = "button button-small notSelectedDate";

        vm.clToday    = ( savedSettings.viewDateChar == 'today'    ) ? selected : notSelected;
        vm.clTomorrow = ( savedSettings.viewDateChar == 'tomorrow' ) ? selected : notSelected;
        vm.clVer      = ( savedSettings.viewOrientation == 'Ver'   ) ? selected : notSelected;
        vm.clHor      = ( savedSettings.viewOrientation == 'Hor'   ) ? selected : notSelected;
        vm.clInt0     = ( savedSettings.viewTimeSpan == '0'        ) ? selected : notSelected;
        vm.clInt15    = ( savedSettings.viewTimeSpan == '15'       ) ? selected : notSelected;
        vm.clInt30    = ( savedSettings.viewTimeSpan == '30'       ) ? selected : notSelected;
        vm.clInt60    = ( savedSettings.viewTimeSpan == '60'       ) ? selected : notSelected;

        function getTheZip() {

            var theLocation = getZip; //from resolve and geolocate svc

            if (theLocation.status == 'error') {
                vm.errMsg = theLocation.errMsg;
                return;
            }

            var zip                = theLocation.tsZip;
            return zip;

        }

        function refreshMovies() {

            refreshCache.refresh = true;
            savedSettings = facSettings.getSettingsObj();

            GeoService.getZip().then(
                function(theLocation) {
                    console.log("refreshmovies: got zip = " + theLocation.tsZip );
                    vm.settingsObj.viewzip = theLocation.tsZip;
                    vm.settingsObj.viewbegintime = new Date(savedSettings.viewbegintime);
                    vm.settingsObj.viewendtime   = new Date(savedSettings.viewendtime);


                },
                function(theLocation) {
                    console.log("refreshmovies: getzip error = " + theLocation.errMsg);
                    vm.settingsObj.viewzip = "";

                });



        }

        function whichOrient(direction) {

            vm.settingsObj.viewOrientation = direction;

            vm.clVer = ( vm.settingsObj.viewOrientation == 'Ver'      ) ? selected : notSelected;
            vm.clHor = ( vm.settingsObj.viewOrientation == 'Hor'      ) ? selected : notSelected;

        }

        function whichDate(theDate) {

            vm.settingsObj.viewDateChar = theDate;

            vm.clToday    = ( vm.settingsObj.viewDateChar == 'today'    ) ? selected : notSelected;
            vm.clTomorrow = ( vm.settingsObj.viewDateChar == 'tomorrow' ) ? selected : notSelected;

            var d = new Date();

            if (vm.settingsObj.viewDateChar == "tomorrow") {

                d.setDate(d.getDate() + 1);

            }

            var adate               = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            vm.settingsObj.viewdate = adate;

        }

        function whichInterval(theInterval) {

            vm.settingsObj.viewTimeSpan = theInterval;

            vm.clInt0  = ( vm.settingsObj.viewTimeSpan == '0'        ) ? selected : notSelected;
            vm.clInt15 = ( vm.settingsObj.viewTimeSpan == '15'       ) ? selected : notSelected;
            vm.clInt30 = ( vm.settingsObj.viewTimeSpan == '30'       ) ? selected : notSelected;
            vm.clInt60 = ( vm.settingsObj.viewTimeSpan == '60'       ) ? selected : notSelected;

        }

        function handleClick(orientation, template, form) {

            var rc = validateInput(form);
            if (rc == false) return;



            //get saved settings
            //var savedSettings   = savedSettings; //.getObject("settings");

            //since this controller may be cached, refresh saveSettings
            savedSettings = facSettings.getSettingsObj();

            var userSettings    = vm.settingsObj;
            var invalidateCache = false;

            if (( userSettings.viewdate != savedSettings.viewdate  )
                || ( userSettings.viewzip != savedSettings.viewzip   )
                || ( userSettings.viewmiles != savedSettings.viewmiles )) {
                //var tsZip = {ts: Date.now(), tsZip: curr.viewzip};
                //$localstorage.setObject("tsZip", curr.viewzip);
                refreshCache.refresh = true;

                //if user typed in a new zip, save it
                if ( userSettings.viewzip != savedSettings.viewzip  ) {
                    userSettings.viewzipuser = userSettings.viewzip;

                }
            }

            vm.template = template;

            //$localstorage.setObject("settings", vm.settingsObj);
            facSettings.setSettingsObj(vm.settingsObj);

            //if (invalidateCache == true) {
            //
            //    GetMovieDate.clearMovies();
            //
            //    $localstorage.deleteObject("tsTheaterNames");
            //    $localstorage.deleteObject("tsExcluded");
            //}

            //var sfx = "";
            //if (orientation == 'hor') sfx = "Hor";
            GetMovieData.getMovies().then(success, failure)


        }


        //vm.tsOptions   = [{name: 'none', value: 0},
        //    {name: '15 min', value: 15},
        //    {name: '30 min', value: 30},
        //    {name: '1 hour', value: 60}
        //];

        function success(resultFromGetMovies) {
            console.log("settings controller, return from getMovies: success");
            $ionicLoading.hide();
            vm.errMsg = "";

            if (resultFromGetMovies.status == "ok") {
                if (vm.template == 'theaters') {

                    $ionicLoading.show({
                        template: 'Getting theaters...'
                    });
                    $state.go("tplMovieTheaters");
                }
                else {
                    //refreshCache.refresh = false;

                    $state.go("tplMovieTimes" + vm.settingsObj.viewOrientation);

                }
            }
            else {
                vm.errMsg = resultFromGetMovies.errMsg;
            }
        }

        function failure() {
            $ionicLoading.hide();
            console.log("settings controller, return from getMovies: failure");

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

                vm.clZip               = {inError: true};
                vm.settingsObj.viewzip = "";
                vm.phZip               = 'Must be 5 digits';

            }

            if (form.viewmiles.$error.required == true) {

                //vm.viewzip = 'Required';
                vm.clMiles = {inError: true};
                vm.phMiles = 'Miles required';

            }

            if (form.viewmiles.$error.pattern == true) {

                vm.clMiles               = {inError: true};
                vm.settingsObj.viewmiles = "";
                vm.phMiles               = 'Must be 1,2 digits';

            }

            return rc;
        }
    }

})();

