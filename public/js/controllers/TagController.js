var appControllers=angular.module('app.controllers');

appControllers.controller('TagController',function(TagService,Storage,$rootScope,focus,$scope,Helpers,toaster,$state){

  $scope.newTag={};
  $scope.tagMessage=null;

  $scope.createTag=function(tag){
    $scope.tagMessage=null;
    if(Helpers.undefined_or_empty(tag.name)){
      $scope.tagMessage='Nay! looks like you forgot to name your tag';
      focus('tagInputControl');return;
    }
    if(!Helpers.checkTagName(tag.name)){
      $scope.tagMessage='Oh! only alphabets(a-z) and hypen(-) can be used as tag name';
      focus('tagInputControl'); return;
    }
    var post_body={"name":tag.name.trim().toLowerCase(),"created_by":Storage.getUsername()};

    TagService.createTag(post_body)
    .then(function(response){
           toaster.pop('success','Tag created successfully');
           $rootScope.$broadcast('newTagAdded', 'New Tag added');
           setTimeout(function(){$scope.tagModal.hide();},2000);
         }
         ,function(error){
           focus('tagInputControl');
           $scope.tagMessage="A tag with this name already exist";
         });
  }

});
