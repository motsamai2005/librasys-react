import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";

function Books() {
  const { books, setBooks } = useLibrary();

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);

  const [newBook, setNewBook] = useState({
    isbn: "",
    title: "",
    author: "",
    category: "",
    copies: "",
  });

  // =========================
  // SEARCH
  // =========================

  const filteredBooks = books.filter((book) => {
    const search = searchTerm.toLowerCase();

    return (
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search) ||
      book.isbn.toLowerCase().includes(search) ||
      book.category.toLowerCase().includes(search)
    );
  });

  // =========================
  // ADD BOOK
  // =========================

  const handleAddBook = () => {
    if (
      !newBook.isbn ||
      !newBook.title ||
      !newBook.author ||
      !newBook.category ||
      newBook.copies === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const copies = Number(newBook.copies);

    if (copies < 0 || !Number.isInteger(copies)) {
      alert("Copies must be a whole number.");
      return;
    }

    const book = {
      id: Date.now(),
      isbn: newBook.isbn,
      title: newBook.title,
      author: newBook.author,
      category: newBook.category,
      copies: copies,
      available: copies,
    };

    setBooks((currentBooks) => [
      ...currentBooks,
      book,
    ]);

    resetForm();
  };

  // =========================
  // EDIT BOOK
  // =========================

  const handleEditBook = (book) => {
    setEditingBookId(book.id);

    setNewBook({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      category: book.category,
      copies: book.copies,
    });

    setShowForm(true);
  };

  // =========================
  // UPDATE BOOK
  // =========================

  const handleUpdateBook = () => {
    if (
      !newBook.isbn ||
      !newBook.title ||
      !newBook.author ||
      !newBook.category ||
      newBook.copies === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const copies = Number(newBook.copies);

    if (copies < 0 || !Number.isInteger(copies)) {
      alert("Copies must be a whole number.");
      return;
    }

    setBooks((currentBooks) =>
      currentBooks.map((book) => {
        if (book.id === editingBookId) {
          const borrowedCopies =
            book.copies - book.available;

          let available = copies - borrowedCopies;

          if (available < 0) {
            available = 0;
          }

          if (available > copies) {
            available = copies;
          }

          return {
            ...book,
            isbn: newBook.isbn,
            title: newBook.title,
            author: newBook.author,
            category: newBook.category,
            copies: copies,
            available: available,
          };
        }

        return book;
      })
    );

    resetForm();
  };

  // =========================
  // DELETE BOOK
  // =========================

  const handleDeleteBook = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
      return;
    }

    setBooks((currentBooks) =>
      currentBooks.filter(
        (book) => book.id !== id
      )
    );
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setNewBook({
      isbn: "",
      title: "",
      author: "",
      category: "",
      copies: "",
    });

    setEditingBookId(null);
    setShowForm(false);
  };

  // =========================
  // STATUS
  // =========================

  const getStatus = (book) => {
    if (book.available === 0) {
      return "Out of Stock";
    }

    if (book.available < 2) {
      return "Low Stock";
    }

    return "Available";
  };

  return (
    <div className="books-page">

      {/* PAGE HEADER */}

      <div className="page-header">
        <h1>Books</h1>

        <p>
          Manage books in the LibraSys library.
        </p>
      </div>


      {/* SEARCH + ADD */}

      <div className="books-toolbar">

        <input
          type="text"
          placeholder="Search books..."
          className="search-input"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        <button
          type="button"
          className="add-book-button"
          onClick={() => {
            setEditingBookId(null);

            setNewBook({
              isbn: "",
              title: "",
              author: "",
              category: "",
              copies: "",
            });

            setShowForm(true);
          }}
        >
          + Add Book
        </button>

      </div>


      {/* ADD / EDIT FORM */}

      {showForm && (

        <div className="add-book-form">

          <h2>
            {editingBookId !== null
              ? "Edit Book"
              : "Add New Book"}
          </h2>

          <p>
            {editingBookId !== null
              ? "Update the book information."
              : "Enter the details of the new book."}
          </p>


          <div className="form-grid">

            <input
              type="text"
              placeholder="ISBN"
              value={newBook.isbn}
              onChange={(e) =>
                setNewBook({
                  ...newBook,
                  isbn: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Book title"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({
                  ...newBook,
                  title: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Author"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({
                  ...newBook,
                  author: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Category"
              value={newBook.category}
              onChange={(e) =>
                setNewBook({
                  ...newBook,
                  category: e.target.value,
                })
              }
            />

            <input
              type="number"
              min="0"
              placeholder="Number of copies"
              value={newBook.copies}
              onChange={(e) =>
                setNewBook({
                  ...newBook,
                  copies: e.target.value,
                })
              }
            />

          </div>


          <div className="form-buttons">

            <button
              type="button"
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>


            {editingBookId !== null ? (

              <button
                type="button"
                className="save-book-button"
                onClick={handleUpdateBook}
              >
                Update Book
              </button>

            ) : (

              <button
                type="button"
                className="save-book-button"
                onClick={handleAddBook}
              >
                Save Book
              </button>

            )}

          </div>

        </div>
      )}


      {/* BOOKS TABLE */}

      <div className="books-table-section">

        <div className="books-table-header">

          <div>

            <h2>Library Books</h2>

            <p>
              Showing {filteredBooks.length} of{" "}
              {books.length} books.
            </p>

          </div>

        </div>


        <div className="table-container">

          <table className="book-table">

            <thead>

              <tr>
                <th>ISBN</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Available</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>


            <tbody>

              {filteredBooks.length > 0 ? (

                filteredBooks.map((book) => {

                  const status = getStatus(book);

                  return (
                    <tr key={book.id}>

                      <td>
                        {book.isbn}
                      </td>

                      <td className="book-title">
                        {book.title}
                      </td>

                      <td>
                        {book.author}
                      </td>

                      <td>
                        {book.category}
                      </td>

                      <td>
                        {book.available}
                      </td>

                      <td>

                        <span
                          className={`status ${
                            status === "Available"
                              ? "available"
                              : status === "Low Stock"
                              ? "low"
                              : "out"
                          }`}
                        >
                          {status}
                        </span>

                      </td>

                      <td>

                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            handleEditBook(book)
                          }
                        >
                          Edit
                        </button>


                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDeleteBook(book.id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#667085",
                    }}
                  >
                    No books found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Books;