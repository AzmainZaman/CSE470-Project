"use client";
import { createBook2, getAllBooks2 } from "@/app/actions";
import { useState, useEffect } from "react";

export default function Admin() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [inventory, setInventory] = useState("");
  const [available, setAvailable] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noError, setNoError] = useState(true); // Simplified error check, adjust as needed
  const [existingBooks, setExistingBooks] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await getAllBooks2();
        // Ensure books is an array of plain objects
        const plainBooks = Array.isArray(books) ? books.map(book => ({ ...book })) : [];
        setExistingBooks(plainBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
        setFeedback("Failed to load books: " + error.message);
      }
    };
    fetchBooks();
  }, [refreshTrigger]);

  const submitForm = async () => {
    if (noError) {
      // Check for duplicate id or title
      const isDuplicate = existingBooks.some(
        book => book.id === id || book.title === title
      );
      if (isDuplicate) {
        setFeedback("A book with this ID or title already exists!");
        return;
      }

      const sureSubmit = confirm("Are you sure to Add this book?");
      if (sureSubmit) {
        setIsLoading(true);
        try {
          const registered = await createBook2({
            id: id,
            title: title,
            author: author,
            genre: genre,
            inventory: inventory,
            available: available,
          });
          // Convert registered to plain object and check for success
          const plainRegistered = registered ? { ...registered.toObject ? registered.toObject() : registered } : false;
          if (plainRegistered && (plainRegistered._id || plainRegistered.id)) {
            setFeedback("Book added successfully!");
            // Reset form fields on success
            setId("");
            setTitle("");
            setAuthor("");
            setGenre("");
            setInventory("");
            setAvailable("");
            // Trigger re-render to refresh existing books
            setRefreshTrigger(prev => !prev);
          } else {
            setFeedback("Failed to add book!");
          }
        } catch (error) {
          console.error("Error adding book:", error);
          setFeedback("Error adding book: " + error.message);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className="bg-blue-950 text-white w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
      {feedback && <p className="mb-4 text-green-300">{feedback}</p>}
      <div className="space-y-4 mb-6">
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Book ID"
          className="w-full p-2 rounded"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 rounded"
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          className="w-full p-2 rounded"
        />
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Genre"
          className="w-full p-2 rounded"
        />
        <input
          type="text"
          value={inventory}
          onChange={(e) => setInventory(e.target.value)}
          placeholder="Inventory"
          className="w-full p-2 rounded"
        />
        <input
          type="text"
          value={available}
          onChange={(e) => setAvailable(e.target.value)}
          placeholder="Available"
          className="w-full p-2 rounded"
        />
        <button
          onClick={submitForm}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Create Book"}
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Existing Books</h2>
      <table className="w-full border-collapse overflow-auto h-64">
        <thead>
          <tr className="bg-gray-800">
            <th className="border p-2">ID</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Genre</th>
            <th className="border p-2">Inventory</th>
            <th className="border p-2">Available</th>
          </tr>
        </thead>
        <tbody>
          {existingBooks.map((book, index) => (
            <tr key={`${book.id}-${index}`} className="hover:bg-gray-700">
              <td className="border p-2">{book.id}</td>
              <td className="border p-2">{book.title}</td>
              <td className="border p-2">{book.author}</td>
              <td className="border p-2">{book.genre}</td>
              <td className="border p-2">{book.inventory}</td>
              <td className="border p-2">{book.available}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}