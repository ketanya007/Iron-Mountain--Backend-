import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Users, Plus, ChevronRight } from 'lucide-react';

export default function GroupsList() {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get('/groups');
      setGroups(res.data);
    } catch (error) {
      console.error('Failed to fetch groups', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroup.name) return;
    try {
      await api.post('/groups', newGroup);
      setNewGroup({ name: '', description: '' });
      fetchGroups();
    } catch (error) {
      console.error('Error creating group', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading groups...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-indigo-500" /> Create New Group
        </h2>
        <form onSubmit={handleCreateGroup} className="flex gap-4 items-start">
          <div className="flex-1 space-y-4">
            <input
              type="text"
              placeholder="Group Name (e.g. Goa Trip)"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={newGroup.name}
              onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description (Optional)"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={newGroup.description}
              onChange={e => setNewGroup({ ...newGroup, description: e.target.value })}
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors h-10">
            Create
          </button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map(group => (
          <Link
            key={group._id}
            to={`/groups/${group._id}`}
            className="block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{group.name}</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{group.description || 'No description'}</p>
            <div className="flex items-center text-sm font-medium text-indigo-600">
              View details <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </Link>
        ))}
        {groups.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            No groups found. Create one above to get started!
          </div>
        )}
      </div>
    </div>
  );
}
