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

app.get("/changepass", function(req, res){
  screen = "changepass";
  res.sendFile(__dirname + "/changepass.html");
});

app.get("/logIn", function(req, res){
  screen = "logIn";
  res.sendFile(__dirname + "/logIn.html");
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
    else if(screen == "changepass"){
      console.log("inside the change password");
      mongoForChangePassword(socket);

    }
    else if(screen == "logIn"){
      console.log("inside log in");
      mongoForLogIn(socket);


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
    // else if(screen == "admin"){
    //   accessAdmin = false; 
    // }
  });
}

/* ****************************** mongo ************************* */

function mongoForChangePassword(socket){

  socket.on("change", function(data){

    MongoClient.connect(url, function (err, db){
      if(err) throw err; 
      const dbo = db.db("AdvDB");

      dbo.collection("userAdmin").find({}).toArray(function(err, result){
        if (err) throw err;
        var dbData = result[0];
        var lastName = data[0];
        var newName = data[1]
        var ladtPassword = data[2];
        var newPassword = data[3];

        
        console.log("dbData pass: " + dbData.password);
        console.log("dbData name: " + dbData.userName);

        if(dbData.password == ladtPassword && dbData.userName == lastName){
          dbo.collection("userAdmin").updateOne({}, {$set: {password: newPassword}});
          dbo.collection("userAdmin").updateOne({}, {$set: {userName: newName}});
          socket.emit("right", "Password and name changed!");
        }
        else{
          socket.emit("wrong", "Last password or last name Wrong!");
        }
      });
    });
  });
}

function mongoFor1(socket){
  MongoClient.connect(url, function (err, db){
    if(err) throw err; 
    const dbo = db.db("AdvDB");

    dbo
    .collection("advData")
    .find({show: "0"})
    .toArray(function (err, result){ 
     
      if(err) throw err;
      dbo.collection("users").find({userId: "0"}).toArray(function(err, res){
        var correctOrder = [];
        var advsUserOreder = res[0].advList;
        fixOrder(advsUserOreder, result, correctOrder);
        if(err) throw err;
        socket.emit("getResultScreen1", correctOrder);
        sendTiming(socket, 1);
      });
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
      dbo.collection("users").find({userId: "1"}).toArray(function(err, res){
        var correctOrder = [];
        var advsUserOreder = res[0].advList;
        fixOrder(advsUserOreder, result, correctOrder);
        if(err) throw err;
        socket.emit("getResultScreen2", correctOrder);
        sendTiming(socket, 2);
      });
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
      dbo.collection("users").find({userId: "2"}).toArray(function(err, res){
        var correctOrder = [];
        var advsUserOreder = res[0].advList;
        fixOrder(advsUserOreder, result, correctOrder);
        if(err) throw err;
        socket.emit("getResultScreen3", correctOrder);
        sendTiming(socket, 3);
      });
    });
  });
}


function fixOrder(advsUserOreder, result, correctOrder){
 
  for(let i = 0; i<advsUserOreder.length; i++){
    for(let j = 0; j<result.length; j++){
      if(advsUserOreder[i] == result[j].myId){
        correctOrder.push(result[j]);
        break;
      }
    }
  }
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
      .find({userId: n.toString()}) 
      .toArray(function(err, user){
        if (err) throw err;
        console.log("the str: " + str);
        socket.emit(str, user);
      });
  });
}

/* ******************************************** Admin ******************************************** */ 

  app.get('/dashboard', function (req, res) {
    if(accessAdmin == true){
      screen = "admin";
      res.sendFile(__dirname + "/dashboard.html"); 
    }
    else{
      res.send("Must verify admin details");
    }
  }); 

  function mongoForAdmin(socket){
    const result = [];
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      const dbo = db.db("AdvDB");
      result[0] = count; 
      var array;

      dbo.collection("advData").find({}).toArray(function(err,Advs){
        if (err) throw err;
        result[1] = Advs.length;
        array = Advs;
        socket.emit("getInfoForAdmin", result); // send to num of connections and num of advs. 
        socket.emit("sendAllAdvs",Advs); // send all the advs.
      });

      dbo.collection("users").find({}).toArray(function(err, clients){
        var isConnClient = [];
        for(let i = 0; i<clients.length; i++){
          if(clients[i].status == "active"){
            isConnClient.push(true);
          }
          else{
            isConnClient[i] = false;
          }
        }
        socket.emit("infoClients", isConnClient);
      });

        /* *********************** sockets for buttons ********************** */

        ////////////////////////////////// add button //////////////////////////////////

        // need to do a refresh at the end!!! (effect the id and the selector!)

      socket.on("newAdvData",function(res){
        var lastId = array[array.length - 1].myId; 
        console.log("the last id is: " + lastId);
        var sh = [];
        var newAdv = createAdv(res, (++lastId), sh);

        dbo.collection("advData").insertOne(newAdv,function(err,res){
          if(err) throw err;
        });
      });        

      socket.on("logout", function(err, logout){
        accessAdmin = logout;
      });

      ////////////////////////////////// edit button //////////////////////////////////

      socket.on("getSelectAdv",function(idAdv){

        dbo.collection("advData").findOne({myId:idAdv},function(err,res){
          if(err) throw err;
          socket.emit("returnSelectedAdv",res);
        });

        socket.on("editAdvData", function(res){
          dbo.collection("advData").find({myId: idAdv}).toArray(function(err, showArr){
            var sh = showArr[0].show;
            var newAdv = createAdv(res, idAdv, sh);
            dbo.collection("advData").replaceOne({myId: idAdv}, newAdv);
          });
        });

        ////////////////////////////////// delete button //////////////////////////////////

        socket.on("deleteAdv", function(idOfAdv){
          dbo.collection("advData").find({myId: idOfAdv}).toArray(function(err, res){
            var adv = res[0];
            var arr = adv.show; 
            for(let i = 0; i < arr.length; i++){
              deleteFromAll(dbo, idOfAdv, arr[i]);
            }
            dbo.collection("advData").deleteOne({myId: idOfAdv});
          });
        });
      });  

        ////////////////////////////////// client /////////////////////////////////

      socket.on("getAdvByScreen", function(currenScreen){

        dbo.collection("users").find({userId: currenScreen}).toArray(function(err, result){
          if (err) throw err;
          var advList = result[0].advList; 
          dbo.collection("advData").find({}).toArray(function(err, all){
            var sendAdv = [];
            var sendToDelete = [];

            findAdvsForAddAndDelete(all, advList, sendAdv, sendToDelete);
            
            socket.emit("getArrayOfAdsToAdd",sendAdv);
            socket.emit("getArrayOfAdsToDelete",sendToDelete);

          });   
          addDataToScreen(socket, dbo);
        });
      });

      socket.on("getAdvToDeleteFromScreen", function(data){
        var currentScreen = data[0];
        var idToDelete = data[1];
        deleteFromAll(dbo, idToDelete, currentScreen);

      });  
    }); 
  }

