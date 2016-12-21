var appControllers=angular.module('app.controllers');


appControllers.controller('SignupController',function($scope,$http,CONSTANT,toaster,$state){
    console.log("Signup Controller is all hooked up");

    $scope.signupData={};

    $scope.signup=function(username,email,password,confirmPassword){
      $scope.signupError=null;
      console.log("Signup is called "+username+"  "+email+"  "+password);
      if(confirmPassword !== password){
          $scope.signupError='Opps! password did not match, type again';
          $scope.signupData.confirmPassword="";
          return;
      }
      var request_body={"username":username,"email":email,"password":password};
      $http.post(CONSTANT.API_URL+'/signup',request_body,{headers:{'Content-Type': 'application/json'}})
      .then(function(response){
             console.log("Successfully created "+response.data);
             toaster.pop('success','Cheers! your account is created');
             setTimeout(function(){$state.go('login');},3000) ;
           }
           ,function(error){
             $scope.signupError=error.data;
           });

    }

});
