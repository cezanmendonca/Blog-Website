import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Blog } from '../types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select(`
            *,
            author:profiles(*)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBlogs(data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif font-bold mb-8 text-accent">Latest Blogs</h1>
      <div className="grid gap-8">
        {blogs.map((blog) => (
          <Link 
            key={blog.id} 
            to={`/blog/${blog.id}`}
            className="bg-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {blog.cover_image && (
              <img 
                src={blog.cover_image} 
                alt={blog.title} 
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-serif font-semibold mb-2 text-accent">{blog.title}</h2>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span>By {blog.author.username}</span>
                <span className="mx-2">•</span>
                <span>{format(new Date(blog.created_at), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex gap-2">
                {blog.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-primary text-accent rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}