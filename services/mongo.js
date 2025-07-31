import mongoose from "mongoose";

export async function dbConnect() {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://Library470:library470@library470.0qkhtzx.mongodb.net/Library470"
    );
    console.log("Connected");
    return conn;
  } catch (err) {
    console.log(err);
  }
}
