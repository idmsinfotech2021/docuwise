import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axiosInstance from '../axiosConfig';

function QuestionConfigurator({ show, onClose, sectionName, templateId, existingQuestions = [] }) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (show) {
      setQuestions([{ questionText: '', defaultAnswer: '' }]);  // initial value only when modal opens
    }
  }, [show]);

  const handleChange = (idx, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) =>
        i === idx ? { ...q, [field]: value } : q
      )
    );
  };
  

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', defaultAnswer: '' }]);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('docuwise_token');
      await axiosInstance.post(
        '/proposal/question/save',
        { templateId, sectionName, questions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Questions saved successfully!');
      onClose(); // ✅ Close after saving
    } catch (err) {
      console.error(err);
      alert('Failed to save questions');
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Configure Questions for <strong>{sectionName}</strong></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {questions.map((q, idx) => (
          <Row key={idx} className="mb-2">
            <Col md={6}>
              <Form.Control
                placeholder="Question Text"
                value={q.questionText}
                onChange={(e) => handleChange(idx, 'questionText', e.target.value)}
              />
            </Col>
            <Col md={6}>
              <Form.Control
                placeholder="Default Answer (optional)"
                value={q.defaultAnswer}
                onChange={(e) => handleChange(idx, 'defaultAnswer', e.target.value)}
              />
            </Col>
          </Row>
        ))}
        <Button variant="outline-secondary" onClick={addQuestion}>+ Add Question</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Questions</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default QuestionConfigurator;
