var mongoose = require( 'mongoose' );
var Bookmark = mongoose.model( 'Bookmark' );

exports.getBookmark=function(req,res){
   console.log("Fetching bookmark "+JSON.stringify(req.params));
   Bookmark.findOne({"_id":req.params.id},function(err,bookmark){
     console.log("Fetched Bookmark "+bookmark);
     res.status(200).send(bookmark);
   });
}


exports.addBookmark=function(req,res){
   console.log("Creating new bookmark "+JSON.stringify(req.body));
   var newBookmark=new Bookmark();
   newBookmark.link=req.body.link;
   newBookmark.description=req.body.description;
   newBookmark.tags=req.body.tags;

   newBookmark.save(function(err,savedBookmark){
       if(err){
         res.status(400).send('Error occurred while creating bookmark');
       }else{
         res.status(201).send('Bookmark created successfully');
       }
   });
}

exports.updateBookmark=function(req,res){
        var id=req.params.id;
        Bookmark.findOne({"_id":id},

             function(err,bookmark){
                        if(err){
                          res.status(404).send("Error Occurred");
                        }
                        else{
                             if(!bookmark){
                                 res.status(404).send("No bookmark found with id "+id);
                               }
                             else{
                               bookmark.link=req.body.link;
                               bookmark.description=req.body.description;
                               bookmark.tags=req.body.tags

                               bookmark.save(function(err,updatedBookmark){
                                         if(err){
                                           res.status(500).send("Error Occured while updating record");
                                         }
                                         else{
                                           res.status(200).send(updatedBookmark);
                                         }
                                       });
                             }
                            }
                      });
}


exports.getBookmarks=function(req,res){
   Bookmark.find({},function(err,bookmarks){
     res.status(200).send(bookmarks);
   });
}



exports.deleteBookmark=function(req,res){
                             var id=req.params.id;
                             Bookmark.findOneAndRemove({"_id":id},
                             function(err){
                                           if(err){
                                               console.log("Error : "+err);
                                               return res.status(404).send("Bookmark not found");
                                               }
                                           return res.status(200).send("Bookmark deleted Successfully");
                                          });
              }
