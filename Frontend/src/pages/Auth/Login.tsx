import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.access_token && data.user) {
        login(data.access_token, data.user);
        navigate('/home');
        console.log('Login successful');
      } else {
        setError(data.message || 'Login failed');
        if (data.errors) {
          setFieldErrors(data.errors);
        }
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex p-40">
     
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-tl-lg rounded-bl-lg">
        <div className="max-w-md w-full space-y-8">
        
          <div className="flex items-center">
         
            <img src={require('../../assets/logo.png')} alt="Logo" className="hidden md:block w-48 mx-auto mb-8" />

          </div>

        

          <div className="space-y-6">
         
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
              />
              {fieldErrors.email && fieldErrors.email.map((msg, idx) => (
                <div key={idx} className="text-red-500 text-sm mt-1">{msg}</div>
              ))}
            </div>

       
            <div>
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
                  placeholder="Password."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
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
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't Have An Account?{' '}
                <a href="/register" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
                  Register Now.
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

    
      <div className="hidden lg:flex flex-1 bg-gradient-to-br rounded-tr-lg rounded-br-lg from-blue-600 via-purple-600 to-indigo-700 items-center justify-center p-12">
        
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="max-w-md text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Policy Managment System
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Log in to access your car4Sure dashboard and manage your policies.
          </p>
          
      
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;