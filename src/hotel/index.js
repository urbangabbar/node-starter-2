const express = require("express");
const router = express.Router();
// mongoose: Mongoose is a driver for MongoDB database
const { Hotel } = require("./model/hotel.model");
const Joi = require("joi");
// joi we are using input validation

// we have defined a get hotel api which fetches all hotels from database
router.get("/", async (req, res) => {
  // when using find in mongodb you can pass query in object
  //..if you want to get all data just pass and empty object
  const hotels = await Hotel.find({});
  return res.send(hotels);
});

// we have designed this api to find a specific hotel with help of id
router.get("/:hotelId", async (req, res) => {
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

// we are creating validation schema using joi. Validation schema helps us define expectations from input
const postHotelSchema = Joi.object({
  name: Joi.string().min(5).max(30).required(),
  avgRating: Joi.number().min(0).max(10),
  price: Joi.number().integer().min(100).max(1000),
});

// we have created post api to save hotel
router.post("/", async (req, res) => {
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
    data: response.toJSON(),
  });
});

router.delete("/:hotelId", async (req, res) => {
  const { hotelId } = req.params;
  const hotel = await Hotel.findOneAndDelete({ _id: hotelId });
  if (!hotel) {
    return res
      .status(404)
      .send({ error: "Hotel not found. please try with a valid ID" });
  }
  return res.status(200).send({ msg: "Hotel removed successfully" });
});

router.put("/:hotelId", async (req, res) => {
  const { hotelId } = req.params;
  const { name, price } = req.body;

  const response = await Hotel.findOneAndUpdate(
    { _id: hotelId }, //filter
    { name: name, price: price }, // field to update
    { new: true } // hume updated document chahiye
  );

  if (!response) {
    return res
      .status(404)
      .send({ error: "Hotel not found. please try with a valid ID" });
  }
  return res.status(200).send({
    message: "Hotel has been updated succesfully",
    data: response.toJSON(),
  });
});

module.exports = router;
