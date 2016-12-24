var appControllers=angular.module('app.controllers');
appControllers.controller('ListController',function(Storage,BookmarkService,$scope,Helpers,$state,$modal,focus,toaster){

    $scope.showBookmarks=function(){
      BookmarkService.getBookmarks().then(function(res){
          $scope.bookmarks=res.data;
      });
    }

    $scope.showBookmarks();

    $scope.showCreateBookmarkModal=function(){
      $scope.bookmarkModal=$modal({scope:$scope,show:true,controller:'BookmarkController',
                                   templateUrl:'templates/create_bookmark_modal.html'
                                   });
      }

    $scope.showCreateTagModal=function(){
      $scope.tagModal=$modal({scope:$scope,show:true,controller:'TagController',
                              placement:'center',templateUrl:'templates/create_tag_modal.html'});
      }

    $scope.showDeleteBookmarkModal=function(bookmark){
      $scope.bookmarkToDelete=bookmark;
      $scope.deleteBookmarkModal=$modal({scope:$scope,show:true,placement:'center',controller:'BookmarkController',
                                         templateUrl:'templates/delete_bookmark_modal.html'});
     }
});
