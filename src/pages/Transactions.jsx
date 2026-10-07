import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";

function Transactions() {
  const {
    books,
    setBooks,
    transactions,
    setTransactions,
  } = useLibrary();

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [newTransaction, setNewTransaction] = useState({
    book: "",
    borrower: "",
    dateBorrowed: "",
    dueDate: "",
  });

  // SEARCH
  const filteredTransactions = transactions.filter(
    (transaction) => {
      const search = searchTerm.toLowerCase();

      return (
        transaction.book
          .toLowerCase()
          .includes(search) ||
        transaction.borrower
          .toLowerCase()
          .includes(search) ||
        transaction.status
          .toLowerCase()
          .includes(search)
      );
    }
  );

  // BORROW BOOK
  const handleAddTransaction = () => {
    if (
      !newTransaction.book ||
      !newTransaction.borrower ||
      !newTransaction.dateBorrowed ||
      !newTransaction.dueDate
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // Find selected book
    const selectedBook = books.find(
      (book) => book.title === newTransaction.book
    );

    if (!selectedBook) {
      alert("Book not found.");
      return;
    }

    // Check availability
    if (selectedBook.available <= 0) {
      alert("This book is currently unavailable.");
      return;
    }

    // Create transaction
    const transaction = {
      id: Date.now(),
      book: newTransaction.book,
      borrower: newTransaction.borrower,
      dateBorrowed: newTransaction.dateBorrowed,
      dueDate: newTransaction.dueDate,
      status: "Borrowed",
    };

    // Add transaction
    setTransactions((currentTransactions) => [
      ...currentTransactions,
      transaction,
    ]);

    // Decrease available copies
    setBooks((currentBooks) =>
      currentBooks.map((book) => {
        if (book.id === selectedBook.id) {
          return {
            ...book,
            available: book.available - 1,
          };
        }

        return book;
      })
    );

    resetForm();
  };

  // RETURN BOOK
  const handleReturnBook = (id) => {
    const transaction = transactions.find(
      (item) => item.id === id
    );

    if (!transaction) {
      return;
    }

    // Change transaction status
    setTransactions((currentTransactions) =>
      currentTransactions.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: "Returned",
          };
        }

        return item;
      })
    );

    // Increase available copies
    setBooks((currentBooks) =>
      currentBooks.map((book) => {
        if (book.title === transaction.book) {
          return {
            ...book,
            available: Math.min(
              book.available + 1,
              book.copies
            ),
          };
        }

        return book;
      })
    );
  };

  // DELETE TRANSACTION
  const handleDeleteTransaction = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (transaction) => transaction.id !== id
      )
    );
  };

  // RESET FORM
  const resetForm = () => {
    setNewTransaction({
      book: "",
      borrower: "",
      dateBorrowed: "",
      dueDate: "",
    });

    setShowForm(false);
  };

  return (
    <div className="transactions-page">

      {/* HEADER */}

      <div className="page-header">
        <h1>Transactions</h1>

        <p>
          Manage book borrowing and returns.
        </p>
      </div>


      {/* SEARCH */}

      <div className="books-toolbar">

        <input
          type="text"
          placeholder="Search transactions..."
          className="search-input"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        <button
          type="button"
          className="add-book-button"
          onClick={() => setShowForm(true)}
        >
          + Borrow Book
        </button>

      </div>


      {/* BORROW FORM */}

      {showForm && (

        <div className="add-book-form">

          <h2>Borrow Book</h2>

          <p>
            Enter the borrowing details.
          </p>


          <div className="form-grid">

            {/* BOOK */}

            <select
              value={newTransaction.book}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  book: e.target.value,
                })
              }
            >

              <option value="">
                Select a book
              </option>

              {books.map((book) => (

                <option
                  key={book.id}
                  value={book.title}
                  disabled={book.available === 0}
                >
                  {book.title} (
                  {book.available} available)
                </option>

              ))}

            </select>


            {/* BORROWER */}

            <input
              type="text"
              placeholder="Borrower name"
              value={newTransaction.borrower}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  borrower: e.target.value,
                })
              }
            />


            {/* BORROW DATE */}

            <input
              type="date"
              value={newTransaction.dateBorrowed}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  dateBorrowed: e.target.value,
                })
              }
            />


            {/* DUE DATE */}

            <input
              type="date"
              value={newTransaction.dueDate}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  dueDate: e.target.value,
                })
              }
            />

          </div>


          {/* BUTTONS */}

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>

            <button
              type="button"
              className="save-book-button"
              onClick={handleAddTransaction}
            >
              Borrow Book
            </button>

          </div>

        </div>
      )}


      {/* TRANSACTIONS */}

      <div className="books-table-section">

        <div className="books-table-header">

          <div>

            <h2>Library Transactions</h2>

            <p>
              Showing {filteredTransactions.length} of{" "}
              {transactions.length} transactions.
            </p>

          </div>

        </div>


        <div className="table-container">

          <table className="book-table">

            <thead>

              <tr>
                <th>Book</th>
                <th>Borrower</th>
                <th>Date Borrowed</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>


            <tbody>

              {filteredTransactions.length > 0 ? (

                filteredTransactions.map(
                  (transaction) => (

                    <tr key={transaction.id}>

                      <td className="book-title">
                        {transaction.book}
                      </td>

                      <td>
                        {transaction.borrower}
                      </td>

                      <td>
                        {transaction.dateBorrowed}
                      </td>

                      <td>
                        {transaction.dueDate}
                      </td>

                      <td>

                        <span
                          className={`status ${
                            transaction.status ===
                            "Borrowed"
                              ? "low"
                              : "available"
                          }`}
                        >
                          {transaction.status}
                        </span>

                      </td>

                      <td>

                        {transaction.status ===
                          "Borrowed" && (

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              handleReturnBook(
                                transaction.id
                              )
                            }
                          >
                            Return
                          </button>

                        )}

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDeleteTransaction(
                              transaction.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No transactions found.
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

export default Transactions;