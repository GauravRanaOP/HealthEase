import Doctor from "./components/doctor";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HeaderPatient from "./components/HeaderPatient";
import FooterPatient from "./components/FooterPatient";

const route = createBrowserRouter([
  {
    path: "/",
    element: "Dashboard"
  },
  {
    path: "/getDoctor",
    element: <Doctor/>
  }
])

function App() {
  return <div className="App">
    <HeaderPatient />
    <RouterProvider router= {route}></RouterProvider>
    <FooterPatient />

    {/* <Doctor/> */}
  </div>;
}

export default App;
