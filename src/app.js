const express = require("express");

const connectionDB = require("./database");
const user = require("./routes/user");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/", user);

connectionDB()
  .then(() => {
    console.log("database is succesfully connected");
    app.listen(7777, () => {
      console.log("server is successfully connected");
    });
  })
  .catch(console.error);
