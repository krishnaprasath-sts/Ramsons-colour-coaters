import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleRight, FaRegClock, FaArrowRight } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RevealText from '../components/ui/RevealText';
import FadeImage from '../components/ui/FadeImage';
import useApiJson from '../hooks/useApiJson';
import { apiUrl } from '../lib/api';

export default function Blogs() {
  const { data, loading } = useApiJson('/api/blogs');
  const blogs = data && Array.isArray(data.blogs) ? data.blogs : [];

  useEffect(() => {
    document.title = 'Industry Articles & Insights | Ramson Colour Coaters Coimbatore';
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
              // Placeholder cards with the same shape as the real ones, so nothing jumps
              [0, 1, 2].map((n) => (
                <div className="col-lg-4 col-md-6 mb-4" key={n} aria-hidden="true">
                  <div className="blog-card-modern">
                    <div className="blog-card-img-wrap skeleton-block" style={{ borderRadius: 0 }} />
                    <div className="blog-card-body">
                      <span className="skeleton-block skeleton-line" style={{ width: '35%' }} />
                      <span className="skeleton-block skeleton-line" style={{ width: '90%', height: '20px' }} />
                      <span className="skeleton-block skeleton-line" style={{ width: '100%' }} />
                      <span className="skeleton-block skeleton-line" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>
              ))
            ) : blogs.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p className="text-muted">No blog articles published yet. Please check back soon!</p>
              </div>
            ) : (
              blogs.map((blog) => (
                <div className="col-lg-4 col-md-6 mb-4" key={blog.id}>
                  <div className="blog-card-modern">
                    <div className="blog-card-img-wrap">
                      <FadeImage
                        src={apiUrl(`/uploads/${blog.image}`)}
                        fallbackSrc="/images/banner-1.jpeg"
                        className="blog-card-img"
                        alt={blog.title}
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
