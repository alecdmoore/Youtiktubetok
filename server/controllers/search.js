const User = require("../models/User.js");

const search = async (req, res) => {
  try {
    const name = req.params.value.split(" ");
    let firstName = name[0];
    let lastName = name[1];
    if (lastName) {
      const users = await User.find({
        firstName: { $regex: new RegExp(firstName, "i") },
        lastName: { $regex: new RegExp(lastName, "i") },
      });
      res.status(200).json(users);
    } else {
      const users = await User.find({
        firstName: { $regex: new RegExp(firstName, "i") },
      });
      res.status(200).json(users);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { search };
