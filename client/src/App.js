import "./App.css";
import EmpList from "./Components/EmpList";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/employees" element={<EmpList />} />
      </Routes>
    </>
  );
}

export default App;
