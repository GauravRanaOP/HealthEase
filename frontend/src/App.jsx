import { useState } from "react";
import Doctor from "./components/doctor";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HeaderPatient from "./components/HeaderPatient";
import FooterPatient from "./components/FooterPatient";
import SearchDoctor from "./components/SearchDoctor";
import PatientDirectory from "./components/PatientDirectory";
import Sidebar from "./components/Sidebar";

const route = createBrowserRouter([
  {
    path: "/",
    element: "Dashboard",
  },
  {
    path: "/getDoctor",
    element: <Doctor />,
  },
  {
    path: "/searchDoctor",
    element: <SearchDoctor />,
  },
  {
    path: "/patientDirectory",
    element: <PatientDirectory />,
  },
]);

function App() {
  return (
    <div className="App">
      <HeaderPatient />
      <RouterProvider router={route}></RouterProvider>
      {/* <PatientDirectory />
      <FooterPatient /> */}
      {/* <Doctor/> */}
      {<Sidebar />}
    </div>
  );
}

export default App;
