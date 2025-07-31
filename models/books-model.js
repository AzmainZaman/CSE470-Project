import mongoose, {Schema} from "mongoose";

const schema = new Schema({
  id: {
    required: true,
    type: String
  },
  title: {
    required: true,
    type: String
  },
  author: {
    required: true,
    type: String
  },
  genre: {
    required: false,
    type: String
  },
  inventory: {
    required: false,
    type: String
  },
  available: {
    required: false,
    type: String
  },
  
});


export const booksModel = mongoose.models.books ?? mongoose.model("books", schema);
