"use client";
import { updateIsBorrowed, updateBorrowedBooks } from "@/app/actions";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function User() {
  const router = useRouter();
  const { auth, book } = useAuth();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!auth) {
      router.push("/login");
    } else {
      // Initialize borrowedBooks from auth or empty array
      setBorrowedBooks(Array.isArray(auth.borrowedBooks) ? auth.borrowedBooks : []);
    }
    setIsCheckingAuth(false);
  }, [auth, router]);

  if (isCheckingAuth || !auth) {
    return null;
  }

  const getExpireDate = (borrowedDate) => {
    try {
      const date = Date.parse(borrowedDate);
      if (!isNaN(date)) {
        const expire = new Date(date + 7 * 24 * 60 * 60 * 1000);
        return expire.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
      }
      return "Invalid Date";
    } catch (error) {
      console.error(`Error parsing borrowedDate: ${borrowedDate}`, error);
      return "Invalid Date";
    }
  };

  const handleBorrow = async () => {
    if (!auth || !book) return;
    setIsLoading(true);
    try {
      const newBorrowedBook = {
        bookId: book.id,
        borrowedDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        title: book.title || "N/A",
        photo: book.photo || "",
      };
      const newBorrowedBooks = [...borrowedBooks, newBorrowedBook];
      setBorrowedBooks(newBorrowedBooks);

      const userResponse = await updateBorrowedBooks(auth.email, newBorrowedBooks);
      const bookResponse = await updateIsBorrowed(book.id, (book.isBorrowed || 0) + 1);

      if (userResponse.success && bookResponse.success) {
        setFeedback("Book borrowed successfully!");
      } else {
        setBorrowedBooks(borrowedBooks); // Revert on failure
        setFeedback(userResponse.error || bookResponse.error || "Failed to borrow book");
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
      setBorrowedBooks(borrowedBooks); // Revert on failure
      setFeedback(`Error borrowing book: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!auth || !book) return;
    setIsLoading(true);
    try {
      const updatedBorrowedBooks = borrowedBooks.filter(
        (borrowed) => borrowed.bookId !== book.id
      );
      setBorrowedBooks(updatedBorrowedBooks);

      const userResponse = await updateBorrowedBooks(auth.email, updatedBorrowedBooks);
      const bookResponse = await updateIsBorrowed(book.id, Math.max((book.isBorrowed || 0) - 1, 0));

      if (userResponse.success && bookResponse.success) {
        setFeedback("Book returned successfully!");
      } else {
        setBorrowedBooks(borrowedBooks); // Revert on failure
        setFeedback(userResponse.error || bookResponse.error || "Failed to return book");
      }
    } catch (error) {
      console.error("Error returning book:", error);
      setBorrowedBooks(borrowedBooks); // Revert on failure
      setFeedback(`Error returning book: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isBookBorrowed = Array.isArray(borrowedBooks) && borrowedBooks.some(
    (borrowed) => borrowed.bookId === book?.id
  );
  const canBorrow = (Array.isArray(borrowedBooks) ? borrowedBooks.length : 0) < 3 && !isBookBorrowed;

  return (
    <div className="bg-white text-gray-800 w-full h-full min-h-screen p-6 flex flex-col md:flex-row gap-6 overflow-auto pb-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-[70%] bg-gray-50 p-6 rounded-lg shadow-md overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Book Details</h2>
        {feedback && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mb-4 text-sm ${
              feedback.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {feedback}
          </motion.p>
        )}
        {book ? (
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-200 w-40 h-60 rounded-md overflow-hidden flex items-center justify-center"
            >
              {book.photo ? (
                <img
                  src={book.photo}
                  alt="Book cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex justify-center items-center text-2xl font-semibold text-gray-500">
                  ?
                </div>
              )}
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold">Title</h3>
              <p>{book.title || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Genre</h3>
              <p>{book.genre || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Author</h3>
              <p>{book.author || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Description</h3>
              <p>{book.description || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Rating</h3>
              <p>{book.rating ?? "0"}</p>
            </div>
            {canBorrow && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBorrow}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Borrowing..." : "Borrow Book"}
              </motion.button>
            )}
            {isBookBorrowed && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReturn}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Returning..." : "Return Book"}
              </motion.button>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No book selected</p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-[30%] bg-gray-50 p-6 rounded-lg shadow-md overflow-auto"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Borrowed Books</h2>
        {!(Array.isArray(borrowedBooks) && borrowedBooks.length > 0) ? (
          <p className="text-gray-500">No books borrowed</p>
        ) : (
          <div className="space-y-4">
            {borrowedBooks.map((borrowedBook, index) => (
              <motion.div
                key={`${borrowedBook.bookId}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center space-x-4 bg-white p-3 rounded-md shadow-sm"
              >
                <div className="bg-gray-200 w-16 h-24 rounded-md overflow-hidden flex items-center justify-center">
                  {borrowedBook.photo ? (
                    <img
                      src={borrowedBook.photo}
                      alt="Borrowed book cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex justify-center items-center text-xl font-semibold text-gray-500">
                      ?
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{borrowedBook.title || "N/A"}</h3>
                  <p className="text-sm text-gray-600">
                    Borrowed: {borrowedBook.borrowedDate}
                  </p>
                  <p className="text-sm text-gray-600">
                    Expires: {getExpireDate(borrowedBook.borrowedDate)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}