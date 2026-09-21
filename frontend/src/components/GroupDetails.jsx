import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, UserPlus, Receipt, ArrowRightLeft } from 'lucide-react';

export default function GroupDetails() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Forms state
  const [newMemberName, setNewMemberName] = useState('');
  const [expenseForm, setExpenseForm] = useState({
    description: '', amount: '', paidBy: '', category: 'Other', splitType: 'EQUAL'
  });

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      const [gRes, mRes, eRes, bRes, sRes] = await Promise.all([
        api.get(`/groups/${groupId}`),
        api.get(`/groups/${groupId}/members`),
        api.get(`/groups/${groupId}/expenses`),
        api.get(`/groups/${groupId}/balances`),
        api.get(`/groups/${groupId}/settlements/suggestions`)
      ]);
      setGroup(gRes.data);
      setMembers(mRes.data);
      setExpenses(eRes.data);
      setBalances(bRes.data);
      setSuggestions(sRes.data);
    } catch (error) {
      console.error('Error fetching group data', error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberName) return;
    try {
      await api.post(`/groups/${groupId}/members`, { name: newMemberName });
      setNewMemberName('');
      fetchGroupData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding member');
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.paidBy || members.length === 0) return;
    
    // For simplicity in this demo, EQUAL split is hardcoded across all members
    const amount = Number(expenseForm.amount);
    const splitAmount = amount / members.length;
    const splits = members.map(m => ({ memberId: m._id, amount: splitAmount }));

    try {
      await api.post(`/groups/${groupId}/expenses`, {
        ...expenseForm,
        amount,
        splits
      });
      setExpenseForm({ description: '', amount: '', paidBy: '', category: 'Other', splitType: 'EQUAL' });
      fetchGroupData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding expense');
    }
  };

  const handleSettle = async (suggestion) => {
    try {
      await api.post(`/groups/${groupId}/settlements`, {
        fromMember: suggestion.from.memberId,
        toMember: suggestion.to.memberId,
        amount: suggestion.amount
      });
      fetchGroupData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error settling debt');
    }
  };

  if (!group) return <div className="p-8 text-center text-gray-500">Loading group...</div>;

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-sm">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Groups
      </Link>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
        <p className="text-gray-500">{group.description}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Members Column */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-indigo-500" /> Members ({members.length})
            </h2>
            <form onSubmit={handleAddMember} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="New member name"
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
              />
              <button type="submit" className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-200">
                Add
              </button>
            </form>
            <ul className="space-y-2">
              {members.map(m => (
                <li key={m._id} className="p-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                  {m.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Balances</h2>
            <ul className="space-y-3">
              {balances.map(b => (
                <li key={b.memberId} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">{b.name}</span>
                  <span className={`font-bold ${b.balance > 0 ? 'text-green-600' : b.balance < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                    {b.balance > 0 ? '+' : ''}{b.balance.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Expenses Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-indigo-500" /> Add Expense
            </h2>
            <form onSubmit={handleAddExpense} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Description"
                className="px-4 py-2 border rounded-lg col-span-2"
                value={expenseForm.description}
                onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Amount"
                className="px-4 py-2 border rounded-lg"
                value={expenseForm.amount}
                onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                required
              />
              <select 
                className="px-4 py-2 border rounded-lg"
                value={expenseForm.paidBy}
                onChange={e => setExpenseForm({...expenseForm, paidBy: e.target.value})}
                required
              >
                <option value="">Paid By...</option>
                {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
              <button type="submit" className="col-span-2 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700">
                Split Equally
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-indigo-500" /> Suggested Settlements
            </h2>
            {suggestions.length === 0 ? (
              <p className="text-sm text-gray-500">Everyone is settled up!</p>
            ) : (
              <div className="space-y-3">
                {suggestions.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg text-sm border border-orange-100">
                    <div>
                      <span className="font-bold">{s.from.name}</span> owes <span className="font-bold">{s.to.name}</span>
                      <div className="text-orange-600 font-bold mt-1">${s.amount.toFixed(2)}</div>
                    </div>
                    <button 
                      onClick={() => handleSettle(s)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium"
                    >
                      Record Payment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Recent Expenses</h2>
            {expenses.length === 0 ? (
              <p className="text-sm text-gray-500">No expenses yet.</p>
            ) : (
              <ul className="divide-y">
                {expenses.map(e => (
                  <li key={e._id} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{e.description}</div>
                      <div className="text-gray-500 text-xs">Paid by {e.paidBy?.name} • {new Date(e.date).toLocaleDateString()}</div>
                    </div>
                    <div className="font-bold text-gray-900">${e.amount.toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
