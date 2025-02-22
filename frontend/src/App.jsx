import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from 'react-toastify';


function App() {
  

  return (
    <>
      <div>
        <Navbar />
        <Outlet />
        {/* <img src="/iphone.jpg" alt="" /> */}
        <ToastContainer />
      </div>  
    </>
  )
}

export default App
