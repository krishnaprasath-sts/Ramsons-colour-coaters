import { Fragment } from 'react';
import useInView from '../../hooks/useInView';

export default function RevealText({ text, delay = 0, step = 60, className = '' }) {
  const [ref, inView] = useInView({ rootMargin: '0px', threshold: 0 });
  const words = String(text).split(' ');

  return (
    <span ref={ref} className={`reveal-text${inView ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="reveal-text__word">
            <span className="reveal-text__inner" style={{ '--d': `${delay + i * step}ms` }}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  );
}
