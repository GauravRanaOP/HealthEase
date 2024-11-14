import { useContext } from "react";
import { AuthContext } from "./authentication/AuthContext";
import { Navigate } from "react-router-dom";
import SideBar from "../components/SideBar.jsx";

const Dashboard = () => {
  const { token, loading } = useContext(AuthContext);
  if (loading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <SideBar />
      <div className="content">
        <h1>Dashboard: Protected Content Here</h1>
      </div>
    </div>
  );
};

export default Dashboard;