server.listen(8080);


function deleteFromAll(dbo, idToDelete, currentScreen){
  dbo.collection("advData").find({myId: idToDelete}).toArray(function(err, result){
    if(err) throw err; 
    var showReplace = []; 
    showReplace = result[0].show;
    console.log("the show: " + showReplace);
    var index = showReplace.indexOf(currentScreen);
    showReplace.splice(index);
    dbo.collection("advData").updateOne({myId: idToDelete}, {$set: {show: showReplace}});
  });

  dbo.collection("users").find({userId: currentScreen}).toArray(function(err, users){
    var user = users[0];
    var newAdvList = user.advList;
    var newTiming = user.timing;
    var index = newAdvList.indexOf(idToDelete); 
    newAdvList.splice(index, 1);
    newTiming.splice(index, 1);
    dbo.collection("users").updateOne({userId: currentScreen}, {$set: {advList: newAdvList}});
    dbo.collection("users").updateOne({userId: currentScreen}, {$set: {timing: newTiming}});
  });
}

function addDataToScreen(socket, dbo){

  socket.on("addAdvToScreen", function(data){
    var screenNum = data[0];
    var advNum = data[1];
    var timingNum = data[2];
    var show = [];

    dbo.collection("advData").find({myId: advNum}).toArray(function(err, relevatAdv){
      if (err) throw err;
      showArray = relevatAdv[0].show;
      showArray.push(screenNum); 

      dbo.collection("advData").updateOne({myId: advNum}, {$set: {show: showArray}});
      dbo.collection("users").find({userId: screenNum}).toArray(function(err, users){
        var user = users[0];
        var timingArray = [];
        var advListArray = [];

        advListArray = user.advList;
        advListArray.push(advNum);
        timingArray = user.timing;
        timingArray.push(timingNum)

        dbo.collection("users").updateOne({userId: screenNum}, {$set: {advList: advListArray}});
        dbo.collection("users").updateOne({userId: screenNum}, {$set: {timing: timingArray}});
      });
    });
  });
}

function findAdvsForAddAndDelete(all, advList, sendAdv, sendToDelete){
  for(let i=0; i<all.length; i++){
    var bol = false; 
    for(let j=0; j<advList.length; j++){
      if(all[i].myId == advList[j]){
        bol = true;
      }
    }
    if(bol == false){
      sendAdv.push(all[i]);
    }else{
      sendToDelete.push(all[i]);
    }
  }
}

function createAdv(res,num, showArray){
  console.log("the res is: " + res);
    var Advobj = {
      myId: num.toString(),
      title: res[0],
      text: {
        line1: res[1],
        line2: res[2],
        line3: res[3],
        line4: res[4],
      },
      colors: {
        line1color: res[5],
        line2color: res[6],
        line3color: res[7],
        line4color: res[8],
        background: res[9],
      },
      imgsrc: res[10],
      show: showArray,
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
    var currentDate = `${date.getUTCDate()}.${date.getMonth() + 1}.${date.getFullYear()}   ${date.getHours()}:${date.getUTCMinutes()}`;
    dbo
    .collection("users").updateOne({userId: a}, 
    {$set: {status: "Not Active"}});

    dbo.collection("users").updateOne({userId: a}, 
      {$set: {lastConnection: currentDate}});
  
  });
}



/* ***************************** logIn ************************ */

var accessAdmin = false; 

function mongoForLogIn(socket){
  socket.on("getDataAdmin", function(data){
    var name = data[0];
    var pass = data[1];
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      const dbo = db.db("AdvDB");
      dbo.collection("userAdmin").find({}).toArray(function(err, result){
        var user = result[0];
        if(user.password == pass && user.userName == name){
          accessAdmin = true; 
          socket.emit("ok", "success");
        }
        else{
          socket.emit("validition", "wrong");
        }
      });
    });
  });
}




