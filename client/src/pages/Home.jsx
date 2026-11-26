import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHistory,
  FaFlask,
  FaArrowsAlt,
  FaLeaf,
  FaCheckCircle,
  FaArrowRight,
  FaUsers,
  FaAngleRight,
  FaBriefcase,
  FaCheckSquare,
  FaBuilding,
  FaPhoneAlt,
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import RevealText from '../components/ui/RevealText';
import useServices, { serviceNumber } from '../hooks/useServices';

export default function Home() {
  // Services are managed in the admin panel (Services page)
  const { services, loading: servicesLoading } = useServices();

  useEffect(() => {
    document.title = 'Ramson Colour Coaters | Powder Coating Service Provider in Coimbatore, India';
  }, []);

  return (
    <>
      <Header />
      <Carousel />

      {/* Stats Highlight Strip */}
      <section className="stats-strip py-0">
        <div className="container">
          <div className="stats-card-wrap">
            <div className="row">
              <div className="col-lg-3 col-sm-6 mb-3 mb-lg-0">
                <div className="stat-item">
                  <div className="stat-icon">
                    <FaHistory />
                  </div>
                  <div className="stat-content">
                    <h3>20+ Years</h3>
                    <p>Proven Experience</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 mb-3 mb-lg-0">
                <div className="stat-item">
                  <div className="stat-icon">
                    <FaFlask />
                  </div>
                  <div className="stat-content">
                    <h3>7-Tank</h3>
                    <p>Pre-treatment System</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 mb-3 mb-sm-0">
                <div className="stat-item">
                  <div className="stat-icon">
                    <FaArrowsAlt />
                  </div>
                  <div className="stat-content">
                    <h3>25 Ft</h3>
                    <p>Large Curing Ovens</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="stat-item">
                  <div className="stat-icon">
                    <FaLeaf />
                  </div>
                  <div className="stat-content">
                    <h3>100%</h3>
                    <p>Eco-Friendly ETP Facility</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome & Company Overview */}
      <section className="py-5" style={{ marginTop: '30px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <span className="section-badge">Welcome to Ramson Colour Coaters</span>
              <h2 className="section-title text-left mb-3">
                <RevealText text="Coimbatore's Premier Powder Coating Facility" />
              </h2>
              <p className="paragraph-tag text-muted mb-4">
                Ramson Colour Coaters is one of the largest and most technically advanced powder coating service providers in Coimbatore. Established in 2002, we specialize in high-durability surface coatings for MS fabrications, castings, and aluminium extrusions.
              </p>

              <div className="mb-4">
                <div className="checklist-item">
                  <FaCheckCircle />
                  <span><strong>Imported Swiss &amp; Turkish Application Guns</strong> ensuring uniform micron thickness.</span>
                </div>
                <div className="checklist-item">
                  <FaCheckCircle />
                  <span><strong>Strict 7-Tank MS &amp; 4-Tank Chromating Pretreatment</strong> ensuring zero blistering or peeling.</span>
                </div>
                <div className="checklist-item">
                  <FaCheckCircle />
                  <span><strong>Large Industrial Curing Ovens (up to 25ft)</strong> for heavy and oversized fabrications.</span>
                </div>
                <div className="checklist-item">
                  <FaCheckCircle />
                  <span><strong>Comprehensive In-House Testing</strong> for adhesion, gloss, thickness, and impact resistance.</span>
                </div>
              </div>

              <div className="d-flex gap-3">
                <Link to="/About" className="btn btn-hero-primary mr-3">
                  <span>Our Story</span>
                  <FaArrowRight />
                </Link>
                <Link to="/Contact" className="btn btn-outline-primary" style={{ padding: '12px 24px', borderRadius: '50px', fontWeight: '700' }}>
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="about-preview-img-wrap">
                <img
                  src="/images/w6.jpg"
                  className="about-preview-img"
                  alt="Ramson Coating Facility"
                  loading="lazy"
                  decoding="async"
                />
                <div className="about-float-badge">
                  <h4>5x Growth</h4>
                  <p>Over 20,000 sq.ft state-of-the-art facility</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Highlights / Feature Cards */}
      <section style={{ backgroundColor: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Core Pillars</span>
            <h2 className="section-title"><RevealText text="What Defines Our Excellence" /></h2>
            <p className="section-subtitle">
              From small intricate components to heavy fabrication assemblies, our end-to-end infrastructure delivers unmatched finish and longevity.
            </p>
          </div>

          <div className="row">
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="feature-card-modern">
                <div>
                  <div className="feature-icon-circle">
                    <FaUsers />
                  </div>
                  <h3 className="feature-card-title">About Us</h3>
                  <p className="feature-card-desc">
                    Serving top fabrication companies, foundries, and engineering firms across Tamil Nadu with 20+ years of dedicated expertise.
                  </p>
                </div>
                <Link to="/About" className="feature-btn">
                  <span>Read Full Story</span>
                  <FaAngleRight />
                </Link>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="feature-card-modern">
                <div>
                  <div className="feature-icon-circle">
                    <FaBriefcase />
                  </div>
                  <h3 className="feature-card-title">Services</h3>
                  <p className="feature-card-desc">
                    Specialized MS powder coating, heavy-duty fusion bonding, and precision aluminium extrusions &amp; casting coatings.
                  </p>
                </div>
                <Link to="/Services" className="feature-btn">
                  <span>Explore Services</span>
                  <FaAngleRight />
                </Link>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="feature-card-modern">
                <div>
                  <div className="feature-icon-circle">
                    <FaCheckSquare />
                  </div>
                  <h3 className="feature-card-title">Why Choose Us?</h3>
                  <p className="feature-card-desc">
                    Guaranteed coating thickness, zero powder wastage booths, customized chemical bath prep, and fast turnaround.
                  </p>
                </div>
                <Link to="/About" className="feature-btn">
                  <span>5 Key Reasons</span>
                  <FaAngleRight />
                </Link>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="feature-card-modern">
                <div>
                  <div className="feature-icon-circle">
                    <FaBuilding />
                  </div>
                  <h3 className="feature-card-title">Infrastructure</h3>
                  <p className="feature-card-desc">
                    Spread over half an acre with 3 large ovens, walk-in booths, Swiss GEMA equipment, and Pollution Control Board approved ETP.
                  </p>
                </div>
                <Link to="/infrastructure" className="feature-btn">
                  <span>View Equipment</span>
                  <FaAngleRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Section (content comes from the admin panel) */}
      {(servicesLoading || services.length > 0) && (
        <section>
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Our Capabilities</span>
              <h2 className="section-title"><RevealText text="Specialized Coating Solutions" /></h2>
              <p className="section-subtitle">
                Engineered surface protection tailored for your exact component specifications.
              </p>
            </div>

            <div className="row justify-content-center">
              {servicesLoading
                ? [0, 1, 2, 3].map((n) => (
                    <div className="col-lg-6 mb-4" key={n}>
                      <div className="service-card-modern service-card-skeleton" aria-hidden="true" />
                    </div>
                  ))
                : services.map((service, index) => (
                    <div className="col-lg-6 mb-4" key={service.id}>
                      <div className="service-card-modern">
                        <div className="service-card-top">
                          <span className="service-number-pill">{serviceNumber(index)}</span>
                          {service.tag && <span className="service-tag">{service.tag}</span>}
                        </div>
                        <h4>{service.title}</h4>
                        <p>{service.summary}</p>
                        {service.specs && service.specs.length > 0 && (
                          <div>
                            {service.specs.map((spec) => (
                              <span className="service-spec-pill mr-2" key={spec}>{spec}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
            </div>

            <div className="text-center mt-3">
              <Link to="/Services" className="btn btn-hero-primary">
                <span>View All Service Specifications</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Modern High-Impact CTA Section */}
      <section className="modern-cta-section">
        <div className="container">
          <div className="modern-cta-card text-center">
            <h2 className="cta-headline mx-auto" style={{ maxWidth: '820px' }}>
              <RevealText text="Ready to Protect & Beautify Your Metal Fabrications?" />
            </h2>
            <p className="cta-subtext mx-auto mb-4" style={{ maxWidth: '720px' }}>
              Partner with Coimbatore's leading powder coating specialists. Get custom RAL shade matching, specialized chemical pre-treatment, and high-durability finishes delivered on schedule.
            </p>

            <div className="d-flex justify-content-center align-items-center flex-wrap gap-3 mt-4">
              <Link to="/Contact" className="btn-cta-white mr-sm-3 mb-2 mb-sm-0">
                <span>Request a Free Quote</span>
                <FaArrowRight className="ml-2" />
              </Link>

              <a href="tel:+916381156460" className="btn-cta-call mb-2 mb-sm-0">
                <FaPhoneAlt className="mr-2" />
                <span>Call +91 6381156460</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
