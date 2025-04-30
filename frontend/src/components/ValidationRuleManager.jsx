import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Install react-toastify
import axiosInstance from '../axiosConfig';

const ValidationRuleManager = () => {
  const [docType, setDocType] = useState('invoice');
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({
    field: '',
    required: false,
    length: '',
    pattern: '',
    numeric: false,
    errorMessage: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchRules();
  }, [docType]);

  const fetchRules = async () => {
    try {
      const res = await axiosInstance.get(`/validation-rules/${docType}`);
      setRules(res.data);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  const handleAddOrEdit = async () => {
    try {
      const payload = {
        field: newRule.field,
        rules: {
          required: newRule.required,
          length: newRule.length ? parseInt(newRule.length) : undefined,
          pattern: newRule.pattern || undefined,
          numeric: newRule.numeric
        },
        errorMessage: newRule.errorMessage
      };

      if (editId) {
        await axiosInstance.put(`/validation-rules/${docType}/update/${editId}`, payload);
        toast.success('Validation Rule Updated!');
      } else {
        await axiosInstance.post(`/validation-rules/${docType}/add`, payload);
        toast.success('Validation Rule Added!');
      }

      setNewRule({ field: '', required: false, length: '', pattern: '', numeric: false, errorMessage: '' });
      setEditId(null);
      fetchRules();
    } catch (error) {
      console.error('Error saving rule:', error);
      toast.error('Something went wrong.');
    }
  };

  const handleEditClick = (rule) => {
    setNewRule({
      field: rule.field,
      required: rule.rules.required,
      length: rule.rules.length || '',
      pattern: rule.rules.pattern || '',
      numeric: rule.rules.numeric || false,
      errorMessage: rule.errorMessage
    });
    setEditId(rule._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this rule?')) {
      try {
        await axiosInstance.delete(`/validation-rules/${docType}/delete/${id}`);
        toast.success('Validation Rule Deleted!');
        fetchRules();
      } catch (error) {
        console.error('Error deleting rule:', error);
        toast.error('Failed to delete rule.');
      }
    }
  };

  return (
    <div className="container">
      <h2>Manage Validation Rules</h2>

      <div>
        <label>Select Document Type: </label>
        <select value={docType} onChange={(e) => setDocType(e.target.value)}>
          <option value="invoice">Vendor Invoice</option>
          <option value="bank_statement">Bank Statement</option>
          <option value="customerPO">Customer PO</option>
          <option value="delivery_challan">Delivery Challan</option>
          {/* Add more document types here */}
        </select>
      </div>

      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Field Name"
          value={newRule.field}
          onChange={(e) => setNewRule({ ...newRule, field: e.target.value })}
        />
        <label>
          Required
          <input
            type="checkbox"
            checked={newRule.required}
            onChange={(e) => setNewRule({ ...newRule, required: e.target.checked })}
          />
        </label>
        <input
          type="text"
          placeholder="Length (optional)"
          value={newRule.length}
          onChange={(e) => setNewRule({ ...newRule, length: e.target.value })}
        />
        <input
          type="text"
          placeholder="Pattern (optional)"
          value={newRule.pattern}
          onChange={(e) => setNewRule({ ...newRule, pattern: e.target.value })}
        />
        <label>
          Numeric
          <input
            type="checkbox"
            checked={newRule.numeric}
            onChange={(e) => setNewRule({ ...newRule, numeric: e.target.checked })}
          />
        </label>
        <input
          type="text"
          placeholder="Error Message"
          value={newRule.errorMessage}
          onChange={(e) => setNewRule({ ...newRule, errorMessage: e.target.value })}
        />

        <button onClick={handleAddOrEdit}>
          {editId ? 'Update Rule' : 'Add Rule'}
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Field</th>
              <th>Required</th>
              <th>Length</th>
              <th>Pattern</th>
              <th>Numeric</th>
              <th>Error Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => (
              <tr key={rule._id}>
                <td>{rule.field}</td>
                <td>{rule.rules.required ? 'Yes' : 'No'}</td>
                <td>{rule.rules.length || '-'}</td>
                <td>{rule.rules.pattern || '-'}</td>
                <td>{rule.rules.numeric ? 'Yes' : 'No'}</td>
                <td>{rule.errorMessage}</td>
                <td>
                  <button onClick={() => handleEditClick(rule)}>Edit</button>
                  <button onClick={() => handleDelete(rule._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValidationRuleManager;
