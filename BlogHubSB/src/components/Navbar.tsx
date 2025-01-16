import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiPlusCircle, FiBell, FiUser } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear the search input after searching
    }
  };

  return (
    <nav className="bg-secondary shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-serif font-bold text-accent">
            BlogHub
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-primary border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 text-accent placeholder-gray-400"
              />
              <button type="submit" className="absolute right-3 top-2.5">
                <FiSearch className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <Link to="/create" className="text-accent hover:text-gray-600 transition-colors">
              <FiPlusCircle className="w-6 h-6" />
            </Link>
            <button className="text-accent hover:text-gray-600 transition-colors">
              <FiBell className="w-6 h-6" />
            </button>
            {user ? (
              <Link to="/profile" className="text-accent hover:text-gray-600 transition-colors">
                <FiUser className="w-6 h-6" />
              </Link>
            ) : (
              <Link to="/login" className="text-accent hover:text-gray-600 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}