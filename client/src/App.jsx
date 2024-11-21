import Doctor from "./components/doctor";
import {
  createBrowserRouter,
  // RouterProvider,
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
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
import Dashboard from "./components/Dashboard.jsx";
//import LoginForm from "./components/authentication/LoginForm";
//import { AuthProvider } from "./components/authentication/AuthContext"; // Ensure AuthProvider is imported correctly
import AdminClinic from "./components/AdminClinic";
import DiagnosticCenterPage from "./components/DiagnosticCenterPage";
import RegistrationForm from "./components/authentication/RegistrationForm";
import AuthenticationPage from "./components/authentication/AuthenticationPage";
import { useAuth } from "./components/authentication/AuthContext.jsx";
import TestTimeslots from "./components/TestTimeslots";
import TestCentersList from "./components/TestCentersList";
import DiagnosticCenterAdmin from "./components/DiagnosticCenterAdmin";

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
  {
    path: "/diagnostic-center",
    element: <DiagnosticCenterPage />,
  },
]);

const App = () => {
  const { isAuthenticated, userDataRole } = useAuth();
  return (
    <Router>
      <HeaderPatient />
      <Routes>
        <Route path="/Login" element={<AuthenticationPage />} />
        <Route
          path="/"
          element={!isAuthenticated ? <AuthenticationPage /> : <Dashboard />}
        />
        {/* <Route path="/register" element={<RegistrationForm />} /> */}
        <Route
          path="/getDoctor"
          element={!isAuthenticated ? <AuthenticationPage /> : <Doctor />}
        />
        <Route
          path="/patientDirectory"
          element={
            !isAuthenticated ? <AuthenticationPage /> : <PatientDirectory />
          }
        />
        <Route
          path="/adminTest"
          element={!isAuthenticated ? <AuthenticationPage /> : <AdminTest />}
        />
        <Route
          path="/adminClinic"
          element={!isAuthenticated ? <AuthenticationPage /> : <AdminClinic />}
        />
        <Route
          path="/getBookings"
          element={!isAuthenticated ? <AuthenticationPage /> : <ViewBookings />}
        />
        <Route
          path="/doctorTimeslots/:doctorId"
          element={
            !isAuthenticated ? <AuthenticationPage /> : <DoctorTimeslots />
          }
        />
        <Route
          path="/diagnostic-center"
          element={
            !isAuthenticated ? <AuthenticationPage /> : <DiagnosticCenterPage />
          }
        />
        <Route
          path="/testTimeslots/:diagnosticCenterId"
          element={
            !isAuthenticated ? <AuthenticationPage /> : <TestTimeslots />
          }
        />
        <Route
          path="/testCentersList/:testId"
          element={
            !isAuthenticated ? <AuthenticationPage /> : <TestCentersList />
          }
        />
        <Route
          path="/diagnostic-admin"
          element={
            !isAuthenticated && userDataRole === "DiagnosticCenterAdmin" ? (
              <AuthenticationPage />
            ) : (
              <DiagnosticCenterAdmin />
            )
          }
        />
      </Routes>
      <FooterPatient />
    </Router>
  );
};

export default App;
