const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    members: {
      type: Array,
      default: [],
    },
    posts: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Collection = mongoose.model("Collection", CollectionSchema);
// export default User;
module.exports = Collection;
