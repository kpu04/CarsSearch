// components/SearchHistory.jsx
import { useState, useEffect } from "react";

const SearchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/search/history`);
      const data = await response.json();
      
      if (data.success) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading history...</div>;

  return (
    <div className="search-history">
      <h3>🔍 Search History</h3>
      <p className="history-count">Total searches: {history.length}</p>
      
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-car">{item.carInfo}</div>
            <div className="history-confidence">
              Confidence: <span className="confidence-value">{item.confidence}</span>
            </div>
            <div className="history-date">
              {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {history.length === 0 && (
          <div className="no-history">No search history yet</div>
        )}
      </div>
    </div>
  );
};

export default SearchHistory;