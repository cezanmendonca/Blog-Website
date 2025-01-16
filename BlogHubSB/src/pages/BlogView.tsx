import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Blog } from '../types';
import { format } from 'date-fns';

export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select(`
            *,
            author:profiles(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchBlog();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {blog.cover_image && (
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{blog.title}</h1>
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <span>By {blog.author.username}</span>
            <span className="mx-2">•</span>
            <span>{format(new Date(blog.created_at), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex gap-2 mb-8">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="prose max-w-none">
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}