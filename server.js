const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const port = process.env.PORT || 5000;

app.use(cors());

let MONGO_URL =
  "mongodb+srv://admin:admin@cluster0.cesne.mongodb.net/curriculo?retryWrites=true&w=majority"; //URL para conexao no banco

MongoClient.connect(MONGO_URL, function (err, db) {
  db = db.db("curriculo");
  console.log("Conectado ao banco!");

  const comments = db.collection("comentarios");
  const contacts = db.collection("contatos");

  app.get("/comentarios", function (req, res) {
    comments
      .find()
      .sort({ createDate: -1 })
      .toArray(function (err, result) {
        res.setHeader("Content-Type", "application/json");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(JSON.stringify(result, null, 2));
      });
  });

  const jsonParser = bodyParser.json();

  app.post("/comentarios/novo", jsonParser, function (req, res) {
    const name = req.body.name;
    const text = req.body.text;
    const createDate = new Date(req.body.createDate);

    comments.insertOne({ name, text, createDate }, function (err, result) {
      if (result !== null) {
        res.setHeader("Content-Type", "application/json");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(JSON.stringify({ name, text }, null, 2));
      }
    });
  });

  app.post("/contato/novo", jsonParser, function (req, res) {
    const { name, email, phone } = req.body;

    contacts.insertOne({ name, email, phone }, function (err, result) {
      if (result !== null) {
        res.setHeader("Content-Type", "application/json");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(JSON.stringify({ name, email, phone }, null, 2));
      }
    });
  });
});

app.listen(port, () => console.log(`Node app is running!! Port ${port}`));
