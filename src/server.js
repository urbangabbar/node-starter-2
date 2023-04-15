require("localenv");
const express = require("express");
// express import server side web applcation framework
const bodyParser = require("body-parser");
// bodyparser import: It helps parsing JSON body
const mongoose = require("mongoose");
const hotelRouter = require('./hotel')
const catRouter = require('./cat')

// Hotel is a model which represents a collection mongoDB

const app = express();
// we are intializing a new express app

const connectionPromise = mongoose.connect(process.env.DB_URL);
// we are making connection to mongodb

//express has a concept of middleware
app.use(bodyParser.json());
// we are using bodyparsser a middlerware

app.use('/api/hotel', hotelRouter)
app.use('/api/cat', catRouter)

connectionPromise
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server has started on port" + process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("Error connecting to DB", err);
  });
