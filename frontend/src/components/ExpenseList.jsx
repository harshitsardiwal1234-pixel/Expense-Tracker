export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
        No expenses found! Time to spend... or save?
      </div>
    );
  }

  // Sort expenses latest first
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="expense-list">
      {sortedExpenses.map(expense => (
        <div key={expense.id} className="expense-item">
          <div className="expense-info">
            <h3>{expense.title}</h3>
            <p>{expense.category} • {expense.date}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="expense-amount">₹{expense.amount.toFixed(2)}</span>
            <button 
              className="btn-danger" 
              onClick={() => onDelete(expense.id)}
              title="Delete"
              style={{ width: '30px', height: '30px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
