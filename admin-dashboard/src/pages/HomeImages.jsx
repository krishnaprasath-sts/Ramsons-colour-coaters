import React, { useCallback, useEffect, useState } from 'react';
import { FiCheck, FiEdit2, FiImage, FiPlus, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import { Alert, ConfirmDialog, EmptyState, LoadingState, Modal, Spinner, useFilePreview, useToast } from '../components/ui';
import { api } from '../lib/api';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

// Shows the slide image, or a neutral placeholder when the file cannot be loaded.
function SlideImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className="thumb-placeholder" role="img" aria-label="Image not available">
        <FiImage aria-hidden="true" />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

export default function HomeImages() {
  const notify = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // `editing` is null (closed), { id: null } (new slide) or an existing slide
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [file, setFile] = useState(null);
  const previewUrl = useFilePreview(file);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBanners = useCallback(() => {
    setLoading(true);
    setLoadError('');
    api('/api/banners')
      .then((data) => setBanners(data.banners || []))
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const openForm = (slide) => {
    setEditing(slide || { id: null, src: '', title: '', subtitle: '' });
    setTitle(slide ? slide.title || '' : '');
    setSubtitle(slide ? slide.subtitle || '' : '');
    setFile(null);
    setFormError('');
  };

  const closeForm = () => {
    if (saving) return;
    setEditing(null);
    setFile(null);
  };

  const handleFileChange = (e) => {
    const chosen = e.target.files && e.target.files[0];
    setFormError('');
    if (!chosen) {
      setFile(null);
      return;
    }
    if (!chosen.type.startsWith('image/')) {
      setFile(null);
      e.target.value = '';
      setFormError('Please choose an image file (JPG, PNG or WEBP).');
      return;
    }
    if (chosen.size > MAX_IMAGE_BYTES) {
      setFile(null);
      e.target.value = '';
      setFormError('That image is larger than 8 MB. Please choose a smaller file.');
      return;
    }
    setFile(chosen);
  };

  const isEdit = Boolean(editing && editing.id !== null);

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a headline for this slide.');
      return;
    }
    if (!isEdit && !file) {
      setFormError('Please choose a banner image to upload.');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('subtitle', subtitle.trim());
      if (file) formData.append('image', file);

      await api(isEdit ? `/api/banners/${editing.id}` : '/api/banners', {
        method: isEdit ? 'PUT' : 'POST',
        body: formData,
      });

      notify(isEdit ? 'Banner slide updated.' : 'Banner slide added.');
      setEditing(null);
      setFile(null);
      fetchBanners();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api(`/api/banners/${deleteTarget.id}`, { method: 'DELETE' });
      setBanners((list) => list.filter((b) => b.id !== deleteTarget.id));
      notify('Banner slide deleted.');
      setDeleteTarget(null);
    } catch (err) {
      notify(err.message, 'danger');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Home Page Banners"
      subtitle="Slides shown in the large carousel at the top of the home page."
      actions={
        <button type="button" className="btn btn-primary" onClick={() => openForm(null)}>
          <FiPlus aria-hidden="true" /> Add slide
        </button>
      }
    >
      {loadError && <Alert type="danger">{loadError}</Alert>}

      {loading ? (
        <section className="card">
          <LoadingState label="Loading banner slides..." />
        </section>
      ) : banners.length === 0 && !loadError ? (
        <section className="card">
          <EmptyState
            icon={FiImage}
            title="No banner slides yet"
            action={
              <button type="button" className="btn btn-primary" onClick={() => openForm(null)}>
                <FiPlus aria-hidden="true" /> Add your first slide
              </button>
            }
          >
            Until a slide is added, the home page shows its two built-in default banners.
          </EmptyState>
        </section>
      ) : (
        <section className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th className="col-order">Slide</th>
                  <th>Preview</th>
                  <th>Headline &amp; subtitle</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((slide, index) => (
                  <tr className="banner-row" key={slide.id || index}>
                    <td className="col-order">
                      <span className="order-number">{String(index + 1).padStart(2, '0')}</span>
                    </td>
                    <td className="col-thumb">
                      <div className="banner-thumb">
                        <SlideImage src={slide.src} alt={slide.title || 'Banner slide'} />
                      </div>
                    </td>
                    <td>
                      <div className="cell-title banner-title">{slide.title || 'Untitled banner'}</div>
                      <div className="cell-sub banner-subtitle">{slide.subtitle || 'No subtitle'}</div>
                    </td>
                    <td className="col-actions">
                      <div className="row-actions">
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => openForm(slide)}>
                          <FiEdit2 aria-hidden="true" /> Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger-soft btn-sm"
                          onClick={() => setDeleteTarget(slide)}
                        >
                          <FiTrash2 aria-hidden="true" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-foot">
            {banners.length} {banners.length === 1 ? 'slide' : 'slides'} · The home page carousel shows them in this
            order.
          </div>
        </section>
      )}

      {editing && (
        <Modal title={isEdit ? 'Edit banner slide' : 'Add banner slide'} onClose={closeForm} busy={saving}>
          <form onSubmit={handleSave}>
            <div className="modal-body">
              {formError && <Alert type="danger">{formError}</Alert>}

              <div className="field">
                <label htmlFor="banner-image">
                  Banner image {isEdit ? <span className="label-hint">(leave empty to keep the current one)</span> : <span className="req">*</span>}
                </label>

                {(previewUrl || editing.src) && (
                  <div className="upload-preview">
                    <SlideImage src={previewUrl || editing.src} alt="Selected banner preview" />
                    <span className="upload-preview-tag">{previewUrl ? 'New image' : 'Current image'}</span>
                  </div>
                )}

                <label className="upload-zone" htmlFor="banner-image">
                  <FiUploadCloud aria-hidden="true" />
                  <span className="upload-zone-title">{file ? file.name : 'Choose an image'}</span>
                  <span className="upload-zone-hint">JPG, PNG or WEBP, up to 8 MB</span>
                  <input id="banner-image" type="file" accept="image/*" onChange={handleFileChange} />
                </label>
                <p className="help">
                  Any size works: the whole image is always shown across the full width of the page, and the
                  banner's height follows the image's shape. A wide landscape image (about 1920 × 800 px) gives a
                  compact banner; use the same shape for every slide so the banner height does not change between
                  slides.
                </p>
              </div>

              <div className="field">
                <label htmlFor="banner-title">
                  Headline <span className="req">*</span>
                </label>
                <input
                  id="banner-title"
                  type="text"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. High-Quality Industrial Powder Coating Specialists"
                  maxLength={120}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="banner-subtitle">
                  Subtitle <span className="label-hint">(optional)</span>
                </label>
                <textarea
                  id="banner-subtitle"
                  className="input textarea"
                  rows="3"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="A short line shown below the headline"
                  maxLength={240}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={closeForm} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner /> Saving...
                  </>
                ) : (
                  <>
                    <FiCheck aria-hidden="true" /> {isEdit ? 'Save changes' : 'Add slide'}
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete banner slide?"
          message={
            <>
              <strong>{deleteTarget.title || 'This slide'}</strong> will be removed from the home page carousel. This
              cannot be undone.
            </>
          }
          confirmLabel="Delete slide"
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </AdminLayout>
  );
}
