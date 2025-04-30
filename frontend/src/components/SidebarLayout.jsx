import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // your left menu bar

export default function SidebarLayout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ minHeight: "100vh", background: "#f9f9f9" }}>
        <Outlet />
      </div>
    </div>
  );
}
