import React, { useState } from 'react';
import { Card, Table, Form } from 'react-bootstrap';

const documentTypes = ['Invoice', 'Purchase Order', 'Bank Statement'];

const mockMappings = {
  Invoice: [
    { docField: 'Invoice Number', erpField: 'inv_no' },
    { docField: 'Amount', erpField: 'total_amt' }
  ],
  'Purchase Order': [
    { docField: 'PO Number', erpField: 'po_no' },
    { docField: 'Vendor Name', erpField: 'vendor_name' }
  ],
  'Bank Statement': [
    { docField: 'Transaction Date', erpField: 'txn_date' },
    { docField: 'Closing Balance', erpField: 'closing_bal' }
  ]
};

export default function TenantFieldMappingView() {
  const [selectedDocType, setSelectedDocType] = useState('Invoice');

  return (
    <div className="container py-4">
      <h2 className="mb-4">🧩 Field Mapping View</h2>

      <Card className="p-4">
        <Form.Group className="mb-3">
          <Form.Label>Select Document Type</Form.Label>
          <Form.Select value={selectedDocType} onChange={(e) => setSelectedDocType(e.target.value)}>
            {documentTypes.map((doc) => (
              <option key={doc} value={doc}>{doc}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Table bordered>
          <thead>
            <tr>
              <th>Document Field</th>
              <th>ERP Field</th>
            </tr>
          </thead>
          <tbody>
            {(mockMappings[selectedDocType] || []).map((row, index) => (
              <tr key={index}>
                <td>{row.docField}</td>
                <td>{row.erpField}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
