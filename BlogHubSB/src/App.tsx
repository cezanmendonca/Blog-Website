import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateBlog from './pages/CreateBlog';
import Profile from './pages/Profile';
import BlogView from './pages/BlogView';
import Search from './pages/Search';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/blog/:id" element={<BlogView />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;