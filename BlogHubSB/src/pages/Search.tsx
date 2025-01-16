import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Blog } from '../types';
import { format } from 'date-fns';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function searchBlogs() {
      if (!query) {
        setBlogs([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('blogs')
          .select(`
            *,
            author:profiles(*)
          `)
          .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBlogs(data || []);
      } catch (error) {
        console.error('Error searching blogs:', error);
      } finally {
        setLoading(false);
      }
    }

    searchBlogs();
  }, [query]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif font-bold mb-8 text-accent">
        {query ? `Search Results for "${query}"` : 'Search Results'}
      </h1>
      
      {blogs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {query 
              ? 'No blogs found matching your search.' 
              : 'Enter a search term to find blogs.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-8">
          {blogs.map((blog) => (
            <Link 
              key={blog.id} 
              to={`/blog/${blog.id}`}
              className="bg-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-2xl font-serif font-semibold mb-2 text-accent">
                  {blog.title}
                </h2>
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
      )}
    </div>
  );
}