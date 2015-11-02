'use strict';
app.controller('forgotController', ['$scope', '$location', 'authService', 'ngAuthSettings' , '$routeParams', function ($scope, $location, authService, ngAuthSettings, $routeParams) {

    $scope.errorMessage = "";
    $scope.userData = {
        email: ""
    };

    $scope.newUserData = {
        id: $routeParams.userId,
        token: $routeParams.codeId,
        password: ""
    };

    $scope.forgot = function () {
        authService.forgotPassword($scope.userData.email).then(function (response) {
            $location.path('/forgotSent');
        },
         function (err) {
             $scope.errorMessage = err.error_description;
         });
    };

    $scope.reset = function () {
        authService.resetPassword($scope.newUserData).then(function (response) {
            $location.path('/home');
        },
         function (err) {
             $scope.errorMessage = err.error_description;
         });
    }
}])