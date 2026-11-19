import React, { useState, useEffect } from 'react';
import { FaBook } from 'react-icons/fa';
import AdminLayout from './AdminLayout';

export default function DashboardHome() {
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.blogs) {
          setTotalBlogs(data.blogs.length);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard | Ramson Colour Coaters">
      <div className="row">
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
          <div className="card shadow-sm border-0" style={{ borderRadius: '10px' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '13px' }}>
                    Total Blogs
                  </h6>
                  <h2 className="mb-0 font-weight-bold" style={{ color: '#168ac9' }}>
                    {loading ? '...' : totalBlogs}
                  </h2>
                </div>
                <div style={{ backgroundColor: '#eaf4fc', padding: '16px', borderRadius: '50%' }}>
                  <FaBook size={28} style={{ color: '#168ac9' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
