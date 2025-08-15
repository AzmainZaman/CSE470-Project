import { userModel } from "@/models/user-model";
import { booksModel } from "@/models/books-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/utils/data-util";

async function getAllUsers() {
  const allUsers = await userModel.find().lean();
  return replaceMongoIdInArray(allUsers);
}

async function getAllBooks() {
  const allBooks = await booksModel.find().lean();
  return replaceMongoIdInArray(allBooks);
}

async function createUser(user) {
  const createdUser = await userModel.create(user);
  return replaceMongoIdInObject(createdUser.toObject());
}

async function createBook(book) {
  console.log("Received book data:", book); // Debug: Log raw input
  if (!book.id) {
    throw new Error("Book ID is required");
  }
  const bookData = {
    id: book.id,
    title: book.title || "",
    author: book.author || "",
    genre: book.genre || "",
    description: book.description || "",
    rating: book.rating !== undefined && !isNaN(book.rating) ? Number(book.rating) : 0,
    inventory: book.inventory !== undefined && !isNaN(book.inventory) ? Number(book.inventory) : 0,
    photo: book.photo || "",
    isBorrowed: book.isBorrowed !== undefined ? Boolean(book.isBorrowed) : false,
  };
  console.log("Sanitized book data for MongoDB:", bookData); // Debug: Log sanitized data
  try {
    const createdBook = await booksModel.create(bookData);
    const result = replaceMongoIdInObject(createdBook.toObject());
    console.log("Created book in database:", result); // Debug: Log saved document
    return result;
  } catch (error) {
    console.error("Error creating book:", error);
    throw new Error(`Failed to create book: ${error.message}`);
  }
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
  );
}

async function updateBook(
  id,
  title,
  author,
  genre,
  description,
  rating,
  inventory,
  photo,
  isBorrowed
) {
  await booksModel.updateOne(
    { id: id },
    {
      $set: {
        title: title || "",
        author: author || "",
        genre: genre || "",
        description: description || "",
        rating: rating !== undefined && !isNaN(rating) ? Number(rating) : 0,
        inventory: inventory !== undefined && !isNaN(inventory) ? Number(inventory) : 0,
        photo: photo || "",
        isBorrowed: isBorrowed !== undefined ? Boolean(isBorrowed) : false,
      },
    }
  );
}

async function changeBookPhoto(id, photo) {
  await booksModel.updateOne({ id: id }, { $set: { photo: photo || "" } });
}

async function deleteBook(id) {
  await booksModel.deleteOne({ id: id });
}

async function changePassword(email, password) {
  await userModel.updateOne({ email: email }, { $set: { password: password } });
}

async function upDateDays(email, days) {
  await userModel.updateOne({ email: email }, { $set: { days: days } });
}

async function changePhoto(email, photo) {
  await userModel.updateOne({ email: email }, { $set: { photo: photo } });
}

async function changeIsBorrowed(id, isBorrowed) {
  console.log("Updating isBorrowed for book ID:", id, "to:", isBorrowed);
  const result = await booksModel.updateOne(
    { id: String(id) },
    { $set: { isBorrowed: Number(isBorrowed) } }
  );
  console.log("Update isBorrowed result:", result);
  if (result.matchedCount === 0) {
    throw new Error(`No book found with ID: ${id}`);
  }
}

async function changeBorrowedBooks(email, borrowedBooks) {
  console.log("Updating borrowedBooks for email:", email, "to:", borrowedBooks);
  const result = await userModel.updateOne(
    { email: email },
    {
      $set: {
        borrowedBooks: Array.isArray(borrowedBooks) ? borrowedBooks.map(book => ({
          bookId: String(book.bookId),
          borrowedDate: String(book.borrowedDate),
          title: String(book.title || ""),
          photo: String(book.photo || ""),
        })) : [],
      },
    }
  );
  console.log("Update borrowedBooks result:", result);
  if (result.matchedCount === 0) {
    throw new Error(`No user found with email: ${email}`);
  }
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
  upDateDays,
  updateBook,
  changeBookPhoto,
  deleteBook,
  changeBorrowedBooks,
  changeIsBorrowed
};