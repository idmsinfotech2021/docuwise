import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { Toaster, toast } from "react-hot-toast";
import axiosInstance from '../axiosConfig';

export default function TenantManagement() {
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ tenantCode: "", tenantName: "", status: "active" });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
   try {
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
 

  const handleCreateTenant = async () => {
   try {
     const token = localStorage.getItem('docuwise_token');  // 🛡️ get token first
 
     await axiosInstance.post("/admin/tenants", form, {
       headers: {
         Authorization: `Bearer ${token}`,                 // 🛡️ attach token
       }
     });
 
     toast.success("Tenant created!");
     setShowModal(false);
     fetchTenants(); // Refresh list
 
   } catch (err) {
     console.error(err);
     toast.error(err.response?.data?.message || "Failed to create tenant");
   }
 };
 

  return (
    <div className="container mt-5">
      <Toaster />
      <div className="d-flex justify-content-between mb-4">
        <h3>Manage Tenants</h3>
        <Button onClick={() => setShowModal(true)}>➕ New Tenant</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Tenant Code</th>
            <th>Tenant Name</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant._id}>
              <td>{tenant.tenantCode}</td>
              <td>{tenant.tenantName}</td>
              <td>{tenant.status}</td>
              <td>{new Date(tenant.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Tenant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tenant Code</Form.Label>
              <Form.Control
                type="text"
                value={form.tenantCode}
                onChange={(e) => setForm({ ...form, tenantCode: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tenant Name</Form.Label>
              <Form.Control
                type="text"
                value={form.tenantName}
                onChange={(e) => setForm({ ...form, tenantName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreateTenant}>Create</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
