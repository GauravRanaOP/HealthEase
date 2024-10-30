import Doctor from "./components/doctor";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HeaderPatient from "./components/HeaderPatient";
import FooterPatient from "./components/FooterPatient";
// import SearchDoctor from "./components/SearchDoctor";
import ViewBookings from "./components/ViewBookings";
import PatientDirectory from "./components/PatientDirectory";
import SideBar from "./components/SideBar";
import "./App.css";
import AdminTest from "./components/AdminTest";
import DoctorTimeslots from "./components/DoctorTimeslots";
import AdminClinic from "./components/AdminClinic";

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
    path: "/adminClinic",
    element: <AdminClinic />,
  },
  {
    path: "/patientDirectory",
    element: <PatientDirectory />,
  },
  {
    path: "/adminTest",
    element: <AdminTest/>
  },
  {
    path: "/getBookings",
    element: <ViewBookings />,
  },
  {
    path: "/doctorTimeslots/:doctorId",
    element: <DoctorTimeslots />
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
