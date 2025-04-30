import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  
  
import axios from 'axios';
import { Card, Row, Col, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const ValidationDashboard = () => {
  const [kpis, setKpis] = useState({});
  const [topErrors, setTopErrors] = useState([]);

  useEffect(() => {
    fetchKPIs();
    fetchTopErrors();
  }, []);

  const fetchKPIs = async () => {
    const res = await axiosInstance.get('/dashboard/validation-kpis');
    setKpis(res.data);
  };

  const fetchTopErrors = async () => {
    const res = await axiosInstance.get('/dashboard/top-validation-errors');
    setTopErrors(res.data);
  };

  const chartData = {
    labels: topErrors.map(e => e._id),
    datasets: [{
      label: 'Failure Count',
      data: topErrors.map(e => e.count),
      backgroundColor: 'rgba(255, 99, 132, 0.6)'
    }]
  };

  return (
    <div className="p-4">
      <h2>Validation Dashboard</h2>
      <Row className="my-4">
        <Col><Card body>Total Docs: {kpis.totalDocs}</Card></Col>
        <Col><Card body>Validated: {kpis.completed}</Card></Col>
        <Col><Card body>Needs Correction: {kpis.needsCorrection}</Card></Col>
      </Row>
      <h4 className="mt-5">Top Validation Failures</h4>
      <Bar data={chartData} />
      <Table striped bordered className="mt-4">
        <thead><tr><th>Error Message</th><th>Count</th></tr></thead>
        <tbody>
          {topErrors.map((err, idx) => (
            <tr key={idx}><td>{err._id}</td><td>{err.count}</td></tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ValidationDashboard;