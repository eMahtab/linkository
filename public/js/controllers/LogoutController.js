var appControllers=angular.module('app.controllers');

appControllers.controller('LogoutController',function(UserService,$scope,toaster,$state){

  $scope.logout=function(){
    UserService.logout();
    $state.go('index');
    toaster.pop('success',"Yup! you are logged out");
  }

});
