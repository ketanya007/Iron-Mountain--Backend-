import React, { useState, useEffect } from 'react';
import api from './api';

function App() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // New group state
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  // Group Details State
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  
  // Forms inside group
  const [newMemberName, setNewMemberName] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expensePaidBy, setExpensePaidBy] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get('/groups');
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName) return;
    try {
      await api.post('/groups', { name: newGroupName, description: newGroupDesc });
      setNewGroupName('');
      setNewGroupDesc('');
      fetchGroups();
    } catch (err) {
      alert(err.message);
    }
  };

  const loadGroupDetails = async (group) => {
    setSelectedGroup(group);
    try {
      const mRes = await api.get(`/groups/${group._id}/members`);
      const eRes = await api.get(`/groups/${group._id}/expenses`);
      const bRes = await api.get(`/groups/${group._id}/balances`);
      const sRes = await api.get(`/groups/${group._id}/settlements/suggestions`);
      
      setMembers(mRes.data);
      setExpenses(eRes.data);
      setBalances(bRes.data);
      setSuggestions(sRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/groups/${selectedGroup._id}/members`, { name: newMemberName });
      setNewMemberName('');
      loadGroupDetails(selectedGroup);
    } catch (err) {
      alert('Failed to add member');
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!expenseAmount || !expensePaidBy) return;
    const amount = Number(expenseAmount);
    const splitAmount = amount / members.length;
    const splits = members.map(m => ({ memberId: m._id, amount: splitAmount }));

    try {
      await api.post(`/groups/${selectedGroup._id}/expenses`, {
        description: expenseDesc,
        amount,
        paidBy: expensePaidBy,
        splitType: 'EQUAL',
        category: 'Other',
        splits
      });
      setExpenseDesc('');
      setExpenseAmount('');
      setExpensePaidBy('');
      loadGroupDetails(selectedGroup);
    } catch (err) {
      alert('Failed to add expense');
    }
  };

  const settleDebt = async (s) => {
    try {
      await api.post(`/groups/${selectedGroup._id}/settlements`, {
        fromMember: s.from.memberId,
        toMember: s.to.memberId,
        amount: s.amount
      });
      loadGroupDetails(selectedGroup);
    } catch (err) {
      alert('Failed to settle');
    }
  };

  // --- RENDER ---
  
  if (!selectedGroup) {
    return (
      <div className="container">
        <h1>Expense Manager</h1>
        <div className="section">
          <h2>Create Group</h2>
          <form onSubmit={createGroup}>
            <input placeholder="Group Name" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} required />
            <input placeholder="Description" value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} />
            <button type="submit">Create</button>
          </form>
        </div>

        <h2>Your Groups</h2>
        <div className="grid">
          {groups.length === 0 ? <p>No groups yet.</p> : null}
          {groups.map(g => (
            <div key={g._id} className="card" onClick={() => loadGroupDetails(g)}>
              <h3>{g.name}</h3>
              <p>{g.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Group Details View
  return (
    <div className="container">
      <button className="back-btn" onClick={() => setSelectedGroup(null)}>← Back to Groups</button>
      
      <h1>{selectedGroup.name}</h1>
      <p>{selectedGroup.description}</p>

      <div className="section">
        <h2>Members</h2>
        <form onSubmit={addMember} className="form-group">
          <input placeholder="New Member Name" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} required />
          <button type="submit">Add Member</button>
        </form>
        <ul>
          {members.map(m => <li key={m._id}>{m.name}</li>)}
        </ul>
      </div>

      <div className="section">
        <h2>Add Expense (Equal Split)</h2>
        <form onSubmit={addExpense}>
          <input placeholder="Description" value={expenseDesc} onChange={e => setExpenseDesc(e.target.value)} required />
          <input type="number" placeholder="Amount" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} required />
          <select value={expensePaidBy} onChange={e => setExpensePaidBy(e.target.value)} required>
            <option value="">Paid By...</option>
            {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
          <button type="submit">Add Expense</button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div className="section" style={{ flex: 1 }}>
          <h2>Balances</h2>
          <ul>
            {balances.map(b => (
              <li key={b.memberId} className="flex-between">
                <span>{b.name}</span>
                <span className={b.balance > 0 ? 'text-green' : b.balance < 0 ? 'text-red' : ''}>
                  {b.balance > 0 ? '+' : ''}{b.balance}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="section" style={{ flex: 1 }}>
          <h2>Settlements</h2>
          {suggestions.length === 0 ? <p>All settled!</p> : null}
          <ul>
            {suggestions.map((s, i) => (
              <li key={i} className="flex-between">
                <span><b>{s.from.name}</b> owes <b>{s.to.name}</b> <span className="text-orange">${s.amount}</span></span>
                <button onClick={() => settleDebt(s)}>Settle</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>Expense History</h2>
        <ul>
          {expenses.map(e => (
            <li key={e._id} className="flex-between">
              <div>
                <strong>{e.description}</strong> <br/>
                <small>Paid by {e.paidBy?.name}</small>
              </div>
              <b>${e.amount}</b>
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
}

export default App;
