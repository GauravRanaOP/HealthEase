import { createBrowserRouter } from "react-router-dom";
import Doctor from "./components/doctor";

var route = [
    {
      path: "/",
      element: "Dashboard",
      layout: "/clinicAdmin"
    },
    {
      path: "/getDoctor",
      element: <Doctor/>,
      layout: "/clinicAdmin"
    }
  ]