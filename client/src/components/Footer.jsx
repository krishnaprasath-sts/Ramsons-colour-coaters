import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaAngleRight,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from 'react-icons/fa';
import useServices from '../hooks/useServices';

export default function Footer() {
  // Service names are managed in the admin panel
  const { services } = useServices();

  return (
    <>
      <footer className="footer-modern">
        <div className="container">
          <div className="row">
            {/* Col 1: Brand Info */}
            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
              <div className="footer-brand">
                <h4>RAMSON COLOUR COATERS</h4>
                <p>
                  One of the biggest and most reliable quality powder coating service providers in Coimbatore. Servicing diverse fabrication companies, foundries, and engineering industries since 2002.
                </p>
                <div className="footer-social-wrap">
                  <a
                    href="https://www.facebook.com/Ramson-Colour-Coaters-103293678061484"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-btn"
                    title="Facebook"
                  >
                    <FaFacebookF />
                  </a>
                  <a href="#!" className="footer-social-btn" title="Instagram">
                    <FaInstagram />
                  </a>
                  <a
                    href="https://wa.me/916381156460"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-btn"
                    title="WhatsApp"
                  >
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
              <h5 className="footer-title">Quick Links</h5>
              <ul className="footer-links-list">
                <li><Link to="/Home"><FaAngleRight /> Home</Link></li>
                <li><Link to="/About"><FaAngleRight /> About Us</Link></li>
                <li><Link to="/Services"><FaAngleRight /> Services</Link></li>
                <li><Link to="/infrastructure"><FaAngleRight /> Infrastructure</Link></li>
                <li><Link to="/Blogs"><FaAngleRight /> Blogs</Link></li>
                <li><Link to="/Contact"><FaAngleRight /> Contact Us</Link></li>
              </ul>
            </div>

            {/* Col 3: Services */}
            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <h5 className="footer-title">Our Services</h5>
              <ul className="footer-links-list">
                {services.slice(0, 6).map((service) => (
                  <li key={service.id}><Link to="/Services"><FaAngleRight /> {service.title}</Link></li>
                ))}
                <li><Link to="/infrastructure"><FaAngleRight /> 25ft Curing Ovens</Link></li>
              </ul>
            </div>

            {/* Col 4: Get in Touch & Map */}
            <div className="col-lg-3 col-md-6">
              <h5 className="footer-title">Get In Touch</h5>
              <div className="footer-contact-item">
                <FaMapMarkerAlt />
                <span>No : 1, S.F.NO.9/2C2, Ramachandra Industrial Estate, Eachanari to Madukkarai Road, Coimbatore - 641 105</span>
              </div>
              <div className="footer-contact-item">
                <FaPhoneAlt />
                <span>
                  <a href="tel:+916381156460" className="text-white-50">+91 6381156460</a> / <a href="tel:+919363103062" className="text-white-50">+91 9363103062</a>
                </span>
              </div>
              <div className="footer-contact-item">
                <FaEnvelope />
                <a href="mailto:ramsoncolour@gmail.com" className="text-white-50">ramsoncolour@gmail.com</a>
              </div>
              <div className="mt-3">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.6340952176556!2d76.97000995074647!3d10.915387992189128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85bc5a3f10237%3A0xf11060f6109dd743!2sRamson%20Colour%20Coaters%20-%20Powder%20Coating%20in%20Coimbatore!5e0!3m2!1sen!2sin!4v1596102492010!5m2!1sen!2sin"
                  style={{ border: 0, width: '100%', height: '120px', borderRadius: '8px' }}
                  allowFullScreen=""
                  aria-hidden="false"
                  tabIndex="0"
                  title="Ramson Map"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-left mb-2 mb-md-0">
                Copyright © {new Date().getFullYear()} Ramson Colour Coaters. All rights reserved.
              </div>
              <div className="col-md-6 text-center text-md-right">
                Developed by{' '}
                <a href="https://saitechnosolutions.com/" target="_blank" rel="noreferrer">
                  Sai Techno Solutions
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <a
        href="https://wa.me/916381156460?text=Hi%20Ramson%20Colour%20Coaters,%20I%20would%20like%20to%20enquire%20about%20your%20powder%20coating%20services."
        className="floating-whatsapp"
        target="_blank"
        rel="noreferrer"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </>
  );
}
