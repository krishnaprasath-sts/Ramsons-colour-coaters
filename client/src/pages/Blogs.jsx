import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleRight, FaSpinner, FaRegClock, FaArrowRight } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RevealText from '../components/ui/RevealText';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Industry Articles & Insights | Ramson Colour Coaters Coimbatore';
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBlogs(data.blogs);
        }
      })
      .catch((err) => console.error('Error fetching blogs:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />

      {/* Modern Page Hero Banner */}
      <div
        className="inner-hero-banner"
        style={{
          backgroundImage: "url('/images/ramson _ banner 5.jpg')",
        }}
      >
        <div className="container inner-hero-content">
          <h1 className="inner-hero-title"><RevealText text="Technical Blogs & Insights" delay={100} /></h1>
          <div className="breadcrumb-modern">
            <Link to="/Home">Home</Link>
            <FaAngleRight />
            <span>Blogs</span>
          </div>
        </div>
      </div>

      <section style={{ backgroundColor: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Knowledge Base</span>
            <h2 className="section-title"><RevealText text="Surface Finishing Insights" /></h2>
            <p className="section-subtitle">
              Learn about pre-treatment chemistry, powder specifications, testing standards, and best practices for metal protection.
            </p>
          </div>

          <div className="row">
            {loading ? (
              <div className="col-12 text-center py-5">
                <FaSpinner className="icon-spin text-primary mb-3" size={28} />
                <p className="text-muted">Loading articles...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p className="text-muted">No blog articles published yet. Please check back soon!</p>
              </div>
            ) : (
              blogs.map((blog) => (
                <div className="col-lg-4 col-md-6 mb-4" key={blog.id}>
                  <div className="blog-card-modern">
                    <div className="blog-card-img-wrap">
                      <img
                        src={`/uploads/${blog.image}`}
                        className="blog-card-img"
                        alt={blog.title}
                        onError={(e) => {
                          e.target.src = '/images/banner-1.jpeg';
                        }}
                      />
                    </div>
                    <div className="blog-card-body">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge badge-primary px-2 py-1" style={{ fontSize: '11px', fontWeight: '600' }}>
                          Powder Coating
                        </span>
                        <span className="small text-muted d-inline-flex align-items-center">
                          <FaRegClock className="mr-1" /> 3 min read
                        </span>
                      </div>
                      <h4>{blog.title}</h4>
                      <div
                        className="small text-muted mb-3"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: '1.6',
                        }}
                        dangerouslySetInnerHTML={{
                          __html: (blog.description || '').replace(/<[^>]+>/g, '').substring(0, 140) + '...',
                        }}
                      />
                      <Link to={`/viewblog/${blog.id}`} className="blog-card-link">
                        <span>Read Full Article</span>
                        <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
