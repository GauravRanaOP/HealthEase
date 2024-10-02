import { useState } from "react";
import Doctor from "./components/doctor";
import {createBrowserRouter, RouterProvider} from "react-router-dom";


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
    <RouterProvider router= {route}></RouterProvider>
    
  </div>;
}

export default App;
