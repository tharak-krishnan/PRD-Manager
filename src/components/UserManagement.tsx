import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useAuth, UserRole } from '../context/AuthContext';
import { canManageUsers } from '../utils/permissions';
import { Shield, Users, ArrowLeft } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser && canManageUsers(currentUser.role)) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      setError(null);
      const data = await apiClient.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      setError(null);
      await apiClient.updateUserRole(userId, newRole);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole as UserRole } : u)));
    } catch (err: any) {
      console.error('Failed to update role:', err);
      setError(err.response?.data?.error || 'Failed to update user role');
    }
  };

  const getRoleBadgeColor = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return 'bg-purple-900/50 text-purple-300 border-purple-700/50';
      case 'product_manager':
        return 'bg-blue-900/50 text-blue-300 border-blue-700/50';
      case 'engineer':
        return 'bg-green-900/50 text-green-300 border-green-700/50';
      case 'viewer':
        return 'bg-gray-700/50 text-gray-300 border-gray-600/50';
      default:
        return 'bg-gray-700/50 text-gray-300 border-gray-600/50';
    }
  };

  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'product_manager':
        return 'Product Manager';
      case 'engineer':
        return 'Engineer';
      case 'viewer':
        return 'Viewer';
      default:
        return role;
    }
  };

  if (!currentUser || !canManageUsers(currentUser.role)) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
          <Shield size={64} className="mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p>Only administrators can access user management.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="p-6 max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="mb-6 flex items-center gap-3">
          <Users size={32} className="text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-gray-100">User Management</h1>
            <p className="text-gray-400 mt-1">Manage user roles and permissions</p>
          </div>
        </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg text-red-300">
          {error}
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Current Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Change Role
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-750 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-100">{user.username}</span>
                    {user.id === currentUser.id && (
                      <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-300 border border-blue-700/50 rounded">
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {getRoleDisplayName(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={user.id === currentUser.id}
                    className={`px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      user.id === currentUser.id
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-600'
                    }`}
                    title={user.id === currentUser.id ? 'You cannot change your own role' : ''}
                  >
                    <option value="admin">Admin</option>
                    <option value="product_manager">Product Manager</option>
                    <option value="engineer">Engineer</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            No users found.
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-400">
          <div className="space-y-2">
            <div>
              <span className="font-medium text-purple-300">Admin:</span> Full access to all
              features
            </div>
            <div>
              <span className="font-medium text-blue-300">Product Manager:</span> Can create/edit
              features and categories (except engineering fields)
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-green-300">Engineer:</span> Can edit engineering
              fields on assigned features only
            </div>
            <div>
              <span className="font-medium text-gray-300">Viewer:</span> Read-only access to all
              content
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default UserManagement;
