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

// mongoForScreen0();
// mongoForScreen1();

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
    ioDisconnection(socket)
  });
}

function ioDisconnection(socket){

  socket.on("disconnect", function(err, res){
  if(screen == 1){
    console.log("discon 1");
    setNotActive("0");
    count--;

  }
  else if(screen == 2){
    console.log("discon 2");
    setNotActive("1");
    count--;
  }
  else if(screen == 3){
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

    // io.on('connection', function(socket) { // need to do in a seperate functions!!! (because the sendFile happend twice)
      // const result = [];
     
      // MongoClient.connect(url, function (err, db) {
      //   if (err) throw err;
      //   const dbo = db.db("AdvDB");

      //   dbo.collection("users").find({status: "active"}).toArray(function(err,numOfClients){
      //     if (err) throw err;
        
      //     // result[0] = numOfClients.length
      //     console.log("count in admin === " + count);
      //     result[0] = count; 

      //     dbo.collection("advData").find({}).toArray(function(err,numOfAdvs){
      //       if (err) throw err;
      //       result[1] = numOfAdvs.length;

      //       console.log("numOfC ================ " + result[0]);
      //       console.log("numOfA ================ " + result[1]);

      //       socket.emit("getInfoForAdmin", result);

      //     });
      //   });
      // });  
    // });

    // res.set("Connection", "close");

  }); 

  function mongoForAdmin(socket){

    const result = [];
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      const dbo = db.db("AdvDB");

      dbo.collection("users").find({status: "active"}).toArray(function(err,numOfClients){
        if (err) throw err;
      
        // result[0] = numOfClients.length
        console.log("count in admin === " + count);
        result[0] = count; 

        dbo.collection("advData").find({}).toArray(function(err,numOfAdvs){
          if (err) throw err;
          result[1] = numOfAdvs.length;

          console.log("numOfC ================ " + result[0]);
          console.log("numOfA ================ " + result[1]);

          socket.emit("getInfoForAdmin", result);

        });
      });
    }); 
  }

server.listen(8080);

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




// app.get("/", function (request, response) { // maybe need to change the "/"!!!!!!!!! to :

//   console.log("*****************************************************************");
//   // /screen=:screen
//   console.log("made here");
//   const {screen} = request.query;
//   // const screen = request.params.screen;

//   // console.log("screen =========== " + screen);


//   if(screen === "1"){
//     console.log("in 111111");

//     // response.sendFile(__dirname + "/screen1.html");          // duplicate!!!!!!!!!!

//     MongoClient.connect(url, function (err, db){

//       if(err) throw err; 
//       console.log("in mongo");
//       const dbo = db.db("AdvDB");

//       dbo
//       .collection("advData")
//       .find({})
//       .toArray(function (err, result){

//         if(err) throw err;
//         console.log("intooooo db");

//         count++;
//         console.log("count ======= " + count);

//         response.sendFile(__dirname + "/screen1.html", function(err){ // asynchronous 


//           // console.log("insideeeeeeeeeeeeeeeeeeeee");
//           // console.log("into sendFile");
//           // if(err){
//           //   response.end;
//           //   console.log("problem with sendFile");
//           // }
//           // response.end;
          
//           // console.log("insideeeeeeeeeee2222222222");


//         });

//         io.on("connection", function (socket) { // 4 times

//           console.log("connection 1");
       

          
//           // socket.emit("getResult", result);
          
//           // dbo.
//           //   collection("users")
//           //   .find({userId: "0"})
//           //   .toArray(function(err, user){
//           //     if (err) throw err;
//           //     // console.log(result);
//           //     socket.emit("getTiming", user);

//           //   });

//             // setActive("0");

//             // socket.on("disconnect", function(err, res){ // 2 times
//             //   console.log("disconnect");
//             //   count--;
//             //   setNotActive("0");

//             // });
//         });
      

//         // console.log("intooooo db2");


//         response.end;

//       });
//     });


//   }
//   else if(screen === "2"){
//     console.log("in 2222222");
//     response.end;


//   }
//   else if(screen === "3"){
//     console.log("in 3333333");
//     response.end;

//   }
  


//   // switch (screen) {
//     // case "1": {
//     // if(screen === "1"){
//     //   MongoClient.connect(url, function (err, db) {
//     //     if (err) throw err;
//     //     const dbo = db.db("AdvDB");

