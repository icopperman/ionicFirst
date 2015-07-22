(function () {

    angular
        .module('MovieApp')
        .factory('GetMovieData', getMovieData);

    getMovieData.$inject
        = ['$q', '$localstorage', '$http', '$timeout',  'constants', '$ionicLoading', 'facSettings', 'refreshCache'];

    function getMovieData($q, $localstorage, $http, $timeout, constants, $ionicLoading, facSettings, refreshCache) {

        console.log("getMovieData factory");

        var movieData = {
            status            : "",
            errMsg            : "",
            tsMovieShowTimes  : null,
            tsTheaterNames    : null,
            tsMovieNames      : null,
            tsExcludedTheaters: null
        };

        return {
            getMovies: getMoviesFn,
            getTheaterNames: getTheaterNamesFn,
            getExcludedTheaters: getExcludedTheatersFn,
            setExcludedTheaters: setExcludedTheatersFn

            //,clearMovies: clearMoviesFn
        };

        function getTheaterNamesFn()
        {
            return movieData.tsTheaterNames

        }

        function getExcludedTheatersFn()
        {
            return movieData.tsExcludedTheaters;

        }
        function setExcludedTheatersFn(xx)
        {
            movieData.tsExcludedTheaters = xx;

        }
        function clearMoviesFn() {

            movieData.tsMovieShowTimes = null;
            movieData.tsTheaterNames   = null;
            movieData.tsMovieNames     = null;
        }

        function getMoviesFromGoogle() {

            var aurl = "http://www.google.com/movies?near=10065&date=0&view=list&callback=JSON_CALLBACK"
            $http.jsonp(aurl)
                .success(function (data, status, headers, config) {
                    console.log("here");
                })
                .error(function( data, status, headers, config) {
                    console.log('here');

                });
        }

        function getMoviesFn() {

            console.log("movie factory, getMovies function");
            $ionicLoading.show({
                template: 'Getting movies...'
            });

            //getMoviesFromGoogle();
            var settingsObj = facSettings.getSettingsObj();

            //var tsMovies = $localstorage.getObject("tsMovies");
            if (refreshCache.refresh == true) {

                console.log("clearing cache");
                clearMoviesFn();
            }

            if (movieData.tsMovieShowTimes != null) {
                //$ionicLoading.hide();
                console.log("returning movies from factory variable");
                refreshCache.refresh = false;
                $ionicLoading.hide();
                return $q.when(movieData);
            }

            var q = $q.defer();

            var toDeferred = $q.defer();
            var timedOut = false;

            //var mtURL = "http://emptywebapiazure.azurewebsites.net/api/values?callback=JSON_CALLBACK";
            var mtURL = constants.serviceURL;
            var xx    = settingsObj;

            var config = {
                method : "JSONP",
                url    : mtURL,
                params : xx,
                timeout: toDeferred.promise
            };

            console.log("getting movies from server");
            $http(config).then(httpSuccess, httpErr);

            $timeout(function() {
                timedOut = true;
                toDeferred.resolve();
            }, 30000);

            return q.promise;

            function httpErr(err) {
                //$ionicLoading.hide();

                if ( timedOut == true)
                {
                    console.log('timed out ' + err);
                    movieData.status = "error";
                    movieData.errMsg = "<b>Timed out retrieving Movie times, try again later...</b>";
                }
                else {
                    console.log('error response from jsonp: ' + err);
                    //q.reject(err);
                    movieData.status = "error";
                    movieData.errMsg = "error response from jsonp: " + err;
                }

                refreshCache.refresh = true;
                $ionicLoading.hide();
                q.resolve(movieData);
            }

            function httpSuccess(response) {

                console.log('response from jsonp : ' + response.data.Source + ',' + response.data.Status);
                //movieData.status = "error";
                //movieData.errMsg = "error response from jsonp:";
                //q.resolve(movieData);
                //return;

                movieData.status = response.data.Status;
                movieData.errMsg = "";

                if (movieData.status != "ok") {

                    refreshCache.refresh = true;
                    angular.forEach(response.data.ErrMessage, function (value, key) {
                        console.log(value);
                        movieData.errMsg += value + "<br/>";
                    });
                    q.resolve(movieData);
                    return;

                }
                //var movieTimes    = response.data.MovieTimes;
                var movieTimesIdx = response.data.movieTimesIdx;
                var theaterNames  = response.data.theaterNames;//.sort();
                var movieNames    = response.data.movieNames;///.sort();

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
                        cnt    : i + 1,
                        time   : showTime,
                        theater: theaterName,
                        runtime: runTime,
                        title  : movieName
                    };

                    movieTimesNew.push(obj);
                }

                //response.data.MovieTimesNew = movieTimesNew;

                movieData.tsMovieShowTimes = movieTimesNew;//response.data;
                movieData.tsTheaterNames   = theaterNames;
                movieData.tsMovieNames     = movieNames;
                movieData.tsExcludedTheaters = [];
                $ionicLoading.hide();
                refreshCache.refresh = false;

                q.resolve(movieData);

            }
        }

    }

})();


