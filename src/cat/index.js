const express = require("express");
const router = express.Router();
// mongoose: Mongoose is a driver for MongoDB database
const { Cat } = require("./model/cat.model");
const Joi = require("joi");
// joi we are using input validation

// we have defined a get cat api which fetches all cats from database
router.get("/", async (req, res) => {
  // when using find in mongodb you can pass query in object
  //..if you want to get all data just pass and empty object
  const cats = await Cat.find({});
  return res.send(cats);
});

// we have designed this api to find a specific cat with help of id
router.get("/:catId", async (req, res) => {
  const { catId } = req.params;
  const cat = await Cat.findOne({ _id: catId });
  if (cat) {
    return res.send(cat);
  } else {
    return res
      .status(404)
      .send({ error: "cat not found. please try with a valid ID" });
  }
});

// we are creating validation schema using joi. Validation schema helps us define expectations from input
const postcatSchema = Joi.object({
  name: Joi.string().min(5).max(30).required(),
  color: Joi.string().min(2).max(30).required()
});

// we have created post api to save cat
router.post("/", async (req, res) => {
  const cat = req.body;
  const { error } = postcatSchema.validate(cat);
  if (error) {
    return res.status(400).send({
      msg: error.message,
    });
  }
  const newcat = new Cat(cat);
  const response = await newcat.save();

  return res.status(201).send({
    msg: "succes cat created",
    data: response.toJSON(),
  });
});

router.delete("/:catId", async (req, res) => {
  const { catId } = req.params;
  const cat = await Cat.findOneAndDelete({ _id: catId });
  if (!cat) {
    return res
      .status(404)
      .send({ error: "cat not found. please try with a valid ID" });
  }
  return res.status(200).send({ msg: "cat removed successfully" });
});

router.put("/:catId", async (req, res) => {
  const { catId } = req.params;
  const { name, price } = req.body;

  const response = await Cat.findOneAndUpdate(
    { _id: catId }, //filter
    { name: name, price: price }, // field to update
    { new: true } // hume updated document chahiye
  );

  if (!response) {
    return res
      .status(404)
      .send({ error: "cat not found. please try with a valid ID" });
  }
  return res.status(200).send({
    message: "cat has been updated succesfully",
    data: response.toJSON(),
  });
});

module.exports = router;
