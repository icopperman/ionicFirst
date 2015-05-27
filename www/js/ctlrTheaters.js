(function () {

    'use strict';

    angular
        .module('MovieApp')
        .controller('MovieTheaterController', MovieTheaterController);

    MovieTheaterController.$inject = ['$localstorage'];

    function MovieTheaterController($localstorage) {

        var vm = this;

        var theaters           = [];
        var excludedTheaters   = [];

        vm.theaterList   = createTheaterList();
        vm.saveExclusion = saveExclusion;

        function createTheaterList() {

            var tsTheaterNames     = $localstorage.getObject("tsTheaterNames");
            var tsExcludedTheaters = $localstorage.getObject("tsExcluded");

            if (tsExcludedTheaters.ts != undefined) {
                excludedTheaters = tsExcludedTheaters.theaterNames;
            }

            var theaterNames = tsTheaterNames.theaterNames;

            for (var i = 0; i < theaterNames.length; i++) {

                var aname   = theaterNames[i];
                var include = true;

                var excludedIdx = _.indexOf(excludedTheaters, aname);

                if (excludedIdx != -1) {
                    include = false;
                }

                theaters.push({theaterName: aname, include: include});
            }

            return theaters;

        }

        function saveExclusion() {

            var xx            = vm.theaterList;
            var exclusionList = _.pluck(_.where(xx, {include: false}), "theaterName");

            $localstorage.setObject("tsExcluded", {ts: Date.now(), theaterNames: exclusionList});
        }

    }

})();
