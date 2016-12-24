var appControllers=angular.module('app.controllers',['toaster']);

appControllers.controller('LoginController',function(UserService,$scope,$window,$state,AuthTokenFactory){
    $scope.loginData={};

    $scope.login=function(email,password){
      $scope.loginError=null;
      var request_body={"email":email,"password":password};
      UserService.login(request_body)
      .then(function(response){
              AuthTokenFactory.setToken(response.data.token);
              $window.localStorage.setItem('username',response.data.username);
              $window.localStorage.setItem('loggedIn',true);
              $state.go('list');
            },
            function(error){ $scope.loginError="Oops! Invalid email or password";});
    }
});
