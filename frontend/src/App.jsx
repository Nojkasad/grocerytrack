import { Routes, Route, Link } from 'react-router-dom';
import ProductsPage from './pages/ProductPage';
import ProductDetailsPage from './pages/ProductDetailsPage';

export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/">Products</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
      </Routes>
    </div>
  );
}