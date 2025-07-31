
import { userModel } from "@/models/user-model";
import { booksModel } from "@/models/books-model";

import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/utils/data-util";



async function getAllUsers() {
  const allUsers = await userModel.find().lean();
  return replaceMongoIdInArray(allUsers);
}

async function getAllBooks() {
  const allBooks = await booksModel.find().lean();
  return replaceMongoIdInArray(allBooks);
}

async function createUser(user) {
  return await userModel.create(user);
}

async function createBook(book) {
  return await booksModel.create(book);
}

async function findUserByCredentials(credentials) {
  const user = await userModel.findOne(credentials).lean();
  if (user) {
    return replaceMongoIdInObject(user);
  }
  return null;
}

async function updateUser(email, name, phone, bio) {
  await userModel.updateOne(
      { email: email },
      { $set: { name: name, phone: phone, bio: bio } }
    )
}

async function changePassword(email, password) {
  await userModel.updateOne(
      { email: email },
      { $set: { password:password } }
    )
}

async function upDateDays(email, days) {
  await userModel.updateOne(
      { email: email },
      { $set: { days:days } }
    )
}

async function changePhoto(email, photo) {
  await userModel.updateOne(
      { email: email },
      { $set: { photo: photo } }
    )
}


export {
  createUser,
  createBook,
  findUserByCredentials,
  getAllUsers,
  getAllBooks,
  updateUser,
  changePassword,
  changePhoto,
  upDateDays
};
