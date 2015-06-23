(function () {

    'use strict';

    angular
        .module('MovieApp')
        .controller("MovieTimesControllerHor", MovieTimesControllerHor);

    MovieTimesControllerHor.$inject = ['$localstorage', 'getMovies', '$ionicScrollDelegate'];

    function MovieTimesControllerHor($localstorage, getMovies, $ionicScrollDelegate) {

        var vm = this;
        //var setingsObj = $localstorage.getObject("settings");
        console.log("MovieTimeCtlrHor entering");

        var allMovieTimes = getMovies;
        var rc            = allMovieTimes.Status;

        if (rc == "fail") {

            angular.forEach(allMovieTimes.ErrMessage, function (value, key) {
                console.log(key);
            });
            vm.navTitle = 'Movie Times -- error';
        }
        else {

            var movieData = allMovieTimes.MovieTimesNew;
            //var x = expandPropNames(movieData);
            vm.moviesAtSpecificTimes = moviesAtSpecificTimes(movieData);

        }

        vm.navTitle = 'Movie Times';
        //vm.movieCount = allMovieTimes.MovieTimes.length;

        vm.noMoreItemsAvailable = false;
        vm.number               = 10;
        vm.items                = [];

        vm.toggleGroup   = function (group) {
            if (vm.isGroupShown(group)) {
                vm.shownGroup = null;
            } else {
                vm.shownGroup = group;
            }
        };
        vm.isGroupShown1 = function (group) {
            var rc = vm.shownGroup === group;
            return rc;
        };
        vm.isGroupShown2 = function (group) {
            var rc = vm.shownGroup === group;
            return rc;
        };
        vm.loadMore      = function () {
            for (var i = 0; i < vm.number; i++) {
                vm.items.push({
                    id: vm.items.length
                });
            }

            if (vm.items.length > 99) {

                vm.noMoreItemsAvailable = true;
            }
            vm.$broadcast('scroll.infiniteScrollComplete');

        };

        vm.goToPage = function () {

            $location.url('/event/attendees');
        };

        function moviesAtSpecificTimes(movies, timespan) {

            var ati;
            //create array like this [time, [moviesAtTime]]
            var moviesByTime = _.groupBy(movies, function (amovie) {

                var movieShowTime = ati = amovie.time;

                switch (timespan) {
                    case "60":
                        ati = movieShowTime.substring(0, 2) + ":00";
                        break;

                    case "30":
                        var hours   = movieShowTime.substr(0, 2);
                        var minutes = movieShowTime.substr(3, 2);
                        if (minutes <= "29") {
                            ati = hours + ":00";
                        }
                        else {
                            ati = hours + ":30";
                        }
                        break;

                }

                return ati;

            });


            var cnt = 1;
            var x   = [];

            //create array of objects with named properties
            angular.forEach(moviesByTime, function (moviesAtTime, keyTime, allMovies) {

                var arow = {cnt: cnt, keyTime: keyTime, moviesAtTime: moviesAtTime};

                x.push(arow);
                cnt++;
            });

            return x;
        }
    }

})();
