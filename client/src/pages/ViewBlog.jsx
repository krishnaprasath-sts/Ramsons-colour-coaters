import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  FaAngleRight,
  FaSpinner,
  FaArrowLeft,
  FaRegCalendarAlt,
  FaShareAlt,
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ViewBlog() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const blogId = params.id || searchParams.get('id');

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Ramson Colour Coaters - Blog Details';
    if (!blogId) {
      setError('Blog ID not provided');
      setLoading(false);
      return;
    }

    fetch(`/api/blogs/${blogId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.blog) {
          setBlog(data.blog);
          document.title = `${data.blog.title} | Ramson Colour Coaters`;
        } else {
          setError('Article not found');
        }
      })
      .catch((err) => {
        console.error('Error fetching blog:', err);
        setError('Error loading blog content');
      })
      .finally(() => setLoading(false));
  }, [blogId]);

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
          <h1 className="inner-hero-title">
            {blog ? blog.title : 'Article Details'}
          </h1>
          <div className="breadcrumb-modern">
            <Link to="/Home">Home</Link>
            <FaAngleRight />
            <Link to="/Blogs">Blogs</Link>
            <FaAngleRight />
            <span>{blog ? blog.title : 'Details'}</span>
          </div>
        </div>
      </div>

      <section style={{ backgroundColor: 'var(--gray-50)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              {loading ? (
                <div className="text-center py-5">
                  <FaSpinner className="icon-spin text-primary mb-3" size={28} />
                  <p className="text-muted">Loading article details...</p>
                </div>
              ) : error || !blog ? (
                <div className="card shadow-sm border-0 p-5 text-center" style={{ borderRadius: '16px' }}>
                  <h4>{error || 'Article not found'}</h4>
                  <p className="text-muted">The requested blog post could not be located.</p>
                  <div className="mt-3">
                    <Link to="/Blogs" className="btn btn-primary">
                      <FaArrowLeft className="mr-2" /> Back to All Articles
                    </Link>
                  </div>
                </div>
              ) : (
                <div
                  className="card shadow-sm border-0 p-4 p-md-5"
                  style={{ borderRadius: '16px', background: '#fff' }}
                >
                  <div className="mb-3 d-flex align-items-center gap-2">
                    <span className="badge badge-primary px-3 py-1 font-weight-bold">
                      Technical Article
                    </span>
                    <span className="text-muted small ml-3">
                      <FaRegCalendarAlt className="mr-1" /> Published by Ramson Technical Team
                    </span>
                  </div>

                  <h2 className="font-weight-bold mb-4" style={{ fontSize: '32px', color: 'var(--gray-900)' }}>
                    {blog.title}
                  </h2>

                  <div className="mb-4 text-center">
                    <img
                      src={`/uploads/${blog.image}`}
                      className="img-fluid"
                      alt={blog.title}
                      style={{
                        maxHeight: '480px',
                        width: '100%',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-md)',
                      }}
                      onError={(e) => {
                        e.target.src = '/images/banner-1.jpeg';
                      }}
                    />
                  </div>

                  <div
                    className="blog-content-body mt-4 text-justify"
                    style={{
                      fontSize: '17px',
                      lineHeight: '1.85',
                      color: 'var(--gray-700)',
                    }}
                    dangerouslySetInnerHTML={{ __html: blog.description }}
                  />

                  {/* Post-reading CTA card */}
                  <div
                    className="mt-5 p-4 rounded text-white"
                    style={{
                      background: 'var(--primary-gradient)',
                      borderRadius: '12px',
                    }}
                  >
                    <div className="row align-items-center">
                      <div className="col-md-8 mb-3 mb-md-0">
                        <h5 className="font-weight-bold mb-1 text-white">Have questions about this coating process?</h5>
                        <p className="small mb-0 text-white">Speak with our coating engineers for customized substrate treatment.</p>
                      </div>
                      <div className="col-md-4 text-md-right">
                        <Link to="/Contact" className="btn btn-light btn-sm font-weight-bold px-3 py-2 text-primary">
                          Contact Engineers
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                    <Link to="/Blogs" className="btn btn-outline-secondary btn-sm">
                      <FaArrowLeft className="mr-1" /> Back to All Articles
                    </Link>
                    <a
                      href={`https://wa.me/?text=Check%20out%20this%20article:%20${encodeURIComponent(blog.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-success text-white"
                    >
                      <FaShareAlt className="mr-1" /> Share on WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
