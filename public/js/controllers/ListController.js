var appControllers=angular.module('app.controllers');


appControllers.controller('ListController',function($scope,$modal,CONSTANT,$http,focus,toaster){

    console.log("List Controller is all hooked up");


    $scope.bookmark={};
    $scope.newTag={};
    $scope.tagMessage=null;
    $scope.bookmark.inputTags=[];
    $scope.tags=[];
    $scope.tagText={input:null};
    $scope.tagInputFocus=false;
    $scope.showInputTagField=true;
    $scope.bookmarkMessage=null;

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
      $http.get(CONSTANT.API_URL+'/tags')
      .then(function(response){
          console.log(JSON.stringify(response.data));
          $scope.tags=response.data.map(function(element){return element.tag;}).sort();
          //console.log("Sorted Tags "+response.data.map(function(element){return element.tag;}).sort())
      });
    }

    $scope.selectTag=function(tag){
      console.log("Selecting Tag "+ tag)
      $scope.bookmark.inputTags.push(tag);
      $scope.tags.splice($scope.tags.indexOf(tag),1)
      $scope.tags.sort();
      console.log("Emptying tag input field");
      $scope.tagText.input=null;
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
      if(undefined_or_empty(tag.name)){
        $scope.tagMessage='Nay! looks like you forgot to name your tag';return;
      }
      if(!checkTagName(tag.name)){
        $scope.tagMessage='Oh! only alphabets(a-z) and hypen(-) can be used as tag name';
        return;
      }
      console.log("Creating a new tag "+tag.name);
      var request_body={"name":tag.name.trim().toLowerCase()};
      $http.post(CONSTANT.API_URL+'/tag',request_body,{headers:{'Content-Type': 'application/json'}})
      .then(function(response){
             console.log("Successfully created "+response.data);
             //$scope.tagMessage="Tag "+response.data.tag+" created successfully";
             toaster.pop('success','Tag created successfully');
             $scope.loadTags();
             setTimeout(function(){$scope.tagModal.hide();},2000);
           }
           ,function(error){
             console.log("Error "+error);
             $scope.tagMessage="A tag with this name already exist";
           });
    }

    $scope.createBookmark=function(bookmark){
      $scope.bookmarkMessage=null;
      console.log("Bookmark "+JSON.stringify(bookmark));
       if(undefined_or_empty(bookmark.link)){$scope.bookmarkMessage='Nay! looks like you forgot bookmark link'; return;}
       if(undefined_or_empty(bookmark.description)){$scope.bookmarkMessage='Please fill in bookmark description'; return;}
       if(bookmark.inputTags.length < 1){$scope.bookmarkMessage='Nay! we need at least one tag for bookmark'; return;}
       var comma_separated_tags=commaSeparatedTags(bookmark.inputTags);
       var request_body={"link":bookmark.link,"description":bookmark.description,"tags":comma_separated_tags};
       $http.post(CONSTANT.API_URL+'/bookmark',request_body,{headers:{"Content-Type":"application/json"}})
       .then(function(response){
               console.log("Bookmark created successfully");
               toaster.pop('success','Bookmark created successfully');
               setTimeout(function(){$scope.bookmarkModal.hide();},2000);
            },
            function(error){
               console.log("Error while creating bookmark");
            }
          );
    }

    $scope.showBookmarks=function(){
      $http.get(CONSTANT.API_URL+'/bookmarks')
      .then(function(res){
        $scope.bookmarks=res.data;
      })
    }

    $scope.showBookmarks();

});



function undefined_or_empty(value){
  if(typeof value == 'undefined' || value == '' ){
    return true;
  }else{
    return false;
  }
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

function checkTagName(tagName){
   if(/^[a-zA-Z-]+$/.test(tagName)){
     console.log("Tag Name Valid");
     return true;
   }else{
     console.log("Tag Name Invalid");
     return false;
   }
}
