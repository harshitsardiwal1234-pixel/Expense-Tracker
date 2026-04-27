import { useState, useEffect, useCallback } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

export default function Dashboard({ user, token, onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');

  const fetchExpenses = useCallback(async () => {
    try {
      let url = 'http://localhost:8080/api/expenses';
      if (filterCategory) {
        url += `?category=${encodeURIComponent(filterCategory)}`;
      }
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
  }, [token, filterCategory]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (expenseData) => {
    try {
      const response = await fetch('http://localhost:8080/api/expenses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(expenseData)
      });
      if (response.ok) {
        fetchExpenses();
      }
    } catch (err) {
      console.error("Error adding expense", err);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchExpenses();
      }
    } catch (err) {
      console.error("Error deleting expense", err);
    }
  };

  const categories = [...new Set(expenses.map(e => e.category))];
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h2>Hi, {user.username}</h2>
          <button style={{ marginTop: '0.5rem', background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold' }}>
            Total Expenses: ₹{total.toFixed(2)}
          </button>
        </div>
        <button className="btn-danger" onClick={onLogout}>Logout</button>
      </div>

      <div className="grid-2">
        <div>
          <ExpenseForm onAdd={handleAddExpense} />
        </div>
        <div>
          <div className="glass-panel">
            <div className="filters">
              <label style={{alignSelf: 'center', margin: 0}}>Filter:</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                {/* Fallback standard categories if list is empty */}
                {!categories.includes('Food') && <option value="Food">Food</option>}
                {!categories.includes('Transport') && <option value="Transport">Transport</option>}
                {!categories.includes('Entertainment') && <option value="Entertainment">Entertainment</option>}
              </select>
            </div>
            
            <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
          </div>
        </div>
      </div>
    </div>
  );
}
