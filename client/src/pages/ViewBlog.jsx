import React, { useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  FaAngleRight,
  FaArrowLeft,
  FaRegCalendarAlt,
  FaShareAlt,
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FadeImage from '../components/ui/FadeImage';
import useApiJson from '../hooks/useApiJson';
import { apiUrl, peekJson } from '../lib/api';

export default function ViewBlog() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const blogId = params.id || searchParams.get('id');

  const { data, loading: requestLoading, error: requestError } = useApiJson(blogId ? `/api/blogs/${blogId}` : null);

  // Coming from the Blogs page the article is already known, so it is shown without waiting
  const listed = !data && requestLoading
    ? (peekJson('/api/blogs')?.blogs || []).find((item) => String(item.id) === String(blogId))
    : null;
  const blog = (data && data.blog) || listed || null;
  const loading = requestLoading && !blog;
  const error = !blogId
    ? 'Blog ID not provided'
    : requestError && !blog
      ? (requestError.offline ? 'Error loading blog content' : 'Article not found')
      : null;

  const blogTitle = blog ? blog.title : '';
  useEffect(() => {
    document.title = blogTitle ? `${blogTitle} | Ramson Colour Coaters` : 'Ramson Colour Coaters - Blog Details';
  }, [blogTitle]);

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
                // Placeholder with the article's shape, so the page does not jump when it arrives
                <div
                  className="card shadow-sm border-0 p-4 p-md-5"
                  style={{ borderRadius: '16px', background: '#fff' }}
                  aria-busy="true"
                  aria-label="Loading article"
                >
                  <span className="skeleton-block skeleton-line" style={{ width: '30%' }} />
                  <span className="skeleton-block mb-4" style={{ width: '80%', height: '34px' }} />
                  <span className="skeleton-block mb-4" style={{ width: '100%', height: '360px', borderRadius: '12px' }} />
                  <span className="skeleton-block skeleton-line" style={{ width: '100%' }} />
                  <span className="skeleton-block skeleton-line" style={{ width: '96%' }} />
                  <span className="skeleton-block skeleton-line" style={{ width: '88%' }} />
                  <span className="skeleton-block skeleton-line" style={{ width: '60%' }} />
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

                  {/* The grey box holds the image's place while it loads */}
                  <div
                    className="mb-4 text-center"
                    style={{
                      aspectRatio: '16 / 9',
                      maxHeight: '480px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: 'var(--gray-100)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  >
                    <FadeImage
                      src={apiUrl(`/uploads/${blog.image}`)}
                      fallbackSrc="/images/banner-1.jpeg"
                      loading="eager"
                      alt={blog.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
