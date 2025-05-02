import React, { useState } from 'react';
import { Button, Card, Form, Row, Col, Tabs, Tab, Table, Dropdown } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';

const documentTypes = ['All', 'Invoice', 'Customer PO', 'Bank Statement', 'PAN/Aadhaar', 'Proposal', 'SOW'];
const statuses = ['All', 'Processed', 'Failed', 'Archived'];

export default function HistoryAndArchive() {
  const [docType, setDocType] = useState('All');
  const [status, setStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [key, setKey] = useState('processed');

  return (
    <div className="container py-4">
      <h2 className="mb-4">📁 History & Archive</h2>

      <Card className="mb-4 p-3">
        <Form>
          <Row className="g-3">
            <Col md={4}>
              <Form.Label>Document Type</Form.Label>
              <Form.Select value={docType} onChange={(e) => setDocType(e.target.value)}>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label>Status</Form.Label>
              <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Col>
            <Col md={2}>
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Col>
            <Col md={1} className="d-flex align-items-end">
              <Button variant="primary" className="w-100">Filter</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="processed" title="✅ Processed">
          <Card className="p-3">
            <p className="text-muted">Processed document list will appear here.</p>
          </Card>
        </Tab>
        <Tab eventKey="failed" title="❌ Failed">
          <Card className="p-3">
            <p className="text-muted">Failed documents with retry option will appear here.</p>
          </Card>
        </Tab>
        <Tab eventKey="archived" title="📦 Archived">
          <Card className="p-3">
            <p className="text-muted">Archived documents by month will be shown here.</p>
          </Card>
        </Tab>
      </Tabs>

      <div className="text-end">
        <Button variant="secondary">
          <Download className="me-2" /> Export to Excel
        </Button>
      </div>
    </div>
  );
}
