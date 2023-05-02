const Collection = require("../models/Collection");
const Post = require("../models/Post.js");
const User = require("../models/User.js");
const { upload } = require("../server");
const fs = require("fs");

//TODO research status codes and implement the correct ones
const getCollections = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let result = [];
    for (const collectionId of user.collections) {
      const collection = await Collection.findById(collectionId);
      result.push(collection);
    }
    // res.status(201).json(user.collections);
    res.status(201).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

async function getCollection(req, res) {
  try {
    const collectionId = req.params.id;
    const collection = await Collection.findById(collectionId);
    res.status(201).json(collection);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

//WARNING ********* memebers
const createCollection = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // want: id, first name, last name, picturepath
    console.log(user.firstName);
    const member = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      picturePath: user.picturePath,
    };
    const newCollection = new Collection({
      title: req.body.title,
      // members: [req.user.id],
      members: [member],
      posts: [],
    });
    await newCollection.save();

    user.collections.push(newCollection._id);
    await user.save();

    res.status(201).json({ message: `${req.body.title} Succesfully Created` });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//WARNING MEMBERS ***********
const addPost = async (req, res) => {
  try {
    const collectionId = req.params.id;
    //find collection
    const collection = await Collection.findById(collectionId);
    // check if user is part of the collection
    if (
      !collection.members.some(
        (member) => member._id.toString() === req.user.id
      )
    ) {
      res
        .status(409)
        .json({ message: "You are not a member of this collection" });
    } else {
      // create a new post
      const { description, mediaPath, mediaType } = req.body;
      const user = await User.findById(req.user.id);

      let src = "";

      if (mediaType === "YouTube") {
        const urlArr = mediaPath.split("/");
        let videoID = urlArr[3];
        if (videoID.includes("watch?v=")) {
          const arr = videoID.split("watch?v=");
          videoID = arr[1];
        }
        src = `https://www.youtube.com/embed/${videoID}`;
      } else if (mediaType === "TikTok") {
        const urlArr = mediaPath.split("?");
        const arr = urlArr[0].split("/");
        src = `${arr[0]}//${arr[2]}/embed/${arr[5]}`;
      }

      const newPost = new Post({
        userId: req.user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        description,
        userPicturePath: user.picturePath,
        mediaPath: mediaType == "Picture" ? mediaPath : src,
        mediaType,
        likes: {},
        comments: [],
      });

      await newPost.save();
      // add the post to the collection

      collection.posts.push(newPost._id);
      await collection.save();
      res.status(201).json(newPost);
    }
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//TODO Delete the post from post database
//TODO Delete the media associated with it
const removePost = async (req, res) => {
  try {
    //get the collection
    const { id } = req.params;
    const { postId } = req.body;
    const collection = await Collection.findById(id);
    const deletedPost = await Post.findOneAndDelete({ _id: postId });
    //remove the post id from the posts array
    collection.posts = collection.posts.filter(
      (post) => post.toString() !== postId
    );
    if (deletedPost.mediaType === "Picture") {
      console.log("picture");
      const filePath = `public/assets/${deletedPost.mediaPath}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    await collection.save();
    res.status(201).json(collection);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//WARNING MEMBERS ***********
const addRemoveMember = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const { memberId, picturePath, firstName, lastName } = req.body;
    //find collection
    const collection = await Collection.findById(collectionId);
    //authorize user
    if (
      !collection.members.some(
        (member) => member._id.toString() === req.user.id
      )
    ) {
      res.json({ message: "You are not authorized" });
    } else {
      //find user
      const user = await User.findById(memberId);
      //TODO
      if (collection.members.find((member) => member._id === memberId)) {
        //replace the current collection with the response(data) and dispatch the state
        const index = collection.members.findIndex(
          (member) => member._id === memberId
        );
        const newMembers = [
          ...collection.members.slice(0, index),
          ...collection.members.slice(index + 1),
        ];

        collection.members = newMembers;
        await collection.save();
        user.collections = user.collections.filter(
          (collection) => collection.toString() !== collectionId
        );
        await user.save();
      } else {
        collection.members.push({
          _id: memberId,
          firstName,
          lastName,
          picturePath,
        });
        await collection.save();
        user.collections.push(collection._id);
        await user.save();
      }
      res.status(201).json(collection);
    }
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//TODO Delete all the post within the collection
//TODO Delete the collection from all the users

//WARNING MEMBERS ***********
const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (
      !collection.members.some(
        (member) => member._id.toString() === req.user.id
      )
    ) {
      res.json({ message: "You are not authorized" });
    }

    for (const member of collection.members) {
      const user = await User.findById(member._id);
      user.collections = user.collections.filter(
        (collection) => collection.toString() !== req.params.id
      );
      await user.save();
    }

    for (const postId of collection.posts) {
      const deletedPost = await Post.findByIdAndDelete(postId);
      if (deletedPost.mediaType === "Picture") {
        const filePath = `public/assets/${deletedPost.mediaPath}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      console.log(`Post deleted: ${deletedPost}`);
    }

    await Collection.deleteOne({ _id: req.params.id });
    res.status(201).json({ message: "Collection Deleted" });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

const changeTitle = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    // collection.members.find((member) => member._id === req.user.id)
    console.log(collection.members);
    if (
      !collection.members.find(
        (member) => member._id.toString() === req.user.id
      )
    ) {
      res.json({
        message: `You are not authorized req.user.id ${req.user.id}`,
      });
    } else {
      collection.title = req.body.title;
      await collection.save();
      res.status(201).json(collection);
    }
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//WARNING MEMBERS ***********
const getPosts = async (req, res) => {
  try {
    const collectionId = req.params.id;
    //find collection
    const collection = await Collection.findById(collectionId);
    // check if user is part of the collection
    if (
      !collection.members.some(
        (member) => member._id.toString() === req.user.id
      )
    ) {
      res
        .status(409)
        .json({ message: "You are not a member of this collection" });
    } else {
      const posts = await Post.find({ _id: { $in: collection.posts } });
      // console.log(posts);
      res.status(201).json(posts);
    }

    // res.status(201).json({ message: "add post success" });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

module.exports = {
  getCollections,
  getCollection,
  createCollection,
  addPost,
  removePost,
  addRemoveMember,
  deleteCollection,
  changeTitle,
  getPosts,
};
