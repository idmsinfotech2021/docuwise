// frontend/src/components/AIGeneratorLandingPage.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

export default function AIGeneratorLandingPage({ menu }) {
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
      <h2 className="text-center mb-4">Select Document Type to Upload</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, max-content))",
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
