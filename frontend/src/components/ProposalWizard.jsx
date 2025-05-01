import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

function ProposalWizard() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      const token = localStorage.getItem('docuwise_token');
      const res = await axiosInstance.get('/proposal/template/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(res.data.templates || []);
    };
    fetchTemplates();
  }, []);

  const handleStart = async () => {
    if (!selectedTemplate) {
      alert('Please select a template');
      return;
    }

    try {
      const token = localStorage.getItem('docuwise_token');
      const res = await axiosInstance.post(
        '/proposal/session/start',
        { templateId: selectedTemplate },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const sessionId = res.data.sessionId;
      navigate(`/proposal-wizard/${sessionId}`); // e.g. /proposal-wizard/66123abcde
    } catch (err) {
      console.error(err);
      alert('Failed to start proposal session');
    }
  };

  return (
    <Container className="mt-5">
      <h4>Start New Proposal</h4>

      <Form.Group className="mb-4">
        <Form.Label>Select Template</Form.Label>
        <Form.Select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <option value="">-- Select Template --</option>
          {templates.map((tpl) => (
            <option key={tpl._id} value={tpl._id}>
              {tpl.name || tpl.fileName}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button onClick={handleStart} variant="primary">
        Start Proposal
      </Button>
    </Container>
  );
}

export default ProposalWizard;
