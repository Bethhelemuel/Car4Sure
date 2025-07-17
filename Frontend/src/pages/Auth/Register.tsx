import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const roles = ['admin', 'agent', 'customer'];

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(roles[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await response.json();
      if (data.access_token && data.user) {
        login(data.access_token, data.user);
        navigate('/home');
      } else {
        setError(data.message || 'Registration failed');
        if (data.errors) {
          setFieldErrors(data.errors);
        } 
      } 
    } catch (err) {
      setError('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex px-40 py-5">

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-1 bg-white rounded-tl-lg rounded-bl-lg ">
        <div className="max-w-md w-full space-y-8">
          
          <div className="flex items-center">
            <img src={require('../../assets/logo.png')} alt="Logo" className="hidden md:block w-48 mx-auto mb-8" />
          </div>

          <div className="space-y-6">
            
      
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                className={`w-full px-4 py-3 border ${
                  fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
              />
              {fieldErrors.name && fieldErrors.name.map((msg, idx) => (
                <div key={idx} className="text-red-500 text-sm mt-1">{msg}</div>
              ))}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-3 border ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              {fieldErrors.email && fieldErrors.email.map((msg, idx) => (
                <div key={idx} className="text-red-500 text-sm mt-1">{msg}</div>
              ))}
            </div>

         
        
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
           
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full px-4 py-3 pr-12 border ${
                      fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              
                  </button>
                </div>
                {fieldErrors.password && fieldErrors.password.map((msg, idx) => (
                  <div key={idx} className="text-red-500 text-sm mt-1">{msg}</div>
                ))}
              </div>
              <div className="flex-1 mt-6 md:mt-0">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`w-full px-4 py-3 pr-12 border ${
                      fieldErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {fieldErrors.password_confirmation && fieldErrors.password_confirmation.map((msg, idx) => (
                  <div key={idx} className="text-red-500 text-sm mt-1">{msg}</div>
                ))}
              </div>
            </div>

            <div>
            
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                id="role"
                className={`w-full px-4 py-3 border ${
                  fieldErrors.role ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                value={role}
                onChange={e => setRole(e.target.value)}
                required
              >
                {roles.map(r => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
              {fieldErrors.role && fieldErrors.role.map((msg, idx) => (
                <div key={idx} className="text-red-500 text-sm mt-1">{msg}</div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
             
               <div className="text-red-700 text-sm">{error}</div>
              </div>
            )}

       
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></span>
                  Registering...
                </>
              ) : (
                'Submit'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
                  Login Now.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>


      <div className="hidden lg:flex flex-1 bg-gradient-to-br rounded-tr-lg rounded-br-lg from-blue-600 via-purple-600 to-indigo-700 items-center justify-center p-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="max-w-md text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Join Our Platform
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Create your account to start managing your policies with car4Sure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;