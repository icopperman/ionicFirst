var appFac = angular.module('MovieApp');

appFac.factory('GeoService', function ($q, $localstorage, $http) {

    console.log("geoservice factory");

    var settingsObj = _init();

    return {

        getZip: function () {

            console.log("factory getzip");

            var aprom1 = _getLocation();
            var aprom2 = aprom1.then(_reverseGeocode);

            return aprom2;

        },

        getSettingsAndMovies: function () {

            var q = $q.defer();

            var mtURL = "http://emptywebapiazure.azurewebsites.net/api/values?callback=JSON_CALLBACK";
            var xx = settingsObj;
            var config = {
                method: "JSONP"
                , url: mtURL
                , params: xx
                , timeout: 5000
            };

            $http(config).then(
                function (response) {
                    console.log('response from jsonp');
                    q.resolve(response.data);
                },
                function (err) {
                    console.log('error response from jsonp');
                    q.reject(err);
                }
            );

            return q.promise;
        }
    };

    function _init() {

        var d = new Date();
        var n = d.getTimezoneOffset();
        var adate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

        return {
            viewdate: adate,
            viewzip: "99999",
            viewmiles: "10",
            viewbegintime: d.getHours(),
            viewendtime: "",
            titlestartsWith: "",
            viewLat: "",
            viewLon: ""
        };

    }

    function _getLocation() {

        var q = $q.defer();

        var geoOptions = {enableHighAccuracy: false, timeout: 3000, maximumAge: 0};

        console.log("getlocation");

        navigator.geolocation.getCurrentPosition(
            function (position) {
                console.log("getlocation success: " + position);
                q.resolve(position);
            },
            function (error) {
                console.log("getlocation error: " + error);
                q.reject(error);
            }
            , geoOptions
        );

        return q.promise;
    }

    function _reverseGeocode(position) {

        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        settingsObj.viewLat = lat;
        settingsObj.viewLon = lng;

        var q = $q.defer();

        var geocoder = new google.maps.Geocoder();
        console.log("reverseGeocdoe:" + position);
        $localstorage.setObject('settings', settingsObj);

        geocoder.geocode({
                'latLng': new google.maps.LatLng(lat, lng)
            },
            function (geoResults, status) {

                var zip = "66666";

                if (status != google.maps.GeocoderStatus.OK) {
                    console.log('reverse fail', geoResults, status);
                    q.reject(geoResults);
                }
                else {
                    console.log('Reverse', geoResults);

                    for (var i = 0; i < geoResults.length; i++) {

                        var ageoResult = null;

                        for (var j = 0; j < geoResults[i].types.length; j++) {

                            if (geoResults[i].types[j] == "postal_code") {
                                ageoResult = geoResults[i];
                                break;
                            } //end for loop over a georesult type array
                        }

                        if (ageoResult == null) continue;

                        for (var k = 0; k < ageoResult.address_components.length; k++) {

                            var aAddrCompo = null;

                            for (var l = 0; l < ageoResult.address_components[k].types.length; l++) {

                                if (ageoResult.address_components[k].types[l] == "postal_code") {
                                    aAddrCompo = ageoResult.address_components[k];
                                    break;
                                }
                            } //end for loop over a georesult type array

                            if (aAddrCompo == null) continue;

                            var xx = $localstorage.getObject("settings");
                            settingsObj.viewzip = aAddrCompo.short_name;
                            $localstorage.setObject("settings", settingsObj);
                            //$("#viewzip").val(zip);

                            break;

                        }

                    } //end for loop over geoResults

                    console.log('Reverse', zip);
                    //$scope.$apply(function() {
                    //    $scope.viewzip = zip;

                    //});
                    q.resolve(settingsObj);

                } //end if geocoder ok

                //return q.promise;

            } //end function result,status
        ); //end geocode

        return q.promise;
    }

});


//function successGetMovies(data) {
//    console.log("invoked webapi svc, success");
//
//    var rc = data.Status;
//    if (rc == "fail") {
//        $.each(data.ErrMessage, function (idx, amsg) {
//            console.log(amsg);
//        });
//
//    }
//    else {
//        movieData = data.MovieTimes;
//        //$("#basetable").remove();
//        if (type == 1) createTable(data.MovieTimes);
//        else createBaseTable(data.MovieTimes);
//
//    }
//}

//.then(function(xxx) {
//     console.log("getlocation then sucess: " + xxx);
//     return xxx;
// })
//.catch(function(reason) {
//        console.log("getlocation error: " + reason);
//    });
//.finally(function(xxx) {
//    console.log("getlocation finally: " + xxx);
//    return xxx;
//})

