var appControllers=angular.module('app.controllers',['toaster']);


appControllers.controller('LoginController',function($scope,$http,$window,$rootScope,CONSTANT,$state,AuthTokenFactory){
    console.log("Login Controller is all hooked up");

    $scope.loginData={};

    $scope.login=function(email,password){
      $scope.loginError=null;
      console.log("Login is called "+email+"  "+password);
      var request_body={"email":email,"password":password};
      $http.post(CONSTANT.API_URL+'/login',request_body,{headers:{'Content-Type': 'application/json'}})
      .then(function(response){
              console.log(JSON.stringify(response));
              AuthTokenFactory.setToken(response.data.token);
              $window.localStorage.setItem('username',response.data.username);
              //$rootScope.loggedIn=true;
              $window.localStorage.setItem('loggedIn',true);
              $state.go('list');
            },
            function(error){
              console.log(JSON.stringify(error));
              $scope.loginError="Oops! Invalid email or password";
            });

    }

});
