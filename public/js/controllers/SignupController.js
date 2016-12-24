var appControllers=angular.module('app.controllers');

appControllers.controller('SignupController',function(UserService,$scope,toaster,$state){
    $scope.signupData={};

    $scope.signup=function(username,email,password,confirmPassword){
      $scope.signupError=null;
      if(confirmPassword !== password){
          $scope.signupError='Opps! password did not match, type again';
          $scope.signupData.confirmPassword="";
          return;
      }
      var request_body={"username":username,"email":email,"password":password};
      UserService.signup(request_body)
      .then(function(response){
             toaster.pop('success','Cheers! your account is created');
             setTimeout(function(){$state.go('login');},3000) ;
            }
           ,function(error){$scope.signupError='An account with same username or email already exist';}
         );
    }
});
