var appControllers=angular.module('app.controllers');

appControllers.controller('SignupController',function(UserService,$scope,toaster,$state){
    $scope.user={};

    $scope.signup=function(){
      $scope.signupError=null;
      if($scope.user.confirmPassword !== $scope.user.password){
          $scope.signupError='Opps! password did not match, type again';
          $scope.user.confirmPassword="";
          return;
      }
      var request_body={"username":$scope.user.username,"email":$scope.user.email,"password":$scope.user.password};
      UserService.signup(request_body)
      .then(function(response){
             toaster.pop('success','Cheers! your account is created');
             setTimeout(function(){$state.go('login');},3000) ;
            }
           ,function(error){$scope.signupError='An account with same username or email already exist';}
         );
    }
});
