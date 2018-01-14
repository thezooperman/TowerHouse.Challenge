angular.module('myApp.Controllers', [])
//IndexController
    .controller('IndexController', function ($scope, $http, $localStorage, $window) {
        $scope.currencies = [];
        $http.get('http://localhost:9090/').then(function (response) {
            $scope.currencies = response.data;
            $scope.open = function (currency) {
                $localStorage.SelectedCurrency = currency;
                $window.open("./detail.html");
            }
        });
    })
    //DetailController
    .controller('DetailController', function ($scope, $http, $localStorage, $interval) {
        $scope.historicalData = [];
        var _currency = '';
        if ($localStorage.SelectedCurrency !== undefined) {
            _currency = $localStorage.SelectedCurrency;
            $scope.legend = _currency;
        }
        $http.get('http://localhost:9090/api/currency/' + _currency).then(function (response) {
            $scope.historicalData = response.data;
            delete $localStorage.SelectedCurrency;
            $scope.refreshDate = $scope.historicalData[0].date
            $scope.refreshPrice = $scope.historicalData[0].priceUSD
            $scope.refreshVolume = $scope.historicalData[0].txVolumeUSD
        });

        $interval(function() {
           $scope.refreshPrice = $http.get('http://localhost:9090/api/getprice/' + _currency)
               .then(function (response) {
                  var a = response.data;
               });
        }, 2000);
    });