const mongoose = require("mongoose");

// By concept of mongoose
//collection <---> Model
// Hotel Model <-----> Hotels Collection db

const HotelSchema = { name: String, price: Number, avgRating: Number };

const Hotel = mongoose.model("Hotel", HotelSchema);

module.exports.Hotel = Hotel;
