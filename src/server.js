const express = require("express");
const bodyParser = require("body-parser");
const Joi = require("joi");
const mongoose = require("mongoose");
const { Hotel } = require("./hotel.model");

const app = express();
const connectionPromise = mongoose.connect(
  "mongodb+srv://chan:ZTVHK5W02XOhWU9r@cluster0.ubvlpgm.mongodb.net/?retryWrites=true&w=majority"
);

//express has a concept of middleware
app.use(bodyParser.json());

app.get("/api/hotel",async (req, res) => {
  // when using finc in mongodb you can pass query in object 
  //..if you want to get all datat just pass and empty object
  const hotels = await Hotel.find({})
  return res.send(hotels);
});

app.get("/api/hotel/:hotelId", async (req, res) => {
  const { hotelId } = req.params;
  const hotel = await Hotel.findOne({ _id: hotelId });
  if (hotel) {
    return res.send(hotel);
  } else {
    return res
      .status(404)
      .send({ error: "Hotel not found. please try with a valid ID" });
  }
});

const postHotelSchema = Joi.object({
  name: Joi.string().min(5).max(30).required(),
  avgRating: Joi.number().min(0).max(10),
  price: Joi.number().integer().min(100).max(1000)
});

// this is an example of api level middleware
app.post("/api/hotel",async (req, res) => {
  const hotel = req.body;
  const { error } = postHotelSchema.validate(hotel);
  if (error) {
    return res.status(400).send({
      msg: error.message,
    });
  }
  const newHotel = new Hotel(hotel);
  const response = await newHotel.save();

  return res.status(201).send({
    msg: "succes hotel created",
    data: response.toJSON()
  });
});

app.delete("/api/hotel/:hotelId",async (req, res) => {
  const { hotelId } = req.params;
  const hotel = await Hotel.findOneAndDelete({_id: hotelId});
  if (!hotel) {
    return res
      .status(404)
      .send({ error: "Hotel not found. please try with a valid ID" });
  }
  return res.status(200).send({ msg: "Hotel removed successfully" });
});

// app.put("/api/hotel/:hotelId", (req, res) => {
//   const { hotelId } = req.params;
//   const hotel = req.body;

//   const hotelIndex = hotels.findIndex((hotel) => hotel.id === hotelId);
//   if (hotelIndex === -1) {
//     return res
//       .status(404)
//       .send({ error: "Hotel not found. please try with a valid ID" });
//   }
//   hotels[hotelIndex] = {
//     name: hotel.name,
//     price: hotel.price,
//     id: hotelId,
//   };
//   return res.status(200).send(hotels[hotelIndex]);
// });

connectionPromise
  .then(() => {
    app.listen(3000, () => {
      console.log("Server has started on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to DB", err);
  });
