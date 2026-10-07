import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useLibrary } from "../context/LibraryContext";

function Register() {
  const navigate = useNavigate();

  const { registerUser } = useLibrary();

  const [formData, setFormData] = useState({
    name: "",
    membershipId: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    // Check all fields
    if (
      !formData.name.trim() ||
      !formData.membershipId.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    // Check password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Check matching passwords
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Register the user
    const result = registerUser(
      formData.name.trim(),
      formData.membershipId.trim(),
      formData.password
    );

    // Registration failed
    if (!result.success) {
      setError(result.message);
      return;
    }

    // Registration successful
    // Go to login page
    navigate("/login", {
      replace: true,
      state: {
        registrationSuccess:
          "Registration successful. Please log in.",
      },
    });
  };

  return (
    <div className="login-page">
      <div className="login-box">

        <div className="login-logo">
          📚
        </div>

        <span className="login-label">
          COMM LIBRARY
        </span>

        <h1>
          Create Account
        </h1>

        <p className="login-description">
          Register a new library member account.
        </p>

        <form
          className="login-form"
          onSubmit={handleSubmit}
          autoComplete="off"
        >

          {/* FULL NAME */}
          <div className="login-field">
            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* MEMBERSHIP ID */}
          <div className="login-field">
            <label>
              Membership ID
            </label>

            <input
              type="text"
              name="membershipId"
              placeholder="e.g. MEM004"
              value={formData.membershipId}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="login-field">
            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="login-field">
            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Enter password again"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            className="login-submit-button"
          >
            Create Account
          </button>

        </form>

        {/* LOGIN LINK */}
        <div className="register-link">
          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login here
          </Link>
        </div>

        {/* NOTE */}
        <div className="registration-note">
          New accounts are automatically registered as{" "}
          <strong>Members</strong>.
        </div>

      </div>
    </div>
  );
}

export default Register;