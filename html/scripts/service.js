angular.module('myApp.Services', [])
//UserService
    .factory('UserServices', function () {
        var data = {};

        var setValue = function(currency) {
            data.Value = currency;
        }

        var getValue = function() {
            return data.Value;
        }

        return {
            setValue: setValue,
            getValue: getValue
        }
    });
