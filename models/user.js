import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String
}, { collection: "movie-rating-app" });

export default mongoose.model("User", userSchema);
 