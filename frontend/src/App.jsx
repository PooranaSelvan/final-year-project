import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <div>
        <Navbar />
        <Outlet />
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
