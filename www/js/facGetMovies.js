(function () {

    angular
        .module('MovieApp')
        .factory('GetMovieData', getMovieData);

    getMovieData.$inject = ['$q', '$localstorage', '$http', 'constants', '$ionicLoading'];

    function getMovieData($q, $localstorage, $http, constants, $ionicLoading) {

        console.log("getMovieData factory");

        return {
            getMovies: getMoviesFn
        };

        function getMoviesFn() {

            $ionicLoading.show( {
                template: 'Loading...'
            });

            var settingsObj = $localstorage.init();
            var tsMovies = $localstorage.getObject("tsMovies");

            if (tsMovies != undefined) {
                //$ionicLoading.hide();
                return $q.when(tsMovies);
            }

            var q = $q.defer();

            //var mtURL = "http://emptywebapiazure.azurewebsites.net/api/values?callback=JSON_CALLBACK";
            var mtURL = constants.serviceURL;
            var xx = settingsObj;

            var config = {
                method: "JSONP",
                url: mtURL,
                params: xx,
                timeout: 5000
            };

            $http(config).then(httpSuccess, httpErr);

            return q.promise;

            function httpErr(err) {
                //$ionicLoading.hide();

                console.log('error response from jsonp');
                q.reject(err);
            }

            function httpSuccess(response) {

                console.log('response from jsonp');

                var errs = response.data.ErrMessage;
                var movieTimes = response.data.MovieTimes;
                var movieTimesIdx = response.data.movieTimesIdx;
                var theaterNames = response.data.theaterNames.sort();
                var movieNames = response.data.movieNames.sort();

                var movieTimesNew = [];

                for (var i = 0; i < movieTimesIdx.length; i++) {

                    var movieTimeIdx = movieTimesIdx[i];

                    var movieIdx = movieTimeIdx.m;
                    var theaterIdx = movieTimeIdx.t;
                    var showTime = movieTimeIdx.s;

                    var movieName = movieNames[movieIdx].m;
                    var runTime = movieNames[movieIdx].r;
                    var theaterName = theaterNames[theaterIdx];

                    var obj = {
                        cnt: i + 1,
                        time: showTime,
                        theater: theaterName,
                        runtime: runTime,
                        title: movieName
                    };

                    movieTimesNew.push(obj);
                }

                response.data.MovieTimesNew = movieTimesNew;

                //var tsMovies = {ts: Date.now(), movies: response.data};
                //var tsMoviesIdx    = { ts: Date.now(), movieTimesIdx: movieTimesIdx};
                //var tsMovieNames   = { ts: Date.now(), movieNames: movieNames };
                //var tsTheaterNames = {ts: Date.now(), theaterNames: theaterNames};

                //$localstorage.setObject("tsMovies", tsMovies);

                //$localstorage.setObject("tsMoviesIdx", tsMoviesIdx);
                //$localstorage.setObject("tsMovieNames", tsMovieNames);
                //$localstorage.setObject("tsTheaterNames", tsTheaterNames);

                $localstorage.setObject("tsMovies", response.data);
                $localstorage.setObject("tsTheaterNames", theaterNames);
                //$ionicLoading.hide();

                q.resolve(response.data);

            }
        }

    }

})();


