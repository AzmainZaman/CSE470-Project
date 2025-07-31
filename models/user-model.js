import mongoose, {Schema} from "mongoose";

const schema = new Schema({
  name: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  phone: {
    required: false,
    type: String
  },
  photo: {
    required: false,
    type: String
  },
  bio: {
    required: false,
    type: String
  },
  userType: {
    required: false,
    type: String
  },
  
});


export const userModel = mongoose.models.users ?? mongoose.model("users", schema);
