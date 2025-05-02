import React, { useState } from 'react';
import { Button, Card, Form, Table, Modal, Row, Col } from 'react-bootstrap';
import { Pencil, Trash, PersonPlus } from 'react-bootstrap-icons';

export default function TenantUserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Anita Rao', email: 'anita@tenant.com', role: 'Admin' },
    { id: 2, name: 'Rahul Joshi', email: 'rahul@tenant.com', role: 'User' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', email: '', role: 'User' });

  const handleEdit = (user) => {
    setFormData(user);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleSave = () => {
    if (formData.id) {
      // update existing
      setUsers(users.map((u) => (u.id === formData.id ? formData : u)));
    } else {
      // add new
      const newUser = { ...formData, id: Date.now() };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
    setFormData({ id: null, name: '', email: '', role: 'User' });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">👥 Tenant User Management</h2>

      <Card className="p-3">
        <div className="d-flex justify-content-end mb-2">
          <Button onClick={() => setShowModal(true)}><PersonPlus className="me-2" /> Add User</Button>
        </div>
        <Table bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button variant="outline-primary" size="sm" onClick={() => handleEdit(user)} className="me-2">
                    <Pencil />
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user.id)}>
                    <Trash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option>User</option>
                <option>Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
