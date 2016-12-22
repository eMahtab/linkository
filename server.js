var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var db=require('./models/db.js');
var signup=require('./routes/signup.js');
var login=require('./routes/login.js');
var tag=require('./routes/tags.js');
var bookmark=require('./routes/bookmark.js');

var jwtSecret = 'fjkdlsajfoew239053/3uk';

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(expressJwt({ secret: jwtSecret }).unless({ path: ['/','/bookmarks','/favicon.ico','/signup','/login','/tag','/tags','/bookmark']}));
//app.use(expressJwt({ secret: jwtSecret }).unless({ path: ['/','/fonts','/signup','/login']}));

app.get('/',function(req,res){
   res.sendFile('index.html',{ root: __dirname });
});

app.post('/signup',signup.signup);
app.post('/login',login.login,function(req,res){
    console.log("Successfully authenticated "+req.body.username);
    var token = jwt.sign({username: req.body.username}, jwtSecret);
    res.status(200).send({token: token,username: req.body.username});
});

app.post('/tag',tag.tag);
app.get('/tags',tag.tags);

app.get('/bookmark/:id',bookmark.getBookmark);
app.get('/bookmarks',bookmark.getBookmarks);
app.post('/bookmark',bookmark.addBookmark);
app.put('/bookmark/:id',bookmark.updateBookmark);
app.delete('/bookmark/:id',bookmark.deleteBookmark);

var port = process.env.PORT || 8080;
var server=app.listen(port,function(req,res){
    console.log("Catch the action at http://localhost:"+port);
});
