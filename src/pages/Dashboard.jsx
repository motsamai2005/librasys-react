import { useLibrary } from "../context/LibraryContext";

function Dashboard() {
  const {
    books,
    users,
    transactions,
    currentUser,
  } = useLibrary();

  // =========================
  // DASHBOARD CALCULATIONS
  // =========================

  const totalBooks = books.reduce(
    (total, book) => total + book.copies,
    0
  );

  const availableCopies = books.reduce(
    (total, book) => total + book.available,
    0
  );

  const lowStockBooks = books.filter(
    (book) =>
      book.available > 0 &&
      book.available < 2
  );

  const borrowedBooks = transactions.filter(
    (transaction) =>
      transaction.status === "Borrowed"
  ).length;

  const totalUsers = users.length;


  return (
    <div className="dashboard-page">

      {/* =====================================
          TOP HEADER
      ====================================== */}

      <div className="dashboard-topbar">

        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back, {currentUser?.name || "Administrator"}.
          </p>
        </div>

        <div className="dashboard-profile">

          <div className="profile-avatar">
            👤
          </div>

          <div>
            <strong>
              {currentUser?.name || "Administrator"}
            </strong>

            <span>
              {currentUser?.role || "Administrator"}
            </span>
          </div>

        </div>

      </div>


      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="dashboard-stats">

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            📚
          </div>

          <div>

            <span>
              Total Books
            </span>

            <strong>
              {totalBooks}
            </strong>

            <small>
              Total copies in library
            </small>

          </div>

        </div>


        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            📦
          </div>

          <div>

            <span>
              Available Copies
            </span>

            <strong>
              {availableCopies}
            </strong>

            <small>
              Currently available
            </small>

          </div>

        </div>


        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon warning-icon">
            ⚠️
          </div>

          <div>

            <span>
              Low Stock
            </span>

            <strong>
              {lowStockBooks.length}
            </strong>

            <small>
              Books needing attention
            </small>

          </div>

        </div>


        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            👥
          </div>

          <div>

            <span>
              Total Users
            </span>

            <strong>
              {totalUsers}
            </strong>

            <small>
              Registered users
            </small>

          </div>

        </div>

      </div>


      {/* =====================================
          MAIN DASHBOARD GRID
      ====================================== */}

      <div className="dashboard-content-grid">

        {/* INVENTORY */}

        <section className="dashboard-panel inventory-panel">

          <div className="dashboard-panel-header">

            <div>

              <h2>
                Book Inventory
              </h2>

              <p>
                Current availability of library books
              </p>

            </div>

          </div>


          <div className="table-container">

            <table className="dashboard-table">

              <thead>

                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Available</th>
                  <th>Status</th>
                </tr>

              </thead>


              <tbody>

                {books.length > 0 ? (

                  books.map((book) => {

                    let status = "Available";
                    let statusClass = "available";

                    if (book.available === 0) {
                      status = "Out of Stock";
                      statusClass = "out";
                    } else if (book.available < 2) {
                      status = "Low Stock";
                      statusClass = "low";
                    }

                    return (
                      <tr key={book.id}>

                        <td className="dashboard-book-title">
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
                            className={`status ${statusClass}`}
                          >
                            {status}
                          </span>

                        </td>

                      </tr>
                    );
                  })

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="dashboard-empty"
                    >
                      No books available.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* QUICK ACTIONS */}

        <section className="dashboard-panel quick-panel">

          <div className="dashboard-panel-header">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Common library operations
              </p>

            </div>

          </div>


          <div className="quick-actions">

            <button
              type="button"
              className="quick-action"
              onClick={() =>
                window.location.href = "/books"
              }
            >

              <span>
                ➕
              </span>

              <div>

                <strong>
                  Add Book
                </strong>

                <small>
                  Add a new book
                </small>

              </div>

            </button>


            <button
              type="button"
              className="quick-action"
              onClick={() =>
                window.location.href = "/transactions"
              }
            >

              <span>
                🔄
              </span>

              <div>

                <strong>
                  New Transaction
                </strong>

                <small>
                  Borrow or return
                </small>

              </div>

            </button>


            <button
              type="button"
              className="quick-action"
              onClick={() =>
                window.location.href = "/users"
              }
            >

              <span>
                👥
              </span>

              <div>

                <strong>
                  Manage Users
                </strong>

                <small>
                  View library users
                </small>

              </div>

            </button>

          </div>

        </section>

      </div>


      {/* =====================================
          RECENT TRANSACTIONS
      ====================================== */}

      <section className="dashboard-panel recent-panel">

        <div className="dashboard-panel-header">

          <div>

            <h2>
              Recent Transactions
            </h2>

            <p>
              Latest library activity
            </p>

          </div>

        </div>


        <div className="table-container">

          <table className="dashboard-table">

            <thead>

              <tr>
                <th>Book</th>
                <th>Borrower</th>
                <th>Date</th>
                <th>Status</th>
              </tr>

            </thead>


            <tbody>

              {transactions.length > 0 ? (

                transactions
                  .slice(-5)
                  .reverse()
                  .map((transaction) => (

                    <tr key={transaction.id}>

                      <td className="dashboard-book-title">
                        {transaction.book}
                      </td>

                      <td>
                        {transaction.borrower}
                      </td>

                      <td>
                        {transaction.dateBorrowed}
                      </td>

                      <td>

                        <span
                          className={`status ${
                            transaction.status === "Borrowed"
                              ? "low"
                              : "available"
                          }`}
                        >
                          {transaction.status}
                        </span>

                      </td>

                    </tr>

                  ))

              ) : (

                <tr>

                  <td
                    colSpan="4"
                    className="dashboard-empty"
                  >
                    No transactions recorded.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;