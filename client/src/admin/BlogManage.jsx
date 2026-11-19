import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import AdminLayout from './AdminLayout';
import { authHeaders, sessionExpired } from './session';

export default function BlogManage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchBlogs = () => {
    setLoading(true);
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBlogs(data.blogs);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!title) {
      alert('Please enter a blog title');
      return;
    }
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('category-name', title);
      formData.append('editor-content', description);
      if (file) {
        formData.append('category-img', file);
      }

      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
      });
      if (sessionExpired(res, navigate)) return;
      const data = await res.json();
      if (data.success) {
        alert('Blog saved successfully');
        setShowModal(false);
        setTitle('');
        setDescription('');
        setFile(null);
        fetchBlogs();
      } else {
        alert(data.error || 'Failed to create blog');
      }
    } catch (err) {
      alert('Error creating blog: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (sessionExpired(res, navigate)) return;
      const data = await res.json();
      if (data.success) {
        alert('Blog deleted successfully');
        fetchBlogs();
      } else {
        alert(data.error || 'Failed to delete blog');
      }
    } catch (err) {
      alert('Error deleting blog: ' + err.message);
    }
  };

  return (
    <AdminLayout title="Blog Management | Ramson Colour Coaters">
      <div className="card shadow-sm border-0" style={{ borderRadius: '10px' }}>
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
          <h5 className="mb-0" style={{ fontWeight: 'bold' }}>Blogs</h5>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <FaPlus className="mr-1" /> Add Blog
          </button>
        </div>

        <div className="card-body p-4">
          {loading ? (
            <p className="text-center py-4">Loading blogs...</p>
          ) : blogs.length === 0 ? (
            <p className="text-center py-4">No blogs found. Click "Add Blog" above to create one.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle mb-0">
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th style={{ width: '80px', textAlign: 'center' }}>Image</th>
                    <th>Title</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>Edit</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((b) => (
                    <tr key={b.id}>
                      <td className="text-center align-middle">
                        <img
                          src={`/uploads/${b.image}`}
                          alt={b.title}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          onError={(e) => { e.target.src = '/images/banner-1.jpeg'; }}
                        />
                      </td>
                      <td className="align-middle" style={{ fontWeight: 500 }}>
                        {b.title}
                      </td>
                      <td className="text-center align-middle">
                        <Link to={`/dashboard/categoryEdit/${b.id}`} className="btn btn-info btn-sm">
                          Edit
                        </Link>
                      </td>
                      <td className="text-center align-middle">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(b.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ borderRadius: '10px' }}>
              <div className="modal-header">
                <h5 className="modal-title">Add Blog</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                  style={{ border: 'none', background: 'none', fontSize: '24px' }}
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleCreateBlog}>
                <div className="modal-body p-4">
                  <div className="form-group mb-3">
                    <label htmlFor="category-img" className="form-label font-weight-bold">
                      Blog Image
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="category-img"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="category-name" className="form-label font-weight-bold">
                      Enter Blog Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="category-name"
                      placeholder="Enter title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="editor-content" className="form-label font-weight-bold">
                      Enter Your Content
                    </label>
                    <textarea
                      className="form-control"
                      id="editor-content"
                      rows="8"
                      placeholder="Enter blog content or HTML..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Blog'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
