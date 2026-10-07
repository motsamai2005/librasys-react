function BookTable() {
  const books = [
    {
      title: "Things Fall Apart",
      author: "Chinua Achebe",
      genre: "Fiction",
      isbn: "9780385474542",
      stock: 5,
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      genre: "Adventure",
      isbn: "9780061122415",
      stock: 3,
    },
    {
      title: "Introduction to Programming",
      author: "John Smith",
      genre: "Technology",
      isbn: "9781234567890",
      stock: 1,
    },
    {
      title: "Business Management",
      author: "Jane Brown",
      genre: "Business",
      isbn: "9780987654321",
      stock: 0,
    },
  ];

  return (
    <section className="inventory-section">

      <div className="section-header">
        <div>
          <h2>Library Inventory</h2>
          <p>Current books available in the library</p>
        </div>

        <button className="view-all-button">
          View All
        </button>
      </div>

      <div className="table-container">
        <table className="book-table">

          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ISBN</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.isbn}>

                <td className="book-title">
                  {book.title}
                </td>

                <td>{book.author}</td>

                <td>{book.genre}</td>

                <td>{book.isbn}</td>

                <td>{book.stock}</td>

                <td>
                  {book.stock === 0 ? (
                    <span className="status out">
                      Out of Stock
                    </span>
                  ) : book.stock < 2 ? (
                    <span className="status low">
                      Low Stock
                    </span>
                  ) : (
                    <span className="status available">
                      Available
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </section>
  );
}

export default BookTable;