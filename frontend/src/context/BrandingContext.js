import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultBranding from '../constants/defaultBranding';
import axiosInstance from '../axiosConfig';

const BrandingContext = createContext();
export const useBranding = () => useContext(BrandingContext);

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState(defaultBranding);

  useEffect(() => {
    const token = localStorage.getItem('docuwise_token');

    axiosInstance.get('/tenants/branding', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const data = res.data;
      if (data) {
        setBranding(data);
        // Set global CSS variables
        document.documentElement.style.setProperty('--tenant-font', `'${data.font}', sans-serif`);

        if (data.color) {
          document.documentElement.style.setProperty('--tenant-primary-color', data.color);
        }
        if (data.secondaryColor) {
          document.documentElement.style.setProperty('--tenant-secondary-color', data.secondaryColor);
        }


        // Inject Google Font dynamically
        if (data.font) {
            const fontName = data.font.replace(/ /g, '+');
          
            const linkId = 'google-font-link';
            let existing = document.getElementById(linkId);
            if (existing) existing.remove();
          
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`;
          
            document.head.appendChild(link); // ✅ This should add <link> inside <head>
        }
          
      }
    })
    .catch(() => {
      setBranding(defaultBranding);
      document.documentElement.style.setProperty('--tenant-font', `'Roboto', sans-serif`);
      document.documentElement.style.setProperty('--tenant-primary-color', '#1a73e8');
      document.documentElement.style.setProperty('--tenant-secondary-color', '#f1f1f1');
    });
  }, []);

  return (
    <BrandingContext.Provider value={branding}>
      {children}
    </BrandingContext.Provider>
  );
};
