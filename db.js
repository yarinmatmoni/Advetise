var mongo = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/AdvDB"; // or localhost ot 127.0.0.1

const dataBase = () => {
  MongoClient.connect(url, function (err, db) {
    if (err) return console.log("can't connect to Database");
    console.log("Database created!");
    const dbo = db.db("AdvDB");

    dbo.listCollections().toArray(function (err, collInfos) {
      if (err) throw err;

      if (collInfos.length == 0) {
     
        dbo.collection("advData").insertMany(advDataObj, function (err, res) {
          if (err) throw err;
          console.log(
            "Number of documents inserted to advData collection: " +
              res.insertedCount
          );
        });
      } else {
      

        dbo.collection("advData").drop(function (err, delOK) {
          if (err) throw err;
          if (delOK) console.log("Collection advData deleted");
        });

        dbo.collection("advData").insertMany(advDataObj, function (err, res) {
          if (err) throw err;
          console.log(
            "Number of documents inserted to advData collection: " +
              res.insertedCount
          );
        });
      }
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
        imgsrc: "https://www.jbl.com/on/demandware.static/-/Sites-JB-US-Library/default/dw2291e42a/glp/true-wireless/images/clubpro-bg.jpg",
        duration: "1",
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
        imgsrc:
          "https://www.valtech.com/4ac5b0/globalassets/00-global/02-images/07-work/mac/mac-case-primary-image-two-column-807x651.png?w=940&h=530&mode=crop&format=jpg",
        duration: "2",
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
        imgsrc: "https://i.ytimg.com/vi/2v9uqysr7C4/maxresdefault.jpg",
        duration: "1",
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
        imgsrc:
          "https://static.nike.com/a/images/w_1920,c_limit/7543470b-9ad1-4e8b-8d39-8f9609e6a0d0/tips-for-buying-the-right-shoe-for-your-next-run.jpg",
        duration: "1",
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
        imgsrc:
          "https://image.cnbcfm.com/api/v1/image/48801806-corona-on-beach-courtesy.jpg?v=1359654649&w=720&h=405",
        duration: "1",
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
        imgsrc:
          "https://i.insider.com/61412b7d2db0850019a97c09?width=1136&format=jpeg",
        duration: "1",
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
        imgsrc:
          "https://s1.kikar.co.il/th/data/auto/nadm/qz/jw7daj5x__w650h433q95.jpg",
        duration: "1",
        show: ["0"],
      },
    ];
  });
};

module.exports = dataBase;