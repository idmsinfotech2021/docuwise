// frontend/src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

export default function Sidebar() {
  const [menuData, setMenuData] = useState([]);
  const userRole = localStorage.getItem('docuwise_role') || 'user'; // Default to 'user' if not set

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await axiosInstance.get(`/menu/${userRole}`);
        setMenuData(response.data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    }
    fetchMenu();
  }, [userRole]);

  return (
    <div style={{
      width: "280px",
      minHeight: "100vh",
      // background: "#f0f0f0",
      padding: "20px",
      borderRight: "1px solid #ccc"
    }}>
      <h4 className="text-center mb-4">DocuWise</h4>
      <nav className="nav flex-column">
        {menuData.map((item, idx) => (
          <NavLink
            key={idx}
            className="nav-link"
            to={item.path}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
