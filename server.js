var express = require("express");
var app = express();
var fs = require("fs");
var server = require("http").Server(app);
var io = require("socket.io")(server);
var mongo = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
// var url = "mongodb://localhost:27017/AdvDB";
var url = "mongodb://127.0.0.1:27017/AdvDB"; // or localhost ot 127.0.0.1
const screen1Router = require('./routes/screen1');

const dataBase = require("./db.js");

dataBase();

let count = 0; 

app.use(express.static(__dirname + "/public"));

/* **************************************** app.get **************************************** */

let screen; 
app.get("/screen=:screen" , function(request, response){

  screen = request.params.screen;
  var path = __dirname +"/screen" + screen + ".html";
  response.sendFile(path);

});

ioConnection();

/* **************************************** functions **************************************** */

function ioConnection(){
    io.on("connection", function (socket) { // 4 times
    if(screen == 1){
      console.log("con 1");
      setActive("0");
      count++; 
      mongoFor1(socket);

    }
    else if(screen == 2){
      console.log("con 2");
      setActive("1");
      count++; 
      mongoFor2(socket);
    }
    else if(screen == 3){
      console.log("con 3");
      setActive("2");
      count++; 
      mongoFor3(socket);
    }
    else if(screen == "admin"){

      console.log("the count in connection to admin is: " + count);
      console.log("admin here");
      mongoForAdmin(socket);
    }
    ioDisconnection(socket, screen);
  });
}

function ioDisconnection(socket, num){

  socket.on("disconnect", function(err, res){
    
    console.log("screen in disconnection: " + num);

    if(num == 1){
      console.log("discon 1");
      setNotActive("0");
      count--;
    }
    else if(num == 2){
      console.log("discon 2");
      setNotActive("1");
      count--;
    }
    else if(num == 3){
      console.log("discon 3");
      setNotActive("2");
      count--;
    }
  });

}

/* ****************************** mongo ************************* */

function mongoFor1(socket){
  MongoClient.connect(url, function (err, db){
    if(err) throw err; 
    const dbo = db.db("AdvDB");
    dbo
    .collection("advData")
    .find({show: "0"})
    .toArray(function (err, result){
      if(err) throw err;
      socket.emit("getResultScreen1", result);
      sendTiming(socket, 1);
    });
  });
}

function mongoFor2(socket){
  MongoClient.connect(url, function (err, db){
    if(err) throw err; 
    const dbo = db.db("AdvDB");
    dbo
    .collection("advData")
    .find({show: "1"})
    .toArray(function (err, result){

      if(err) throw err;
      socket.emit("getResultScreen2", result);
      sendTiming(socket, 2);
    });
  });
}

function mongoFor3(socket){
  MongoClient.connect(url, function (err, db){
    if(err) throw err; 
    const dbo = db.db("AdvDB");
    dbo
    .collection("advData")
    .find({show: "2"})
    .toArray(function (err, result){

      if(err) throw err;
      socket.emit("getResultScreen3", result);
      sendTiming(socket, 3);
    });
  });
}

function sendTiming(socket, num){
  MongoClient.connect(url, function (err, db){
    if(err) throw err; 
    var str;
    if(num == 1){
      str ="getTimingScreen1"; 
    }
    else if(num == 2){
      str = "getTimingScreen2";
    }
    else if(num == 3){
      str = "getTimingScreen3";
    }

    var n = num - 1;
    const dbo = db.db("AdvDB");
      dbo
      .collection("users")
      .find({userId: n.toString}) /////////////TODO: check this!
      .toArray(function(err, user){
        if (err) throw err;
        socket.emit(str, user);
      });
  });
}

/* ******************************************** Admin ******************************************** */ 

  app.get('/dashboard', function (req, res) {
    screen = "admin";
    res.sendFile(__dirname + "/dashboard.html"); 
  }); 

  function mongoForAdmin(socket){
    const result = [];
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      const dbo = db.db("AdvDB");
      dbo.collection("users").find({status: "active"}).toArray(function(err,numOfClients){
        if (err) throw err;
        // console.log("count in admin === " + count);
        result[0] = count; 
        dbo.collection("advData").find({}).toArray(function(err,Advs){
          if (err) throw err;
          result[1] = Advs.length;
          socket.emit("getInfoForAdmin", result); // send to num of connections and num of advs. 
          socket.emit("sendAdv",Advs); // send all the advs.
        });

        /* *********************** sockets for buttons ********************** */

        // add button:

        socket.on("newAdvData",function(res){
          result[1];
          var a = newObj(res,result[1]);
          result[1]++;
          dbo.collection("advData").insertOne(a,function(err,res){
            if(err)
              throw err;
            console.log(res);
            dbo.collection("advData").find({}).toArray(function(err, res){
              if(err) throw err;
              socket.emit("getAllAdvsForAdd", res);
            });
          });
        });

        socket.on("getSelectAdv",function(idAdv){
          dbo.collection("advData").findOne({myId:idAdv},function(err,res){
            if(err)
              throw err;
            socket.emit("returnSelectedAdv",res);
          });


          // edit button: 

          socket.on("editAdvData", function(res){

            var adv = newObj(res, idAdv);
            // var a = adv.get();
            console.log("inside the edit in mongo");

            console.log("res: " + res);
            console.log("res[0]: " + res[0]);
            console.log("res[1]: " + res[1]);
            console.log("res[2]: " + res[2]);
            console.log("res[3]: " + res[3]);

            dbo.collection("advData").replaceOne({myId: idAdv}, adv);


          
            // dbo.collection("advData").updateOne({myId: idAdv},  { $set: {
            //    title: adv.title,
            //    line1:adv.text.line1,
            //    line2: adv.text.line2,
            //    line3: adv.text.line3,
            //    line4: adv.text.line4,
            //    line1color: adv.colors.line1color,
            //    line2color: adv.colors.line2color,
            //    line3color: adv.colors.line3color,
            //    line4color: adv.colors.line4color,
            //    background: adv.colors.background,
            //    imgsrc: adv.imgsrc,
            //    show: adv.show,
            //      }  } );


                 console.log("after the edit in mongo");
           
            
          });

        });
        
      });
    }); 
  }

server.listen(8080);




function newObj(res,num){
  var Advobj = {
    myId: num.toString(),
    title: res[0],
    text: {
      line1: res[0],
      line2: res[1],
      line3: res[2],
      line4: res[3],
    },
    colors: {
      line1color: "#E9724C",
      line2color: "#E9724C",
      line3color: "#E9724C",
      line4color: "",
      background: "#EDF2F4",
    },
    imgsrc: res[5],
    show: [""],
  }

  return Advobj;
} 


/* *********************************** Active or Not Active *********************************** */

function setActive(a){
  MongoClient.connect(url, function (err, db) {
      const dbo = db.db("AdvDB");
      dbo
      .collection("users").updateOne({userId: a}, 
      {$set: {status: "active"}});
  });
}


function setNotActive(a){
  MongoClient.connect(url, function (err, db) {
    const dbo = db.db("AdvDB");
    var date = new Date();
    // console.log("UTC: " + date.getUTCMonth());
    var currentDate = `${date.getUTCDate()}.${date.getMonth() + 1}.${date.getFullYear()}   ${date.getHours()}:${date.getUTCMinutes()}`;
    // console.log("current date: " + currentDate);
    dbo
    .collection("users").updateOne({userId: a}, 
    {$set: {status: "Not Active"}});

    dbo.collection("users").updateOne({userId: a}, 
      {$set: {lastConnection: currentDate}});
  
  });
}

