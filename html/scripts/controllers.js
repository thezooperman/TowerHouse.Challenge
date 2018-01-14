angular.module('myApp.Controllers', [])
//IndexController
    .controller('IndexController', ['$scope', '$http', 'UserServices', function ($scope, $http, UserServices) {
        $scope.currencies = [];
        $http.get('http://localhost:9090/').
            then(function (response) {
                $scope.currencies = response.data;
            });
        $scope.open = function (currency) {
            UserServices.setValue(currency);
            window.open("./detail.html");
        }
    }])
//DetailController
    .controller('DetailController', ['$scope', '$http', 'UserServices', function ($scope, $http, UserServices) {
        $scope.historicalData = [];
        var _currency = UserServices.getValue();
        $http.get('http://localhost:9090/api/currency/' + _currency).
            then(function (response) {
                $scope.historicalData = response.data;
            });
    }])