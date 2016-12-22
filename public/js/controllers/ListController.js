var appControllers=angular.module('app.controllers');


appControllers.controller('ListController',function($scope,Helpers,$window,$state,$modal,CONSTANT,$http,focus,toaster){
    if($window.localStorage.getItem('loggedIn') !== 'true'){
      $state.go('login');
    }
  

    $scope.search={"description":'',"link":'',"tags":'',"created_at":''};
    $scope.sortOrder={};
    $scope.sortOrder.order='-created_at';
    $scope.bookmark={};
    $scope.newTag={};
    $scope.tagMessage=null;
    $scope.bookmark.inputTags=[];
    $scope.tags=[];
    $scope.tagText={input:null};
    $scope.tagInputFocus=false;
    $scope.showInputTagField=true;
    $scope.bookmarkMessage=null;

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
      $scope.bookmarkModal=$modal({scope:$scope,show:true,
                                   templateUrl:'templates/create_bookmark_modal.html?n='+cacheBurst
                                   });
      $scope.bookmark={};
      $scope.newTag={};
      $scope.tagMessage=null;
      $scope.bookmark.inputTags=[];
      $scope.tags=[];
      $scope.tagText={input:null};
      $scope.tagInputFocus=false;
      $scope.showInputTagField=true;
      $scope.loadTags();
      $scope.bookmarkMessage=null;
    }

    $scope.removeTag=function(tag){
      console.log("Removing Tag "+tag);
      $scope.bookmark.inputTags.splice($scope.bookmark.inputTags.indexOf(tag),1);
      $scope.tags.push(tag);
      $scope.tags.sort();
      if($scope.bookmark.inputTags.length < 8){$scope.showInputTagField=true;}
      focus('bookmarkTagsInput');
    }

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
          //console.log("Sorted Tags "+response.data.map(function(element){return element.tag;}).sort())
      });
    }

    $scope.selectTag=function(tag){
      $scope.bookmark.inputTags.push(tag); $scope.tags.splice($scope.tags.indexOf(tag),1)
      $scope.tags.sort(); $scope.tagText.input=null;
      if($scope.bookmark.inputTags.length >= 8){$scope.showInputTagField=false;}
      focus('bookmarkTagsInput');
    }

    $scope.showCreateTagModal=function(){
      $scope.newTag={};
      $scope.tagMessage=null;
      $scope.tagModal=$modal({scope:$scope,show:true,placement:'center',templateUrl:'templates/create_tag_modal.html'});
      $scope.tagText.input=null;
    }

    $scope.createTag=function(tag){
      $scope.tagMessage=null;
      if(Helpers.undefined_or_empty(tag.name)){
        $scope.tagMessage='Nay! looks like you forgot to name your tag';return;
      }
      if(!Helpers.checkTagName(tag.name)){
        $scope.tagMessage='Oh! only alphabets(a-z) and hypen(-) can be used as tag name'; return;
      }
      var request_body={"name":tag.name.trim().toLowerCase(),"created_by":$window.localStorage.getItem('username')};
      $http.post(CONSTANT.API_URL+'/tag',request_body,{headers:{'Content-Type': 'application/json'}})
      .then(function(response){
             toaster.pop('success','Tag created successfully');
             $scope.loadTags();
             setTimeout(function(){$scope.tagModal.hide();},2000);
           }
           ,function(error){
             $scope.tagMessage="A tag with this name already exist";
           });
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

    $scope.showBookmarks=function(){
      console.log("B "+CONSTANT.API_URL+'/bookmarks?created_by='+$window.localStorage.getItem('username'));
      $http.get(CONSTANT.API_URL+'/bookmarks?created_by='+$window.localStorage.getItem('username'))
      .then(function(res){
        $scope.bookmarks=res.data;
      })
    }

    $scope.showBookmarks();

    $scope.showDeleteBookmarkModal=function(bookmark){
      $scope.bookmarkToDelete=bookmark;
      $scope.deleteBookmarkModal=$modal({scope:$scope,show:true,placement:'center',
                              templateUrl:'templates/delete_bookmark_modal.html'});
    }

    $scope.deleteBookmark=function(){
      $scope.deleteBookmarkModal.hide();
      $http.delete(CONSTANT.API_URL+'/bookmark/' + $scope.bookmarkToDelete._id)
           .then(function(response){
              $scope.bookmarkToDelete=null;
              toaster.pop("success","Bookmark deleted successfully");
              setTimeout(function(){$scope.showBookmarks();},2000);
           });
    }

});
