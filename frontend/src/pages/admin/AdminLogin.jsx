import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { toast } from 'react-hot-toast';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData.email, formData.password, 'admin');
    setLoading(false);
    
    if (!result.success) {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
        <p className="mt-2 text-gray-600">
          Sign in to access admin dashboard
        </p>
      </div>

      <div className="card p-8 shadow-lg">
        <div className="mb-6">
          <p className="text-sm text-gray-600 text-center">
            This portal is for authorized administrators only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 px-4 text-base font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="spinner h-5 w-5 border-2 mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign in as Admin'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Are you a patient or doctor?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Go to main login
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Authorized access only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;