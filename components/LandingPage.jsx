"use client";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import Admin from "./Admin";
import { useEffect, useState } from "react";
import { getAllBooks2 } from "@/app/actions";

export default function LandingPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const [initialBooks, setInitialBooks] = useState([]);
  const [yourBooks, setYourBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedBooks, setSearchedBooks] = useState(initialBooks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth) {
      router.push("/login"); // Redirects to login if not authenticated
    }
  }, [auth, router]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const books = await getAllBooks2();
        // Ensure books is an array of plain objects with fallback fields
        const plainBooks = Array.isArray(books) ? books.map(book => ({
          ...book,
          status: book.status || "available", // Fallback status
          available: book.available || 0 // Fallback available number
        })) : [];
        setInitialBooks(plainBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setSearchedBooks(initialBooks);
    } else {
      const filteredBooks = initialBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchedBooks(filteredBooks);
    }
  }, [searchTerm, initialBooks]);

  const handleBorrow = () => {
    if (selectedBook && selectedBook.status === "available" && selectedBook.available > 0) {
      setInitialBooks(initialBooks.map(book =>
        book.id === selectedBook.id ? { ...book, available: book.available - 1 } : book
      ).filter(book => book.available > 0 || book.id !== selectedBook.id));
      setYourBooks([...yourBooks, { ...selectedBook, status: "borrowed", available: 0 }]);
      setSelectedBook(null);
    }
  };

  const handleReturn = () => {
    if (selectedBook) {
      setYourBooks(yourBooks.filter(book => book.id !== selectedBook.id));
      setInitialBooks([...initialBooks, { ...selectedBook, status: "available", available: (initialBooks.find(book => book.id === selectedBook.id)?.available || 0) + 1 }]);
      setSelectedBook(null);
    }
  };

  return (
    auth?.userType === "user" ? (
      <div className="bg-blue-950 text-white w-full min-h-screen p-4">
        {loading && <p className="mb-4">Loading books...</p>}
        {error && <p className="mb-4 text-red-300">{error}</p>}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by title, author, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded border border-blue-300 focus:outline-none"
          />
        </div>
        <div className="flex space-x-4 h-full">
          <div className="w-1/2">
            <h2 className="text-xl font-bold mb-2">Books</h2>
            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
              {searchedBooks.map((book, index) => (
                <div
                  key={`search-${book.id}-${index}`} // Unique key with prefix and index
                  onClick={() => setSelectedBook(book)}
                  className={`p-2 border rounded cursor-pointer ${selectedBook?.id === book.id ? "bg-gray-700" : "hover:bg-gray-800"}`}
                >
                  <span>ID: {book.id}</span><br />
                  <span className="align-middle">{book.title}</span><br />
                  <span className="text-sm text-gray-300">by {book.author}</span><br />
                  <span className="text-sm text-gray-300">Genre: {book.genre || "N/A"}</span><br />
                  <span className="text-sm text-green-300">Available: {book.available}</span><br />
                  <span className="text-sm text-green-300">Status: {book.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/2">
            <h2 className="text-xl font-bold mb-2">Your Books</h2>
            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
              {yourBooks.map((book, index) => (
                <div
                  key={`your-${book.id}-${index}`} // Unique key with prefix and index
                  onClick={() => setSelectedBook(book)}
                  className={`p-2 border rounded cursor-pointer ${selectedBook?.id === book.id ? "bg-gray-700" : "hover:bg-gray-800"}`}
                >
                  <span>ID: {book.id}</span><br />
                  <span className="align-middle">{book.title}</span><br />
                  <span className="text-sm text-gray-300">by {book.author}</span><br />
                  <span className="text-sm text-gray-300">Genre: {book.genre || "N/A"}</span><br />
                  <span className="text-sm text-red-300">Available: {book.available}</span><br />
                  <span className="text-sm text-red-300">Status: {book.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={handleBorrow}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={!selectedBook || selectedBook.status !== "available" || selectedBook.available <= 0}
          >
            Borrow
          </button>
          <button
            onClick={handleReturn}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            disabled={!selectedBook || !yourBooks.some(book => book.id === selectedBook.id)}
          >
            Return
          </button>
        </div>
      </div>
    ) : (
      <div className="bg-blue-950 text-white flex justify-center items-center w-full min-h-screen"><Admin/></div>
    )
  );
}