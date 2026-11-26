import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaAngleRight,
  FaMapMarkerAlt,
  FaCheck,
  FaCalendarAlt,
  FaPhoneAlt,
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RevealText from '../components/ui/RevealText';

export default function Infrastructure() {
  useEffect(() => {
    document.title = 'Infrastructure & Equipment | Ramson Colour Coaters Coimbatore';
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
          <h1 className="inner-hero-title"><RevealText text="Infrastructure" delay={100} /></h1>
          <div className="breadcrumb-modern">
            <Link to="/Home">Home</Link>
            <FaAngleRight />
            <span>Infrastructure</span>
          </div>
        </div>
      </div>

      {/* Infrastructure Metrics Overview */}
      <section className="py-4" style={{ backgroundColor: 'var(--gray-50)' }}>
        <div className="container">
          <div className="row text-center">
            <div className="col-md-2 col-4 mb-3 mb-md-0">
              <h3 className="font-weight-bold text-primary mb-0">1/2 Acre</h3>
              <p className="small text-muted mb-0">Total Land Area</p>
            </div>
            <div className="col-md-2 col-4 mb-3 mb-md-0">
              <h3 className="font-weight-bold text-primary mb-0">12 Tanks</h3>
              <p className="small text-muted mb-0">Chemical Baths</p>
            </div>
            <div className="col-md-2 col-4 mb-3 mb-md-0">
              <h3 className="font-weight-bold text-primary mb-0">3 Booths</h3>
              <p className="small text-muted mb-0">Powder Spray</p>
            </div>
            <div className="col-md-2 col-4 mb-3 mb-md-0">
              <h3 className="font-weight-bold text-primary mb-0">3 Ovens</h3>
              <p className="small text-muted mb-0">Up to 25 Feet</p>
            </div>
            <div className="col-md-2 col-4 mb-3 mb-md-0">
              <h3 className="font-weight-bold text-primary mb-0">5 Guns</h3>
              <p className="small text-muted mb-0">GEMA &amp; ELECTRON</p>
            </div>
            <div className="col-md-2 col-4 mb-3 mb-md-0">
              <h3 className="font-weight-bold text-primary mb-0">RO ETP</h3>
              <p className="small text-muted mb-0">PCB Approved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Bento Grid Section */}
      <section>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title"><RevealText text="Engineered for Massive Capacity & Precision" /></h2>
            <p className="section-subtitle">
              Every section of our plant is laid out for seamless material handling, strict chemical compliance, and zero defects.
            </p>
          </div>

          <div className="bento-grid">
            {/* Bento Item 1: Facility card (Span 8): photo on top, text on a solid panel below */}
            <div className="bento-col-8">
              <div className="bento-card">
                <div className="bento-img-wrap bento-img-wrap-facility">
                  <img loading="lazy" decoding="async" src="/images/w6.jpg" alt="Ramson Colour Coaters coating facility" />
                </div>
                <div className="bento-body">
                  <div className="bento-location">
                    <FaMapMarkerAlt className="mr-2" /> Ramachandra Industrial Estate, Eachanari &bull; Half Acre Complex
                  </div>
                  <h3 className="bento-title bento-title-lg">20,000+ Sq.Ft Modern Coating Facility</h3>
                  <p className="bento-desc">
                    Engineered for continuous workflow from raw fabrication staging, chemical dipping, automated electrostatic spray bays, to final protective packing. Built for rapid truck turnaround.
                  </p>
                  <ul className="bento-specs-list bento-specs-inline list-unstyled mb-0">
                    <li>
                      <FaCheck className="text-primary mr-2" /> Overhead Monorail Transport
                    </li>
                    <li>
                      <FaCheck className="text-primary mr-2" /> Zero-Dust Cleanroom Bays
                    </li>
                    <li>
                      <FaCheck className="text-primary mr-2" /> Dedicated Dispatch Lanes
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bento Item 2: Swiss & Turkish Guns (Span 4) */}
            <div className="bento-col-4">
              <div className="bento-card bento-card-dark">
                <div className="bento-img-wrap" style={{ height: '200px' }}>
                  <img loading="lazy" decoding="async" src="/images/WhatsApp Image 2020-08-03 at 12.43.07 PM.jpeg" alt="GEMA & ELECTRON Equipment" />
                </div>
                <div className="bento-body">
                  <div className="bento-stat-num">5 Electrostatic Guns</div>
                  <h4 className="bento-title">Precision Spray Units</h4>
                  <p className="bento-desc">
                    Digital voltage regulation ensures uniform micron thickness without Faraday-cage corner repulsion.
                  </p>
                  <ul className="bento-specs-list list-unstyled mb-0">
                    <li><FaCheck className="text-info mr-2" /> GEMA OPTIMA (Swiss) - 2 Nos</li>
                    <li><FaCheck className="text-info mr-2" /> GEMA MPS &amp; ECF (Swiss)</li>
                    <li><FaCheck className="text-info mr-2" /> ELECTRON (Turkey) - 1 No</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bento Item 3: Pre-treatment Tanks (Span 4) */}
            <div className="bento-col-4">
              <div className="bento-card">
                <div className="bento-img-wrap">
                  <img loading="lazy" decoding="async" src="/images/slide-4-compressed.jpg" alt="Pre-treatment Tanks" />
                </div>
                <div className="bento-body">
                  <div className="bento-stat-num">12 Dipping Tanks</div>
                  <h4 className="bento-title">Pre-treatment System</h4>
                  <p className="bento-desc">
                    Full immersion chemical baths guaranteeing lifelong adhesion and 500+ hours salt spray durability.
                  </p>
                  <ul className="bento-specs-list list-unstyled mb-0">
                    <li><FaCheck className="text-primary mr-2" /> 8 Tanks: 12ft x 6ft x 5ft</li>
                    <li><FaCheck className="text-primary mr-2" /> 4 Tanks: 22ft x 2.5ft x 5ft</li>
                    <li><FaCheck className="text-primary mr-2" /> 7-Tank MS &amp; 4-Tank Chromating</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bento Item 4: Powder Coating Booths (Span 4) */}
            <div className="bento-col-4">
              <div className="bento-card">
                <div className="bento-img-wrap">
                  <img loading="lazy" decoding="async" src="/images/w8.jpg" alt="Powder Coating Booths" />
                </div>
                <div className="bento-body">
                  <div className="bento-stat-num">3 Spray Booths</div>
                  <h4 className="bento-title">Multi-Cyclone Recovery</h4>
                  <p className="bento-desc">
                    Engineered walk-in and batch booths with high-efficiency cyclone recovery systems to eliminate dust and color blending.
                  </p>
                  <ul className="bento-specs-list list-unstyled mb-0">
                    <li><FaCheck className="text-primary mr-2" /> Walk-In: 8ft x 8ft x 12ft</li>
                    <li><FaCheck className="text-primary mr-2" /> Walk-In: 8ft x 8ft x 8ft</li>
                    <li><FaCheck className="text-primary mr-2" /> Batch: 6ft x 4ft x 3ft</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bento Item 5: Curing Ovens (Span 4) */}
            <div className="bento-col-4">
              <div className="bento-card">
                <div className="bento-img-wrap">
                  <img loading="lazy" decoding="async" src="/images/w5.jpg" alt="Thermal Curing Ovens" />
                </div>
                <div className="bento-body">
                  <div className="bento-stat-num">25 Ft Max Length</div>
                  <h4 className="bento-title">Heavy Curing Ovens</h4>
                  <p className="bento-desc">
                    Three heavy-duty diesel fired curing ovens delivering uniform temperature distribution (180°C - 200°C) across massive assemblies.
                  </p>
                  <ul className="bento-specs-list list-unstyled mb-0">
                    <li><FaCheck className="text-primary mr-2" /> Heavy Oven: 25ft x 7ft x 7ft</li>
                    <li><FaCheck className="text-primary mr-2" /> High-Capacity: 12ft x 8ft x 6ft</li>
                    <li><FaCheck className="text-primary mr-2" /> Calibrated Temp Sensors</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bento Item 6: ETP (Span 12 - Full Width Dark Bento Card) */}
            <div className="bento-col-12">
              <div className="bento-card bento-card-dark">
                <div className="row no-gutters align-items-center">
                  <div className="col-lg-6">
                    <div className="bento-img-wrap" style={{ height: '100%', minHeight: '320px' }}>
                      <img loading="lazy" decoding="async" src="/images/WhatsApp Image 2020-09-11 at 12.18.03 PM.jpeg" alt="Effluent Treatment Plant" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="bento-body p-4 p-md-5">
                      <h3 className="bento-title mb-3" style={{ fontSize: '26px' }}>
                        In-House Effluent Treatment Plant (ETP) with 2-Stage RO
                      </h3>
                      <p className="bento-desc mb-4" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                        Our commitment to the environment matches our dedication to industrial quality. We operate an advanced in-house Effluent Treatment Plant featuring a high-capacity two-stage Reverse Osmosis (RO) system that purifies chemical rinse waters and recycles 100% back into plant utilities with zero liquid discharge.
                      </p>
                      <ul className="bento-specs-list list-unstyled mb-0">
                        <li>
                          <FaCheck className="text-success mr-2" /> Two-Stage Industrial RO Unit
                        </li>
                        <li>
                          <FaCheck className="text-success mr-2" /> Zero Liquid Discharge (ZLD)
                        </li>
                        <li>
                          <FaCheck className="text-success mr-2" /> TN Pollution Control Board Approved
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Strip */}
      <section className="py-5" style={{ backgroundColor: 'var(--gray-50)' }}>
        <div className="container text-center">
          <h3 className="font-weight-bold mb-2">Want to Inspect Our Facility or Discuss Batch Capabilities?</h3>
          <p className="text-muted mb-4">We welcome industrial clients and fabrication partners to visit our plant in Eachanari, Coimbatore.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/Contact" className="btn btn-hero-primary mr-3">
              <span>Schedule Plant Visit</span>
              <FaCalendarAlt className="ml-1" />
            </Link>
            <a href="tel:+916381156460" className="btn btn-outline-primary" style={{ padding: '14px 28px', borderRadius: '50px', fontWeight: '700' }}>
              <FaPhoneAlt className="mr-1" /> Call +91 6381156460
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
