import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const LibraryContext = createContext();

const defaultBooks = [
  {
    id: 1,
    title: "Effective Java",
    author: "Joshua Bloch",
    isbn: "345678",
    category: "Programming",
    copies: 5,
    available: 4,
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "12345",
    category: "Programming",
    copies: 4,
    available: 3,
  },
  {
    id: 3,
    title: "Design Patterns",
    author: "Erich Gamma",
    isbn: "786544",
    category: "Programming",
    copies: 3,
    available: 2,
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    isbn: "5677554",
    category: "Programming",
    copies: 4,
    available: 4,
  },
];

const defaultUsers = [
  {
    id: 1,
    name: "Administrator",
    membershipId: "1234",
    role: "Administrator",
    status: "Active",
    password: "admin2",
  },
  {
    id: 2,
    name: "Rethabile",
    membershipId: "MEM001",
    role: "Member",
    status: "Active",
    password: "john123",
  },
  {
    id: 3,
    name: "Thato Lebo",
    membershipId: "MEM002",
    role: "Member",
    status: "Active",
    password: "mary123",
  },
  {
    id: 4,
    name: "Thabiso",
    membershipId: "LIB001",
    role: "Librarian",
    status: "Active",
    password: "david123",
  },
];

const defaultTransactions = [
  {
    id: 1,
    book: "Effective JavaScript",
    borrower: "John Max",
    dateBorrowed: "2026-09-20",
    dueDate: "2026-10-04",
    status: "Borrowed",
  },
  {
    id: 2,
    book: "Code Wih Ramaria",
    borrower: "Tshepiso",
    dateBorrowed: "2026-09-18",
    dueDate: "2026-10-02",
    status: "Borrowed",
  },
];

function loadData(key, fallback) {
  const saved = localStorage.getItem(key);

  if (!saved) {
    return fallback;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return fallback;
  }
}

function LibraryProvider({ children }) {
  const [books, setBooks] = useState(() =>
    loadData("libraryBooks", defaultBooks)
  );

  const [users, setUsers] = useState(() =>
    loadData("libraryUsers", defaultUsers)
  );

  const [transactions, setTransactions] = useState(() =>
    loadData(
      "libraryTransactions",
      defaultTransactions
    )
  );

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("loggedInUser");

    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  // Make sure the administrator exists
  useEffect(() => {
    setUsers((currentUsers) => {
      const adminExists = currentUsers.some(
        (user) => user.membershipId === "1234"
      );

      if (adminExists) {
        return currentUsers;
      }

      return [...currentUsers, defaultUsers[0]];
    });
  }, []);

  // Save books
  useEffect(() => {
    localStorage.setItem(
      "libraryBooks",
      JSON.stringify(books)
    );
  }, [books]);

  // Save users
  useEffect(() => {
    localStorage.setItem(
      "libraryUsers",
      JSON.stringify(users)
    );
  }, [users]);

  // Save transactions
  useEffect(() => {
    localStorage.setItem(
      "libraryTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

   // LOGIN
const login = (membershipId, password) => {
  const cleanMembershipId = String(membershipId ?? "")
    .trim()
    .toLowerCase();

  const user = users.find(
    (item) =>
      String(item?.membershipId ?? "")
        .trim()
        .toLowerCase() === cleanMembershipId &&
      item?.password === password
  );

  if (!user) {
    return false;
  }

  const sessionUser = {
    id: user.id,
    name: user.name,
    membershipId: user.membershipId,
    role: user.role,
  };

  localStorage.setItem(
    "loggedInUser",
    JSON.stringify(sessionUser)
  );

  setCurrentUser(sessionUser);

  return true;
};
const registerUser = (name, membershipId, password) => {
  const cleanName = name.trim();
  const cleanMembershipId = membershipId.trim();

  // Prevent empty fields
  if (!cleanName || !cleanMembershipId || !password) {
    return {
      success: false,
      message: "Please complete all fields.",
    };
  }

  // Check whether the membership ID already exists
  const existingUser = users.find(
    (user) =>
      String(user.membershipId ?? "").trim().toLowerCase() ===
      cleanMembershipId.toLowerCase()
  );

  if (existingUser) {
    return {
      success: false,
      message: "This Membership ID is already registered.",
    };
  }

  // Create the new account
  const newUser = {
    id: Date.now(),
    name: cleanName,
    membershipId: cleanMembershipId,
    password: password,
    role: "Member",
    status: "Active",
  };

  // Save the new user in React state
  setUsers((previousUsers) => [...previousUsers, newUser]);

  return {
    success: true,
    message: "Registration successful. Please log in.",
  };
};

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("loggedInUser");
    setCurrentUser(null);
  };

  
  return (
    <LibraryContext.Provider
      value={{
        books,
        setBooks,

        users,
        setUsers,

        transactions,
        setTransactions,

        currentUser,

        login,
        registerUser,
        logout,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}

export default LibraryProvider;