//     //     dbo
//     //       .collection("advData")
//     //       .find({ show: "0" })
//     //       .toArray(function (err, result) {
//     //         if (err) throw err;
//     //         // console.log(result);
//     //         response.sendFile(__dirname + "/screen1.html");
//     //         io.on("connection", function (socket) { // 4 times
//     //           // socket.removeAllListeners(); 
//     //           console.log("connection 1");
//     //           count++;
//     //           socket.emit("getResult", result);
              
//     //           dbo.
//     //             collection("users")
//     //             .find({userId: "0"})
//     //             .toArray(function(err, user){
//     //               if (err) throw err;
//     //               // console.log(result);
//     //               socket.emit("getTiming", user);

//     //             });

//     //             setActive("0");

//     //             socket.on("disconnect", function(err, res){ // 2 times
//     //               console.log("disconnect");
//     //               count--;
//     //               setNotActive("0");

//     //             });
//     //         });

         
//     //       });

        
//     //   });
//     //   // break;
//     // }
//   //   // case "2": {
//   //   else if(screen === "2"){  
//   //     MongoClient.connect(url, function (err, db) {
//   //       if (err) throw err;
//   //       const dbo = db.db("AdvDB");

//   //       dbo
//   //         .collection("advData")
//   //         .find({ show: "1" })
//   //         .toArray(function (err, result) {
//   //           if (err) throw err;
//   //           // console.log(result);
//   //           response.sendFile(__dirname + "/screen2.html");
//   //           io.sockets.on("connection", function (socket) {
//   //             socket.emit("getResult", result);
              
//   //             dbo.
//   //               collection("users")
//   //               .find({userId: "1"})
//   //               .toArray(function(err, user){
//   //                 if (err) throw err;
//   //                 // console.log(result);
//   //                 socket.emit("getTiming", user);

//   //               });

//   //               setActive("1");
              
//   //               socket.on("disconnect", function(err, res){
//   //               console.log("in disconnection"); 
//   //               setNotActive("1");

//   //             });
//   //           });
//   //         });

         
//   //     });
//   //     // break;
//   //   }
//   //   // case "3":
//   //   else if(screen === "3")
//   //     {
//   //       MongoClient.connect(url, function (err, db) {
//   //         if (err) throw err;
//   //         const dbo = db.db("AdvDB");

//   //         dbo
//   //           .collection("advData")
//   //           .find({ show: "2" })
//   //           .toArray(function (err, result) {
//   //             if (err) throw err;
//   //             // console.log(result);
//   //             response.sendFile(__dirname + "/screen3.html");
//   //             io.sockets.on("connection", function (socket) {
//   //               socket.emit("getResult", result);

//   //               dbo.
//   //               collection("users")
//   //               .find({userId: "2"})
//   //               .toArray(function(err, user){
//   //                 if (err) throw err;
//   //                 // console.log(result);
//   //                 socket.emit("getTiming", user);

//   //               });

//   //               setActive("2");
                
//   //               socket.on("disconnect", function(err, res){
//   //                 console.log("in disconnection"); 
//   //                 setNotActive("2"); 

//   //               });

//   //             });
//   //           });
//   //       });
//   //       // break;
//   //     }
//   //     // case "admin":
//   //     else if(screen === "admin"){
//   //       {
//   //         response.sendFile(__dirname + "/logIn.html");
//   //         let username;
//   //         let userPassword;
//   //         io.on('connection', function(socket) {
//   //           socket.on('getDataAdmin', function(adminData) {
//   //             username = adminData[0];
//   //             userPassword = adminData[1];

//   //             MongoClient.connect(url, function (err, db) {
//   //               if (err) throw err;
//   //                 const dbo = db.db("AdvDB");
//   //                 dbo.collection("userAdmin").find({}).toArray(function(err,result){
//   //                   if (err) throw err;
//   //                   if(result[0].userName == username && result[0].password == userPassword){
//   //                     // console.log("ok");

//   //                     socket.emit("ok", "ok");
                      
//   //                     // app.get('/login', function (req, res) {
//   //                       // res.sendFile(__dirname + "/dashboard.html");
//   //                     // });                    
//   //                   }else{
//   //                     socket.emit("validition");
//   //                   }
//   //                 });
//   //             });
            
//   //           });
//   //         });
//   //         // break;
//   //       }
//   // }
// });
