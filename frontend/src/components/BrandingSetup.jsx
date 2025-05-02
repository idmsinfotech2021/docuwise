import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import axiosInstance from '../axiosConfig';

const fontOptions = ['Roboto', 'Open Sans', 'Lato', 'Poppins', 'Arial', 'Montserrat'];

export default function BrandingSetup() {
  const tenantId = localStorage.getItem('tenantId');
  const token = localStorage.getItem('docuwise_token');

  const [branding, setBranding] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBranding() {
      try {
        const response = await axiosInstance.get('/tenants/branding', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          setBranding(response.data);
        } else {
          setBranding({
            logo: null,
            favicon: null,
            backgroundImage: null,
            color: '#1a73e8',
            secondaryColor: '#f1f1f1',
            headerText: '',
            footerText: '',
            font: 'Roboto'
          });
        }
      } catch (error) {
        console.error('Error fetching branding:', error);
        setBranding({
          logo: null,
          favicon: null,
          backgroundImage: null,
          color: '#1a73e8',
          secondaryColor: '#f1f1f1',
          headerText: '',
          footerText: '',
          font: 'Roboto'
        });
      } finally {
        setLoading(false);
      }
    }
    fetchBranding();
  }, [token]);

  const handleInputChange = (field, value) => {
    setBranding({ ...branding, [field]: value });
  };

  const handleFileChange = (field, file) => {
    setBranding({ ...branding, [field]: file });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      for (const key in branding) {
        if (branding[key]) formData.append(key, branding[key]);
      }
      const response = await axiosInstance.put('/tenants/branding', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Branding settings saved successfully!');
    } catch (error) {
      console.error('Error saving branding:', error);
      alert('Failed to save branding settings');
    }
  };

  if (loading || !branding) return <div className="text-center py-5"><Spinner animation="border" /> Loading branding settings...</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">🎨 Branding Setup</h2>

      <Card className="p-4">
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Upload Logo</Form.Label>
                <Form.Control type="file" onChange={(e) => handleFileChange('logo', e.target.files[0])} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Upload Favicon</Form.Label>
                <Form.Control type="file" onChange={(e) => handleFileChange('favicon', e.target.files[0])} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Primary Theme Color</Form.Label>
                <Form.Control
                  type="color"
                  value={branding.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Secondary Color</Form.Label>
                <Form.Control
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Upload Background Image</Form.Label>
                <Form.Control type="file" onChange={(e) => handleFileChange('backgroundImage', e.target.files[0])} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Font Family</Form.Label>
                <Form.Select value={branding.font} onChange={(e) => handleInputChange('font', e.target.value)}>
                  {fontOptions.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Header Text</Form.Label>
            <Form.Control
              type="text"
              value={branding.headerText}
              onChange={(e) => handleInputChange('headerText', e.target.value)}
              placeholder="Enter custom header text"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Footer Text</Form.Label>
            <Form.Control
              type="text"
              value={branding.footerText}
              onChange={(e) => handleInputChange('footerText', e.target.value)}
              placeholder="Enter custom footer text"
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => setShowPreview(true)}>Preview Branding</Button>
            <Button variant="primary" onClick={handleSave}>Save Branding</Button>
          </div>
        </Form>
      </Card>

      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Branding Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ backgroundColor: branding.secondaryColor, fontFamily: branding.font }} className="p-4">
            <h3 style={{ color: branding.color }}>{branding.headerText || 'Header Text Preview'}</h3>
            <p style={{ fontSize: '0.9rem' }}>{branding.footerText || 'Footer Text Preview'}</p>
            <p style={{ fontStyle: 'italic' }}>Background image and logo preview can be rendered here.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
