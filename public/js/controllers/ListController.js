var appControllers=angular.module('app.controllers');


appControllers.controller('ListController',function($scope,Helpers,$window,$state,$modal,CONSTANT,$http,focus,toaster){
    if($window.localStorage.getItem('loggedIn') !== 'true'){
      $state.go('login');
    }

    $scope.search={"description":'',"link":'',"tags":'',"created_at":''};
    $scope.sortOrder={}; $scope.sortOrder.order='-created_at';

    $scope.showBookmarks=function(){
      console.log("B "+CONSTANT.API_URL+'/bookmarks?created_by='+$window.localStorage.getItem('username'));
      $http.get(CONSTANT.API_URL+'/bookmarks?created_by='+$window.localStorage.getItem('username'))
      .then(function(res){
        $scope.bookmarks=res.data;
      })
    }

    $scope.showBookmarks();

    $scope.changeOrder=function(order){
      $scope.sortOrder.order=order;
    }

    $scope.searchBookmarks=function(bookmark){

      if($scope.search.description === '' && $scope.search.link === ''
             && $scope.search.tags === '' && $scope.search.created_at === ''){
        return true;
      }
      else{

        if($scope.search.description !== '' && bookmark.description.toLowerCase().indexOf($scope.search.description.toLowerCase()) !== -1){
            return true;
        }
        if($scope.search.link !== '' && bookmark.link.toLowerCase().indexOf($scope.search.link.toLowerCase()) !== -1){
            return true;
        }
        if($scope.search.created_at == null && $scope.search.description == ''
              && $scope.search.link == '' && $scope.search.tags == '' ){
            return true;
        }
        if($scope.search.created_at !== '' && typeof($scope.search.created_at) !== 'undefined' && $scope.search.created_at !== null){
             return compareDate(bookmark.created_at,$scope.search.created_at.toISOString());
        }
        if($scope.search.tags !== ''){
           var searchTags=$scope.search.tags.toLowerCase().split(',');
           for(var i=0;i<searchTags.length;i++){
                 if(bookmark.tags.indexOf(searchTags[i]) === -1){
                   return false;
                 }
           }
             return true;
        }
        return false;
      }
    }

    $scope.showCreateBookmarkModal=function(){
      var cacheBurst=Date.now();
      $scope.bookmarkModal=$modal({scope:$scope,show:true,controller:'BookmarkController',
                                   templateUrl:'templates/create_bookmark_modal.html?n='+cacheBurst
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
