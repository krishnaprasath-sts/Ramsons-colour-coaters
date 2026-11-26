import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import RevealText from './ui/RevealText';
import useApiJson from '../hooks/useApiJson';
import { apiUrl } from '../lib/api';

// Shown only when the server cannot be reached
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

// The hero is as tall as the banner image's own shape (nothing is cropped). The shape is only
// known once the image has arrived, so each banner's width/height ratio is remembered here and
// the space is reserved up front on the next visit. Until then a typical banner shape is used.
const DEFAULT_RATIO = 1351 / 700;
const RATIO_STORE = 'rcc-hero-ratios';

function readRatios() {
  try {
    return JSON.parse(localStorage.getItem(RATIO_STORE)) || {};
  } catch {
    return {};
  }
}

const AUTOPLAY_MS = 6000;

export default function Carousel() {
  const { data, loading } = useApiJson('/api/banners');
  const banners = data && Array.isArray(data.banners) && data.banners.length > 0 ? data.banners : null;
  // While the first answer is on its way a placeholder is shown instead of the default banners,
  // so the hero never flashes one image and then swaps to another.
  const slides = banners || (loading ? [] : defaultSlides);

  const [activeIndex, setActiveIndex] = useState(0);
  const [ratios, setRatios] = useState(readRatios);
  const [settled, setSettled] = useState({}); // src -> true once the image has loaded (or failed)

  const slideCount = slides.length;
  const current = slideCount > 0 ? activeIndex % slideCount : 0;
  const activeSrc = slideCount > 0 ? slides[current].src : '';
  const firstSettled = slideCount > 0 && Boolean(settled[slides[0].src]);

  const markSettled = useCallback((src, img) => {
    setSettled((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
    if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
      const ratio = Number((img.naturalWidth / img.naturalHeight).toFixed(4));
      setRatios((prev) => {
        if (prev[src] === ratio) return prev;
        const next = { ...prev, [src]: ratio };
        try {
          localStorage.setItem(RATIO_STORE, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    }
  }, []);

  // Start rotating only after the first banner is on screen
  useEffect(() => {
    if (slideCount <= 1 || !firstSettled) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideCount);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [slideCount, firstSettled]);

  const handlePrev = (e) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const handleNext = (e) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev + 1) % slideCount);
  };

  return (
    <div className="hero-wrapper">
      <div id="heroCarousel" className="carousel slide">
        <div
          className={`hero-stage${slideCount === 0 || !settled[activeSrc] ? ' is-loading' : ''}`}
          style={{ aspectRatio: String(ratios[activeSrc] || DEFAULT_RATIO) }}
          aria-busy={slideCount === 0}
        >
          {slides.map((slide, index) => {
            const isActive = index === current;
            // The first banner gets the whole connection; the others load once it is visible
            const shouldLoad = index === 0 || firstSettled;
            return (
              <div
                key={slide.id || slide.src}
                className={`hero-slide${isActive ? ' is-active' : ''}`}
                aria-hidden={!isActive}
              >
                {shouldLoad && (
                  <img
                    src={apiUrl(slide.src)}
                    className={`hero-slide-img${settled[slide.src] ? ' is-loaded' : ''}`}
                    alt={slide.title}
                    decoding="async"
                    fetchpriority={index === 0 ? 'high' : 'low'}
                    ref={(img) => {
                      // Already in the browser cache: no load event will follow
                      if (img && img.complete && img.naturalWidth > 0) markSettled(slide.src, img);
                    }}
                    onLoad={(e) => markSettled(slide.src, e.currentTarget)}
                    onError={() => markSettled(slide.src, null)}
                  />
                )}
                <div className="hero-overlay">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-9 col-md-11">
                        <h1 className="hero-title">
                          {isActive ? (
                            <RevealText key={`${current}-${slide.title}`} text={slide.title} delay={120} step={65} />
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
                          <Link to="/Services" className="btn-hero-primary" tabIndex={isActive ? undefined : -1}>
                            <span>Our Services</span>
                            <FaArrowRight />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Controls */}
        {slideCount > 1 && (
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
