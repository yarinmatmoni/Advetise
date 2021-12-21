var express = require("express");
var app = express();
var fs = require("fs");
var server = require("http").Server(app);
var io = require("socket.io")(server);

app.use(express.static(__dirname + "/public"));

app.get("/", function (request, response) {
  const { screen } = request.query;
  switch (screen) {
    case "1": {
      response.sendFile(__dirname + "/screen1.html");
      io.sockets.on("connection", function (socket) {
        fs.readFile("./data.json", (err, data) => {
          if (err) {
            console.log(err);
          }
          let json = JSON.parse(data);
          socket.emit("getJson", json);
        });
      });
      break;
    }
    case "2": {
      response.sendFile(__dirname + "/screen2.html");
      io.sockets.on("connection", function (socket) {
        fs.readFile("./data.json", (err, data) => {
          if (err) {
            console.log(err);
          }
          let json = JSON.parse(data);
          socket.emit("getJson", json);
        });
      });
      break;
    }
    case "3":
      {
        response.sendFile(__dirname + "/screen3.html");
        io.sockets.on("connection", function (socket) {
          fs.readFile("./data.json", (err, data) => {
            if (err) {
              console.log(err);
            }
            let json = JSON.parse(data);
            socket.emit("getJson", json);
          });
        });
      }
      break;
  }
});

server.listen(8080);
