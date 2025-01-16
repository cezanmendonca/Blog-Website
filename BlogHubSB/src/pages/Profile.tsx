import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, Blog } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          navigate('/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) throw profileError;
        setUser(profile);

        const { data: userBlogs, error: blogsError } = await supabase
          .from('blogs')
          .select('*')
          .eq('author_id', authUser.id)
          .order('created_at', { ascending: false });

        if (blogsError) throw blogsError;
        setBlogs(userBlogs);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Error loading profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-secondary p-8 rounded-lg shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-serif font-bold text-accent">Profile</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-white bg-accent rounded-md hover:bg-gray-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Username</h2>
            <p className="mt-1 text-lg text-accent">{user.username}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Email</h2>
            <p className="mt-1 text-lg text-accent">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-secondary p-8 rounded-lg shadow-sm">
        <h2 className="text-xl font-serif font-bold mb-6 text-accent">Your Blogs</h2>
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
            >
              <h3 className="text-lg font-serif font-semibold mb-2 text-accent">{blog.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span>{format(new Date(blog.created_at), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex gap-2 mb-4">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary text-accent rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => navigate(`/blog/${blog.id}`)}
                className="text-accent hover:text-gray-600 transition-colors"
              >
                View Blog →
              </button>
            </div>
          ))}
          {blogs.length === 0 && (
            <p className="text-gray-500 text-center">
              You haven't created any blogs yet.{' '}
              <button
                onClick={() => navigate('/create')}
                className="text-accent hover:text-gray-600 transition-colors"
              >
                Create your first blog
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}