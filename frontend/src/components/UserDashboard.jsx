import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Spinner, ProgressBar } from "react-bootstrap";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axiosInstance from '../axiosConfig';

export default function UserDashboard() {
  const [uploads, setUploads] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("invoice");
  const [extractedData, setExtractedData] = useState(null);
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingUploads, setLoadingUploads] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    fetchUploads();
    const interval = setInterval(fetchUploads, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUploads = async () => {
    try {
      const token = localStorage.getItem('docuwise_token');
      const tenantId = localStorage.getItem('docuwise_tenantId');

      const response = await axiosInstance.get("/uploads", {
        headers: { Authorization: `Bearer ${token}` },
        params: { tenantId }
      });

      setUploads(response.data);
      setLoadingUploads(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load uploads");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      const token = localStorage.getItem('docuwise_token');
      const tenantId = localStorage.getItem('docuwise_tenantId');

      const formData = new FormData();
      formData.append("file", file);
      formData.append("tenantId", tenantId);
      formData.append("docType", docType);

      setUploading(true);

      await axiosInstance.post("/uploads", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("File uploaded successfully!");
      setShowUploadModal(false);
      setFile(null);
      setUploading(false);
      fetchUploads();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const viewExtraction = async (uploadId) => {
    try {
      const token = localStorage.getItem('docuwise_token');
      const response = await axiosInstance.get(`/extracted-results/${uploadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExtractedData(response.data.extractedData);
      setShowExtractModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch extracted data");
    }
  };

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(extractedData, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = "extracted_result.json";
    link.click();
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([extractedData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExtractedData");
    XLSX.writeFile(workbook, "extracted_result.xlsx");
  };

  return (
    <div className="container mt-5">
      <Toaster />
      <div className="d-flex justify-content-between mb-4">
        <h3>My Uploaded Documents</h3>
        <div>
          <Button variant="success" onClick={() => setShowUploadModal(true)} className="me-2">
            ➕ Upload Document
          </Button>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      {loadingUploads ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <div>Loading documents...</div>
        </div>
      ) : uploads.length === 0 ? (
        <div className="text-center my-5">
          <h5>No documents uploaded yet!</h5>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Doc Type</th>
              <th>Status</th>
              <th>Uploaded At</th>
              <th>Actions</th>
              <th>Validation Errors</th>
              <th>Validate</th> {/* ✅ Added New Column */}
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr
                key={upload._id}
                style={{
                  backgroundColor:
                    upload.status === 'needs_correction'
                      ? '#fff9c4'
                      : upload.status === 'completed'
                      ? '#c8e6c9'
                      : 'transparent'
                }}
              >
                <td>{upload.originalFilename}</td>
                <td>{upload.docType}</td>
                <td>{upload.status}</td>
                <td>{new Date(upload.createdAt).toLocaleString('en-GB')}</td>
                <td>
                  {upload.status === "completed" ? (
                    <Button size="sm" variant="info" onClick={() => viewExtraction(upload._id)}>View Result</Button>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {upload.status === 'needs_correction' && upload.validationErrors && upload.validationErrors.length > 0 ? (
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {upload.validationErrors.map((err, idx) => (
                        <li key={idx} style={{ color: 'red', fontSize: '13px' }}>{err}</li>
                      ))}
                    </ul>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {(upload.status === 'needs_correction' || upload.status === 'completed') ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/validate/${upload._id}`)}
                    >
                      Validate
                    </Button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {uploading ? (
            <div className="text-center my-5">
              <ProgressBar animated now={100} label="Uploading..." />
            </div>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Choose File</Form.Label>
                <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Document Type</Form.Label>
                <Form.Select value={docType} onChange={(e) => setDocType(e.target.value)}>
                  <option value="invoice">Invoice</option>
                  <option value="customerPO">Customer PO</option>
                  <option value="coa">Certificate of Analysis (COA)</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        {!uploading && (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpload}>Upload</Button>
          </Modal.Footer>
        )}
      </Modal>

      {/* Extraction Result Modal */}
      <Modal show={showExtractModal} onHide={() => setShowExtractModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Extracted Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre>{JSON.stringify(extractedData, null, 2)}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={downloadJSON}>Download JSON</Button>
          <Button variant="success" onClick={downloadExcel}>Download Excel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
