import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { toast, Toaster } from "react-hot-toast";
import axiosInstance from '../axiosConfig';

export default function ManagePrompt() {
  const [prompts, setPrompts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [form, setForm] = useState({ tenantId: "", docType: "", promptText: "" });
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    fetchPrompts();
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
   try {
     const response = await axiosInstance.get('/tenants');
     setTenants(response.data);
   } catch (error) {
     console.error('Failed to load tenants:', error);
   }
 };

  const fetchPrompts = async () => {
    try {
      const response = await axiosInstance.get("/prompts");
      setPrompts(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load prompts");
    }
  };

  const openNewPromptModal = () => {
    setEditingPrompt(null);
    setForm({ tenantId: "", docType: "", promptText: "" });
    setShowModal(true);
  };

  const openEditPromptModal = (prompt) => {
    setEditingPrompt(prompt);
    setForm({
      tenantId: prompt.tenantId,
      docType: prompt.docType,
      promptText: prompt.promptText,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this prompt?")) {
      try {
        await axiosInstance.delete(`/prompts/${id}`);
        toast.success("Prompt deleted successfully");
        fetchPrompts();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete prompt");
      }
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        tenantId: form.tenantId === "default" ? null : form.tenantId,
        docType: form.docType,
        promptText: form.promptText,
      };
  
      if (editingPrompt) {
        await axiosInstance.patch(`/prompts/${editingPrompt._id}`, {
          promptText: form.promptText,
        });
        toast.success("Prompt updated successfully");
      } else {
        await axiosInstance.post("/prompts", payload);
        toast.success("Prompt created successfully");
      }
      setShowModal(false);
      fetchPrompts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save prompt");
    }
  };
  

  return (
   <div className="main-content">
      <div className="container mt-5">
        <h3 className="text-center mb-4">Upload Customer PO</h3>
         <div className="container mt-5">
      <Toaster />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Manage Prompts</h3>
        <Button variant="primary" onClick={openNewPromptModal}>
          ➕ Create New Prompt
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {/*<th>Tenant Code</th>*/}
            <th>Tenant Name</th>
            <th>Document Type</th>
            <th>Prompt Text</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map((prompt) => (
            <tr key={prompt._id}>
              {/*<td>{prompt.tenantId?.tenantCode}</td>*/}
              <td>{prompt.tenantId ? prompt.tenantId.tenantName : "Default (Global Prompt)"}</td>
              <td>{prompt.docType}</td>
              <td style={{ maxWidth: "400px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {prompt.promptText}
              </td>
              <td>
                <Button size="sm" variant="info" onClick={() => openEditPromptModal(prompt)}>
                  Edit
                </Button>{" "}
                <Button size="sm" variant="danger" onClick={() => handleDelete(prompt._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Create/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingPrompt ? "Edit Prompt" : "Create Prompt"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
               <Form.Label>Select Tenant</Form.Label>
               <Form.Select
                  value={form.tenantId}
                  onChange={(e) => setForm({ ...form, tenantId: e.target.value })}
                  disabled={!!editingPrompt}
               >
                  <option value="default">Default (Global Prompt)</option>
                  {tenants.map((tenant) => (
                  <option key={tenant._id} value={tenant._id}>
                     {tenant.tenantName} ({tenant.tenantCode})
                  </option>
                  ))}
               </Form.Select>
            </Form.Group>
        

            <Form.Group className="mb-3">
              <Form.Label>Document Type</Form.Label>
              <Form.Control
                type="text"
                value={form.docType}
                onChange={(e) => setForm({ ...form, docType: e.target.value })}
                disabled={!!editingPrompt}
                placeholder="Enter Document Type (invoice, customerPO, coa)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prompt Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={form.promptText}
                onChange={(e) => setForm({ ...form, promptText: e.target.value })}
                placeholder="Paste your prompt text here"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editingPrompt ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
      </div>
    </div>
  );
}
