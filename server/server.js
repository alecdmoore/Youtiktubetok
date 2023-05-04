const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { fileURLToPath } = require("url");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const collectionRoutes = require("./routes/collections");
const { register } = require("./controllers/auth.js");
const { createPost } = require("./controllers/posts.js");
const { addPost } = require("./controllers/collections");
const { search } = require("./controllers/search");
const verifyToken = require("./middleware/auth");
const User = require("./models/User");
const Post = require("./models/Post.js");
const Collection = require("./models/Collection");
const { users, posts, collections } = require("./data/index.js");

require("dotenv").config();

//middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// *** FILE STORAGE ***
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    process.env.NODE_ENV === "production"
      ? cb(null, "uploads/")
      : cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// *** ROUTES ***
app.post("/api/auth/register", upload.single("picture"), register);
app.patch(
  "/api/collections/:id",
  verifyToken,
  upload.single("picture"),
  addPost
);
app.get("/api/search/:value", verifyToken, search);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/collections", collectionRoutes);

// *** MONGOOSE & SERVER SETUP ***
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Example app listening on port ${process.env.PORT}`);

      // console.log(users);

      /* ADD DATA ONE TIME */
      // User.insertMany(users);
      // Post.insertMany(posts);
      // Collection.insertMany(collections);
    });
  })
  .catch((error) => console.log(`${error} did not connect`));

module.exports = { upload };
