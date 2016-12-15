var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );


exports.login=function(req,res,next){
    var email=req.body.email;
    var password=req.body.password;

    User.findOne({email:email}, function(err,user){
      console.log("User "+user);
      if(user==null){
        console.log("user with that email is not found");
        res.status(400).end('No account with this email');
      }
     else{
      req.body.username=user.username;
      user.comparePassword(password,function(err,isMatch){
       if(isMatch && isMatch==true){
         next();
       }else{
         res.status(400).end('Invalid email or password');
       }
     });
     }
    });
}
