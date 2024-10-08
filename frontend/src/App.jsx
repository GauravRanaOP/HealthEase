import Doctor from "./components/doctor";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HeaderPatient from "./components/HeaderPatient";
import FooterPatient from "./components/FooterPatient";
import SearchDoctor from "./components/SearchDoctor";
import PatientDirectory from "./components/PatientDirectory";
import SideBar from "./components/SideBar";
import "./App.css";
import AdminTest from "./components/AdminTest";

const route = createBrowserRouter([
  {
    path: "/",
    element: <div>Dashboard</div>,
  },
  {
    path: "/getDoctor",
    element: <Doctor />,
  },
  {
    path: "/patientDirectory",
    element: <PatientDirectory />,
  },
  {
    path: "/adminTest",
    element: <AdminTest/>
  }
]);

function App() {
  return (
    <>
      <HeaderPatient />
      <div className="app-layout">
        <SideBar />
        <div className="content">
          <RouterProvider router={route} />
        </div>
      </div>
      <FooterPatient />
    </>
  );
}

export default App;
