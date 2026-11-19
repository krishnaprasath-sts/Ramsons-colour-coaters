import React, { useState, useEffect, useRef } from 'react';
import {
  FaTimes,
  FaSpinner,
  FaPaperPlane,
  FaExclamationCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import useServices from '../hooks/useServices';

const INITIAL_FORM = {
  name: '',
  companyname: '',
  phone: '',
  email: '',
  service: '', // empty = the first service in the list
  message: '',
};

// Always offered in addition to the services managed in the admin panel
const OTHER_SERVICE = 'Other / Custom Requirement';

function validateField(name, value, serviceOptions = []) {
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
    case 'email': {
      if (!trimmed) return 'Please enter your email address.';
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
        return 'Enter a valid email address (e.g. name@company.com).';
      }
      return '';
    }
    case 'service': {
      if (trimmed && !serviceOptions.includes(trimmed)) {
        return 'Please select a valid coating service.';
      }
      return '';
    }
    case 'message': {
      if (!trimmed) return 'Please describe your component & coating requirements.';
      if (trimmed.length < 10) {
        return 'Please provide at least 10 characters of requirement details.';
      }
      if (trimmed.length > 1000) {
        return 'Details cannot exceed 1000 characters.';
      }
      return '';
    }
    default:
      return '';
  }
}

export default function QuoteModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const closeTimerRef = useRef(null);

  // The dropdown lists the services managed in the admin panel
  const { services } = useServices();
  const serviceOptions = [...services.map((service) => service.title), OTHER_SERVICE];
  const selectedService = serviceOptions.includes(formData.service) ? formData.service : serviceOptions[0];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setErrors({});
      setTouched({});
      setStatusMsg(null);
    }
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue =
      name === 'phone' ? value.replace(/[^0-9+\-\s()]/g, '') : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, nextValue, serviceOptions) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, serviceOptions) }));
  };

  const validateAll = () => {
    const nextErrors = {};
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
      const err = validateField(key, formData[key], serviceOptions);
      if (err) nextErrors[key] = err;
    });
    setTouched(allTouched);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const getFieldClass = (fieldName) => {
    if (touched[fieldName] && errors[fieldName]) {
      return 'form-control-modern quote-input-error';
    }
    if (touched[fieldName] && !errors[fieldName] && String(formData[fieldName]).trim()) {
      return 'form-control-modern quote-input-valid';
    }
    return 'form-control-modern';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!validateAll()) {
      setStatusMsg({
        type: 'danger',
        text: 'Please fix the highlighted fields before submitting.',
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
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          service: selectedService,
          message: formData.message.trim(),
          source: 'Get a Quote Popup',
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatusMsg({
          type: 'success',
          text: 'Thank you! Your quote request has been submitted.',
        });
        setFormData(INITIAL_FORM);
        setErrors({});
        setTouched({}); 
        closeTimerRef.current = setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatusMsg({
          type: 'danger',
          text: data.error || 'Unable to submit quote request. Please try again.',
        });
      }
    } catch {
      setStatusMsg({
        type: 'danger',
        text: 'Network error. Please call us directly at +91 6381156460.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="quote-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-heading"
      onClick={onClose}
    >
      <div className="quote-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="quote-modal-header">
          <div>
            <h3 id="quote-modal-heading" className="quote-modal-title">
              Get a Free Coating Quote
            </h3>
            <p className="quote-modal-subtitle">
              Share your component details and coating specs for a quick estimate.
            </p>
          </div>
          <button
            type="button"
            className="quote-modal-close"
            onClick={onClose}
            aria-label="Close quote modal"
          >
            <FaTimes />
          </button>
        </div>

        <div className="quote-modal-body">
          {statusMsg && (
            <div className={`quote-status-banner quote-status-${statusMsg.type}`} role="alert">
              {statusMsg.type === 'success' ? (
                <FaCheckCircle className="mr-2" />
              ) : (
                <FaExclamationCircle className="mr-2" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <div className="col-sm-6 form-group">
                <label htmlFor="quote-name">Your Name *</label>
                <input
                  id="quote-name"
                  type="text"
                  name="name"
                  className={getFieldClass('name')}
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

              <div className="col-sm-6 form-group">
                <label htmlFor="quote-company">Company Name</label>
                <input
                  id="quote-company"
                  type="text"
                  name="companyname"
                  className={getFieldClass('companyname')}
                  placeholder="e.g. Precision Fabricators"
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
            </div>

            <div className="row">
              <div className="col-sm-6 form-group">
                <label htmlFor="quote-phone">Phone Number *</label>
                <input
                  id="quote-phone"
                  type="tel"
                  name="phone"
                  className={getFieldClass('phone')}
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
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

              <div className="col-sm-6 form-group">
                <label htmlFor="quote-email">Email Address *</label>
                <input
                  id="quote-email"
                  type="email"
                  name="email"
                  className={getFieldClass('email')}
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
            </div>

            <div className="form-group">
              <label htmlFor="quote-service">Coating Service Type *</label>
              <select
                id="quote-service"
                name="service"
                className={getFieldClass('service')}
                value={selectedService}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {serviceOptions.map((option) => (
                  <option value={option} key={option}>{option}</option>
                ))}
              </select>
              {touched.service && errors.service && (
                <div className="quote-field-error">
                  <FaExclamationCircle />
                  <span>{errors.service}</span>
                </div>
              )}
            </div>

            <div className="form-group mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <label htmlFor="quote-message" className="mb-1">Component &amp; Shade Details *</label>
                <span className="quote-char-count">{formData.message.trim().length}/1000</span>
              </div>
              <textarea
                id="quote-message"
                name="message"
                rows="3"
                className={getFieldClass('message')}
                placeholder="Mention dimensions, quantity, desired RAL shade, or special requirements..."
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
              className="quote-submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <span>
                  <FaSpinner className="icon-spin mr-2" /> Submitting Request...
                </span>
              ) : (
                <span>
                  <FaPaperPlane className="mr-2" /> Submit Quote Request
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
