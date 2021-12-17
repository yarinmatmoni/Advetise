var express = require('express');
var app = express();
var fs = require('fs');
var data = JSON.parse(fs.readFileSync("./data.json"));
const getWork = require("./work");

app.get('/screen=1',function(request,response){
    response.sendFile(__dirname + "/screen.html");
    const array1 = data.screen[0].advArray;

    getWork();
});

app.get('/screen=2',function(request,response){
    response.sendFile(__dirname + "/screen.html");
});

app.get('/screen=3',function(request,response){
    response.sendFile(__dirname + "/screen.html");
});


app.get('/style.css', function(req, response) {
    response.sendFile(__dirname + "/" + "style.css");
});

app.listen(8080);

