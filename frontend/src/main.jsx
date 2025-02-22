import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";
import ProductPage from "./pages/ProductPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import CartPage from "./pages/CartPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx"
import AdminPanel from "./pages/admin/AdminPanel.jsx";
import SellingPage from "./pages/SellingPage.jsx"
import ShippingPage from './pages/shipping/ShippingPage.jsx';
import PaymentPage from './pages/payment/PaymentPage.jsx';
import OrderHistoryPage from './pages/order/OrderHistoryPage.jsx';

const router = createBrowserRouter(

  createRoutesFromElements(
    <Route path="/" element={<App/>}>

        {/* Products & Cart */}
       <Route index={true} path='/' element={<HomePage />}/>  
       <Route path='/products/:id' element={<ProductPage />}/>
       <Route path='/cart' element={<CartPage />}/>

        {/* Login, Register, Settings */}
       <Route path='/login' element={<LoginPage />}/>
       <Route path='/settings' element={<SettingsPage />}/>
       <Route path='/register' element={<RegisterPage />}/>

        {/* Admin & Seller */}
       <Route path='/admin' element={<AdminPanel />}/>
       <Route path='/sell' element={<SellingPage />}/>

        {/* Shipping & Payment */}
       <Route path='/shipping' element={<ShippingPage />}/>
       <Route path='/payment' element={<PaymentPage />}/>

        {/* Orders */}
       <Route path='/order-history' element={<OrderHistoryPage />}/>

    </Route>
  )
  
);


createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}>
    <StrictMode>
      <App />
    </StrictMode>
  </RouterProvider>
)
