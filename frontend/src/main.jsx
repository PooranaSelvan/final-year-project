import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App.jsx';

// Lazy load the pages to optimize performance
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'));
const CartPage = lazy(() => import('./pages/CartPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel.jsx'));
const SellingPage = lazy(() => import('./pages/SellingPage.jsx'));
const ShippingPage = lazy(() => import('./pages/shipping/ShippingPage.jsx'));
const PaymentPage = lazy(() => import('./pages/payment/PaymentPage.jsx'));
const OrderHistoryPage = lazy(() => import('./pages/order/OrderHistoryPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));

// Define routes with lazy loading
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Suspense fallback={<p>Loading...</p>}><HomePage /></Suspense>} />
      <Route path="/products/:id" element={<Suspense fallback={<p>Loading...</p>}><ProductPage /></Suspense>} />
      <Route path="/cart" element={<Suspense fallback={<p>Loading...</p>}><CartPage /></Suspense>} />
      <Route path="/login" element={<Suspense fallback={<p>Loading...</p>}><LoginPage /></Suspense>} />
      <Route path="/settings" element={<Suspense fallback={<p>Loading...</p>}><SettingsPage /></Suspense>} />
      <Route path="/register" element={<Suspense fallback={<p>Loading...</p>}><RegisterPage /></Suspense>} />
      <Route path="/admin" element={<Suspense fallback={<p>Loading...</p>}><AdminPanel /></Suspense>} />
      <Route path="/sell" element={<Suspense fallback={<p>Loading...</p>}><SellingPage /></Suspense>} />
      <Route path="/shipping" element={<Suspense fallback={<p>Loading...</p>}><ShippingPage /></Suspense>} />
      <Route path="/payment" element={<Suspense fallback={<p>Loading...</p>}><PaymentPage /></Suspense>} />
      <Route path="/order-history" element={<Suspense fallback={<p>Loading...</p>}><OrderHistoryPage /></Suspense>} />
      <Route path="/about" element={<Suspense fallback={<p>Loading...</p>}><AboutPage /></Suspense>} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
