import React from 'react';

// Renders text typed in the admin panel. Only <strong>...</strong> (or <b>...</b>)
// is turned into bold; everything else is shown as plain text, so admin content
// can never inject HTML into the page.
const BOLD = /<(strong|b)>([\s\S]*?)<\/\1>/gi;

export default function RichText({ text }) {
  const source = String(text || '');
  const parts = [];
  let lastIndex = 0;
  let match;

  BOLD.lastIndex = 0;
  while ((match = BOLD.exec(source)) !== null) {
    if (match.index > lastIndex) parts.push(source.slice(lastIndex, match.index));
    parts.push(<strong key={match.index}>{match[2]}</strong>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < source.length) parts.push(source.slice(lastIndex));

  return <>{parts}</>;
}
