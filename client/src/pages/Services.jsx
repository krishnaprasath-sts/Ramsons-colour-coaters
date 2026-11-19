import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleRight, FaCheck, FaArrowRight, FaPhoneAlt } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RevealText from '../components/ui/RevealText';
import RichText from '../components/ui/RichText';
import useServices, { serviceNumber } from '../hooks/useServices';

export default function Services() {
  // Services are managed in the admin panel (Services page)
  const { services, loading: servicesLoading } = useServices();

  useEffect(() => {
    document.title = 'Powder Coating Services | MS, Fusion Bonding, Aluminium | Ramson Colour Coaters';
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
          <h1 className="inner-hero-title"><RevealText text="Our Services" delay={100} /></h1>
          <div className="breadcrumb-modern">
            <Link to="/Home">Home</Link>
            <FaAngleRight />
            <span>Services</span>
          </div>
        </div>
      </div>

      {/* Intro Overview */}
      <section>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <span className="section-badge">Precision Engineering</span>
              <h2 className="section-title"><RevealText text="End-to-End Surface Finishing Excellence" /></h2>
              <p className="paragraph-tag text-muted" style={{ fontSize: '18px', lineHeight: '1.8' }}>
                We provide state-of-the-art powder coating quality for industrial products made of cast aluminium, Grey Cast Iron, aluminium profiles, and mild steel fabrications. Every component undergoes tailored chemical pre-treatment developed by us to match metal alloy composition, ensuring maximum adhesion, impact resistance, and corrosion defense.
              </p>
            </div>
          </div>

          {/* Process Timeline Strip */}
          <div className="row mt-5 mb-4">
            <div className="col-lg-3 col-sm-6 mb-3">
              <div className="p-4 text-center bg-light rounded" style={{ border: '1px solid var(--gray-200)' }}>
                <div className="mb-2 text-primary font-weight-bold" style={{ fontSize: '24px' }}>01</div>
                <h5 className="font-weight-bold mb-1">Pre-treatment</h5>
                <p className="small text-muted mb-0">Degreasing, Derusting, Phosphating / Chromating</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 mb-3">
              <div className="p-4 text-center bg-light rounded" style={{ border: '1px solid var(--gray-200)' }}>
                <div className="mb-2 text-primary font-weight-bold" style={{ fontSize: '24px' }}>02</div>
                <h5 className="font-weight-bold mb-1">Powder Spray</h5>
                <p className="small text-muted mb-0">Swiss GEMA Electrostatic Guns for Uniform Cover</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 mb-3">
              <div className="p-4 text-center bg-light rounded" style={{ border: '1px solid var(--gray-200)' }}>
                <div className="mb-2 text-primary font-weight-bold" style={{ fontSize: '24px' }}>03</div>
                <h5 className="font-weight-bold mb-1">Thermal Curing</h5>
                <p className="small text-muted mb-0">Uniform Temperature in 25ft Diesel Ovens</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 mb-3">
              <div className="p-4 text-center bg-light rounded" style={{ border: '1px solid var(--gray-200)' }}>
                <div className="mb-2 text-primary font-weight-bold" style={{ fontSize: '24px' }}>04</div>
                <h5 className="font-weight-bold mb-1">Quality Inspection</h5>
                <p className="small text-muted mb-0">Micron Thickness, Adhesion &amp; Gloss Check</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services Grid (content comes from the admin panel) */}
      {(servicesLoading || services.length > 0) && (
        <section style={{ backgroundColor: 'var(--gray-50)', paddingTop: '20px' }}>
          <div className="container">
            <div className="row justify-content-center">
              {servicesLoading
                ? [0, 1, 2, 3].map((n) => (
                    <div className="col-lg-6 mb-4" key={n}>
                      <div className="service-card-modern service-card-skeleton service-card-skeleton-lg" aria-hidden="true" />
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
                        <p>
                          <RichText text={service.description || service.summary} />
                        </p>
                        {service.features && service.features.length > 0 && (
                          <div className="mt-3">
                            {service.features.map((feature) => (
                              <div className="checklist-item mb-2" key={feature}>
                                <FaCheck className="text-primary" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-4 pt-3 border-top">
                          <Link
                            to={`/Contact?service=${encodeURIComponent(service.title)}`}
                            className="btn btn-outline-primary btn-sm font-weight-bold"
                          >
                            {service.buttonLabel || `Enquire about ${service.title}`} <FaArrowRight className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* Ready to start project banner */}
      <section className="py-5">
        <div className="container">
          <div className="card shadow-sm border-0 p-4 p-md-5 text-center" style={{ borderRadius: '16px', background: 'var(--primary-light)' }}>
            <h3 className="font-weight-bold mb-2 text-dark">Have Custom Specifications or Large Component Dimensions?</h3>
            <p className="text-muted mb-4" style={{ maxWidth: '650px', margin: '0 auto' }}>
              We accommodate parts up to 25ft long in our diesel fired ovens. Talk directly to our technical supervisor.
            </p>
            <div>
              <Link to="/Contact" className="btn btn-hero-primary">
                <span>Request Custom Quote</span>
                <FaPhoneAlt className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
