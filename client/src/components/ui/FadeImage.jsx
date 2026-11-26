import { useEffect, useRef, useState } from 'react';

/**
 * An <img> that loads lazily and fades in once it has arrived.
 * `fallbackSrc` is shown if the image cannot be loaded.
 */
export default function FadeImage({ src, fallbackSrc, className = '', alt = '', ...rest }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const shownSrc = failed && fallbackSrc ? fallbackSrc : src;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  useEffect(() => {
    // Already in the browser cache: no load event will follow
    const img = ref.current;
    setLoaded(Boolean(img && img.complete && img.naturalWidth > 0));
  }, [shownSrc]);

  return (
    <img
      loading="lazy"
      decoding="async"
      {...rest}
      ref={ref}
      src={shownSrc}
      alt={alt}
      className={`fade-img${loaded ? ' is-loaded' : ''}${className ? ` ${className}` : ''}`}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (fallbackSrc && !failed) setFailed(true);
        else setLoaded(true);
      }}
    />
  );
}
