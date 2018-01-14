angular.module('myApp.Services', [])
//UserService
.factory('UserServices', function ($http) {
    var _val = '';
    var services = {};

    services.setValue = function (value) {
        this._val = value;
    };

    services.getValue = function () {
        return this._val;
    };
    return services;
});
