import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useBranding } from '../context/BrandingContext';

export default function Sidebar() {
  const [menuData, setMenuData] = useState([]);
  const userRole = localStorage.getItem('docuwise_role') || 'user';
  const branding = useBranding();

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

  console.log("branding.logo >>>>>> ", branding.logo)

  return (
    <div
      style={{
        width: "280px",
        minHeight: "100vh",
        padding: "20px",
        borderRight: "1px solid #ccc",
        fontFamily: branding.font,
        backgroundColor: 'var(--tenant-secondary-color)'
      }}
    >
      {branding.logo ? (
        <div className="text-center mb-3">
          <img
            src={`http://localhost:5000${branding.logo}`}
            alt="Logo"
            style={{ maxWidth: '120px', maxHeight: '60px' }}
          />
        </div>
      ) : (
        <h4 className="text-center mb-4" style={{ color: 'var(--tenant-primary-color)' }}>
          DocuWise
        </h4>
      )}

      <nav className="nav flex-column">
        {menuData.map((item, idx) => (
          <NavLink
            key={idx}
            className="nav-link"
            to={item.path}
            style={{
              color: 'var(--tenant-primary-color)',
              fontWeight: 500
            }}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
