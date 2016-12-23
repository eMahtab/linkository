var appControllers=angular.module('app.controllers');

appControllers.controller('BookmarkController',function($http,focus,$scope,CONSTANT,Helpers,$window,toaster,$state){
    $scope.bookmark={};
    $scope.bookmark.inputTags=[];
    $scope.tags=[];
    $scope.bookmarkMessage=null;
    $scope.tagText={input:null};
    $scope.showInputTagField=true;

    $scope.loadTags=function(){
      console.log("Loading tags from database");
      $http.get(CONSTANT.API_URL+'/tags?created_by='+$window.localStorage.getItem('username'))
      .then(function(response){
          console.log(JSON.stringify(response.data));
          $scope.tags=response.data.map(function(element){
                                        if($scope.bookmark.inputTags.indexOf(element.tag)==-1){
                                          return element.tag;
                                        }
                                      }).sort();
      });
     }

    $scope.loadTags();

    $scope.$on('newTagAdded', function(event, data){
      focus('bookmarkTagsInput');
      console.log("Loading New tags ... ");
      $scope.loadTags();
    });

  $scope.selectTag=function(tag){
    $scope.bookmark.inputTags.push(tag); $scope.tags.splice($scope.tags.indexOf(tag),1)
    $scope.tags.sort(); $scope.tagText.input=null;
    if($scope.bookmark.inputTags.length >= 8){$scope.showInputTagField=false;}
    focus('bookmarkTagsInput');
  }

  $scope.removeTag=function(tag){
    console.log("Removing Tag "+tag);
    $scope.bookmark.inputTags.splice($scope.bookmark.inputTags.indexOf(tag),1);
    $scope.tags.push(tag);
    $scope.tags.sort();
    if($scope.bookmark.inputTags.length < 8){$scope.showInputTagField=true;}
    focus('bookmarkTagsInput');
  }

  $scope.createBookmark=function(bookmark){
    $scope.bookmarkMessage=null;
     if(Helpers.undefined_or_empty(bookmark.link)){$scope.bookmarkMessage='Nay! looks like you forgot bookmark link'; return;}
     if(Helpers.undefined_or_empty(bookmark.description)){$scope.bookmarkMessage='Please fill in bookmark description'; return;}
     if(bookmark.inputTags.length < 1){$scope.bookmarkMessage='Nay! we need at least one tag for bookmark'; return;}
     var comma_separated_tags=Helpers.commaSeparatedTags(bookmark.inputTags);
     var request_body={"link":bookmark.link,"description":bookmark.description,"tags":comma_separated_tags,
                       "created_at":Date.now().toString(),"created_by":$window.localStorage.getItem('username')};
     $http.post(CONSTANT.API_URL+'/bookmark',request_body,{headers:{"Content-Type":"application/json"}})
     .then(function(response){
             toaster.pop('success','Bookmark created successfully');
             setTimeout(function(){$scope.bookmarkModal.hide();$scope.showBookmarks();},2000);
          },
          function(error){
             console.log("Error while creating bookmark");
          }
        );
  }

  $scope.deleteBookmark=function(_id){
    $scope.deleteBookmarkModal.hide();
    $http.delete(CONSTANT.API_URL+'/bookmark/' + _id)
         .then(function(response){
            toaster.pop("success","Bookmark deleted successfully");
            setTimeout(function(){$scope.showBookmarks();},2000);
         });
  }

});
