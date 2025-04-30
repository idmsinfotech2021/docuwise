import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { Toaster, toast } from "react-hot-toast";
import axiosInstance from '../axiosConfig';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", tenantId: "", role: "user" });

  useEffect(() => {
    fetchUsers();
    fetchTenants();
  }, []);

  const fetchUsers = async () => {
    try {
      //const response = await axiosInstance.get("/admin/users");
      const token = localStorage.getItem('docuwise_token');  // 🛡️ get token first

      const response = await axiosInstance.get("/admin/users", {
         headers: {
         Authorization: `Bearer ${token}`,                  // 🛡️ attach token
         }
      });

      setUsers(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  };

  const fetchTenants = async () => {
    try {
      //const response = await axiosInstance.get("/admin/tenants");
      const token = localStorage.getItem('docuwise_token');  // 🛡️ get token first
      const response = await axiosInstance.get("/admin/tenants", {
         headers: {
         Authorization: `Bearer ${token}`,                  // 🛡️ attach token
         }
      });
      setTenants(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tenants");
    }
  };

  const handleCreateUser = async () => {
    try {
      //await axiosInstance.post("/admin/users", form);
      const token = localStorage.getItem('docuwise_token');  // 🛡️ get token first
 
      await axiosInstance.post("/admin/users", form, {
         headers: {
            Authorization: `Bearer ${token}`,                 // 🛡️ attach token
         }
      });
      toast.success("User created!");
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div className="container mt-5">
      <Toaster />
      <div className="d-flex justify-content-between mb-4">
        <h3>Manage Users</h3>
        <Button onClick={() => setShowModal(true)}>➕ New User</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Tenant Code</th>
            <th>Tenant Name</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.tenantId?.tenantCode || "-"}</td>
              <td>{user.tenantId?.tenantName || "-"}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tenant</Form.Label>
              <Form.Select
                value={form.tenantId}
                onChange={(e) => setForm({ ...form, tenantId: e.target.value })}
              >
                <option value="">-- Select Tenant --</option>
                {tenants.map((tenant) => (
                  <option key={tenant._id} value={tenant._id}>
                    {tenant.tenantCode} - {tenant.tenantName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreateUser}>Create</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
