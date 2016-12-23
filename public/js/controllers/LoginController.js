var appControllers=angular.module('app.controllers',['toaster']);

appControllers.controller('LoginController',function($scope,$http,$window,$rootScope,CONSTANT,$state,AuthTokenFactory){
    $scope.loginData={};

    $scope.login=function(email,password){
      $scope.loginError=null;
      var request_body={"email":email,"password":password};
      $http.post(CONSTANT.API_URL+'/login',request_body,{headers:{'Content-Type': 'application/json'}})
      .then(function(response){
              AuthTokenFactory.setToken(response.data.token);
              $window.localStorage.setItem('username',response.data.username);
              $window.localStorage.setItem('loggedIn',true);
              $state.go('list');
            },
            function(error){ $scope.loginError="Oops! Invalid email or password";});
    }
});
