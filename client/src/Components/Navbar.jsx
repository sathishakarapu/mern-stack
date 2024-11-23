import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name");

    if (!name) {
      setUserName("");
      return;
    }

    setUserName(name);
  }, [userName]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setUserName("");
    alert("Logout completed");
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="logo-flex">
        <img
          src="https://is2-ssl.mzstatic.com/image/thumb/Purple114/v4/b5/60/9b/b5609b14-e928-3f4d-0a34-6ead78a0ada4/source/512x512bb.jpg"
          alt="Logo"
          className="logo-nav"
        />
        <h5 className="logo-div">DealsDray</h5>
      </div>
      <div
        className={`navbar-item ${
          location.pathname === "/home" ? "selected" : ""
        }`}
        onClick={() => navigate("/home")}
      >
        Home
      </div>
      <div
        className={`navbar-item ${
          location.pathname === "/employees" ? "selected" : ""
        }`}
        onClick={() => navigate("/employees")}
      >
        Employees List
      </div>
      <h4 style={{ textTransform: "capitalize" }}>{userName}</h4>
      <button className="btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;
