import React, { useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please Enter All The Required Fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/register", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/");
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Registration failed.");
      } else if (error.request) {
        setError("No response from the server. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
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
        <h1>Register page</h1>
        <form action="post" className="input-form">
          <input
            type="text"
            name="name"
            placeholder="First Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Id"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" type="button" onClick={onSubmit}>
            Register
          </button>
        </form>
        <span style={{ margin: "5px" }}>Already Have An Account</span>
        <button className="btn" onClick={() => navigate("/")}>
          Login
        </button>
        <h4 style={{ color: "red" }}>{error}</h4>
      </div>
    </div>
  );
};

export default Register;
