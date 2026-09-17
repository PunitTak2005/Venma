import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, User } from 'lucide-react';
import api from '../../services/api';

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        if (res.data.success) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Registered Users & Customers</h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete roster of registered accounts across customer, vendor, and administrator roles.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors duration-200">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-500">{u.email}</td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-[#F8ECE3] text-[#C67C4E] dark:bg-[#2B2B2F] dark:text-[#D8956A]'
                          : u.role === 'vendor'
                          ? 'bg-[#FCF9EE] text-[#D4A24C] dark:bg-[#2B2B2F] dark:text-[#E5BE73]'
                          : 'bg-[#F7F5F2] text-[#1C1C1E] dark:bg-[#2B2B2F] dark:text-[#F8F7F5]'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    {u.address?.city ? `${u.address.city}, ${u.address.state}` : 'N/A'}
                  </td>
                  <td className="px-6 py-3.5 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
