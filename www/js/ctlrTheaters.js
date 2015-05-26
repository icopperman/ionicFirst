(function () {

    'use strict';

    angular
        .module('MovieApp')
        .controller('MovieTheaterController', MovieTheaterController);

    function MovieTheaterController($scope, $localstorage) {

        var tsTheaterNames = $localstorage.getObject("tsTheaterNames");
        var tsExcludedTheaters = $localstorage.getObject("tsExcluded");

        var theaters = [];
        var excludedTheaters = [];

        if (tsExcludedTheaters.ts != undefined) {

            excludedTheaters = tsExcludedTheaters.theaterNames;

        }

        var theaterNames = tsTheaterNames.theaterNames;

        for (var i = 0; i < theaterNames.length; i++) {

            var aname = theaterNames[i];
            var include = true;

            var excludedIdx = _.indexOf(excludedTheaters, aname);
            if (excludedIdx != -1) {
                include = false;
            }

            theaters.push({theaterName: aname, include: include});
        }

        //var theaters = xx.theaters;

        $scope.theaterList = theaters;

        $scope.saveExclusion = function () {
            var xx = $scope.theaterList;
            var exclusionList = _.pluck(_.where(xx, {include: false}), "theaterName");

            $localstorage.setObject("tsExcluded", {ts: Date.now(), theaterNames: exclusionList});
        }


    }

})();
