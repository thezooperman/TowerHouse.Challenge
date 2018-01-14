angular.module('myApp.Controllers', [])
//IndexController
    .controller('IndexController', function ($scope, $http, $localStorage) {
        $scope.currencies = [];
        $http.get('http://localhost:9090/').
            then(function (response) {
                $scope.currencies = response.data;
            });
        $scope.open = function (currency) {
            $localStorage.SelectedCurrency = currency;
            window.open("./detail.html");
        }
    })
//DetailController
    .controller('DetailController', function ($scope, $http, $localStorage) {
        $scope.historicalData = [];
        var _currency = '';
        if ($localStorage.SelectedCurrency !== undefined) {
            _currency = $localStorage.SelectedCurrency;
        }
        $http.get('http://localhost:9090/api/currency/' + _currency).
            then(function (response) {
                $scope.historicalData = response.data;
                delete $localStorage.SelectedCurrency;
            });
    });