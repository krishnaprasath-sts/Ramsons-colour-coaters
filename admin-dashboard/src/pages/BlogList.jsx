import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiExternalLink, FiFileText, FiImage, FiPlus, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import { Alert, ConfirmDialog, EmptyState, LoadingState, useToast } from '../components/ui';
import { api, formatDate, imageUrl, SITE_URL } from '../lib/api';

function Cover({ blog }) {
  const [failed, setFailed] = useState(false);
  if (!blog.image || failed) {
    return (
      <div className="cover-thumb thumb-placeholder" aria-hidden="true">
        <FiImage />
      </div>
    );
  }
  return <img className="cover-thumb" src={imageUrl(blog.image)} alt="" loading="lazy" onError={() => setFailed(true)} />;
}

// Short plain-text preview of the article body (stored as HTML)
function excerpt(html) {
  const text = String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > 110 ? `${text.slice(0, 110)}...` : text;
}

export default function BlogList() {
  const notify = useToast();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = useCallback(() => {
    setLoading(true);
    setLoadError('');
    api('/api/blogs')
      .then((data) => setBlogs(data.blogs || []))
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api(`/api/blogs/${deleteTarget.id}`, { method: 'DELETE' });
      setBlogs((list) => list.filter((b) => b.id !== deleteTarget.id));
      notify('Article deleted.');
      setDeleteTarget(null);
    } catch (err) {
      notify(err.message, 'danger');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Blog Articles"
      subtitle="Articles published on the Blogs page of the website."
      actions={
        <Link to="/blogs/new" className="btn btn-primary">
          <FiPlus aria-hidden="true" /> New article
        </Link>
      }
    >
      {loadError && <Alert type="danger">{loadError}</Alert>}

      <section className="card">
        {loading ? (
          <LoadingState label="Loading articles..." />
        ) : blogs.length === 0 && !loadError ? (
          <EmptyState
            icon={FiFileText}
            title="No articles yet"
            action={
              <Link to="/blogs/new" className="btn btn-primary">
                <FiPlus aria-hidden="true" /> Write your first article
              </Link>
            }
          >
            Share coating tips, process explainers and company news with your customers.
          </EmptyState>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Author</th>
                  <th>Published</th>
                  <th className="col-actions">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <div className="article-cell">
                        <Cover blog={blog} />
                        <div>
                          <Link to={`/blogs/edit/${blog.id}`} className="cell-title cell-title-link">
                            {blog.title}
                          </Link>
                          <div className="cell-sub clamp-1">{excerpt(blog.description) || 'No content yet'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="nowrap">{blog.author || 'Ramson Colour Coaters'}</td>
                    <td className="nowrap cell-sub">{formatDate(blog.created_at)}</td>
                    <td className="col-actions">
                      <div className="row-actions">
                        <a
                          href={`${SITE_URL}/viewblog/${blog.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="icon-btn"
                          aria-label={`View "${blog.title}" on the website`}
                          title="View on website"
                        >
                          <FiExternalLink aria-hidden="true" />
                        </a>
                        <Link
                          to={`/blogs/edit/${blog.id}`}
                          className="icon-btn"
                          aria-label={`Edit "${blog.title}"`}
                          title="Edit article"
                        >
                          <FiEdit2 aria-hidden="true" />
                        </Link>
                        <button
                          type="button"
                          className="icon-btn icon-btn-danger"
                          onClick={() => setDeleteTarget(blog)}
                          aria-label={`Delete "${blog.title}"`}
                          title="Delete article"
                        >
                          <FiTrash2 aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {deleteTarget && (
        <ConfirmDialog
          title="Delete article?"
          message={
            <>
              <strong>{deleteTarget.title}</strong> will be removed from the website. This cannot be undone.
            </>
          }
          confirmLabel="Delete article"
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </AdminLayout>
  );
}
