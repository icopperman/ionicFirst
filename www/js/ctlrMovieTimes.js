(function () {

    'use strict';

    angular
        .module('MovieApp')
        .controller("MovieTimesController", MovieTimesController);

    MovieTimesController.$inject = ['$state', '$localstorage', 'getMovies'];

    function MovieTimesController($state, $localstorage, getMovies) {

        var vm = this;

        if ($state.current.name.indexOf('Hor') != -1) {

            var els = $('.outerdiv');

            angular.forEach(els, function (el) {

                console.log('here');
            });
        }


        //$scope.movieCount = allMovieTimes.MovieTimes.length;
        vm.totMovies = 0;
        vm.totTheaters = 0;
        vm.totExcludedMovies = 0;
        vm.totExcludedTheaters = 0;
        vm.navTitle = 'Movie Times';
        //vm.data               = {showDelete: false, showReorder: false};

        vm.showTheaters = showTheaters;
        vm.scroller = scroller;
        vm.toggleGroup = toggleGroup;
        vm.isGroupShownClass1 = isGroupShownClass1;
        vm.isGroupShownClass2 = isGroupShownClass2;
        vm.isGroupShownShow = isGroupShownShow;
        //vm.edit               = edit;
        //vm.share              = share;
        //vm.moveItem           = moveItem;
        //vm.onItemDelete       = onItemDelete;

        var settingsObj = $localstorage.getObject("settings");
        var allMovieTimes = getMovies;
        var rc = allMovieTimes.Status;

        if (rc == "fail") {

            angular.forEach(allMovieTimes.ErrMessage, function (value, key) {
                console.log(key);
            });

            vm.navTitle = 'Movie Times -- error';
        }
        else {

            var movieData = allMovieTimes.MovieTimesNew;

            var filteredMovieData = [];
            var excludedTheaters = [];

            filteredMovieData = filterMovieList();

            var theaterNames = allMovieTimes.theaterNames;

            vm.totExcludedTheaters = excludedTheaters.length;
            vm.totExcludedMovies = movieData.length - filteredMovieData.length;

            vm.moviesAtSpecificTimes = moviesAtSpecificTimes(filteredMovieData, settingsObj.viewTimeSpan);

            vm.totMovies = movieData.length;
            vm.totTheaters = theaterNames.length;
        }

        var scrollcnt = 0;

        function filterMovieList() {

            var beginTime = -1;
            var endTime = 26;
            var titleFilter = "";
            var exList = $localstorage.getObject("tsExcluded");

            if (exList.ts != undefined) {

                excludedTheaters = exList.theaterNames;
            }

            if (( settingsObj.viewbegintime != undefined) && ( settingsObj.viewbegintime != "")) {
                beginTime = parseInt(settingsObj.viewbegintime);
            }
            if (( settingsObj.viewendtime != undefined) && ( settingsObj.viewendtime != "" )) {
                endTime = parseInt(settingsObj.viewendtime);
            }
            if (( settingsObj.viewstartsWith != undefined) && ( settingsObj.viewstartsWith != "")) {
                titleFilter = settingsObj.viewstartsWith;
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

            return filteredMovieData;

        }

        function showTheaters() {
            $state.go("tplMovieTheaters");
        }

        function scroller() {
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
        }

        function toggleGroup(group, el) {
            var elem1 = document.getElementsByName(el);
            var elem2 = document.getElementById(el);
            if (vm.isGroupShownClass1(group)) {
                vm.shownGroup = null;
            } else {
                vm.shownGroup = group;
            }
        }

        function isGroupShownClass1(group, index, last) {
            var outerdiv = $(".outerdiv").length;
            var innerdiv = $(".innerdiv").length;
            var xxx = $(".xxx").length;

            if (last == true) {
                //console.log('group shown class1');
            }

            //console.log('class1 ' + index + ' ' + last + ' ' + outerdiv + ' ' + innerdiv + ' ' + xxx);
            var rc = vm.shownGroup === group;
            return rc;
        }

        function isGroupShownClass2(group, index, last) {
            var outerdiv = $(".outerdiv").length;
            var innerdiv = $(".innerdiv").length;
            var xxx = $(".xxx").length;

            if (last == true) {
                //console.log('group shown class2 ');
            }

            //console.log('class2 ' + index + ' ' + last + ' ' + outerdiv + ' ' + innerdiv + ' ' + xxx);
            var rc = vm.shownGroup === group;
            return rc;
        }

        function isGroupShownShow(group, index, last) {
            //  console.log('show ' + index + ' ' + last);
            var rc = vm.shownGroup === group;
            return rc;
        }
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

    function edit(item) {
        console.log('Edit Item: ' + item.keyTime);
    }

    function share(item) {
        console.log('Share Item: ' + item.keyTime);
    }

    function moveItem(item, fromIndex, toIndex) {
        vm.moviesAtSpecificTimes.splice(fromIndex, 1);
        vm.moviesAtSpecificTimes.splice(toIndex, 0, item);
    }

    function onItemDelete(item) {
        vm.moviesAtSpecificTimes.splice(vm.moviesAtSpecificTimes.indexOf(item), 1);
    }

})();


