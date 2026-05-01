import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export default function ProductDetailsPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [prices, setPrices] = useState([]);
  const [form, setForm] = useState({ price: '', storeName: '' });
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const productRes = await fetch(`http://localhost:3000/products/${id}`);
      const productData = await productRes.json();
      setProduct(productData);

      const pricesRes = await fetch(`http://localhost:3000/products/${id}/prices`);
      const pricesData = await pricesRes.json();
      setPrices(pricesData);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) {
      alert('You must be logged in to submit a price');
      return;
    }
    const res = await fetch('http://localhost:3000/prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        price: Number(form.price),
        storeName: form.storeName,
        productId: Number(id),
      }),
    });
    if (!res.ok) {
      alert('Failed to create price entry');
      return;
    }
    setForm({ price: '', storeName: '' });
    loadData();
  }

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (!product) return <p className="text-red-400">Product not found.</p>;

  const lowestPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : null;

  return (
    <div>
      {/* Back link */}
      <Link to="/" className="text-sm text-green-500 hover:underline mb-4 inline-block">← Back to products</Link>

      {/* Product header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
        <div className="flex gap-4 mt-2">
          {product.category && <span className="text-sm text-gray-400">Category: {product.category}</span>}
          {product.barcode && <span className="text-sm text-gray-400">Barcode: {product.barcode}</span>}
        </div>
        {lowestPrice && (
          <p className="mt-3 text-green-600 font-semibold text-lg">
            Best price: €{lowestPrice.toFixed(2)}
          </p>
        )}
      </div>

      {/* Submit price form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Submit a price</h2>
        {!token ? (
          <p className="text-sm text-gray-400">
            <Link to="/login" className="text-green-500 hover:underline">Log in</Link> to submit a price.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="number"
              step="0.01"
              placeholder="Price (€)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              placeholder="Store name"
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg"
            >
              Submit price
            </button>
          </form>
        )}
      </div>
{/* Chart */}
{prices.length > 1 && (
  <div className="mb-6">
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={[...prices].reverse().map(p => ({
        date: new Date(p.dateSeen).toLocaleDateString(),
        price: p.price,
        store: p.storeName
      }))}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} unit="€" />
        <Tooltip formatter={(value) => [`€${value}`, 'Price']} />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ fill: '#22c55e' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}
      {/* Price history */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Price history</h2>
        {prices.length === 0 ? (
          <p className="text-gray-400">No prices submitted yet. Be the first!</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {prices.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
                <div>
                  <p className="font-medium text-gray-700">{entry.storeName}</p>
                  <p className="text-sm text-gray-400">{new Date(entry.dateSeen).toLocaleDateString()}</p>
                </div>
                <span className="text-green-600 font-bold text-lg">€{entry.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}