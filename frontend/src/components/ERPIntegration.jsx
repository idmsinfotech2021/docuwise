import React, { useState } from 'react';
import { Button, Card, Form, Row, Col, Tabs, Tab, Table, InputGroup } from 'react-bootstrap';
import { Plus, Trash, Download } from 'react-bootstrap-icons';

const docTypes = ['Invoice', 'Purchase Order', 'Bank Statement'];

export default function ERPIntegration() {
  const [key, setKey] = useState('api');
  const [apiKey, setApiKey] = useState('');
  const [webhook, setWebhook] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('Invoice');
  const [fieldMappings, setFieldMappings] = useState({
    Invoice: [
      { docField: 'Invoice Number', erpField: 'inv_no' },
      { docField: 'Amount', erpField: 'total_amt' },
    ],
    'Purchase Order': [],
    'Bank Statement': []
  });

  const generateApiKey = () => {
    setApiKey('abc123xyz456generated');
  };

  const handleMappingChange = (index, value) => {
    const updated = [...fieldMappings[selectedDocType]];
    updated[index].erpField = value;
    setFieldMappings({ ...fieldMappings, [selectedDocType]: updated });
  };

  const handleDeleteMapping = (index) => {
    const updated = [...fieldMappings[selectedDocType]];
    updated.splice(index, 1);
    setFieldMappings({ ...fieldMappings, [selectedDocType]: updated });
  };

  const handleAddField = () => {
    const updated = [...fieldMappings[selectedDocType], { docField: '', erpField: '' }];
    setFieldMappings({ ...fieldMappings, [selectedDocType]: updated });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">🔄 ERP Integration</h2>

      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="api" title="🔑 API Key Management">
          <Card className="p-4">
            <Form.Group controlId="apiKey">
              <Form.Label>Current API Key</Form.Label>
              <InputGroup>
                <Form.Control type="text" value={apiKey} readOnly placeholder="No key generated yet" />
                <Button variant="outline-primary" onClick={generateApiKey}>Generate Key</Button>
              </InputGroup>
            </Form.Group>
          </Card>
        </Tab>

        <Tab eventKey="push" title="📤 Push to ERP">
          <Card className="p-4">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select Module</Form.Label>
                <Form.Select>
                  <option>Invoice</option>
                  <option>Purchase Order</option>
                  <option>Bank Statement</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary">Push Selected Documents</Button>
            </Form>
          </Card>
        </Tab>

        <Tab eventKey="webhook" title="🔔 Webhook Setup">
          <Card className="p-4">
            <Form>
              <Form.Group>
                <Form.Label>Webhook Endpoint</Form.Label>
                <Form.Control
                  type="text"
                  value={webhook}
                  onChange={(e) => setWebhook(e.target.value)}
                  placeholder="https://yourdomain.com/erp/webhook"
                />
              </Form.Group>
              <Button variant="success" className="mt-3">Save Webhook</Button>
            </Form>
          </Card>
        </Tab>

        <Tab eventKey="mapping" title="🧩 Field Mapping">
          <Card className="p-4">
            <Form.Group className="mb-3">
              <Form.Label>Select Document Type</Form.Label>
              <Form.Select value={selectedDocType} onChange={(e) => setSelectedDocType(e.target.value)}>
                {docTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </Form.Select>
            </Form.Group>

            <p className="text-muted">Define how extracted fields map to your ERP system fields.</p>
            <Table bordered>
              <thead>
                <tr>
                  <th>Doc Field</th>
                  <th>ERP Field</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fieldMappings[selectedDocType].map((row, index) => (
                  <tr key={index}>
                    <td>{row.docField}</td>
                    <td>
                      <Form.Control
                        value={row.erpField}
                        onChange={(e) => handleMappingChange(index, e.target.value)}
                      />
                    </td>
                    <td><Button variant="outline-danger" size="sm" onClick={() => handleDeleteMapping(index)}><Trash /></Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="outline-secondary" size="sm" onClick={handleAddField}><Plus /> Add Field</Button>
          </Card>
        </Tab>

        <Tab eventKey="logs" title="📜 Integration Logs">
          <Card className="p-4">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Document Type</th>
                  <th>Status</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2025-05-01</td>
                  <td>Invoice</td>
                  <td className="text-success">Success</td>
                  <td>Pushed to ERP</td>
                </tr>
                <tr>
                  <td>2025-05-01</td>
                  <td>Bank Statement</td>
                  <td className="text-danger">Failed</td>
                  <td>Invalid API Key</td>
                </tr>
              </tbody>
            </Table>
            <div className="text-end">
              <Button variant="secondary"><Download className="me-2" /> Export Logs</Button>
            </div>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
