var appService=angular.module('app.service',[]);

appService.service('Helpers',function(){
     return {
        'compareDate' :  function(bookmarkDate,search){
                            var bookmark_date=new Date(bookmarkDate);
                            var search_criteria=new Date(search);

                            if(bookmark_date.getDate() == search_criteria.getDate()
                              && bookmark_date.getMonth() == search_criteria.getMonth()
                              && bookmark_date.getFullYear() == search_criteria.getFullYear()){
                                return true;
                              }
                              else{
                                return false;
                              }
                            },
        'extractDate' :  function(isoDate){
                            var date=new Date(isoDate);
                            var day=date.getDate();
                            var month=date.getMonth()+1;
                            var year=date.getFullYear();
                            console.log("Extracted date "+day+"-"+month+"-"+year);
                            return day+"-"+month+"-"+year;
                          } ,
        'checkTagName' : function(tagName){
                            if(/^[a-zA-Z-]+$/.test(tagName)){
                                console.log("Tag Name Valid");
                                return true;
                              }else{
                                console.log("Tag Name Invalid");
                                return false;
                              }
                            },

       'commaSeparatedTags'  :   function(tagsArray){
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
                                  },

        'undefined_or_empty' :   function (value){
                                    if(typeof value == 'undefined' || value == '' ){
                                          return true;
                                        }else{
                                          return false;
                                        }
                                  }

     }
});


appService.service('Storage',function($window){
  var store = $window.localStorage;
      return{
            getUsername: getUsername,
            setUsername: setUsername,
            remove:remove,
            save:save
      };
    function getUsername() {
      return store.getItem('username');
    }
    function setUsername(username) {
      return store.setItem('username',username);
    }
    function remove(key){
      return store.removeItem(key);
    }
    function save(key,value){
      return store.setItem(key,value);
    }

});

appService.service('AuthService',function($window){
     return{
       isLoggedIn:isLoggedIn
     };
     function isLoggedIn(){
       if($window.localStorage.getItem('loggedIn')){
         return true;
       }else{
         console.log("User is not logged in");
         return false;
       }
     }
});


appService.service('BookmarkService',function($http,CONSTANT,Storage){
   this.getBookmark = function(_id) {
       return $http.get('/bookmark/'+_id);
     };

   this.getBookmarks = function() {
        return $http.get('/bookmarks?created_by='+Storage.getUsername());
      };

   this.createBookmark = function(bookmark) {
        return $http.post('/bookmark',bookmark,{headers:{"Content-Type":"application/json"}});
      };

   this.deleteBookmark = function(_id){
     return $http.delete('/bookmark/'+_id);
   };

   this.updateBookmark = function(_id,bookmark){
     return $http.put('/bookmark/'+_id,bookmark,{headers:{"Content-Type":"application/json"}});
   }
});


appService.service('TagService',function($http,CONSTANT,Storage){
   this.getTags = function(){
     return $http.get('/tags?created_by='+Storage.getUsername());
   };

   this.createTag = function(tag){
     return $http.post('/tag',tag,{headers:{'Content-Type': 'application/json'}});
   };
});

appService.service('UserService',function($http,CONSTANT,Storage){

      this.signup = function(user){
        return $http.post('/signup',user,{headers:{'Content-Type': 'application/json'}});
      };

      this.login = function(user){
        return $http.post('/login',user,{headers:{'Content-Type': 'application/json'}});
      };

      this.logout = function(){
         Storage.remove('auth-token');
         Storage.remove('username');
         Storage.remove('loggedIn');
      };
});
