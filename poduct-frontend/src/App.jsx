// src/App.jsx
import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    setError('');
    setProducts([]);

    try {
      const response = await axios.post('http://127.0.0.1:8000/recommend', {
        query: query
      });
      setProducts(response.data.products);
    } catch (err) {
      setError('Failed to fetch recommendations. Is the backend server running?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>AI Product Recommender</h1>
        {/* ⭐️ ADD THIS LINK ⭐️ */}
        <a href="/analytics" style={{ marginBottom: '1rem', display: 'block' }}>View Analytics</a>
        <p>Enter a description of the product you're looking for.</p>
      </header>

      <div className="search-box">
        <input
          type="text"
          className="input-field"
          placeholder="e.g., a modern wooden chair..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className="search-button"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {products.length > 0 && (
        <div className="results-container">
          <h2>Results</h2>
          {products.map((product) => (
            <div key={product.uniq_id} className="result-card">
              <h3>{product.title}</h3>
              <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
              <p><strong>Price:</strong> {product.price || 'N/A'}</p>
              <p style={{ fontStyle: 'italic', marginTop: '10px' }}>
                {product.genai_description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;