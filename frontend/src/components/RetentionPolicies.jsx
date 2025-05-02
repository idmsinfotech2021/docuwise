import React, { useState } from 'react';
import { Card, Table, Form, Button } from 'react-bootstrap';

const documentTypes = ['Invoice', 'Purchase Order', 'Bank Statement'];

export default function RetentionPolicies() {
  const [retentionSettings, setRetentionSettings] = useState({
    Invoice: 365,
    'Purchase Order': 180,
    'Bank Statement': 730
  });

  const handleChange = (docType, value) => {
    setRetentionSettings({ ...retentionSettings, [docType]: Number(value) });
  };

  const handleSave = () => {
    console.log('Retention settings saved:', retentionSettings);
    alert('Retention settings saved successfully!');
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">📁 Retention Policies</h2>

      <Card className="p-4">
        <p className="text-muted">Set how long (in days) each document type should be retained before being archived or deleted.</p>
        <Table bordered>
          <thead>
            <tr>
              <th>Document Type</th>
              <th>Retention Period (Days)</th>
            </tr>
          </thead>
          <tbody>
            {documentTypes.map((docType) => (
              <tr key={docType}>
                <td>{docType}</td>
                <td>
                  <Form.Control
                    type="number"
                    min="30"
                    value={retentionSettings[docType]}
                    onChange={(e) => handleChange(docType, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="text-end">
          <Button variant="primary" onClick={handleSave}>Save Retention Settings</Button>
        </div>
      </Card>
    </div>
  );
}
