import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
        error: signUpError,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: user.id, // Ensure this is a UUID
            username,
            avatar_url: '', // You can set a default avatar URL if needed
            created_at: new Date().toISOString(), // Optional: set created_at
            updated_at: new Date().toISOString(), // Optional: set updated_at
          },
        ]);

        if (profileError) throw profileError;
      }

      toast.success('Successfully signed up! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(`Error signing up: ${error.message || 'Please try again.'}`);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-secondary p-8 rounded-lg shadow-sm">
        <h1 className="text-2xl font-serif font-bold mb-6 text-center text-accent">
          Sign Up
        </h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-200 bg-primary"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-200 bg-primary"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-200 bg-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-accent hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-accent hover:text-gray-600 transition-colors"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
