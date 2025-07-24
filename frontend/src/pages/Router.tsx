import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductCRUD from './products/ProductCRUD';
import ProductPage from './products/ProductPage';
import Homepage from './Homepage';
import Dashboard from './dashboard/DashboardPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Homepage />} />
        <Route path="/products" element={<ProductCRUD />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
