import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FaAngleRight,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaSpinner,
  FaPaperPlane,
  FaExclamationCircle,
  FaCheckCircle,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RevealText from '../components/ui/RevealText';
import useServices from '../hooks/useServices';

const INITIAL_CONTACT = {
  name: '',
  companyname: '',
  email: '',
  phone: '',
  message: '',
};

function validateContactField(name, value) {
  const trimmed = String(value || '').trim();

  switch (name) {
    case 'name': {
      if (!trimmed) return 'Please enter your full name.';
      if (trimmed.length < 2) return 'Name must be at least 2 characters.';
      if (!/^[A-Za-z][A-Za-z\s.'-]{1,59}$/.test(trimmed)) {
        return 'Enter a valid name using letters only.';
      }
      return '';
    }
    case 'companyname': {
      if (!trimmed) return '';
      if (trimmed.length < 2) return 'Company name must be at least 2 characters.';
      if (!/^[A-Za-z0-9\s.&,'()/-]{2,80}$/.test(trimmed)) {
        return 'Enter a valid company name.';
      }
      return '';
    }
    case 'email': {
      if (!trimmed) return 'Please enter your email address.';
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
        return 'Enter a valid email address (e.g. name@company.com).';
      }
      return '';
    }
    case 'phone': {
      if (!trimmed) return 'Please enter your phone number.';
      const digitsOnly = trimmed.replace(/[\s\-()]/g, '');
      const normalized = digitsOnly.replace(/^(?:\+91|91|0)(?=\d{10}$)/, '');
      if (!/^[6-9]\d{9}$/.test(normalized)) {
        return 'Enter a valid 10-digit mobile number (e.g. +91 98765 43210).';
      }
      if (/^(\d)\1{9}$/.test(normalized)) {
        return 'Please enter a genuine mobile number.';
      }
      return '';
    }
    case 'message': {
      if (!trimmed) return 'Please describe your metal component & coating details.';
      if (trimmed.length < 10) {
        return 'Please enter at least 10 characters of enquiry details.';
      }
      if (trimmed.length > 1000) {
        return 'Message cannot exceed 1000 characters.';
      }
      return '';
    }
    default:
      return '';
  }
}

export default function Contact() {
  const [formData, setFormData] = useState(INITIAL_CONTACT);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // "Service interested in": pre-selected when the visitor arrives from a
  // service's Enquire button (/Contact?service=<service name>).
  const [searchParams] = useSearchParams();
  const requestedService = (searchParams.get('service') || '').trim();
  const { services } = useServices();
  const serviceOptions = services.map((item) => item.title);
  const [service, setService] = useState('');
  const [serviceTouched, setServiceTouched] = useState(false);
  const matchedService = serviceOptions.find((option) => option.toLowerCase() === requestedService.toLowerCase()) || '';
  const selectedService = serviceTouched ? service : matchedService;

  useEffect(() => {
    document.title = 'Contact Us | Ramson Colour Coaters Coimbatore';
  }, []);

  // Arriving from a service button: bring the form into view
  useEffect(() => {
    if (!matchedService) return;
    const form = document.getElementById('contact-form');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [matchedService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue =
      name === 'phone' ? value.replace(/[^0-9+\-\s()]/g, '') : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateContactField(name, nextValue) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateContactField(name, value) }));
  };

  const validateAll = () => {
    const nextErrors = {};
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
      const err = validateContactField(key, formData[key]);
      if (err) nextErrors[key] = err;
    });
    setTouched(allTouched);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const getFieldClass = (fieldName) => {
    if (touched[fieldName] && errors[fieldName]) {
      return 'form-control-modern field-input-error';
    }
    if (touched[fieldName] && !errors[fieldName] && String(formData[fieldName]).trim()) {
      return 'form-control-modern field-input-valid';
    }
    return 'form-control-modern';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!validateAll()) {
      setStatusMsg({
        type: 'danger',
        text: 'Please fix the highlighted fields before submitting your enquiry.',
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          companyname: formData.companyname.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          service: selectedService,
          source: 'Contact Form',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({
          type: 'success',
          text: 'Thank you! Your enquiry has been submitted. Our engineering team will contact you shortly.',
        });
        setFormData(INITIAL_CONTACT);
        setService('');
        setServiceTouched(true);
        setErrors({});
        setTouched({});
      } else {
        setStatusMsg({ type: 'danger', text: data.error || 'Error sending enquiry. Please try again.' });
      }
    } catch {
      setStatusMsg({ type: 'danger', text: 'Network connection error. Please contact us directly via phone or WhatsApp.' });
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1 className="inner-hero-title"><RevealText text="Contact Us" delay={100} /></h1>
          <div className="breadcrumb-modern">
            <Link to="/Home">Home</Link>
            <FaAngleRight />
            <span>Contact Us</span>
          </div>
        </div>
      </div>

      {/* Contact Cards Strip */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            {/* Card 1: Address */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="contact-info-box">
                <div className="contact-info-icon">
                  <FaMapMarkerAlt />
                </div>
                <h5>Our Works</h5>
                <p>
                  No : 1, S.F.NO.9/2C2, Ramachandra Industrial Estate, Eachanari to Madukkarai Road, Coimbatore - 641 105, Tamil Nadu, India
                </p>
              </div>
            </div>

            {/* Card 2: Phone */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="contact-info-box">
                <div className="contact-info-icon">
                  <FaPhoneAlt />
                </div>
                <h5>Call Us Directly</h5>
                <p>
                  <a href="tel:+916381156460" className="text-dark font-weight-bold d-block">+91 6381156460</a>
                  <a href="tel:+919363103062" className="text-muted d-block">+91 9363103062</a>
                  <a href="tel:+919363344757" className="text-muted d-block">+91 9363344757</a>
                </p>
              </div>
            </div>

            {/* Card 3: Email */}
            <div className="col-lg-4 col-md-12 mb-4">
              <div className="contact-info-box">
                <div className="contact-info-icon">
                  <FaEnvelope />
                </div>
                <h5>Email &amp; WhatsApp</h5>
                <p className="mb-2">
                  <a href="mailto:ramsoncolour@gmail.com" className="text-dark font-weight-bold">
                    ramsoncolour@gmail.com
                  </a>
                </p>
                <a
                  href="https://wa.me/916381156460"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-success text-white font-weight-bold mt-1 d-inline-flex align-items-center"
                  style={{ borderRadius: '20px' }}
                >
                  <FaWhatsapp className="mr-1" /> Quick WhatsApp Chat
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form & Map Section */}
      <section className="contact-main-section" style={{ backgroundColor: 'var(--gray-50)', paddingTop: '50px', paddingBottom: '70px' }}>
        <div className="container">
          <div className="row align-items-stretch">
            {/* Google Map Column (Left) */}
            <div className="col-lg-6 mb-4 mb-lg-0 d-flex">
              <div className="contact-map-card w-100">
                <div className="contact-map-header">
                  <div>
                    <h5 className="mb-1 font-weight-bold text-dark">
                      <FaMapMarkerAlt className="text-primary mr-2" />
                      Ramson Colour Coaters Plant
                    </h5>
                    <p className="small text-muted mb-0">
                      Ramachandra Industrial Estate, Eachanari, Coimbatore
                    </p>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Ramson+Colour+Coaters+Powder+Coating+in+Coimbatore"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-map-link"
                  >
                    <span>Directions</span>
                    <FaExternalLinkAlt size={11} />
                  </a>
                </div>
                <div className="contact-map-frame-wrap">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.6340952176556!2d76.97000995074647!3d10.915387992189128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85bc5a3f10237%3A0xf11060f6109dd743!2sRamson%20Colour%20Coaters%20-%20Powder%20Coating%20in%20Coimbatore!5e0!3m2!1sen!2sin!4v1596114877461!5m2!1sen!2sin"
                    className="contact-map-iframe"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ramson Colour Coaters Location"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Form Column (Right) */}
            <div className="col-lg-6 d-flex">
              <div className="contact-card-modern w-100">
                <span className="section-badge">Get in Touch</span>
                <h3 className="font-weight-bold mb-2">Send Us an Enquiry</h3>
                <p className="text-muted small mb-4">
                  Please provide your metal component details, approximate quantity, and powder coating specifications for a prompt quote.
                </p>

                {statusMsg && (
                  <div className={`quote-status-banner quote-status-${statusMsg.type} mb-4`} role="alert">
                    {statusMsg.type === 'success' ? (
                      <FaCheckCircle className="mr-2" />
                    ) : (
                      <FaExclamationCircle className="mr-2" />
                    )}
                    <span>{statusMsg.text}</span>
                  </div>
                )}

                <form id="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="form-group mb-3">
                    <label htmlFor="contact-name" className="font-weight-bold small text-dark">Your Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      className={getFieldClass('name')}
                      name="name"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(touched.name && errors.name)}
                      maxLength={60}
                      required
                    />
                    {touched.name && errors.name && (
                      <div className="quote-field-error">
                        <FaExclamationCircle />
                        <span>{errors.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="contact-company" className="font-weight-bold small text-dark">Company / Fabrication Firm Name</label>
                    <input
                      id="contact-company"
                      type="text"
                      className={getFieldClass('companyname')}
                      name="companyname"
                      placeholder="e.g. Precision Fabricators Ltd"
                      value={formData.companyname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(touched.companyname && errors.companyname)}
                      maxLength={80}
                    />
                    {touched.companyname && errors.companyname && (
                      <div className="quote-field-error">
                        <FaExclamationCircle />
                        <span>{errors.companyname}</span>
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6 form-group mb-3">
                      <label htmlFor="contact-email" className="font-weight-bold small text-dark">E-mail Address *</label>
                      <input
                        id="contact-email"
                        type="email"
                        className={getFieldClass('email')}
                        name="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(touched.email && errors.email)}
                        maxLength={100}
                        required
                      />
                      {touched.email && errors.email && (
                        <div className="quote-field-error">
                          <FaExclamationCircle />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 form-group mb-3">
                      <label htmlFor="contact-phone" className="font-weight-bold small text-dark">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        className={getFieldClass('phone')}
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-required="true"
                        aria-invalid={Boolean(touched.phone && errors.phone)}
                        maxLength={16}
                        required
                      />
                      {touched.phone && errors.phone && (
                        <div className="quote-field-error">
                          <FaExclamationCircle />
                          <span>{errors.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="contact-service" className="font-weight-bold small text-dark">Service Interested In</label>
                    <select
                      id="contact-service"
                      name="service"
                      className="form-control-modern"
                      value={selectedService}
                      onChange={(e) => {
                        setService(e.target.value);
                        setServiceTouched(true);
                      }}
                    >
                      <option value="">General enquiry</option>
                      {serviceOptions.map((option) => (
                        <option value={option} key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <label htmlFor="contact-message" className="font-weight-bold small text-dark mb-1">
                        Message &amp; Component Details *
                      </label>
                      <span className="quote-char-count">{formData.message.trim().length}/1000</span>
                    </div>
                    <textarea
                      id="contact-message"
                      className={getFieldClass('message')}
                      name="message"
                      placeholder="Specify material (MS, Aluminium, Casting), dimensions, desired shade/RAL code, quantity, and turnaround requirements..."
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(touched.message && errors.message)}
                      maxLength={1000}
                      required
                    ></textarea>
                    {touched.message && errors.message && (
                      <div className="quote-field-error">
                        <FaExclamationCircle />
                        <span>{errors.message}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-contact-submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span><FaSpinner className="icon-spin mr-2" /> Submitting Enquiry...</span>
                    ) : (
                      <span><FaPaperPlane className="mr-2" /> Submit Enquiry</span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
