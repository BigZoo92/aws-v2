import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductCRUD from './products/ProductCRUD';
import ProductPage from './products/ProductPage';
import Homepage from './Homepage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/products" element={<ProductCRUD />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="*" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}
