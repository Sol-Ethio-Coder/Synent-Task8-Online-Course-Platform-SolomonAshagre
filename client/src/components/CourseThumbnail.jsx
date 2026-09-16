import React from 'react';

// A handful of hand-picked gradient pairs in STCA's brand family — varied
// enough that a course list doesn't look monotonous, but every pair still
// reads as "the same site" rather than random colors.
const PALETTES = [
  ['#22C55E', '#0F766E'], // green → teal
  ['#F59E0B', '#DC2626'], // amber → red
  ['#6366F1', '#8B5CF6'], // indigo → violet
  ['#0EA5E9', '#22C55E'], // sky → green
  ['#F43F5E', '#F59E0B'], // rose → amber
  ['#14B8A6', '#0EA5E9'] // teal → sky
];

const CATEGORY_GLYPH = {
  'coding-online': '</>',
  'coding-offline': '</>',
  'tutoring-online': '✎',
  'tutoring-offline': '✎'
};

// Simple deterministic hash so the same course always renders the same
// thumbnail (not random on every reload), but different courses spread
// across the palette.
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function CourseThumbnail({ title = 'STCA', category, curriculum, className = '' }) {
  const seed = hashString(title + (category || ''));
  const [from, to] = PALETTES[seed % PALETTES.length];
  const glyph = CATEGORY_GLYPH[category] || '★';
  const initial = title.trim()[0]?.toUpperCase() || 'S';
  const gradId = `courseGrad-${seed}`;

  return (
    <svg viewBox="0 0 400 220" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill={`url(#${gradId})`} />
      <circle cx="355" cy="25" r="65" fill="#FFFFFF" opacity="0.08" />
      <circle cx="30" cy="200" r="55" fill="#FFFFFF" opacity="0.08" />

      <text
        x="200" y="105" textAnchor="middle" dominantBaseline="middle"
        fontFamily="'Courier New', monospace" fontWeight="700" fontSize="34" fill="#FFFFFF" opacity="0.92"
      >
        {glyph}
      </text>
      <text
        x="200" y="150" textAnchor="middle" dominantBaseline="middle"
        fontFamily="Georgia, serif" fontWeight="700" fontSize="26" fill="#FFFFFF"
      >
        {initial}
      </text>
      {curriculum && curriculum !== 'General' && (
        <text
          x="200" y="178" textAnchor="middle" dominantBaseline="middle"
          fontFamily="system-ui, sans-serif" fontSize="11" fill="#FFFFFF" opacity="0.8" letterSpacing="0.5"
        >
          {curriculum.toUpperCase()}
        </text>
      )}
    </svg>
  );
}
