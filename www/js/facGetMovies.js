(function () {

    angular
        .module('MovieApp')
        .factory('GetMovieData', getMovieData);

    getMovieData.$inject
        = ['$q', '$localstorage', '$http', 'constants', '$ionicLoading', 'facSettings', 'refreshCache'];

    function getMovieData($q, $localstorage, $http, constants, $ionicLoading, facSettings, refreshCache) {

        var movieData = {
            status: "ok",
            errMsg: "",
            tsMovies : null,
            tsTheaterNames : null,
            tsMovieName : null,
            tsExcluded : null
        };

        console.log("getMovieData factory");

        return {
            getMovies: getMoviesFn
            //,clearMovies: clearMoviesFn
        };

        function clearMoviesFn() {

            movieData.tsMovies = null;
            movieData.tsTheaterNames = null;
            movieData.tsMovieName = null;
        }

        function getMoviesFn() {

            $ionicLoading.show({
                template: 'Getting movies...'
            });

            var settingsObj = facSettings.getSettingsObj();

            //var tsMovies = $localstorage.getObject("tsMovies");
            if ( refreshCache.refresh == true) {

                clearMoviesFn();
            }

            if (movieData.tsMovies != null) {
                //$ionicLoading.hide();
                return $q.when(movieData);
            }

            var q = $q.defer();

            //var mtURL = "http://emptywebapiazure.azurewebsites.net/api/values?callback=JSON_CALLBACK";
            var mtURL = constants.serviceURL;
            var xx    = settingsObj;

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
                //q.reject(err);
                movieData.status = "error";
                movieData.errMsg = "error response from jsonp:" + err;
                q.resolve(movieData);
            }

            function httpSuccess(response) {

                console.log('response from jsonp');
                //movieData.status = "error";
                //movieData.errMsg = "error response from jsonp:";
                //q.resolve(movieData);
                //return;

                var errs          = response.data.ErrMessage;
                //var movieTimes    = response.data.MovieTimes;
                var movieTimesIdx = response.data.movieTimesIdx;
                var theaterNames  = response.data.theaterNames.sort();
                var movieNames    = response.data.movieNames.sort();

                var movieTimesNew = [];

                for (var i = 0; i < movieTimesIdx.length; i++) {

                    var movieTimeIdx = movieTimesIdx[i];

                    var movieIdx   = movieTimeIdx.m;
                    var theaterIdx = movieTimeIdx.t;
                    var showTime   = movieTimeIdx.s;

                    var movieName   = movieNames[movieIdx].m;
                    var runTime     = movieNames[movieIdx].r;
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

                movieData.tsMovies = response.data;
                movieData.tsTheaterNames = theaterNames;
                //$ionicLoading.hide();

                q.resolve(movieData);

            }
        }

    }

})();


