import React, { useCallback, useEffect, useState } from 'react';
import { FiArrowDown, FiArrowUp, FiCheck, FiEdit2, FiLayers, FiPlus, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import { Alert, ConfirmDialog, EmptyState, LoadingState, Modal, Spinner, useToast } from '../components/ui';
import { api } from '../lib/api';

const EMPTY_FORM = {
  title: '',
  tag: '',
  summary: '',
  description: '',
  specs: '',
  features: '',
  buttonLabel: '',
};

// Lists are edited as one item per line
const toLines = (list) => (Array.isArray(list) ? list.join('\n') : '');
const fromLines = (text) =>
  String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const number = (index) => String(index + 1).padStart(2, '0');

export default function Services() {
  const notify = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // `editing` is null (closed), { id: null } (new service) or an existing service
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [reordering, setReordering] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = useCallback(() => {
    setLoading(true);
    setLoadError('');
    api('/api/services')
      .then((data) => setServices(data.services || []))
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openForm = (service) => {
    setEditing(service || { id: null });
    setForm(
      service
        ? {
            title: service.title || '',
            tag: service.tag || '',
            summary: service.summary || '',
            description: service.description || '',
            specs: toLines(service.specs),
            features: toLines(service.features),
            buttonLabel: service.buttonLabel || '',
          }
        : EMPTY_FORM
    );
    setFormError('');
  };

  const closeForm = () => {
    if (!saving) setEditing(null);
  };

  const setField = (name) => (e) => setForm((current) => ({ ...current, [name]: e.target.value }));

  const isEdit = Boolean(editing && editing.id !== null);

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.title.trim()) {
      setFormError('Please enter the service name.');
      return;
    }
    if (!form.summary.trim()) {
      setFormError('Please enter a short summary (it is shown on the home page).');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        tag: form.tag.trim(),
        summary: form.summary.trim(),
        description: form.description.trim(),
        specs: fromLines(form.specs),
        features: fromLines(form.features),
        buttonLabel: form.buttonLabel.trim(),
      };

      await api(isEdit ? `/api/services/${editing.id}` : '/api/services', {
        method: isEdit ? 'PUT' : 'POST',
        json: payload,
      });

      notify(isEdit ? 'Service updated.' : 'Service added.');
      setEditing(null);
      fetchServices();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Moves a service one place up (-1) or down (+1) and saves the new order
  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= services.length || reordering) return;

    const previous = services;
    const next = [...services];
    [next[index], next[target]] = [next[target], next[index]];

    setServices(next);
    setReordering(true);
    try {
      await api('/api/services/reorder', { method: 'PUT', json: { ids: next.map((s) => s.id) } });
    } catch (err) {
      setServices(previous);
      notify(err.message, 'danger');
    } finally {
      setReordering(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api(`/api/services/${deleteTarget.id}`, { method: 'DELETE' });
      setServices((list) => list.filter((s) => s.id !== deleteTarget.id));
      notify('Service deleted.');
      setDeleteTarget(null);
    } catch (err) {
      notify(err.message, 'danger');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Services"
      subtitle="Shown on the home page, the Services page, the footer and the Get a Quote form."
      actions={
        <button type="button" className="btn btn-primary" onClick={() => openForm(null)}>
          <FiPlus aria-hidden="true" /> Add service
        </button>
      }
    >
      {loadError && <Alert type="danger">{loadError}</Alert>}

      <section className="card">
        {loading ? (
          <LoadingState label="Loading services..." />
        ) : services.length === 0 && !loadError ? (
          <EmptyState
            icon={FiLayers}
            title="No services yet"
            action={
              <button type="button" className="btn btn-primary" onClick={() => openForm(null)}>
                <FiPlus aria-hidden="true" /> Add your first service
              </button>
            }
          >
            The services sections are hidden on the website until you add a service.
          </EmptyState>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th className="col-order">Order</th>
                  <th>Service</th>
                  <th>Summary</th>
                  <th>Highlights</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={service.id}>
                    <td className="col-order">
                      <div className="order-cell">
                        <span className="order-number">{number(index)}</span>
                        <div className="order-buttons">
                          <button
                            type="button"
                            className="icon-btn icon-btn-sm"
                            onClick={() => move(index, -1)}
                            disabled={index === 0 || reordering}
                            aria-label={`Move ${service.title} up`}
                            title="Move up"
                          >
                            <FiArrowUp aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="icon-btn icon-btn-sm"
                            onClick={() => move(index, 1)}
                            disabled={index === services.length - 1 || reordering}
                            aria-label={`Move ${service.title} down`}
                            title="Move down"
                          >
                            <FiArrowDown aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="service-cell">
                        <div className="cell-title">{service.title}</div>
                        {service.tag && <span className="badge badge-blue">{service.tag}</span>}
                      </div>
                    </td>
                    <td>
                      <div className="clamp-2 cell-message">{service.summary}</div>
                    </td>
                    <td>
                      {service.specs && service.specs.length > 0 ? (
                        <div className="pill-list">
                          {service.specs.map((spec) => (
                            <span className="badge badge-gray" key={spec}>
                              {spec}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="is-muted">—</span>
                      )}
                      <div className="cell-sub">
                        {(service.features || []).length} key {(service.features || []).length === 1 ? 'point' : 'points'}
                      </div>
                    </td>
                    <td className="col-actions">
                      <div className="row-actions">
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => openForm(service)}>
                          <FiEdit2 aria-hidden="true" /> Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger-soft btn-sm"
                          onClick={() => setDeleteTarget(service)}
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
        )}

        {!loading && services.length > 0 && (
          <div className="card-foot">
            {services.length} {services.length === 1 ? 'service' : 'services'} · The website shows them in this order.
          </div>
        )}
      </section>

      {editing && (
        <Modal title={isEdit ? 'Edit service' : 'Add service'} onClose={closeForm} busy={saving} size="lg">
          <form onSubmit={handleSave}>
            <div className="modal-body">
              {formError && <Alert type="danger">{formError}</Alert>}

              <div className="field-row">
                <div className="field">
                  <label htmlFor="service-title">
                    Service name <span className="req">*</span>
                  </label>
                  <input
                    id="service-title"
                    type="text"
                    className="input"
                    value={form.title}
                    onChange={setField('title')}
                    placeholder="e.g. MS Powder Coating"
                    maxLength={80}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="service-tag">
                    Tag <span className="label-hint">(small label on the card)</span>
                  </label>
                  <input
                    id="service-tag"
                    type="text"
                    className="input"
                    value={form.tag}
                    onChange={setField('tag')}
                    placeholder="e.g. Mild Steel"
                    maxLength={40}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="service-summary">
                  Short summary <span className="req">*</span> <span className="label-hint">(home page card)</span>
                </label>
                <textarea
                  id="service-summary"
                  className="input textarea"
                  rows="3"
                  value={form.summary}
                  onChange={setField('summary')}
                  placeholder="Two or three lines describing the service"
                  maxLength={400}
                  required
                />
                <p className="help">{form.summary.length}/400 characters</p>
              </div>

              <div className="field">
                <label htmlFor="service-description">
                  Full description <span className="label-hint">(Services page; leave empty to reuse the summary)</span>
                </label>
                <textarea
                  id="service-description"
                  className="input textarea"
                  rows="4"
                  value={form.description}
                  onChange={setField('description')}
                  placeholder="A fuller explanation of the service"
                  maxLength={1500}
                />
                <p className="help">
                  To make words bold, wrap them like this: &lt;strong&gt;250 to 500 microns&lt;/strong&gt;
                </p>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="service-specs">
                    Highlights <span className="label-hint">(home page, one per line, up to 6)</span>
                  </label>
                  <textarea
                    id="service-specs"
                    className="input textarea"
                    rows="4"
                    value={form.specs}
                    onChange={setField('specs')}
                    placeholder={'Uniform 60-100 Microns\n7-Tank Treated'}
                  />
                </div>

                <div className="field">
                  <label htmlFor="service-features">
                    Key points <span className="label-hint">(Services page, one per line, up to 8)</span>
                  </label>
                  <textarea
                    id="service-features"
                    className="input textarea"
                    rows="4"
                    value={form.features}
                    onChange={setField('features')}
                    placeholder={'Pre-treated through our 7-tank immersion system.\nUniform dry film thickness of 60 to 100 microns.'}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="service-button">
                  Enquiry button text <span className="label-hint">(optional)</span>
                </label>
                <input
                  id="service-button"
                  type="text"
                  className="input"
                  value={form.buttonLabel}
                  onChange={setField('buttonLabel')}
                  placeholder={form.title.trim() ? `Enquire about ${form.title.trim()}` : 'e.g. Enquire for MS Coating'}
                  maxLength={60}
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
                    <FiCheck aria-hidden="true" /> {isEdit ? 'Save changes' : 'Add service'}
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete service?"
          message={
            <>
              <strong>{deleteTarget.title}</strong> will be removed from the home page, the Services page, the footer
              and the quote form. This cannot be undone.
            </>
          }
          confirmLabel="Delete service"
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </AdminLayout>
  );
}
