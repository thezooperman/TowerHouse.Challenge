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
            $scope.refreshDate = '--';//$scope.historicalData[0].date;
            $scope.refreshPrice = '--';//$scope.historicalData[0].priceUSD;
            $scope.refreshVolume = '--';//$scope.historicalData[0].txVolumeUSD;
        });

        switch (_currency) {
            case 'DogeCoin':
                _currency = 'doge'
                break;
            case 'Ethereum':
                _currency = 'eth'
                break;
            case 'Litecoin':
                _currency = 'ltc'
                break;
            default:
                _currency = 'btc';
        }
        var url = 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_INTRADAY&symbol=' + _currency + '&market=USD&apikey=SQ53PLSDSYK58K0A';

        //Route the call from client to external REST API
        var interval = $interval(function () {
            $http.get(url)
                .then(function (response) {
                    var finalData = response.data['Time Series (Digital Currency Intraday)'];
                    var lastKey = Object.keys(finalData)[0];
                    var lastVal = finalData[lastKey];
                    $scope.refreshDate = new Date(lastKey).toISOString().slice(0, 10);
                    $scope.refreshPrice = Number.parseFloat(Object.values(lastVal)[0]).toFixed(2);
                    $scope.refreshVolume = Number.parseFloat(Object.values(lastVal)[2]).toFixed(2);
                });
        }, 2000);

        //Route the call to REST API Server - No need due to server issue to handle frequent requests
        // var interval = $interval(function () {
        //     $http.get('http://localhost:9090/api/getprice/' + _currency)
        //         .then(function (response) {
        //             $scope.refreshDate = new Date(response.data.date).toISOString().slice(0, 10);
        //             $scope.refreshPrice = Number.parseFloat(response.data.price).toFixed(2);
        //             $scope.refreshVolume = Number.parseFloat(response.data.volume).toFixed(2);
        //         });
        // }, 2000);
    });
