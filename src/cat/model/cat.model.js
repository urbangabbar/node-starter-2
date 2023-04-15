const mongoose = require("mongoose");

// By concept of mongoose
//collection <---> Model
// Cat Model <-----> Cats Collection db

const CatSchema = { name: String, color: String };

const Cat = mongoose.model("Cat", CatSchema);

module.exports.Cat = Cat;
