import React, { useState } from "react";
import axios from "axios";

const UpdateForm = ({ employee, onCancel, onSuccess }) => {
  const [name, setName] = useState(employee.name || "");
  const [email, setEmail] = useState(employee.email || "");
  const [mobile, setMobile] = useState(employee.mobile || "");
  const [designation, setDesignation] = useState(employee.designation || "");
  const [gender, setGender] = useState(employee.gender || "");
  const [courses, setCourses] = useState(employee.courses || []);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  // Define handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate the form
    if (
      !name ||
      !email ||
      !mobile ||
      !designation ||
      !gender ||
      courses.length === 0
    ) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("designation", designation);
    formData.append("gender", gender);
    formData.append("courses", JSON.stringify(courses));
    if (file) formData.append("file", file);

    try {
      // Send the PUT request to update the employee
      await axios.put(
        `http://localhost:8080/employees/${employee._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Show success message
      alert("Employee Updated Successfully!");
      onSuccess();
    } catch (error) {
      console.error("Error updating employee:", error);
      if (error.response) {
        alert(
          `Error: ${
            error.response.data.message ||
            "There was an error updating the employee."
          }`
        );
      } else {
        alert("There was an error updating the employee.");
      }
    }
  };

  return (
    <div>
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Update Employee</h3>
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
                <option value="select desiganation">Select Designation</option>
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
              <button type="button" className="btn" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn">
                Update
              </button>
            </div>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateForm;
