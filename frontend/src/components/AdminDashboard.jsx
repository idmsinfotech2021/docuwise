import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Row, Col } from "react-bootstrap";
import { Toaster, toast } from "react-hot-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("docuwise_token");
    localStorage.removeItem("docuwise_role");
    toast.success("Logged out successfully");
    navigate("/admin-login");
  };

  return (
    <div className="container mt-5">
      <Toaster />
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h3>Super Admin Dashboard</h3>
        <Button variant="danger" onClick={handleLogout}>Logout</Button>
      </div>

      <Row xs={1} md={2} className="g-4">
        <Col>
          <Card
            className="text-center shadow-sm"
            style={{ cursor: "pointer", height: "180px", display: "flex", justifyContent: "center", alignItems: "center" }}
            onClick={() => navigate("/admin/tenants")}
          >
            <Card.Body>
              <Card.Title>🏢 Manage Tenants</Card.Title>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card
            className="text-center shadow-sm"
            style={{ cursor: "pointer", height: "180px", display: "flex", justifyContent: "center", alignItems: "center" }}
            onClick={() => navigate("/admin/users")}
          >
            <Card.Body>
              <Card.Title>👤 Manage Users</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
