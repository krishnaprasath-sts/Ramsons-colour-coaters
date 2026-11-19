import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaAngleRight,
  FaMapMarkerAlt,
  FaFlask,
  FaCogs,
  FaExpand,
  FaLeaf,
  FaArrowRight,
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RevealText from '../components/ui/RevealText';

export default function About() {
  useEffect(() => {
    document.title = 'About Us | Ramson Colour Coaters - Powder Coating Pioneers in Coimbatore';
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
          <h1 className="inner-hero-title"><RevealText text="About Us" delay={100} /></h1>
          <div className="breadcrumb-modern">
            <Link to="/Home">Home</Link>
            <FaAngleRight />
            <span>About Us</span>
          </div>
        </div>
      </div>

      {/* Main Story & Map Section */}
      <section>
        <div className="container">
          <div className="row align-items-center flex-direction">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <span className="section-badge">Our Journey Since 2002</span>
              <h2 className="section-title text-left mb-4">
                <RevealText text="Two Decades of Excellence in Industrial Coating" />
              </h2>
              <p className="paragraph-tag text-justify text-muted mb-4">
                <strong>Ramson Colour Coaters</strong>, a premier quality powder coating service provider in Coimbatore, was founded in the year <strong>2002</strong> by <strong>R. Jayakumar</strong> and <strong>R. Rajeshkumar</strong> with the primary aim of delivering uncompromising, world-class powder coating services to engineering and fabrication customers across Tamil Nadu and neighbouring states.
              </p>
              <p className="paragraph-tag text-justify text-muted mb-4">
                What began as a modest 4,000 sq.ft workshop has now expanded into a specialized, state-of-the-art facility over five times its initial size, spanning more than half an acre. This remarkable milestone has been earned through the enduring trust and patronage of our satisfied clientele and our steadfast dedication to quality.
              </p>
              <p className="paragraph-tag text-justify text-muted">
                Our ability to deliver industry-leading finishes is the direct result of continuous learning, in-house chemical testing, proactive infrastructure upgradation, and a passion for industrial surface perfection.
              </p>
            </div>

            <div className="col-lg-6">
              <div
                style={{
                  background: '#fff',
                  padding: '15px',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--gray-200)',
                }}
              >
                <img
                  src="/images/ramsonmap.png"
                  className="img-fluid"
                  alt="Ramson Coimbatore Facility Location Map"
                  style={{ borderRadius: '12px' }}
                />
                <div className="p-3 text-center">
                  <h6 className="font-weight-bold mb-1 text-dark">
                    <FaMapMarkerAlt className="text-danger mr-1" /> Strategic Location
                  </h6>
                  <p className="small text-muted mb-0">
                    Ramachandra Industrial Estate, Eachanari to Madukkarai Road, Coimbatore - 641 105
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of Success */}
      <section style={{ backgroundColor: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Our Foundation</span>
            <h2 className="section-title"><RevealText text="The Principles Driving Our Quality" /></h2>
            <p className="section-subtitle">
              How we ensure every batch meets rigid industrial specifications for adhesion, gloss, and salt-spray durability.
            </p>
          </div>

          <div className="row">
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="feature-card-modern">
                <div className="feature-icon-circle">
                  <FaFlask />
                </div>
                <h4 className="feature-card-title">In-House Chemical R&amp;D</h4>
                <p className="feature-card-desc">
                  Every substrate—from cold rolled sheet metal to cast aluminium—undergoes customized chemical bath preparation formulated for optimal adhesion.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="feature-card-modern">
                <div className="feature-icon-circle">
                  <FaCogs />
                </div>
                <h4 className="feature-card-title">Global Equipment</h4>
                <p className="feature-card-desc">
                  We invest exclusively in internationally renowned brands including Swiss GEMA Optima guns and Turkish ELECTRON application systems.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="feature-card-modern">
                <div className="feature-icon-circle">
                  <FaExpand />
                </div>
                <h4 className="feature-card-title">Capacity &amp; Scale</h4>
                <p className="feature-card-desc">
                  With 3 curing ovens up to 25ft in length, walk-in booths, and 12 pre-treatment tanks, we easily handle massive structural orders without bottleneck.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="feature-card-modern">
                <div className="feature-icon-circle">
                  <FaLeaf />
                </div>
                <h4 className="feature-card-title">Green Responsibility</h4>
                <p className="feature-card-desc">
                  Our full-fledged effluent treatment plant featuring a 2-stage Reverse Osmosis unit is officially approved by the Tamil Nadu Pollution Control Board.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-5">
        <div className="container">
          <div
            style={{
              background: 'var(--primary-gradient)',
              borderRadius: '20px',
              padding: '50px 40px',
              color: '#fff',
              boxShadow: '0 15px 35px rgba(2, 132, 199, 0.3)',
            }}
          >
            <div className="row align-items-center">
              <div className="col-lg-8 text-center text-lg-left mb-3 mb-lg-0">
                <h3 className="text-white font-weight-bold mb-2">
                  Visit Our Facility or Request Sample Powder Coating Trials
                </h3>
                <p className="text-white mb-0" style={{ fontSize: '16.5px', fontWeight: 500 }}>
                  Experience our surface finish quality firsthand. Bring your sample component for trial coating.
                </p>
              </div>
              <div className="col-lg-4 text-center text-lg-right">
                <Link to="/Contact" className="btn btn-hero-outline" style={{ background: '#fff', color: 'var(--primary)', borderColor: '#fff' }}>
                  <span>Get In Touch</span>
                  <FaArrowRight className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
