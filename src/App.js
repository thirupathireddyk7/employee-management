import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:7000";

function App() {
  const [employees, setEmployees] = useState([]);

  const [employeeName, setEmployeeName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [salary, setSalary] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [status, setStatus] = useState("Active");

  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  // ============================================
  // Fetch Employees
  // ============================================

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API}/employees`);

      setEmployees(response.data.employees);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ============================================
  // Clear Form
  // ============================================

  const clearForm = () => {
    setEmployeeName("");
    setEmail("");
    setPhone("");
    setDepartment("");
    setDesignation("");
    setSalary("");
    setJoiningDate("");
    setStatus("Active");

    setEditingEmployeeId(null);
  };

  // ============================================
  // Submit
  // ============================================

  const handleSubmit = async () => {
    if (
      !employeeName ||
      !email ||
      !department ||
      !designation ||
      !salary ||
      !joiningDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const employeeData = {
      employee_name: employeeName,
      email,
      phone,
      department,
      designation,
      salary,
      joining_date: joiningDate,
      status,
    };

    try {
      setLoading(true);

      if (editingEmployeeId === null) {
        await axios.post(`${API}/employees`, employeeData);

        setMessage("Employee Added Successfully.");
      } else {
        await axios.put(`${API}/employees/${editingEmployeeId}`, employeeData);

        setMessage("Employee Updated Successfully.");
      }

      clearForm();

      fetchEmployees();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  // ============================================
  // Edit Employee
  // ============================================

  const handleEdit = (employee) => {
    setEditingEmployeeId(employee.id);

    setEmployeeName(employee.employee_name);
    setEmail(employee.email);
    setPhone(employee.phone);
    setDepartment(employee.department);
    setDesignation(employee.designation);
    setSalary(employee.salary);
    setJoiningDate(employee.joining_date.split("T")[0]);
    setStatus(employee.status);
  };

  // ============================================
  // Delete Employee
  // ============================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this employee?");

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/employees/${id}`);

      setMessage("Employee Deleted Successfully.");

      fetchEmployees();
    } catch (error) {
      console.log(error);

      alert("Delete failed.");
    }
  };

  // ============================================
  // Search
  // ============================================

  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      employee.department.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="container">
      <h1>Employee Management System</h1>

      {message && <div className="success">{message}</div>}

      <div className="card">
        <h2>{editingEmployeeId ? "Update Employee" : "Add Employee"}</h2>

        <div className="grid">
          <input
            type="text"
            placeholder="Employee Name"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <input
            type="text"
            placeholder="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />

          <input
            type="number"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />

          <input
            type="date"
            value={joiningDate}
            onChange={(e) => setJoiningDate(e.target.value)}
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="buttons">
          <button onClick={handleSubmit}>
            {editingEmployeeId ? "Update Employee" : "Add Employee"}
          </button>

          <button className="cancel" onClick={clearForm}>
            Clear
          </button>
        </div>
      </div>
      <div className="card">
        <div className="table-header">
          <h2>Employees</h2>

          <input
            type="text"
            placeholder="Search by Name, Email or Department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Salary</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-data">
                    No Employees Found
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>

                    <td>{employee.employee_name}</td>

                    <td>{employee.email}</td>

                    <td>{employee.phone}</td>

                    <td>{employee.department}</td>

                    <td>{employee.designation}</td>

                    <td>₹ {employee.salary}</td>

                    <td>{employee.joining_date.split("T")[0]}</td>

                    <td>
                      <span
                        className={
                          employee.status === "Active" ? "active" : "inactive"
                        }
                      >
                        {employee.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="edit"
                        onClick={() => handleEdit(employee)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete"
                        onClick={() => handleDelete(employee.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
