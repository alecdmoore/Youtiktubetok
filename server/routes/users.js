const express = require("express");
const {
  getUser,
  getUserFriends,
  addRemoveFriend,
} = require("../controllers/users.js");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.get("/:id", verifyToken, getUser);
// router.get("/:id", getUser);

router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

module.exports = router;
