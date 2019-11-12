var express = require('express');
var app = express();
// var router = express.Router();
var path = require('path');

var http=require('http').createServer(app);
var https = require('https');

var io=require('socket.io')(http);

var bodyParser = require('body-parser');
var cors = require('cors');

var multer = require('multer');


app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({extended: false});

var mongoose = require("mongoose");

//var connectionString = 'mongodb://localhost/carone';
var connectionString = 'mongodb+srv://wagaugusto:W8uH6GqihQtBdWfj@cluster0-h4z8c.azure.mongodb.net/test?retryWrites=true&w=majority';

// use remote connection string
// if running in remote server
/*if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
}*/

/*var db = mongoose.connect(connectionString , function(){
    console.log('Connect to the database ' + connectionString)
});*/

var db = mongoose.connect(connectionString, {
    reconnectTries: 100,
    reconnectInterval: 500,
    autoReconnect: true,
    useNewUrlParser: true
  })
    .catch(err => console.log('Mongo connection error', err))

//var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var request = require('request');

// load session support
var session = require('express-session');

// load passport module
var passport = require('passport');

// load cookie parsers
var cookieParser = require('cookie-parser');

// configure cookie parser - needed for oauth
app.use(cookieParser());

// configure session support
//var key=process.env.SESSION_SECRET;
var key="dhiraj";
app.use(session({
    secret: key,
    resave: true,
    saveUinitialized: true
}));

// initialize passport and session support
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());



// require("./public/assignment/server/app.js")(app,db);
require("./server/app.js")(app,db);
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, '/client'));
app.set('view engine', 'html');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(express.static(__dirname + '/client'));
// app.use(function (req, res, next) {
//     res.render('index')
//     next();  
// });

app.get('/', function(req, res){
    res.render('index');
});
app.listen(port, function(){
    console.log('App listening to port ' + port);
    
});
// http.listen(port, ipaddress);

//on coonection disconnection

io.sockets.on('connection', function(socket){
    
    socket.on('chat',function(message){
        console.log("chat");
        console.log(message);
        var alertMsg= "New Message : " + message.message + "from "+"@"+message.fromUser;
        io.in(message.toUser).emit('chat',alertMsg);
    });
    
    socket.on('create', function(user){
        console.log("create socket");
        socket.join(user);
    });
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});



app.post('/maps', urlencodedParser, function (req, results) {
    
    var URL="https://maps.googleapis.com/maps/api/directions/json?&origin=ORIGIN&destination=DESTINATION&key=AIzaSyD_70F4Mj8HaLj4AS8IYt4ZXyJGm2v-KD0";
    var a=URL.replace("ORIGIN",req.body.origin);
    var b=a.replace("DESTINATION",req.body.destination);
    
    console.log(b);
    request({
        url: b,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            //console.log(response);
            // console.log(body) // Print the json response
            results.json(body);
        }
    });
    
});

app.post('/hello2', function(req, res){
    res.json(app.get("https://maps.googleapis.com/maps/api/place/autocomplete/json?input=LOCATION&types=geocode&key=AIzaSyA3nKVMjeVHJbKe7D8M6U8SFlg4kTZU1bg"));
});

module.exports =app;