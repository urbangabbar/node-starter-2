const express = require("express");
const bodyParser = require("body-parser");
const Joi = require("joi");

const app = express();

//express has a concept of middleware
app.use(bodyParser.json());

const hotels = [
  {
    name: "abhinav hotel 2",
    id: "2",
    price: 1000,
  },
  {
    name: "abhinav hotel",
    id: "1",
    price: 1000,
  },
];

app.get("/api/hotel", (req, res) => {
  return res.send(hotels);
});

app.get("/api/hotel/:hotelId", (req, res) => {
  const { hotelId } = req.params;
  const hotel = hotels.find((el) => el.id === hotelId);
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
  id: Joi.number().integer().min(1),
  price: Joi.number().integer().min(100).max(1000),
});

// this is an example of api level middleware
app.post("/api/hotel", (req, res) => {
  const hotel = req.body;
  const { error } = postHotelSchema.validate(hotel);
  if (error) {
    return res.status(400).send({
      msg: error.message,
    });
  }
  hotels.push(hotel);
  return res.status(201).send({
    msg: "succes hotel created",
  });
});

app.delete("/api/hotel/:hotelId", (req, res) => {
  const { hotelId } = req.params;
  const hotelIndex = hotels.findIndex((hotel) => hotel.id === hotelId);
  if (hotelIndex === -1) {
    return res
      .status(404)
      .send({ error: "Hotel not found. please try with a valid ID" });
  }
  hotels.splice(hotelIndex, 1);
  return res.status(200).send({ msg: "Hotel removed successfully" });
});

app.put("/api/hotel/:hotelId", (req, res) => {
  const { hotelId } = req.params;
  const hotel = req.body;

  const hotelIndex = hotels.findIndex((hotel) => hotel.id === hotelId);
  if (hotelIndex === -1) {
    return res
      .status(404)
      .send({ error: "Hotel not found. please try with a valid ID" });
  }
  hotels[hotelIndex] = {
    name: hotel.name,
    price: hotel.price,
    id: hotelId,
  };
  return res.status(200).send(hotels[hotelIndex]);
});

app.listen(3000, () => {
  console.log("Server has started on port 3000");
});
