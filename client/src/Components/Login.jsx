import React, { useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please Enter All The Required Fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, name, userId } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        localStorage.setItem("userId", userId);
        alert("Logged In Successful!");
        navigate("/home");
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response);
        setError(error.response.data.message || "Login failed.");
      }
    }
  };

  return (
    <div>
      <img
        src="https://is2-ssl.mzstatic.com/image/thumb/Purple114/v4/b5/60/9b/b5609b14-e928-3f4d-0a34-6ead78a0ada4/source/512x512bb.jpg"
        alt="Logo"
        className="image-card"
      />
      <h3 className="logo">DEALSDRAY</h3>
      <div className="container">
        <h1>Login Page</h1>
        <form className="input-form">
          <input
            type="email"
            placeholder="Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" type="button" onClick={onSubmit}>
            Login
          </button>
        </form>
        <span style={{ margin: "5px" }}>Dont You Have An Account</span>
        <button className="btn" onClick={() => navigate("/register")}>
          Register
        </button>
        <h4 style={{ color: "red" }}>{error}</h4>
      </div>
    </div>
  );
};

export default Login;
