import React from 'react';
import { Link } from 'react-router-dom';

export default function SidebarMenu() {
  return (
    <div style={{ width: '240px', height: '100vh', background: '#f0f0f0', position: 'fixed', padding: '10px' }}>
      <h5 className="text-center">DocuWise</h5>
      <ul className="list-unstyled ">
        <li><Link to="/">🏠 Dashboard</Link></li>
        <li><Link to="/upload-customer-po">Upload Customer PO</Link></li>
        <li><Link to="/upload-invoice">Upload Invoice</Link></li>
        <li><Link to="/upload-coa">Upload COA</Link></li>
        <li><Link to="/manage-prompts">Manage Prompts</Link></li>
      </ul>
    </div>
  );
}
