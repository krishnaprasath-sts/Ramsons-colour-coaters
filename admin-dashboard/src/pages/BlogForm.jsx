import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiImage, FiUploadCloud } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import { Alert, LoadingState, Spinner, useFilePreview, useToast } from '../components/ui';
import { api, imageUrl } from '../lib/api';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const DEFAULT_AUTHOR = 'Ramson Colour Coaters';

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The website renders article content as HTML. Plain text typed here is turned
// into paragraphs so line breaks are kept; content that already has HTML tags
// is saved exactly as written.
function toArticleHtml(content) {
  const trimmed = content.trim();
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return trimmed;
  return trimmed
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

export default function BlogForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const notify = useToast();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(DEFAULT_AUTHOR);
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const previewUrl = useFilePreview(imageFile);
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return undefined;
    let cancelled = false;

    api(`/api/blogs/${id}`)
      .then((data) => {
        if (cancelled) return;
        setTitle(data.blog.title || '');
        setAuthor(data.blog.author || DEFAULT_AUTHOR);
        setContent(data.blog.description || '');
        setExistingImage(data.blog.image || '');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoadFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const handleFileChange = (e) => {
    const chosen = e.target.files && e.target.files[0];
    setError('');
    if (!chosen) {
      setImageFile(null);
      return;
    }
    if (!chosen.type.startsWith('image/')) {
      setImageFile(null);
      e.target.value = '';
      setError('Please choose an image file (JPG, PNG or WEBP) for the cover.');
      return;
    }
    if (chosen.size > MAX_IMAGE_BYTES) {
      setImageFile(null);
      e.target.value = '';
      setError('That cover image is larger than 8 MB. Please choose a smaller file.');
      return;
    }
    setImageFile(chosen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a title for the article.');
      return;
    }
    if (!content.trim()) {
      setError('Please write the article content.');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('author', author.trim() || DEFAULT_AUTHOR);
      formData.append('description', toArticleHtml(content));
      if (imageFile) formData.append('image', imageFile);

      await api(isEdit ? `/api/blogs/${id}` : '/api/blogs', {
        method: isEdit ? 'PUT' : 'POST',
        body: formData,
      });

      notify(isEdit ? 'Article updated.' : 'Article published.');
      navigate('/blogs');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const coverSrc = previewUrl || imageUrl(existingImage);

  return (
    <AdminLayout
      title={isEdit ? 'Edit Article' : 'New Article'}
      subtitle={isEdit ? 'Update this article and save your changes.' : 'Write and publish a new blog article.'}
      actions={
        <Link to="/blogs" className="btn btn-ghost">
          <FiArrowLeft aria-hidden="true" /> Back to articles
        </Link>
      }
    >
      {error && <Alert type="danger">{error}</Alert>}

      {loading ? (
        <section className="card">
          <LoadingState label="Loading article..." />
        </section>
      ) : loadFailed ? null : (
        <form className="form-layout" onSubmit={handleSubmit}>
          <section className="card card-pad">
            <div className="field">
              <label htmlFor="blog-title">
                Title <span className="req">*</span>
              </label>
              <input
                id="blog-title"
                type="text"
                className="input"
                placeholder="e.g. Benefits of 7-Tank MS Powder Coating Pre-treatment"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={160}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="blog-content">
                Content <span className="req">*</span>
              </label>
              <textarea
                id="blog-content"
                className="input textarea textarea-lg"
                rows="16"
                placeholder="Write the article here. Leave a blank line between paragraphs."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <p className="help">
                Leave a blank line to start a new paragraph. Basic HTML such as &lt;h3&gt;, &lt;ul&gt; and
                &lt;strong&gt; is also supported.
              </p>
            </div>
          </section>

          <aside className="form-side">
            <section className="card card-pad">
              <h2 className="side-title">Cover image</h2>
              <div className="cover-preview">
                {coverSrc ? (
                  <img
                    src={coverSrc}
                    alt="Cover preview"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="thumb-placeholder" aria-hidden="true">
                    <FiImage />
                  </div>
                )}
              </div>
              <label className="upload-zone upload-zone-sm" htmlFor="blog-image">
                <FiUploadCloud aria-hidden="true" />
                <span className="upload-zone-title">
                  {imageFile ? imageFile.name : existingImage ? 'Replace image' : 'Choose an image'}
                </span>
                <span className="upload-zone-hint">JPG, PNG or WEBP, up to 8 MB</span>
                <input id="blog-image" type="file" accept="image/*" onChange={handleFileChange} />
              </label>
            </section>

            <section className="card card-pad">
              <div className="field">
                <label htmlFor="blog-author">Author</label>
                <input
                  id="blog-author"
                  type="text"
                  className="input"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  maxLength={80}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner /> Saving...
                  </>
                ) : (
                  <>
                    <FiCheck aria-hidden="true" /> {isEdit ? 'Save changes' : 'Publish article'}
                  </>
                )}
              </button>
              <Link to="/blogs" className="btn btn-ghost btn-block">
                Cancel
              </Link>
            </section>
          </aside>
        </form>
      )}
    </AdminLayout>
  );
}
