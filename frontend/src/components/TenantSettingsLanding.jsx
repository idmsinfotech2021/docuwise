// frontend/src/components/TenantSettingsLanding.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

export default function TenantSettingsLanding({ menu }) {
  const [subMenus, setSubMenus] = useState([]);

  useEffect(() => {
    async function fetchSubMenus() {
      try {
        const role = localStorage.getItem('docuwise_role') || 'user';
        const response = await axiosInstance.get(`/menu/${role}`);
        const documentUploadMenu = response.data.find(m => m.label === menu);
        if (documentUploadMenu && documentUploadMenu.subMenus) {
          setSubMenus(documentUploadMenu.subMenus);
        }
      } catch (error) {
        console.error('Error fetching submenus:', error);
      }
    }
    fetchSubMenus();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginTop: "30px"
      }}>
        {subMenus.map((menu, idx) => (
          <Link key={idx} to={menu.path} className="doc-card">
            {menu.icon} {menu.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
