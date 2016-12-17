var appControllers=angular.module('app.controllers');


appControllers.controller('EditController',function($scope,$stateParams,$state,$modal,CONSTANT,$http,focus,toaster){

    console.log("Edit Controller is all hooked up for "+JSON.stringify($stateParams));
    $scope.editBookmark={};
    $scope.editTags=[];
    $scope.allTags=[];
    $scope.editTagText={};
    $scope.editTagText.input=null;
    $scope.editBookmarkMessage=null;

    $http.get(CONSTANT.API_URL+'/bookmark/'+$stateParams.id)
    .then(function(response){
       $scope.editBookmark.link=response.data.link;
       $scope.editBookmark.description=response.data.description;
       $scope.editBookmark.inputTags=response.data.tags.split(',').sort();
       if($scope.editBookmark.inputTags.length ==8){
         $scope.showEditTagField=false;
       }else{
         $scope.showEditTagField=true;
       }
    });

    $scope.loadTags=function(){
      console.log("Loading tags from database");
      $http.get(CONSTANT.API_URL+'/tags')
      .then(function(response){
          console.log(JSON.stringify(response.data));
          $scope.allTags=response.data.map(function(element){return element.tag;}).sort();
          $scope.editTags=getSuggestionTags($scope.allTags,$scope.editBookmark.inputTags);
          $scope.editTags.sort();
      });
    }
    $scope.loadTags();


    $scope.removeEditTag=function(tag){
      console.log("Removing Tag "+tag);
      $scope.editBookmark.inputTags.splice($scope.editBookmark.inputTags.indexOf(tag),1);
      $scope.editTags.push(tag);
      $scope.editTags.sort();
      if($scope.editBookmark.inputTags.length < 8){$scope.showEditTagField=true;}
      focus('editBookmarkTagsInput');
    }

    $scope.selectEditTag=function(tag){
      console.log("Selecting Tag "+ tag);
      $scope.editBookmark.inputTags.push(tag);
      $scope.editTags.splice($scope.editTags.indexOf(tag),1)
      $scope.editTags.sort();
      console.log("Emptying tag input field");
      $scope.editTagText.input=null;
      if($scope.editBookmark.inputTags.length >= 8){$scope.showEditTagField=false;}
      focus('editBookmarkTagsInput');
    }

    $scope.updateBookmark=function(bookmark){
      $scope.editBookmarkMessage=null;
      console.log("Bookmark "+JSON.stringify(bookmark));
       if(undefined_or_empty(bookmark.link)){$scope.editBookmarkMessage='Nay! looks like you forgot bookmark link'; return;}
       if(undefined_or_empty(bookmark.description)){$scope.editBookmarkMessage='Please fill in bookmark description'; return;}
       if(bookmark.inputTags.length < 1){$scope.editBookmarkMessage='Nay! we need at least one tag for bookmark'; return;}
       var comma_separated_tags=commaSeparatedTags(bookmark.inputTags);
       var request_body={"link":bookmark.link,"description":bookmark.description,"tags":comma_separated_tags};
       $http.put(CONSTANT.API_URL+'/bookmark/'+$stateParams.id,request_body,{headers:{"Content-Type":"application/json"}})
       .then(function(response){
               console.log("Bookmark updated successfully");
               toaster.pop('success','Bookmark updated successfully');
            },
            function(error){
               console.log("Error while updating bookmark");
            }
          );
    }



  });


  function getSuggestionTags(allTags,bookmarkTags ) {
    return allTags.filter(function (tag) {
        return bookmarkTags.indexOf(tag) == -1;
    });
}

function commaSeparatedTags(tagsArray){
  var size=tagsArray.length;
  var commaSeparatedTags='';
  for(var i=0;i<size;i++){
    if(i < size-1){
      commaSeparatedTags +=tagsArray[i]+',';
    }else{
      commaSeparatedTags +=tagsArray[i];
    }
  }
  return commaSeparatedTags;
}
