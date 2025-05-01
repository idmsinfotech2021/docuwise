import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Form, Card, Spinner } from 'react-bootstrap';
import axiosInstance from '../axiosConfig';

function ProposalQA() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [sections, setSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);

  const [templateId, setTemplateId] = useState('');

  useEffect(() => {
    const fetchSessionData = async () => {
      const token = localStorage.getItem('docuwise_token');

      const session = await axiosInstance.get(`/proposal/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const templateId = session.data.templateId;
      setTemplateId(templateId);

      const secRes = await axiosInstance.get(`/proposal/section/${templateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSections(secRes.data.sections || []);
    };

    fetchSessionData();
  }, [sessionId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      
      if (!sections[currentSectionIndex]) return;
      const sectionName = sections[currentSectionIndex].displayName;
      const token = localStorage.getItem('docuwise_token');
      const res = await axiosInstance.get(`/proposal/question`, {
        params: { templateId, sectionName },
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(res.data.questions || []);
    };

    fetchQuestions();
  }, [sections, currentSectionIndex, templateId]);

  const handleInputChange = (idx, value) => {
    setAnswers({ ...answers, [idx]: value });
  };

  const handleGenerate = async () => {
    const currentSection = sections[currentSectionIndex];
    if (!currentSection) return;

    const questionText = questions.map((q, i) => `${q.questionText}: ${answers[i] || ''}`).join('\n');
    const token = localStorage.getItem('docuwise_token');

    setLoading(true);
    try {
      const res = await axiosInstance.post(
        '/proposal/session/answer',
        {
          sessionId,
          sectionName: currentSection.displayName,
          questionText,
          userInput: questionText
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGeneratedText(res.data.aiOutput || '');
    } catch (err) {
      console.error(err);
      alert('Failed to generate section content');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    const currentSection = sections[currentSectionIndex];
    if (!currentSection) return;

    const token = localStorage.getItem('docuwise_token');
    try {
      await axiosInstance.post(
        '/proposal/session/confirm',
        {
          sessionId,
          sectionName: currentSection.displayName,
          finalContent: generatedText
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (currentSectionIndex + 1 < sections.length) {
        setCurrentSectionIndex(currentSectionIndex + 1);
        setAnswers({});
        setGeneratedText('');
      } else {
        alert('✅ All sections completed!');
        navigate('/dashboard'); // or proposal history page
      }
    } catch (err) {
      console.error(err);
      alert('Failed to confirm section');
    }
  };

  const currentSection = sections[currentSectionIndex];

  return (
    <Container className="mt-4">
      <h4>Proposal Wizard</h4>
      {currentSection ? (
        <>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Section: {currentSection.displayName}</Card.Title>
              {questions.map((q, idx) => (
                <Form.Group key={idx} className="mb-2">
                  <Form.Label>{q.questionText}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={answers[idx] || ''}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                  />
                </Form.Group>
              ))}
              <Button onClick={handleGenerate} disabled={loading} className="me-2">
                {loading ? <Spinner animation="border" size="sm" /> : 'Generate with AI'}
              </Button>
            </Card.Body>
          </Card>

          {generatedText && (
            <Card className="mb-4">
              <Card.Header>AI-Generated Draft</Card.Header>
              <Card.Body>
                <Form.Control
                  as="textarea"
                  rows={8}
                  value={
                    typeof generatedText === 'object'
                      ? JSON.stringify(generatedText, null, 2)
                      : generatedText
                  }
                  onChange={(e) => setGeneratedText(e.target.value)}
                />
              </Card.Body>
            </Card>
          )}


            {generatedText && (
            <>
                <Button onClick={handleConfirm} variant="success" className="me-3">
                {currentSectionIndex + 1 < sections.length ? 'Confirm & Next' : 'Confirm Final Section'}
                </Button>

                {currentSectionIndex + 1 === sections.length && (
                <Button
                    variant="primary"
                    onClick={() =>
                    window.open(`/api/proposal/session/${sessionId}/generate-docx`, '_blank')
                    }
                >
                    📄 Download Final Proposal
                </Button>
                )}
            </>
            )}

        </>
      ) : (
        <p>Loading sections...</p>
      )}
    </Container>
  );
}

export default ProposalQA;
