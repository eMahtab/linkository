var appControllers=angular.module('app.controllers');

appControllers.controller('LogoutController',function($scope,$window,toaster,$state){

  $scope.logout=function(){
    $window.localStorage.removeItem('auth-token');
    $window.localStorage.removeItem('loggedIn');
    $window.localStorage.removeItem('username');
    $state.go('index');
    toaster.pop('success',"Yup! you are logged out");
  }

});
