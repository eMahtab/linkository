var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );


exports.signup=function(req,res){
   var newuser=new User();
   newuser.username=req.body.username;
   newuser.email=req.body.email;
   newuser.password=req.body.password;

   newuser.save(function(err,savedUser){
       if(err){
         res.status(400).send('An account with same username or email already exist');
       }else{
         res.status(201).send({"username":savedUser.username});
       }
   });
}

exports.login=function(req,res,next){
    var email=req.body.email;
    var password=req.body.password;

    User.findOne({email:email}, function(err,user){
      if(user==null){
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
