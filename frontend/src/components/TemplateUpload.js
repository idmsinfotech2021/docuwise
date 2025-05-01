import React, { useState } from 'react';
import axios from 'axios';
import { Spinner, Alert, Button, Form } from 'react-bootstrap';
import axiosInstance from '../axiosConfig';

function TemplateUpload() {
  const [file, setFile] = useState(null);
  const [placeholders, setPlaceholders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('info');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setPlaceholders([]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a .docx file to upload');
      setVariant('warning');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const token = localStorage.getItem('docuwise_token');  // 🛡️ get token first
      const response = await axiosInstance.post(
        '/proposal/template/upload',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,  // <<< THIS IS IMPORTANT
          }
        }
      );

      setPlaceholders(response.data.template.placeholderList);
      setMessage('Template uploaded successfully!');
      setVariant('success');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed');
      setVariant('danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Upload Proposal Template</h3>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Select .docx Template File</Form.Label>
        <Form.Control type="file" accept=".docx" onChange={handleFileChange} />
      </Form.Group>

      <Button variant="primary" onClick={handleUpload} disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Upload Template'}
      </Button>

      {message && <Alert className="mt-3" variant={variant}>{message}</Alert>}

      {placeholders.length > 0 && (
        <div className="mt-4">
          <h5>Detected Placeholders:</h5>
          <ul>
            {placeholders.map((ph, idx) => <li key={idx}>{ph}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TemplateUpload;
