const express = require("express");
const {
  getCollections,
  getCollection,
  createCollection,
  addPost,
  removePost,
  addRemoveMember,
  deleteCollection,
  changeTitle,
  getPosts,
} = require("../controllers/collections");
const verifyToken = require("../middleware/auth");
const router = express.Router();

router.get("/", verifyToken, getCollections);
router.get("/:id", verifyToken, getCollection);
router.post("/", verifyToken, createCollection);
// router.patch("/:id", verifyToken, addPost);
router.patch("/:id/posts", verifyToken, removePost);
router.get("/:id/posts", verifyToken, getPosts);
router.patch("/:id/members", verifyToken, addRemoveMember);
router.patch("/:id/title", verifyToken, changeTitle);
router.delete("/:id", verifyToken, deleteCollection);

module.exports = router;
