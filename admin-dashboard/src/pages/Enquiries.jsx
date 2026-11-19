import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiEye, FiInbox, FiMail, FiPhone, FiRefreshCw, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import { Alert, ConfirmDialog, EmptyState, LoadingState, Modal, useToast } from '../components/ui';
import { api, formatDate, formatDateTime, initials } from '../lib/api';

const QUOTE_SOURCE = 'Get a Quote Popup';
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'quote', label: 'Quote requests' },
  { key: 'contact', label: 'Contact form' },
];

const isQuote = (enq) => enq.source === QUOTE_SOURCE;
const sourceLabel = (enq) => {
  if (isQuote(enq)) return 'Quote request';
  return !enq.source || enq.source === 'Contact Form' ? 'Contact form' : enq.source;
};

export default function Enquiries() {
  const notify = useToast();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewing, setViewing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEnquiries = useCallback(() => {
    setLoading(true);
    setLoadError('');
    api('/api/contact/all')
      .then((data) => setEnquiries(data.contacts || []))
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const counts = useMemo(
    () => ({
      all: enquiries.length,
      quote: enquiries.filter(isQuote).length,
      contact: enquiries.filter((e) => !isQuote(e)).length,
    }),
    [enquiries]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enquiries.filter((item) => {
      if (filter === 'quote' && !isQuote(item)) return false;
      if (filter === 'contact' && isQuote(item)) return false;
      if (!q) return true;
      return [item.name, item.email, item.phone, item.companyname, item.source, item.message].some((value) =>
        String(value || '').toLowerCase().includes(q)
      );
    });
  }, [enquiries, search, filter]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api(`/api/contact/${deleteTarget.id}`, { method: 'DELETE' });
      setEnquiries((list) => list.filter((item) => item.id !== deleteTarget.id));
      notify(`Enquiry from ${deleteTarget.name} deleted.`);
      setDeleteTarget(null);
      setViewing(null);
    } catch (err) {
      notify(err.message, 'danger');
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters = search.trim() !== '' || filter !== 'all';

  return (
    <AdminLayout
      title="Enquiries"
      subtitle="Messages sent from the Contact page and the Get a Quote popup."
      actions={
        <button type="button" className="btn btn-ghost" onClick={fetchEnquiries} disabled={loading}>
          <FiRefreshCw className={loading ? 'spin' : ''} aria-hidden="true" /> Refresh
        </button>
      }
    >
      {loadError && <Alert type="danger">{loadError}</Alert>}

      <section className="card">
        <div className="toolbar">
          <div className="segmented" role="group" aria-label="Filter enquiries by source">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`segment ${filter === key ? 'is-active' : ''}`}
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
              >
                {label} <span className="segment-count">{counts[key]}</span>
              </button>
            ))}
          </div>

          <div className="search">
            <FiSearch className="search-icon" aria-hidden="true" />
            <input
              type="search"
              className="input has-icon"
              placeholder="Search enquiries..."
              aria-label="Search enquiries"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <LoadingState label="Loading enquiries..." />
        ) : enquiries.length === 0 && !loadError ? (
          <EmptyState icon={FiInbox} title="No enquiries yet">
            When a visitor submits the contact form or asks for a quote, it will appear here.
          </EmptyState>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FiSearch}
            title="No matching enquiries"
            action={
              hasFilters && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setSearch('');
                    setFilter('all');
                  }}
                >
                  <FiX aria-hidden="true" /> Clear filters
                </button>
              )
            }
          >
            Try a different search term or filter.
          </EmptyState>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Source</th>
                  <th>Message</th>
                  <th>Received</th>
                  <th className="col-actions">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((enq) => (
                  <tr key={enq.id}>
                    <td>
                      <div className="person">
                        <span className="avatar avatar-soft" aria-hidden="true">
                          {initials(enq.name)}
                        </span>
                        <div>
                          <button type="button" className="cell-title name-btn" onClick={() => setViewing(enq)}>
                            {enq.name}
                          </button>
                          <div className="cell-sub">{enq.companyname || 'Individual'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${enq.email}`} className="link contact-line">
                        <FiMail aria-hidden="true" /> {enq.email}
                      </a>
                      {enq.phone && (
                        <a href={`tel:${enq.phone}`} className="link link-muted contact-line">
                          <FiPhone aria-hidden="true" /> {enq.phone}
                        </a>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${isQuote(enq) ? 'badge-blue' : 'badge-gray'}`}>{sourceLabel(enq)}</span>
                    </td>
                    <td>
                      <div className="clamp-2 cell-message">
                        {enq.message || <span className="is-muted">No message provided</span>}
                      </div>
                    </td>
                    <td className="nowrap cell-sub">{formatDate(enq.created_at)}</td>
                    <td className="col-actions">
                      <div className="row-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => setViewing(enq)}
                          aria-label={`View enquiry from ${enq.name}`}
                          title="View details"
                        >
                          <FiEye aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn-danger"
                          onClick={() => setDeleteTarget(enq)}
                          aria-label={`Delete enquiry from ${enq.name}`}
                          title="Delete enquiry"
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

        {!loading && filtered.length > 0 && (
          <div className="card-foot">
            Showing {filtered.length} of {enquiries.length} {enquiries.length === 1 ? 'enquiry' : 'enquiries'}
          </div>
        )}
      </section>

      {viewing && !deleteTarget && (
        <Modal
          title={`Enquiry #${viewing.id}`}
          onClose={() => setViewing(null)}
          footer={
            <>
              <button type="button" className="btn btn-danger-soft" onClick={() => setDeleteTarget(viewing)}>
                <FiTrash2 aria-hidden="true" /> Delete
              </button>
              <span className="footer-spacer" />
              {viewing.phone && (
                <a href={`tel:${viewing.phone}`} className="btn btn-ghost">
                  <FiPhone aria-hidden="true" /> Call
                </a>
              )}
              <a
                href={`mailto:${viewing.email}?subject=${encodeURIComponent('Re: Your enquiry to Ramson Colour Coaters')}`}
                className="btn btn-primary"
              >
                <FiMail aria-hidden="true" /> Reply by email
              </a>
            </>
          }
        >
          <div className="modal-body">
            <div className="person person-lg">
              <span className="avatar avatar-soft avatar-lg" aria-hidden="true">
                {initials(viewing.name)}
              </span>
              <div>
                <div className="cell-title">{viewing.name}</div>
                <div className="cell-sub">{viewing.companyname || 'Individual'}</div>
              </div>
              <span className={`badge ${isQuote(viewing) ? 'badge-blue' : 'badge-gray'}`}>{sourceLabel(viewing)}</span>
            </div>

            <dl className="detail-list">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${viewing.email}`} className="link">
                    {viewing.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  {viewing.phone ? (
                    <a href={`tel:${viewing.phone}`} className="link">
                      {viewing.phone}
                    </a>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div>
                <dt>Received</dt>
                <dd>{formatDateTime(viewing.created_at)}</dd>
              </div>
            </dl>

            <div className="message-box">
              <div className="message-box-label">Message</div>
              <p>{viewing.message || 'No message provided.'}</p>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete enquiry?"
          message={
            <>
              The enquiry from <strong>{deleteTarget.name}</strong> will be permanently removed. This cannot be undone.
            </>
          }
          details={
            <>
              <div>
                <strong>Email:</strong> {deleteTarget.email}
              </div>
              {deleteTarget.phone && (
                <div>
                  <strong>Phone:</strong> {deleteTarget.phone}
                </div>
              )}
            </>
          }
          confirmLabel="Delete enquiry"
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </AdminLayout>
  );
}