//.factory("getMoviesService", ['$q', '$http',
//        function($q, $http) {
//
//            //var mtURL = "http://" + window.location.host + "/api/values";
//            var mtURL = "http://emptywebapiazure.azurewebsites.net/api/values?callback=JSON_CALLBACK";
//
//            return {
//
//                getMovies: function (obj) {
//                    return $http.jsonp(mtURL,  {
//                        method: "GET",
//                        //data: obj,
//                        params: obj
//                        //transformRequest: function(data, headersGetter) {
//                        //    console.log("here");
//                        //},
//                        //transformResponse: function(data, headersGetter) {
//                        //    console.log('here');
//                        //}
//                    });
//                    //.success(function(data, status, headers, config) {
//                    //        console.log('here');
//                    //})
//                    //.error(function(data, status, headers, config) {
//                    //        console.log('here');
//                    //});
//                }
//            }
//        }
//    ]);

//function createTable(movies) {
//    $("#content").append("<table id='basetable' rules='all' border='1'>"
//    + "<tr><th>cnt</th><th id='hdrTime'>time</th><th>rt</th>"
//    + "<th id='hdrTitle' width=400>movie</th><th id='hdrTheater'>theater</th></tr></table>");
//    $.each(movies,
//        function (idx, aval) {
//            var arow = "<tr>"
//                + "<td>" + idx + "</td>"
//                + "<td>" + aval.d + "</td>"
//                + "<td>" + aval.r + "</td>"
//                + "<td>" + aval.t + "</td>"
//                + "<td>" + aval.h + "</td>"
//                + "</tr>";
//            $("#basetable").append(arow);
//
//        });
//}

//function createBaseTable(movies) {
//
//    $("#content").append("<div style='float:left;'>"
//    + "<table id='basetable' rules='all' border='1'>"
//    + "<tr><th>#</th><th>Time</th><th>Movies</th></tr>"
//    + "</table></div>");
//    moviesByTime = _.groupBy(movies, function (amovie) { return amovie.d; });
//
//    var cnt = 1;
//
//    _.forEach(moviesByTime,
//        function (moviesAtTime, keyTime, allMovies) {
//            var arow = "<tr key='" + keyTime + "' >"
//                + "<td>" + cnt + "</td>"
//                + "<td>" + keyTime + "</td>"
//                + "<td>" + moviesAtTime.length + " movies at this time</td>"
//                + "</tr>";
//            $("#basetable").append(arow);
//            cnt++;
//        });
//
//    $("#content").on("click", "tr", function () {
//        var thetr = this;
//        var key = $(thetr).attr('key');
//        var data = moviesByTime[key];
//        createSideTable(data, key);
//        console.log('here');
//    })
//
//    $("#content").on("mouseenter", "tr", function () {
//        var thetr = this;
//        var key = $(thetr).attr('key');
//        var data = moviesByTime[key];
//        createSideTable(data, key);
//        console.log('here');
//    })
//    $("#content").on("mouseleave", "tr", function () {
//        $("#sidetable").remove();
//        console.log('here');
//    })
//}
//
//function createSideTable(movies, key) {
//    $("#sidetable").remove();
//    $("#content").append("<div  style='float:left; margin-left: 10px;' >"
//    + "<table id='sidetable' rules='all' border='1'>"
//    + "<tr><th>#</th>"
//    + "<th id='hdrTitle' width=400>" + movies.length + " movies at " + key
//    + "</th><th id='hdrTheater'>theater</th><th>rt</th></tr>"
//    + "</table></div>");
//    $.each(movies,
//        function (idx, aval) {
//            idx++;
//            var arow = "<tr>"
//                + "<td>" + idx + "</td>"
//                + "<td>" + aval.t + "</td>"
//                + "<td>" + aval.h + "</td>"
//                + "<td>" + aval.r + "</td>"
//                + "</tr>";
//            $("#sidetable").append(arow);
//
//        });
//}


//app.factory('$localstorage', ['$window', function($window) {
//    return {
//        set: function(key, value) {
//            $window.localStorage[key] = value;
//        },
//        get: function(key, defaultValue) {
//            return $window.localStorage[key] || defaultValue;
//        },
//        setObject: function(key, value) {
//            $window.localStorage[key] = JSON.stringify(value);
//        },
//        getObject: function(key) {
//            return JSON.parse($window.localStorage[key] || '{}');
//        }
//    }
//}])
