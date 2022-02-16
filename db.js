var mongo = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/AdvDB"; // or localhost ot 127.0.0.1

const dataBase = () => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db("AdvDB");

    dbo.listCollections().toArray(function (err, collInfos) {
      if (err) throw err;

      /* *********************** newDelete **************** */

      dbo.dropDatabase();

      dbo.collection("advData").insertMany(advDataObj, function (err, res) {
        if (err) throw err;
      });
        
      dbo.collection("userAdmin").insertMany(adminDataObj, function (err, res) {
        if (err) throw err;
      });

      dbo.collection("users").insertMany(users, function (err, res) {
        if (err) throw err;
      });
    });

    var advDataObj = [
      {
        myId: "0",
        title: "jbl",
        text: {
          line1: "JBL",
          line2: "pro sound",
          line3: "perfect fit.",
          line4: "",
        },
        colors: {
          line1color: "#E9724C",
          line2color: "#E9724C",
          line3color: "#E9724C",
          line4color: "",
          background: "#EDF2F4",
        },
        imgsrc: "/image/jbl5.jpg",
        show: ["0"],
      },
      {
        myId: "1",
        title: "mac",
        text: {
          line1: "MAC",
          line2: "Changing the",
          line3: "beauty industry.",
          line4: "",
        },
        colors: {
          line1color: "white",
          line2color: "white",
          line3color: "",
          line4color: "",
          background: "black",
        },
        imgsrc: "/image/mac.jpg",
        show: ["0"],
      },
      {
        myId: "2",
        title: "disneyland",
        text: {
          line1: "Disneyland",
          line2: "The Magic",
          line3: "Is Here.",
          line4: "",
        },
        colors: {
          line1color: "#9F86C0",
          line2color: "#BE95C4",
          line3color: "#E0B1CB",
          line4color: "",
          background: "#F5F1ED",
        },
        imgsrc: "/image/disney.jpg",
        show: ["1", "0"],
      },
      {
        myId: "3",
        title: "nike",
        text: {
          line1: "",
          line2: "NIKE.",
          line3: "JUST DO IT.",
          line4: "",
        },
        colors: {
          line1color: "",
          line2color: "#FF6700",
          line3color: "#FEC89A",
          line4color: "#FEC89A",
          background: "#001B2E",
        },
        imgsrc: "/image/nike.jpg",
        show: ["1", "2"],
      },
      {
        myId: "4",
        title: "Corona",
        text: {
          line1: "Log off.",
          line2: "Lime in.",
          line3: "Find your beach.",
          line4: "",
        },
        colors: {
          line1color: "#E2EAFC",
          line2color: "#FFF3B0",
          line3color: " #E2EAFC",
          line4color: "",
          background: "#073B4C",
        },
        imgsrc: "/image/corona.jpg",
        show: ["2"],
      },

      {
        myId: "5",
        title: "iphone",
        text: {
          line1: "Introducing,",
          line2: "the new iPhone",
          line3: "Is Here.",
          line4: "",
        },
        colors: {
          line1color: "#E0E1DD",
          line2color: "#E0E1DD",
          line3color: "#E0E1DD",
          line4color: "",
          background: "#1B263B",
        },
        imgsrc: "/image/iphone.jpg",
        show: ["2"],
      },

      {
        myId: "6",
        title: "Coca Cola",
        text: {
          line1: "Coca Cola,",
          line2: "The taste of",
          line3: "Life.",
          line4: "",
        },
        colors: {
          line1color: "#ced4da",
          line2color: "#ced4da",
          line3color: "#BC4749",
          line4color: "",
          background: "#212529",
        },
        imgsrc: "/image/cola.jpg",
        show: ["0"],
      },
    ];

    var adminDataObj = [
      {
        userName: "0",
        password: "0",
      }
    ];

    var users = [

    {
      userId: "0",
      lastConnection: "",
      status: "Not Active",
      advList: ["0","1","2","6"],
      timing:  ["1", "3", "5", "1"],
    },
    {
      userId: "1",
      lastConnection: "",
      status: "Not Active",
      advList: ["2","3"],
      timing:  ["1", "3"],
    },
    {
      userId: "2",
      lastConnection: "", // date
      status: "Not Active", 
      advList: ["3","4","5"],
      timing:  ["1", "3", "5"],
    }

  ]

  });
};

module.exports = dataBase;
