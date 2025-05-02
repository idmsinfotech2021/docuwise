import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useBranding } from "../context/BrandingContext";

export default function SidebarLayout() {
  const branding = useBranding();
  console.log("branding ===== ", branding)

  const appliedFont = branding.font ? `${branding.font}, sans-serif` : 'Roboto, sans-serif';

  return (
    <div className="d-flex" style={{ fontFamily: appliedFont }}>
      <Sidebar />
      <div
        className="flex-grow-1 p-4"
        style={{
          minHeight: "100vh",
          background: branding.backgroundImage
            ? `url(${branding.backgroundImage}) no-repeat center center / cover`
            : branding.secondaryColor || "#f9f9f9",
          fontFamily: appliedFont
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
