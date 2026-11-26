import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import AdminLayout from './AdminLayout';
import { authHeaders, sessionExpired } from './session';
import { apiUrl } from '../lib/api';

export default function BlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.blog) {
          setTitle(data.blog.title);
          setDescription(data.blog.description || '');
          setCurrentImage(data.blog.image || '');
        } else {
          alert('Blog not found');
          navigate('/dashboard/category');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to load blog');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('category-name', title);
      formData.append('editor-content', description);
      if (file) {
        formData.append('category-img', file);
      }

      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: formData,
      });
      if (sessionExpired(res, navigate)) return;
      const data = await res.json();
      if (data.success) {
        alert('Blog updated successfully');
        navigate('/dashboard/category');
      } else {
        alert(data.error || 'Update failed');
      }
    } catch (err) {
      alert('Error updating blog: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Edit Blog | Ramson Colour Coaters">
      <div className="card shadow-sm border-0" style={{ borderRadius: '10px' }}>
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
          <h5 className="mb-0" style={{ fontWeight: 'bold' }}>Edit Blog</h5>
          <Link to="/dashboard/category" className="btn btn-outline-secondary btn-sm">
            <FaArrowLeft className="mr-1" /> Back to Blogs
          </Link>
        </div>

        <div className="card-body p-4">
          {loading ? (
            <p className="text-center py-4">Loading blog details...</p>
          ) : (
            <form onSubmit={handleUpdate}>
              <div className="form-group mb-3">
                <label className="form-label font-weight-bold">Current Image</label>
                <div>
                  <img
                    src={apiUrl(`/uploads/${currentImage}`)}
                    alt={title}
                    style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '5px' }}
                    onError={(e) => { e.target.src = '/images/banner-1.jpeg'; }}
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="category-img" className="form-label font-weight-bold">
                  Change Image (leave empty to keep current)
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
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="category-name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="editor-content" className="form-label font-weight-bold">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="editor-content"
                  rows="8"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-success"
                disabled={saving}
              >
                {saving ? 'Updating...' : 'Update Category'}
              </button>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
