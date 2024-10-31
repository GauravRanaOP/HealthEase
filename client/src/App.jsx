import Doctor from "./components/doctor";
import {
  createBrowserRouter,
  // RouterProvider,
  BrowserRouter as Router, Route, Routes
} from "react-router-dom";
import HeaderPatient from "./components/HeaderPatient";
import FooterPatient from "./components/FooterPatient";
// import SearchDoctor from "./components/SearchDoctor";
import ViewBookings from "./components/ViewBookings";
import PatientDirectory from "./components/PatientDirectory";
import SideBar from "./components/SideBar";
import "./App.css";
import AdminTest from "./components/AdminTest";
import DoctorTimeslots from "./components/DoctorTimeslots";
import Dashboard from "./components/authentication/Dashboard";
import LoginForm from "./components/authentication/LoginForm";
import { AuthProvider } from "./components/authentication/AuthContext";  // Ensure AuthProvider is imported correctly

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
    element: <AdminTest />,
  },
  {
    path: "/getBookings",
    element: <ViewBookings />,
  },
  {
    path: "/doctorTimeslots/:doctorId",
    element: <DoctorTimeslots />,
  },
]);

function App() {
  return (
    <AuthProvider>
    <Router>
      <HeaderPatient />
      <div className="app-layout">
        <SideBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/getDoctor" element={<Doctor />} />
            <Route path="/patientDirectory" element={<PatientDirectory />} />
            <Route path="/adminTest" element={<AdminTest />} />
            <Route path="/getBookings" element={<ViewBookings />} />
            <Route path="/doctorTimeslots/:doctorId" element={<DoctorTimeslots />} />
          </Routes>
        </div>
      </div>
      <FooterPatient />
    </Router>
    </AuthProvider>
  );
}

export default App;
