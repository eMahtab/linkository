var appControllers=angular.module('app.controllers');


appControllers.controller('EditController',function($scope,$window,$stateParams,$state,$modal,CONSTANT,$http,focus,toaster){

  if($window.localStorage.getItem('loggedIn') !== 'true'){
    $state.go('login');
  }

  $scope.logout=function(){
    console.log("Logging out");
    $window.localStorage.removeItem('auth-token');
    $window.localStorage.removeItem('loggedIn');
    $window.localStorage.removeItem('username');
    $state.go('index');
    toaster.pop('success',"Yup! you are logged out");
  }

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

    $scope.fetchTags=function(){
      console.log("Loading tags from database");
      $http.get(CONSTANT.API_URL+'/tags?created_by='+$window.localStorage.getItem('username'))
      .then(function(response){
          console.log(JSON.stringify(response.data));
          $scope.allTags=response.data.map(function(element){return element.tag;}).sort();
          $scope.editTags=getSuggestionTags($scope.allTags,$scope.editBookmark.inputTags);
          $scope.editTags.sort();
      });
    }
    $scope.fetchTags();


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
               setTimeout(function(){$state.go('list');},2000);
            },
            function(error){
               console.log("Error while updating bookmark");
            }
          );
    }

    $scope.cancelUpdate=function(){
      $state.go('list');
    }

    $scope.showCreateEditTagModal=function(){
      $scope.newEditTag={};
      $scope.editTagMessage=null;
      $scope.editTagModal=$modal({scope:$scope,show:true,placement:'center',templateUrl:'templates/update_tag_modal.html'});
      $scope.editTagText.input=null;
    }

    $scope.createNewEditTag=function(tag){
      $scope.editTagMessage=null;
      if(undefined_or_empty(tag.name)){
        $scope.editTagMessage='Nay! looks like you forgot to name your tag';return;
      }
      if(!checkTagName(tag.name)){
        $scope.editTagMessage='Oh! only alphabets(a-z) and hypen(-) can be used as tag name';
        return;
      }
      console.log("Creating a new tag "+tag.name);
      var request_body={"name":tag.name.trim().toLowerCase(),"created_by":$window.localStorage.getItem('username')};
      $http.post(CONSTANT.API_URL+'/tag',request_body,{headers:{'Content-Type': 'application/json'}})
      .then(function(response){
             console.log("Successfully created "+response.data);
             toaster.pop('success','Tag created successfully');
             $scope.fetchTags();
             setTimeout(function(){$scope.editTagModal.hide();},2000);
             focus('editBookmarkTagsInput');
           }
           ,function(error){
             console.log("Error "+error);
             $scope.editTagMessage="A tag with this name already exist";
           });
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

function undefined_or_empty(value){
  if(typeof value == 'undefined' || value == '' ){
    return true;
  }else{
    return false;
  }
}

function checkTagName(tagName){
   if(/^[a-zA-Z-]+$/.test(tagName)){
     console.log("Tag Name Valid");
     return true;
   }else{
     console.log("Tag Name Invalid");
     return false;
   }
}
