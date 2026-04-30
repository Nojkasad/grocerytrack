import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [prices, setPrices] = useState([]);
  const [form, setForm] = useState({
    price: '',
    storeName: '',
    userId: '1',
  });

  async function loadData() {
    const productRes = await fetch(`http://localhost:3000/products/${id}`);
    const productData = await productRes.json();
    setProduct(productData);

    const pricesRes = await fetch(`http://localhost:3000/products/${id}/prices`);
    const pricesData = await pricesRes.json();
    setPrices(pricesData);
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price: Number(form.price),
        storeName: form.storeName,
        productId: Number(id),
        userId: Number(form.userId),
      }),
    });

    if (!res.ok) {
      alert('Failed to create price entry');
      return;
    }

    setForm({ price: '', storeName: '', userId: '1' });
    loadData();
  }

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Category: {product.category || '—'}</p>
      <p>Barcode: {product.barcode || '—'}</p>

      <h2>Add price</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Store name"
          value={form.storeName}
          onChange={(e) => setForm({ ...form, storeName: e.target.value })}
        />
        <input
          placeholder="User ID"
          value={form.userId}
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
        />
        <button type="submit">Add price</button>
      </form>

      <h2>Price history</h2>
      {prices.length === 0 ? (
        <p>No prices yet.</p>
      ) : (
        <ul>
          {prices.map((entry) => (
            <li key={entry.id}>
              {entry.storeName} — €{entry.price} — {new Date(entry.dateSeen).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}