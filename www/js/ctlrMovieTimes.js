(function () {

    'use strict';

    angular
        .module('MovieApp')
        .controller("MovieTimesController", MovieTimesController);

    MovieTimesController.$inject = ['$state', '$localstorage', '$ionicLoading', 'facSettings', 'GetMovieData'];

    function MovieTimesController($state, $localstorage, $ionicLoading, facSettings, GetMovieData) {

        var vm = this;

        //if ($state.current.name.indexOf('Hor') != -1) {
        //
        //    var els = $('.outerdiv');
        //
        //    //angular.forEach(els, function (el) {
        //    //
        //    //    console.log('here');
        //    //});
        //}


        //$scope.movieCount = allMovieTimes.MovieTimes.length;
        console.log("MovieTimeCtlr entering");
        vm.totMovies           = 0;
        vm.totTheaters         = 0;
        vm.totExcludedMovies   = 0;
        vm.totExcludedTheaters = 0;
        vm.navTitle            = 'Movie Times';
        //vm.data               = {showDelete: false, showReorder: false};

        vm.showTheaters       = showTheaters;
        vm.scroller           = scroller;
        vm.toggleGroup        = toggleGroup;
        vm.isGroupShownClass1 = isGroupShownClass1;
        vm.isGroupShownClass2 = isGroupShownClass2;
        vm.isGroupShownShow   = isGroupShownShow;
        //vm.edit               = edit;
        //vm.share              = share;
        //vm.moveItem           = moveItem;
        //vm.onItemDelete       = onItemDelete;

        var settingsObj = facSettings.getSettingsObj();//.getObject("settings");

        GetMovieData.getMovies().then(function (allMovieTimes) {

            if (allMovieTimes.status != "ok") {

                angular.forEach(allMovieTimes.ErrMessage, function (value, key) {
                    console.log(value);
                });


                vm.navTitle = 'Movie Times -- error' + allMovieTimes.errMsg;
                return;

            }

            var movieData = allMovieTimes.tsMovieShowTimes;

            var excludedTheaters  = GetMovieData.getExcludedTheaters();

            var filteredMovieData = filterMovieList(movieData, excludedTheaters);

            var theaterNames = allMovieTimes.tsTheaterNames;

            vm.totExcludedTheaters   = excludedTheaters.length;
            vm.totExcludedMovies     = movieData.length - filteredMovieData.length;
            vm.moviesAtSpecificTimes = moviesAtSpecificTimes(filteredMovieData, settingsObj.viewTimeSpan);
            vm.totMovies             = movieData.length;
            vm.totTheaters           = theaterNames.length;


            $ionicLoading.hide();
            var scrollcnt            = 0;
        });

        function filterMovieList(movieData, excludedTheaters) {

            var beginTimeHour = -1;
            var endTimeHour   = 26;
            var titleFilter   = "";
            //var exList        = null;//$localstorage.getObject("tsExcluded");
            var filteredMovieData = [];

            //if (exList != null) {
            //
            //    excludedTheaters = exList.theaterNames;
            //}

            if (( settingsObj.viewbegintime != undefined) && ( settingsObj.viewbegintime != "")) {
                var xx        = new Date(settingsObj.viewbegintime).getHours();
                beginTimeHour = parseInt(xx);
            }

            if (( settingsObj.viewendtime != undefined) && ( settingsObj.viewendtime != "" )) {
                var yy      = new Date(settingsObj.viewendtime).getHours();
                endTimeHour = parseInt(yy);
                if (endTimeHour == 0) endTimeHour = 24;
            }

            if (( settingsObj.viewstartsWith != undefined) && ( settingsObj.viewstartsWith != "")) {
                titleFilter = settingsObj.viewstartsWith;
            }

            for (var i = 0; i < movieData.length; i++) {

                var amovie       = movieData[i];
                var showTimeHour = amovie.time.substr(0, 2);
                var showTimeMin  = amovie.time.substr(3, 2);
                var theaterName  = amovie.theater;
                var hour         = parseInt(showTimeHour);

                if (hour < beginTimeHour) continue;
                if (hour >= endTimeHour) continue;

                if (_.startsWith(amovie.title.toLowerCase(), titleFilter) == false) continue;

                if (excludedTheaters != null) {
                    var exIdx = _.indexOf(excludedTheaters, theaterName);
                    if (exIdx != -1) continue;
                }

                var sfx;

                if (hour == 0) {
                    sfx          = "AM";
                    showTimeHour = "12";
                }
                if (hour < 12) {
                    sfx = "AM";
                }
                if (hour == 12) {
                    sfx = "PM";
                }
                if (hour > 12) {
                    showTimeHour = parseInt(showTimeHour) - 12;
                    sfx          = "PM";
                }

                amovie.time = showTimeHour + ":" + showTimeMin + sfx;

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
            var xxx      = $(".xxx").length;

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
            var xxx      = $(".xxx").length;

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
    }

})();


