var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );

exports.signup=function(req,res){
   var username=req.body.username;
   var email=req.body.email;
   var password=req.body.password;

   var newuser=new User();
   newuser.username=username;
   newuser.email=email;
   newuser.password=password;

   newuser.save(function(err,savedUser){
       if(err){
         res.status(400).send('An account with same username or email already exist');
       }else{
         res.status(201).send({"username":savedUser.username});
       }
   });
}
