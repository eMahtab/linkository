var mongoose = require( 'mongoose' );
var Tag = mongoose.model( 'Tag' );

exports.tag=function(req,res){
   var tagname=req.body.name;

   var newTag=new Tag();
   newTag.tag=tagname;

   newTag.save(function(err,savedTag){
       if(err){
         res.status(400).send('A tag with this name already exist');
       }else{
         res.status(201).send({"tag":savedTag.tag});
       }
   });
}


exports.tags=function(req,res){
   Tag.find({},function(err,tags){
     res.status(200).send(tags);
   })
};
