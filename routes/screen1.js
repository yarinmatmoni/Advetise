const express = require("express");
const router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/AdvDB"; // or localhost ot 127.0.0.1


router.get("/",(req,res)=>{
    res.send("Screen 1");
    // res.sendFile(__dirname + "/screen1.html");
    // MongoClient.connect(url, function (err, db) {
    //           if (err) throw err;
    //           const dbo = db.db("AdvDB");
      
    //           dbo
    //             .collection("advData")
    //             .find({ show: "0" })
    //             .toArray(function (err, result) {
    //               if (err) throw err;
    //               console.log(result);
    //               response.sendFile(__dirname + "/screen1.html");
    //               io.sockets.on("connection", function (socket) { // 4 times
    //                 // socket.removeAllListeners(); 
    //                 count++
    //                 socket.emit("getResult", result);
                    
    //                 dbo.
    //                   collection("users")
    //                   .find({userId: "0"})
    //                   .toArray(function(err, user){
    //                     if (err) throw err;
    //                     console.log(result);
    //                     socket.emit("getTiming", user);
      
    //                   });
      
    //                   setActive("0");
      
    //                   socket.on("disconnect", function(err, res){ // 2 times
    //                     console.log("disconnect");
    //                     count--;
    //                     setNotActive("0");
      
    //                   });
    //               });
      
               
    //             });
      
              
    //         });
});


module.exports = router;