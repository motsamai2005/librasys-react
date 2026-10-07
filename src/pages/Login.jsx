import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useLibrary } from "../context/LibraryContext";


function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useLibrary();

  const [membershipId, setMembershipId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const successMessage =
    location.state?.registrationSuccess || "";


  const handleSubmit = (event) => {
  event.preventDefault();
  setError("");

  console.log("LibraSys: Login button clicked");

  try {
    const success = login(
      membershipId.trim(),
      password
    );

    console.log("LibraSys: Login result:", success);

    if (!success) {
      setError("Invalid membership ID or password.");
      return;
    }

    console.log("LibraSys: Opening dashboard");

    navigate("/dashboard", {
      replace: true,
    });
  } catch (error) {
    console.error("LibraSys: Login error:", error);
    setError("An application error occurred during login.");
  }
};

  return (
    <div className="login-page">

      <div className="login-box">

        <div className="login-logo">
          📚
        </div>

        <span className="login-label">
          LIBRASYS
        </span>

        <h1>
          Welcome Back
        </h1>

        <p className="login-description">
          Sign in to manage the library system.
        </p>


        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="login-field">

            <label>
              Membership ID
            </label>

            <input
              type="text"
              placeholder="e.g. 1234"
              value={membershipId}
              onChange={(event) =>
                setMembershipId(
                  event.target.value
                )
              }
              required
            />

          </div>


          <div className="login-field">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              required
            />

          </div>


          {successMessage && (
            <p className="login-success">
              {successMessage}
            </p>
          )}


          {error && (
            <p className="login-error">
              {error}
            </p>
          )}


          <button
            type="submit"
            className="login-submit-button"
          >
             Login to LibraSys
          </button>

        </form>


        <div className="register-link">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Register here
          </Link> 

        </div>


        <div className="demo-login">

          <strong>
            Demo Administrator
          </strong>

          <span>
            ID: 1234
          </span>

          <span>
            Password: admin2
          </span>

        </div>

      </div>

    </div>
  );
}

export default Login;