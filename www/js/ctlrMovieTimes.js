(function () {

    'use strict';

    angular
        .module('MovieApp')
        .controller("MovieTimesController", MovieTimesController);

    function MovieTimesController($scope, $state, $localstorage, getMovies) {

        if ($state.current.name.indexOf('Hor') != -1) {

            var els = $('.outerdiv');

            angular.forEach(els, function (el) {

                console.log('here');
            });
        }
        var settingsObj = $localstorage.getObject("settings");

        var allMovieTimes = getMovies;
        var rc = allMovieTimes.Status;

        $scope.totMovies = 0;
        $scope.totTheaters = 0;
        $scope.totExcludedMovies = 0;
        $scope.totExcludedTheaters = 0;

        if (rc == "fail") {

            angular.forEach(allMovieTimes.ErrMessage, function (value, key) {
                console.log(key);
            });

            $scope.navTitle = 'Movie Times -- error';
        }
        else {

            var movieData = allMovieTimes.MovieTimesNew;

            var beginTime = -1;
            var endTime = 26;
            var titleFilter = "";
            var filteredMovieData = [];
            var excludedTheaters = [];

            if (( settingsObj.viewbegintime != undefined) && ( settingsObj.viewbegintime != "")) {
                beginTime = parseInt(settingsObj.viewbegintime);
            }
            if (( settingsObj.viewendtime != undefined) && ( settingsObj.viewendtime != "" )) {
                endTime = parseInt(settingsObj.viewendtime);
            }
            if (( settingsObj.viewstartsWith != undefined) && ( settingsObj.viewstartsWith != "")) {
                titleFilter = settingsObj.viewstartsWith;
            }

            var exList = $localstorage.getObject("tsExcluded");

            if (exList.ts != undefined) {

                excludedTheaters = exList.theaterNames;
            }

            for (var i = 0; i < movieData.length; i++) {

                var amovie = movieData[i];
                var movieBeginTime = parseInt(amovie.time.substring(0, 2));
                var theaterName = amovie.theater;

                if (movieBeginTime < beginTime) continue;
                if (movieBeginTime > endTime) continue;
                if (_.startsWith(amovie.title.toLowerCase(), titleFilter) == false) continue;

                var exIdx = _.indexOf(excludedTheaters, theaterName);
                if (exIdx != -1) continue;

                filteredMovieData.push(amovie);

            }

            var theaterNames = allMovieTimes.theaterNames;


            $scope.totExcludedTheaters = excludedTheaters.length;
            $scope.totExcludedMovies = movieData.length - filteredMovieData.length;

            $scope.moviesAtSpecificTimes = moviesAtSpecificTimes(filteredMovieData, settingsObj.viewTimeSpan);


            $scope.totMovies = movieData.length;
            $scope.totTheaters = theaterNames.length;
        }


        $scope.navTitle = 'Movie Times';
        //$scope.movieCount = allMovieTimes.MovieTimes.length;
        $scope.data = {showDelete: false, showReorder: false};

        $scope.showTheaters = function () {
            $state.go("tplMovieTheaters");
        };

        var scrollcnt = 0;

        $scope.scroller = function () {
            scrollcnt++;
            if (scrollcnt == 300) {
                console.log('here');
            }
            //window.status = window.pageXOffset;
            //console.log('scrollerpo ' + window.pageXOffset);
            //console.log('scrollersl1 ' + document.documentElement.scrollLeft);
            //console.log('scroller screen w ' + screen.availWidth);
            //console.log('scrollersl2 ' + screenLeft);
            //console.log('scroller ww ' + window.outerWidth);
        };

        $scope.edit = function (item) {
            console.log('Edit Item: ' + item.keyTime);
        };
        $scope.share = function (item) {
            console.log('Share Item: ' + item.keyTime);
        };

        $scope.moveItem = function (item, fromIndex, toIndex) {
            $scope.moviesAtSpecificTimes.splice(fromIndex, 1);
            $scope.moviesAtSpecificTimes.splice(toIndex, 0, item);
        };

        $scope.onItemDelete = function (item) {
            $scope.moviesAtSpecificTimes.splice($scope.moviesAtSpecificTimes.indexOf(item), 1);
        };

        $scope.toggleGroup = function (group, el) {
            var elem1 = document.getElementsByName(el);
            var elem2 = document.getElementById(el);
            if ($scope.isGroupShownClass1(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };

        $scope.isGroupShownClass1 = function (group, index, last) {
            var outerdiv = $(".outerdiv").length;
            var innerdiv = $(".innerdiv").length;
            var xxx = $(".xxx").length;

            if (last == true) {
                //console.log('group shown class1');
            }

            //console.log('class1 ' + index + ' ' + last + ' ' + outerdiv + ' ' + innerdiv + ' ' + xxx);
            var rc = $scope.shownGroup === group;
            return rc;
        };
        $scope.isGroupShownClass2 = function (group, index, last) {
            var outerdiv = $(".outerdiv").length;
            var innerdiv = $(".innerdiv").length;
            var xxx = $(".xxx").length;

            if (last == true) {
                //console.log('group shown class2 ');
            }

            //console.log('class2 ' + index + ' ' + last + ' ' + outerdiv + ' ' + innerdiv + ' ' + xxx);
            var rc = $scope.shownGroup === group;
            return rc;
        };


        $scope.isGroupShownShow = function (group, index, last) {
            //  console.log('show ' + index + ' ' + last);
            var rc = $scope.shownGroup === group;
            return rc;
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


