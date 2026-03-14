import { Outlet } from "react-router-dom";
import EducatorSidebar from "./EducatorSidebar";

export default function EducatorLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <EducatorSidebar />
      <main style={{ flex: 1, marginLeft: 256, overflowY: "auto" }}>
        <div style={{ padding: "32px 32px", maxWidth: 1100, margin: "0 auto" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
