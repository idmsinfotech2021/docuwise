import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Row, Col } from 'react-bootstrap';
import axiosInstance from '../axiosConfig';
import QuestionConfigurator from './QuestionConfigurator';

function SectionConfigurator() {
  const [templates, setTemplates] = useState([]);
  const [templateId, setTemplateId] = useState('');
  const [sections, setSections] = useState([]);
  const [questionsMap, setQuestionsMap] = useState({}); // sectionName → [questions]

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedSectionName, setSelectedSectionName] = useState('');

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

  const generatePlaceholderKey = (displayName) =>
    `[[section_${displayName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}]]`;

  const handleTemplateSelect = async (selectedId) => {
    setTemplateId(selectedId);
    const token = localStorage.getItem('docuwise_token');

    try {
      const res = await axiosInstance.get(`/proposal/section/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const sectionList = res.data?.sections || [];
      setSections(sectionList.length > 0 ? sectionList : [{
        displayName: '',
        placeholderKey: '',
        order: 1,
        required: true
      }]);

      // fetch questions per section
      const allQuestions = {};
      for (const sec of sectionList) {
        const qRes = await axiosInstance.get('/proposal/question', {
          params: { templateId: selectedId, sectionName: sec.displayName },
          headers: { Authorization: `Bearer ${token}` }
        });
        allQuestions[sec.displayName] = qRes.data?.questions || [];
      }
      setQuestionsMap(allQuestions);
    } catch (err) {
      console.error('Error loading section/question config:', err);
    }
  };

  const handleChange = (idx, field, value) => {
    const updated = [...sections];
    if (field === 'displayName') {
      updated[idx].displayName = value;
      updated[idx].placeholderKey = generatePlaceholderKey(value);
    } else if (field === 'required') {
      updated[idx].required = value.target.checked;
    } else {
      updated[idx][field] = value;
    }
    setSections(updated);
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        displayName: '',
        placeholderKey: '',
        order: sections.length + 1,
        required: false
      }
    ]);
  };

  const handleSubmit = async () => {
    if (!templateId) {
      alert('Please select a template first.');
      return;
    }
    try {
      const token = localStorage.getItem('docuwise_token');
      await axiosInstance.post(
        '/proposal/section/save',
        { templateId, sections },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('Sections saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save section configuration');
    }
  };

  return (
    <div className="container mt-4">
      <h4>Configure Sections</h4>

      <Form.Group className="mb-4">
        <Form.Label>Select Template</Form.Label>
        <Form.Select value={templateId} onChange={(e) => handleTemplateSelect(e.target.value)}>
          <option value="">-- Select Template --</option>
          {templates.map((tpl) => (
            <option key={tpl._id} value={tpl._id}>
              {tpl.name || tpl.fileName}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {templateId && (
        <>
          {sections.map((section, idx) => (
            <Row key={idx} className="mb-3 align-items-center">
              <Col md={3}>
                <Form.Control
                  placeholder="Section Name"
                  value={section.displayName}
                  onChange={(e) => handleChange(idx, 'displayName', e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  readOnly
                  value={section.placeholderKey}
                />
              </Col>
              <Col md={1}>
                <Form.Control
                  type="number"
                  value={section.order}
                  onChange={(e) => handleChange(idx, 'order', parseInt(e.target.value))}
                />
              </Col>
              <Col md={2}>
                <Form.Check
                  label="Required"
                  checked={section.required}
                  onChange={(e) => handleChange(idx, 'required', e)}
                />
              </Col>
              <Col md={2}>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setSelectedSectionName(section.displayName);
                    setShowQuestionModal(true);
                  }}
                >
                  + Add Questions
                </Button>
              </Col>
            </Row>
          ))}

          <Button onClick={addSection} variant="secondary" className="me-2">
            Add Section
          </Button>
          <Button onClick={handleSubmit} variant="primary">
            Save Sections
          </Button>
        </>
      )}

      <QuestionConfigurator
        show={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        sectionName={selectedSectionName}
        templateId={templateId}
        existingQuestions={questionsMap[selectedSectionName]}
      />
    </div>
  );
}

export default SectionConfigurator;
