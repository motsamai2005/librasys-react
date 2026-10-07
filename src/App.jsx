import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  Outlet,
} from "react-router-dom";

import { useLibrary } from "./context/LibraryContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";


// ========================================
// PROTECTED LAYOUT
// ========================================

function ProtectedLayout() {
  const { currentUser, logout } = useLibrary();

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="brand-icon">
            📚
          </div>

          <div>
            <strong>LibraSys</strong>

            <span>
              Library System
            </span>
          </div>

        </div>


        <div className="nav-title">
          MAIN MENU
        </div>


        <nav>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            <span>📊</span>
            Dashboard
          </NavLink>


          <NavLink
            to="/books"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            <span>📚</span>
            Books
          </NavLink>


          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            <span>🔄</span>
            Transactions
          </NavLink>

        </nav>


        <div className="nav-title">
          MANAGEMENT
        </div>


        <nav>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            <span>👥</span>
            Users
          </NavLink>

        </nav>


        <div className="current-user">

          <small>
            Logged in as
          </small>

          <strong>
            {currentUser.name}
          </strong>

          <span>
            {currentUser.role}
          </span>

        </div>


        <button
          type="button"
          className="logout"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </aside>


      <main className="main-content">

        <Outlet />

      </main>

    </div>
  );
}


// ========================================
// APP
// ========================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

    {/* MAIN LINK OPENS REGISTRATION */}
    <Route
      path="/"
      element={<Navigate to="/register" replace />}
    />

        {/* PUBLIC */}
        

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PROTECTED */}

        <Route element={<ProtectedLayout />}>
  
  <Route
    path="/dashboard"
    element={<Dashboard />}
  />

  <Route
    path="/books"
    element={<Books />}
  />

  <Route
    path="/transactions"
    element={<Transactions />}
  />

  <Route
    path="/users"
    element={<Users />}
  />
</Route>


        {/* UNKNOWN URL */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;