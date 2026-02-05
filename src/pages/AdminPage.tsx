
import React, { useEffect, useState } from 'react';
import { resetAllUserBalances } from '../lib/resetBalances';
import { apiListUsers, apiUpdateBalance, apiEditName, apiSendNotification } from '../lib/session';

export function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editName, setEditName] = useState<{[id: string]: string}>({});
  const [editBalance, setEditBalance] = useState<{[id: string]: number}>({});
  const [notifyMsg, setNotifyMsg] = useState<{[id: string]: string}>({});

  useEffect(() => {
    apiListUsers().then(setUsers).catch(() => setStatus('Failed to fetch users'));
  }, []);

  const handleUpdateBalance = async (userId: string, amount: number) => {
    setLoading(true);
    try {
      await apiUpdateBalance(userId, amount);
      setStatus('Balance updated');
      setUsers(await apiListUsers());
    } catch (err: any) {
      setStatus('Error updating balance');
    } finally {
      setLoading(false);
    }
  };

  const handleEditName = async (userId: string, name: string) => {
    setLoading(true);
    try {
      await apiEditName(userId, name);
      setStatus('Name updated');
      setUsers(await apiListUsers());
    } catch (err: any) {
      setStatus('Error updating name');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (userId: string, message: string) => {
    setLoading(true);
    try {
      await apiSendNotification(userId, message);
      setStatus('Notification sent');
      setNotifyMsg(msgs => ({ ...msgs, [userId]: '' }));
    } catch (err: any) {
      setStatus('Error sending notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      {status && <div className="mb-4 text-lg text-slate-700">{status}</div>}
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Balance</th>
            <th className="px-4 py-2">Edit Name</th>
            <th className="px-4 py-2">Add/Subtract Balance</th>
            <th className="px-4 py-2">Notify</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-t">
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.name || '-'}</td>
              <td className="px-4 py-2">{user.balance ?? 0}</td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={editName[user._id] ?? user.name ?? ''}
                  onChange={e => setEditName(n => ({ ...n, [user._id]: e.target.value }))}
                  className="border px-2 py-1 rounded w-32"
                />
                <button
                  className="ml-2 px-3 py-1 bg-emerald-600 text-white rounded"
                  onClick={() => handleEditName(user._id, editName[user._id] ?? user.name ?? '')}
                  disabled={loading}
                >Save</button>
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={editBalance[user._id] ?? 0}
                  onChange={e => setEditBalance(b => ({ ...b, [user._id]: Number(e.target.value) }))}
                  className="border px-2 py-1 rounded w-20"
                />
                <button
                  className="ml-2 px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() => handleUpdateBalance(user._id, editBalance[user._id] ?? 0)}
                  disabled={loading}
                >Update</button>
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={notifyMsg[user._id] ?? ''}
                  onChange={e => setNotifyMsg(m => ({ ...m, [user._id]: e.target.value }))}
                  className="border px-2 py-1 rounded w-32"
                  placeholder="Message..."
                />
                <button
                  className="ml-2 px-3 py-1 bg-amber-600 text-white rounded"
                  onClick={() => handleSendNotification(user._id, notifyMsg[user._id] ?? '')}
                  disabled={loading}
                >Send</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav className="mt-10 w-full flex justify-center">
        <ul className="flex gap-8 text-lg">
          <li><a href="#/dashboard" className="text-emerald-700 hover:underline">Dashboard</a></li>
          <li><a href="#/" className="text-emerald-700 hover:underline">Home</a></li>
          <li><a href="#/login" className="text-emerald-700 hover:underline">Logout</a></li>
        </ul>
      </nav>
    </div>
  );
}
