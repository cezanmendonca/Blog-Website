import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast.error('Please log in to create a blog post');
        navigate('/login');
        return;
      }

      const { error } = await supabase
        .from('blogs')
        .insert([
          {
            title: title.trim(),
            content: content.trim(),
            author_id: user.id,
            tags: tags.split(',')
              .map(tag => tag.trim())
              .filter(Boolean),
          },
        ]);

      if (error) throw error;

      toast.success('Blog post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error creating blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-secondary p-8 rounded-lg shadow-sm">
        <h1 className="text-2xl font-serif font-bold mb-6 text-accent">Create New Blog</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-600">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter your blog title"
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-200 bg-primary"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-600">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your blog content here..."
              rows={10}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-200 bg-primary"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-600">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="technology, programming, web development"
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-200 bg-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-accent hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating...' : 'Create Blog Post'}
          </button>
        </form>
      </div>
    </div>
  );
}