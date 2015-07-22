(function () {

    'use strict';

    angular
        .module('MovieApp')
        .controller('MovieTheaterController', MovieTheaterController);

    MovieTheaterController.$inject = ['$localstorage', 'GetMovieData','$ionicLoading'];

    function MovieTheaterController($localstorage, GetMovieData, $ionicLoading) {

        console.log("MovieTheater Ctlr entering");

        var vm = this;

        var theaters         = [];
        var excludedTheaters = GetMovieData.getExcludedTheaters();

        vm.theaterList   = createTheaterList();
        vm.saveExclusion = saveExclusion;

        vm.navTitle = "List of Theaters";
        $ionicLoading.hide();

        function createTheaterList() {

            var tsTheaterNames     = GetMovieData.getTheaterNames(); //.getObject("tsTheaterNames");
            //var tsExcludedTheaters = $localstorage.getObject("tsExcluded");

                for (var i = 0; i < tsTheaterNames.length; i++) {

                    var aname   = tsTheaterNames[i];
                    var exclude = false;

                    if ( excludedTheaters != null) {

                        exclude = _.contains(excludedTheaters, aname);

                    }

                    theaters.push({theaterName: aname, exclude: exclude});
                }

            return theaters;

        }

        function saveExclusion() {

            var xx            = vm.theaterList;
            var exclusionList = _.pluck(_.where(xx, {exclude: true}), "theaterName");

            excludedTheaters = exclusionList;
            GetMovieData.setExcludedTheaters(excludedTheaters);

            //$localstorage.setObject("tsExcluded", {ts: Date.now(), theaterNames: exclusionList});
            //$localstorage.setObject("tsExcluded", exclusionList);

        }

    }

})();
