import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";
import axios from "./axios";
import { useAuth } from "./contexts/AuthContext";

function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const history = useHistory();
  const { setCurrentUser } = useAuth();
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    setError("");
    e.preventDefault();
    try {
      const res = await axios.post("/user/login", {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      });
      localStorage.setItem("token", "Bearer " + res.data.accessToken);
      setCurrentUser(res.data.userId);
      history.push("/home");
    } catch (err) {
      setError("Failed to login");
    }
  }

  return (
    <div className="login">
      <div className="card1">
        <h1>RideALONG</h1>
        <h2 className="text-muted">Mern MiniProject</h2>
      </div>
      <div className="card2">
        <h1>Login</h1>
        {error && <span className="errorMessage">{error}</span>}
        <form onSubmit={handleSubmit}>
          <div className="inputContainer">
            <span class="material-icons-outlined">person_outline</span>
            <input ref={usernameRef} placeholder="Username" type="text" />
          </div>

          <div className="inputContainer">
            <span class="material-icons-outlined">lock</span>
            <input ref={passwordRef} placeholder="Password" type="password" />
          </div>
          <div className="loginBtn">
            <button type="submit">Login</button>
          </div>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Signup.</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
