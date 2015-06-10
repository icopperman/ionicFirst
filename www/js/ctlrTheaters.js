(function () {

    'use strict';

    angular
        .module('MovieApp')
        .controller('MovieTheaterController', MovieTheaterController);

    MovieTheaterController.$inject = ['$localstorage', 'GetMovieData','$ionicLoading'];

    function MovieTheaterController($localstorage, GetMovieData, $ionicLoading) {

        var vm = this;

        var theaters         = [];
        var excludedTheaters = null;

        vm.theaterList   = createTheaterList();
        vm.saveExclusion = saveExclusion;

        function createTheaterList() {

            var tsTheaterNames     = GetMovieData.getTheaterNames(); //.getObject("tsTheaterNames");
            //var tsExcludedTheaters = $localstorage.getObject("tsExcluded");

            if (excludedTheaters != null) {

                for (var i = 0; i < excludedTheaters.length; i++) {

                    var aname   = tsTheaterNames[i];
                    var include = true;

                    var excludedIdx = _.indexOf(excludedTheaters, aname);

                    if (excludedIdx != -1) {
                        include = false;
                    }

                    theaters.push({theaterName: aname, include: include});
                }
            }
            else {

                theaters = tsTheaterNames;
            }

            $ionicLoading.hide();

            return theaters;

        }

        function saveExclusion() {

            var xx            = vm.theaterList;
            var exclusionList = _.pluck(_.where(xx, {include: false}), "theaterName");

            excludedTheaters = exclusionList;

            //$localstorage.setObject("tsExcluded", {ts: Date.now(), theaterNames: exclusionList});
            //$localstorage.setObject("tsExcluded", exclusionList);

        }

    }

})();
