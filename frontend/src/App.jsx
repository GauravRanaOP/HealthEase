import Doctor from "./components/doctor";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HeaderPatient from "./components/HeaderPatient";
import FooterPatient from "./components/FooterPatient";
import SearchDoctor from "./components/SearchDoctor";

const route = createBrowserRouter([
  {
    path: "/",
    element: "Dashboard"
  },
  {
    path: "/getDoctor",
    element: <Doctor/>
  },
  {
    path: "/searchDoctor",
    element: <SearchDoctor />
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
