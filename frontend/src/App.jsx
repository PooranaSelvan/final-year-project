import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

function App() {
  return (
    <>
      <div>
        <div className="fixed-top">
          <Navbar />
        </div>
        <Outlet />
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
