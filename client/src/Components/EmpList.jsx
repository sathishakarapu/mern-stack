import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./style.css";
import axios from "axios";
import UpdateForm from "./UpdateForm";

const EmpList = () => {
  const [userId, setUserId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [designation, setDesignation] = useState("");
  const [gender, setGender] = useState("");
  const [courses, setCourses] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `http://localhost:8080/list?userId=${userId}`
        );
        setEmployees(response.data.employeesList);
        setError("");
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchEmployees();
  }, [userId, employees]);

  const handleDelete = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:8080/employees/${employeeId}`);
      alert("Employee deleted successfully");
      const response = await axios.get(
        `http://localhost:8080/list?userId=${userId}`
      );
      setEmployees(response.data.employeesList);
    } catch (error) {
      alert("Something Went Wrong!");
      console.error("Error deleting employee:", error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    clearForm();
  };

  useEffect(() => {
    const filtered = employees.filter((employee) =>
      ["name", "email", "_id", "createdAt"].some((key) =>
        employee[key]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    const sorted = [...filteredEmployees].sort((a, b) => {
      if (field === "createdAt") {
        return order === "asc"
          ? new Date(a[field]) - new Date(b[field])
          : new Date(b[field]) - new Date(a[field]);
      } else {
        return order === "asc"
          ? a[field]?.localeCompare(b[field])
          : b[field]?.localeCompare(a[field]);
      }
    });
    setFilteredEmployees(sorted);
    setSortField(field);
    setSortOrder(order);
  };

  const validateForm = () => {
    if (
      !name.trim() ||
      !email ||
      !mobile ||
      !designation ||
      !gender ||
      !file ||
      !userId
    )
      return "All Fields Are required.";
    if (courses.length === 0) return "Please select at least one course.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email format.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("email", email);
      formDataToSend.append("mobile", mobile);
      formDataToSend.append("designation", designation);
      formDataToSend.append("gender", gender);
      formDataToSend.append("courses", JSON.stringify(courses));
      formDataToSend.append("file", file);
      formDataToSend.append("userId", userId);

      const response = await axios.post(
        "http://localhost:8080/employees",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Employee Created Successfully!");
      setEmployees((prev) => [...prev, response.data]);
      toggleModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to create employee.");
    }
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setMobile("");
    setDesignation("");
    setGender("");
    setCourses([]);
    setFile(null);
  };

  const handleEdit = async (employeeId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/list/${employeeId}`
      );
      setEmployeeToEdit(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onCancel = () => {
    setEmployeeToEdit(false);
    clearForm();
  };

  const onSuccess = () => {
    setEmployeeToEdit(false);
    clearForm();
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
        }}
      >
        <div className="count">Total Count: {employees.length}</div>
        <div
          className="div-button"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <button className="btn" onClick={toggleModal}>
            Create Employee
          </button>
          <input
            className="search"
            type="search"
            placeholder="Search Here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div>
        {filteredEmployees.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("_id")}>
                  Unique ID{" "}
                  {sortField === "_id" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th>Image</th>
                <th onClick={() => handleSort("name")}>
                  Name{" "}
                  {sortField === "name"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th onClick={() => handleSort("email")}>
                  Email{" "}
                  {sortField === "email"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th>Mobile No</th>
                <th>Designation</th>
                <th>Gender</th>
                <th>Courses</th>
                <th onClick={() => handleSort("createdAt")}>
                  Created Date{" "}
                  {sortField === "createdAt"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, i) => (
                <tr key={employee._id}>
                  <td>{i + 1}</td>
                  <td>
                    <img
                      src={employee.file}
                      alt={employee.name}
                      width="60"
                      height="60"
                    />
                  </td>
                  <td style={{ textTransform: "capitalize" }}>
                    {employee.name}
                  </td>
                  <td>{employee.email}</td>
                  <td>{employee.mobile}</td>
                  <td style={{ textTransform: "capitalize" }}>
                    {employee.designation}
                  </td>
                  <td style={{ textTransform: "capitalize" }}>
                    {employee.gender}
                  </td>
                  <td style={{ textTransform: "capitalize" }}>
                    {employee.courses ? employee.courses.join(", ") : ""}
                  </td>
                  <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(employee._id)}
                      className="btn"
                      style={{ marginRight: "5px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="btn"
                      style={{ background: "#FF2929" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h1 style={{ marginTop: "150px", marginLeft: "300px" }}>
            No Employees Found. Create An Employee !
          </h1>
        )}
      </div>
      <div>
        {employeeToEdit && (
          <UpdateForm
            employee={employeeToEdit}
            onCancel={onCancel}
            onSuccess={onSuccess}
          />
        )}
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create Employee</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  required
                  type="text"
                  id="name"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  required
                  type="email"
                  id="email"
                  placeholder="Enter Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="mobile">Mobile</label>
                <input
                  required
                  type="number"
                  id="mobile"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="designation" style={{ marginRight: "5px" }}>
                  Designation
                </label>
                <select
                  id="designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                >
                  <option value="select desiganation">
                    Select Designation
                  </option>
                  <option value="hr">HR</option>
                  <option value="manager">Manager</option>
                  <option value="sales">Sales</option>
                </select>
              </div>
              <div className="form-group">
                <label>Gender</label>
                <div style={{ display: "flex" }}>
                  <label style={{ display: "flex" }}>
                    <input
                      className="radio"
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    Male
                  </label>
                  <label style={{ display: "flex" }}>
                    <input
                      className="radio"
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    Female
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Course</label>
                <div style={{ display: "flex" }}>
                  <label style={{ display: "flex" }}>
                    <input
                      className="radio"
                      type="checkbox"
                      value="mca"
                      checked={courses.includes("mca")}
                      onChange={(e) =>
                        setCourses((prev) =>
                          e.target.checked
                            ? [...prev, e.target.value]
                            : prev.filter((course) => course !== e.target.value)
                        )
                      }
                    />
                    MCA
                  </label>
                  <label style={{ display: "flex" }}>
                    <input
                      className="radio"
                      type="checkbox"
                      value="bca"
                      checked={courses.includes("bca")}
                      onChange={(e) =>
                        setCourses((prev) =>
                          e.target.checked
                            ? [...prev, e.target.value]
                            : prev.filter((course) => course !== e.target.value)
                        )
                      }
                    />
                    BCA
                  </label>
                  <label style={{ display: "flex" }}>
                    <input
                      className="radio"
                      type="checkbox"
                      value="bsc"
                      checked={courses.includes("bsc")}
                      onChange={(e) =>
                        setCourses((prev) =>
                          e.target.checked
                            ? [...prev, e.target.value]
                            : prev.filter((course) => course !== e.target.value)
                        )
                      }
                    />
                    BSC
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="file">Upload File</label>
                <input
                  required
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <div
                className="form-actions"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <button type="button" className="btn" onClick={toggleModal}>
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Submit
                </button>
              </div>
              {error && <p className="error">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpList;
