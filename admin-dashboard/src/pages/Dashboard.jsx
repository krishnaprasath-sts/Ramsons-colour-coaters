import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight, FiFileText, FiImage, FiInbox } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import { Alert, EmptyState, LoadingState } from '../components/ui';
import { api, formatDate, getAdminName, initials, parseDate } from '../lib/api';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const [stats, setStats] = useState({ blogs: 0, enquiries: 0, banners: 0, newThisWeek: 0, recent: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    Promise.all([api('/api/blogs'), api('/api/contact/all'), api('/api/banners')])
      .then(([blogsData, contactsData, bannersData]) => {
        if (cancelled) return;
        const contacts = contactsData.contacts || [];
        const weekAgo = Date.now() - WEEK_MS;
        setStats({
          blogs: (blogsData.blogs || []).length,
          enquiries: contacts.length,
          banners: (bannersData.banners || []).length,
          newThisWeek: contacts.filter((c) => {
            const date = parseDate(c.created_at);
            return date && date.getTime() >= weekAgo;
          }).length,
          recent: contacts.slice(0, 6),
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      to: '/enquiries',
      label: 'Customer enquiries',
      value: stats.enquiries,
      note: `${stats.newThisWeek} new in the last 7 days`,
      icon: FiInbox,
      tone: 'blue',
    },
    {
      to: '/home-images',
      label: 'Home page banners',
      value: stats.banners,
      note: 'Slides in the hero carousel',
      icon: FiImage,
      tone: 'teal',
    },
    {
      to: '/blogs',
      label: 'Published articles',
      value: stats.blogs,
      note: 'Live on the Blogs page',
      icon: FiFileText,
      tone: 'amber',
    },
  ];

  return (
    <AdminLayout
      title={`${greeting()}, ${getAdminName()}`}
      subtitle="Here is what is happening on the Ramson Colour Coaters website."
    >
      {error && <Alert type="danger">{error}</Alert>}

      <div className="stat-grid">
        {cards.map(({ to, label, value, note, icon: Icon, tone }) => (
          <Link key={to} to={to} className="stat-card">
            <span className={`stat-icon tone-${tone}`} aria-hidden="true">
              <Icon />
            </span>
            <span className="stat-body">
              <span className="stat-label">{label}</span>
              <span className="stat-value">{loading ? '–' : value}</span>
              <span className="stat-note">{loading ? 'Loading...' : note}</span>
            </span>
            <FiArrowUpRight className="stat-arrow" aria-hidden="true" />
          </Link>
        ))}
      </div>

      <section className="card">
        <div className="card-head">
          <div>
            <h2>Latest enquiries</h2>
            <p>The most recent messages from the contact form and quote popup.</p>
          </div>
          <Link to="/enquiries" className="btn btn-ghost btn-sm">
            View all <FiArrowRight aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <LoadingState label="Loading enquiries..." />
        ) : stats.recent.length === 0 ? (
          <EmptyState icon={FiInbox} title="No enquiries yet">
            When a visitor submits the contact form or asks for a quote, it will appear here.
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
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((enq) => (
                  <tr key={enq.id}>
                    <td>
                      <div className="person">
                        <span className="avatar avatar-soft" aria-hidden="true">
                          {initials(enq.name)}
                        </span>
                        <div>
                          <div className="cell-title">{enq.name}</div>
                          <div className="cell-sub">{enq.companyname || 'Individual'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${enq.email}`} className="link">
                        {enq.email}
                      </a>
                      {enq.phone && <div className="cell-sub">{enq.phone}</div>}
                    </td>
                    <td>
                      <span className={`badge ${enq.source === 'Get a Quote Popup' ? 'badge-blue' : 'badge-gray'}`}>
                        {enq.source === 'Get a Quote Popup'
                          ? 'Quote request'
                          : !enq.source || enq.source === 'Contact Form'
                            ? 'Contact form'
                            : enq.source}
                      </span>
                    </td>
                    <td>
                      <div className="clamp-1 cell-message">{enq.message || '—'}</div>
                    </td>
                    <td className="nowrap cell-sub">{formatDate(enq.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
