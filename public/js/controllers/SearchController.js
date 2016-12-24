var appControllers=angular.module('app.controllers');

appControllers.controller('SearchController',function($scope,Helpers){

     $scope.search={"description":'',"link":'',"tags":'',"created_at":''};
     $scope.sortOrder={}; $scope.sortOrder.order='-created_at';

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
              return Helpers.compareDate(bookmark.created_at,$scope.search.created_at.toISOString());
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

     $scope.changeOrder=function(order){
       $scope.sortOrder.order=order;
     }

});
