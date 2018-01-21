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
        // switch (_currency) {
        //     case 'DogeCoin':
        //         _currency = 'doge'
        //         break;
        //     case 'Ethereum':
        //         _currency = 'eth'
        //         break;
        //     case 'Litecoin':
        //         _currency = 'ltc'
        //         break;
        //     default:
        //         _currency = 'btc';
        // }
        var url = 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_INTRADAY&symbol=' + _currency + '&market=USD&apikey=SQ53PLSDSYK58K0A';

        // var interval = $interval(function () {
        //     $http.get(url)
        //         .then(function (response) {
        //             var newArr = [];
        //             angular.forEach(response.data, (msg)=>
        //             {
        //                 // if (msg.hasOwnProperty('Time Series (Digital Currency Intraday)'))
        //                 // {
        //                     // console.log(msg);
        //                     // console.log(response.data[msg]);
        //                     if (msg !== undefined || msg !== null) {
        //                         newArr.push(msg);
        //                         // angular.forEach(msg, (text)=>{
        //                         //     console.log(text);
        //                         // });
        //                     }
        //                 // }
        //             });
        //             console.log(newArr);
        //             $scope.refreshDate = response.data.date;
        //             $scope.refreshPrice = response.data.price;
        //             $scope.refreshVolume = response.data.volume;
        //         });
        // }, 5000);

        var interval = $interval(function () {
            $http.get('http://localhost:9090/api/getprice/' + _currency)
                .then(function (response) {
                    $scope.refreshDate = response.data.date;
                    $scope.refreshPrice = response.data.price;
                    $scope.refreshVolume = response.data.volume;
                });
        }, 2000);
    });