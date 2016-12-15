var appControllers=angular.module('app.controllers');


appControllers.controller('ListController',function($scope,$modal,CONSTANT,$http){

    console.log("List Controller is all hooked up");
    $scope.bookmark={};
    $scope.tag={};
    $scope.tagMessage=null;
    $scope.tags=[];

    $scope.showCreateBookmarkModal=function(){
      $scope.bookmarkModal=$modal({scope:$scope,show:true,templateUrl:'templates/create_bookmark_modal.html'});
      $scope.loadTags();
    }

    $scope.loadTags=function(){
      console.log("Loading tags from database");
      $http.get(CONSTANT.API_URL+'/tags')
      .then(function(response){
          console.log(JSON.stringify(response.data));
          $scope.tags=response.data;
      });
    }

    $scope.showCreateTagModal=function(){
      $scope.tag={};
      $scope.tagMessage=null;
      $scope.tagModal=$modal({scope:$scope,show:true,templateUrl:'templates/create_tag_modal.html'});
    }

    $scope.createTag=function(){
      $scope.tagMessage=null;
      console.log("Creating a new tag "+$scope.tag.name);
      var request_body={"name":$scope.tag.name};
      $http.post(CONSTANT.API_URL+'/tag',request_body,{headers:{'Content-Type': 'application/json'}})
      .then(function(response){
             console.log("Successfully created "+response.data);
             $scope.tagMessage="Tag "+response.data.tag+" created successfully";
           }
           ,function(error){
             console.log("Error "+error);
             $scope.tagMessage="A tag with this name already exist";
           });
    }

    $scope.createBookmark=function(){
      console.log("Creating bookmark");
    }

});
