const express = require("express");

const connectionDB = require("./database");

const app = express();

connectionDB()
  .then(() => {
    console.log("database is succesfully connected");
    app.listen(7777, () => {
      console.log("server is successfully connected");
    });
  })
  .catch(console.error);
