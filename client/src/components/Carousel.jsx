import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import RevealText from './ui/RevealText';

const defaultSlides = [
  {
    src: '/images/banner-1.jpeg',
    title: 'High-Quality Industrial Powder Coating Specialists',
    subtitle: 'Equipped with Swiss GEMA & Turkish ELECTRON systems, 7-tank pretreatment, and ovens up to 25ft for unmatched durability & finish.',
  },
  {
    src: '/images/banner-2.jpeg',
    title: 'Fusion Bonding & Heavy-Duty Metal Surface Finishing',
    subtitle: '',
  },
];

export default function Carousel() {
  const [slides, setSlides] = useState(defaultSlides);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch('/api/banners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.banners) && data.banners.length > 0) {
          setSlides(data.banners);
        }
      })
      .catch(() => {
        // Fallback to defaultSlides if server not reached
      });
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = (e) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="hero-wrapper">
      <div id="heroCarousel" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
              style={{ display: index === activeIndex ? 'block' : 'none' }}
            >
              <div className="hero-slide-container">
                <img src={slide.src} className="hero-slide-img" alt={slide.title} />
                <div className="hero-overlay">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-9 col-md-11">
                        <h1 className="hero-title">
                          {index === activeIndex ? (
                            <RevealText key={`${activeIndex}-${slide.title}`} text={slide.title} delay={120} step={65} />
                          ) : (
                            slide.title
                          )}
                        </h1>
                        {slide.subtitle && (
                          <p className="hero-subtitle">
                            {slide.subtitle}
                          </p>
                        )}
                        <div className="hero-btn-group">
                          <Link to="/Services" className="btn-hero-primary">
                            <span>Our Services</span>
                            <FaArrowRight />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        {slides.length > 1 && (
          <>
            <a className="carousel-control-prev" href="#heroCarousel" role="button" onClick={handlePrev}>
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#heroCarousel" role="button" onClick={handleNext}>
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
