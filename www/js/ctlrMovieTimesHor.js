(function () {

    'use strict';

    angular
        .module('MovieApp')
        .controller("MovieTimesControllerHor", MovieTimesControllerHor);

    function MovieTimesControllerHor($scope, $localstorage, getMovies, $ionicScrollDelegate) {

        //var setingsObj = $localstorage.getObject("settings");


        var allMovieTimes = getMovies;
        var rc = allMovieTimes.Status;

        if (rc == "fail") {

            angular.forEach(allMovieTimes.ErrMessage, function (value, key) {
                console.log(key);
            });
            $scope.navTitle = 'Movie Times -- error';
        }
        else {

            var movieData = allMovieTimes.MovieTimesNew;
            //var x = expandPropNames(movieData);
            $scope.moviesAtSpecificTimes = moviesAtSpecificTimes(movieData);

        }

        $scope.navTitle = 'Movie Times';
        //$scope.movieCount = allMovieTimes.MovieTimes.length;

        $scope.noMoreItemsAvailable = false;
        $scope.number = 10;
        $scope.items = [];

        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown1 = function (group) {
            var rc = $scope.shownGroup === group;
            return rc;
        };
        $scope.isGroupShown2 = function (group) {
            var rc = $scope.shownGroup === group;
            return rc;
        };
        $scope.loadMore = function () {
            for (var i = 0; i < $scope.number; i++) {
                $scope.items.push({
                    id: $scope.items.length
                });
            }

            if ($scope.items.length > 99) {

                $scope.noMoreItemsAvailable = true;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

        };

        $scope.goToPage = function () {

            $location.url('/event/attendees');
        };
    }

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
                    var hours = movieShowTime.substr(0, 2);
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
        var x = [];

        //create array of objects with named properties
        angular.forEach(moviesByTime, function (moviesAtTime, keyTime, allMovies) {

            var arow = {cnt: cnt, keyTime: keyTime, moviesAtTime: moviesAtTime};

            x.push(arow);
            cnt++;
        });

        return x;
    }

})();
