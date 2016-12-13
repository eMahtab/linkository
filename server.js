var express=require('express');
var app=express();

var port = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/',function(req,res){
   res.sendFile('index.html',{ root: __dirname });
});


var server=app.listen(port,function(req,res){
    console.log("Catch the action at http://localhost:"+port);
});
