import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';

export default function DashboardCards() {
  const navigate = useNavigate();

  const cards = [
    { title: 'Upload Customer PO', path: '/upload-customer-po' },
    { title: 'Upload Invoice', path: '/upload-invoice' },
    { title: 'Upload COA', path: '/upload-coa' },
    { title: 'Manage Prompts', path: '/manage-prompts' }
  ];

  return (
   <div className="main-content1">
      <div className="mt-5">
        <h3 className="text-center mb-4">Dashboard</h3>
         <div className="container" style={{ marginLeft: '205px', marginTop: '30px' }}>
      <Row xs={1} md={2} lg={3} className="g-3">
        {cards.map((card, idx) => (
          <Col key={idx}>
            <Card 
              className="text-center shadow-sm"
              style={{ cursor: 'pointer', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              onClick={() => navigate(card.path)}
            >
              <Card.Body>
                <Card.Title>{card.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
      </div>
    </div>
  );
}
