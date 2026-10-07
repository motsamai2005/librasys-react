import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";

function Users() {
  const { users, setUsers } = useLibrary();

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    membershipId: "",
    role: "Member",
  });

  // =========================
  // SEARCH
  // =========================

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    return (
      user.name.toLowerCase().includes(search) ||
      user.membershipId.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search)
    );
  });

  // =========================
  // ADD USER
  // =========================

  const handleAddUser = () => {
    if (
      !newUser.name ||
      !newUser.membershipId ||
      !newUser.role
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const duplicate = users.some(
      (user) =>
        user.membershipId.toLowerCase() ===
        newUser.membershipId.toLowerCase()
    );

    if (duplicate) {
      alert("That membership ID already exists.");
      return;
    }

    const user = {
      id: Date.now(),
      name: newUser.name,
      membershipId: newUser.membershipId,
      role: newUser.role,
      status: "Active",
    };

    setUsers((currentUsers) => [
      ...currentUsers,
      user,
    ]);

    resetForm();
  };

  // =========================
  // EDIT USER
  // =========================

  const handleEditUser = (user) => {
    setEditingUserId(user.id);

    setNewUser({
      name: user.name,
      membershipId: user.membershipId,
      role: user.role,
    });

    setShowForm(true);
  };

  // =========================
  // UPDATE USER
  // =========================

  const handleUpdateUser = () => {
    if (
      !newUser.name ||
      !newUser.membershipId ||
      !newUser.role
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const duplicate = users.some(
      (user) =>
        user.id !== editingUserId &&
        user.membershipId.toLowerCase() ===
          newUser.membershipId.toLowerCase()
    );

    if (duplicate) {
      alert("That membership ID already exists.");
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) => {
        if (user.id === editingUserId) {
          return {
            ...user,
            name: newUser.name,
            membershipId: newUser.membershipId,
            role: newUser.role,
          };
        }

        return user;
      })
    );

    resetForm();
  };

  // =========================
  // DELETE USER
  // =========================

  const handleDeleteUser = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== id)
    );
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setNewUser({
      name: "",
      membershipId: "",
      role: "Member",
    });

    setEditingUserId(null);
    setShowForm(false);
  };

  return (
    <div className="users-page">

      {/* PAGE HEADER */}

      <div className="page-header">
        <h1>Users</h1>

        <p>
          Manage library members, librarians and administrators.
        </p>
      </div>


      {/* SEARCH + ADD */}

      <div className="books-toolbar">

        <input
          type="text"
          placeholder="Search users..."
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
            setEditingUserId(null);

            setNewUser({
              name: "",
              membershipId: "",
              role: "Member",
            });

            setShowForm(true);
          }}
        >
          + Add User
        </button>

      </div>


      {/* ADD / EDIT FORM */}

      {showForm && (

        <div className="add-book-form">

          <h2>
            {editingUserId !== null
              ? "Edit User"
              : "Add New User"}
          </h2>

          <p>
            {editingUserId !== null
              ? "Update the user's details."
              : "Enter the new user's details."}
          </p>


          <div className="form-grid">

            <input
              type="text"
              placeholder="Full name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  name: e.target.value,
                })
              }
            />


            <input
              type="text"
              placeholder="Membership ID"
              value={newUser.membershipId}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  membershipId: e.target.value,
                })
              }
            />


            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  role: e.target.value,
                })
              }
            >
              <option value="Member">
                Member
              </option>

              <option value="Librarian">
                Librarian
              </option>

              <option value="Administrator">
                Administrator
              </option>
            </select>

          </div>


          {/* FORM BUTTONS */}

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>


            {editingUserId !== null ? (

              <button
                type="button"
                className="save-book-button"
                onClick={handleUpdateUser}
              >
                Update User
              </button>

            ) : (

              <button
                type="button"
                className="save-book-button"
                onClick={handleAddUser}
              >
                Save User
              </button>

            )}

          </div>

        </div>
      )}


      {/* USERS TABLE */}

      <div className="books-table-section">

        <div className="books-table-header">

          <div>

            <h2>Library Users</h2>

            <p>
              Showing {filteredUsers.length} of{" "}
              {users.length} users.
            </p>

          </div>

        </div>


        <div className="table-container">

          <table className="book-table">

            <thead>

              <tr>
                <th>Name</th>
                <th>Membership ID</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>


            <tbody>

              {filteredUsers.length > 0 ? (

                filteredUsers.map((user) => (

                  <tr key={user.id}>

                    <td className="book-title">
                      {user.name}
                    </td>

                    <td>
                      {user.membershipId}
                    </td>

                    <td>
                      {user.role}
                    </td>

                   <td>

                      <span className="status available">
                        {user.status}
                      </span>

                    </td>

                    <td>

                      <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                          handleEditUser(user)
                        }
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          handleDeleteUser(user.id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#667085",
                    }}
                  >
                    No users found.
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

export default Users;