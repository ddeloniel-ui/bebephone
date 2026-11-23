import React from 'react';

interface PixelStarsProps {
  variant?: 'subtle' | 'rich';
}

const STARS = [
  { top: '12%', left: '8%', size: 12, delay: '0s', type: 'cross' },
  { top: '20%', left: '86%', size: 14, delay: '0.8s', type: 'spark' },
  { top: '34%', left: '14%', size: 10, delay: '1.6s', type: 'dot' },
  { top: '42%', left: '91%', size: 12, delay: '2.2s', type: 'cross' },
  { top: '68%', left: '10%', size: 14, delay: '1.1s', type: 'spark' },
  { top: '76%', left: '84%', size: 10, delay: '2.9s', type: 'cross' },
  { top: '86%', left: '22%', size: 12, delay: '0.4s', type: 'dot' },
  { top: '16%', left: '68%', size: 10, delay: '3.4s', type: 'dot' },
  { top: '56%', left: '76%', size: 11, delay: '1.9s', type: 'dot' },
  { top: '26%', left: '26%', size: 10, delay: '2.6s', type: 'cross' },
];

export const PixelStars: React.FC<PixelStarsProps> = ({ variant = 'subtle' }) => {
  const visibleStars = variant === 'rich' ? STARS : STARS.slice(0, 6);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {visibleStars.map((star, idx) => (
        <div
          key={idx}
          className="absolute animate-pixel-twinkle text-[#333333]"
          style={{
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
          }}
        >
          {star.type === 'cross' && (
            <svg width={star.size} height={star.size} viewBox="0 0 12 12" fill="currentColor">
              <rect x="5" y="0" width="2" height="4" />
              <rect x="5" y="8" width="2" height="4" />
              <rect x="0" y="5" width="4" height="2" />
              <rect x="8" y="5" width="4" height="2" />
            </svg>
          )}
          {star.type === 'spark' && (
            <svg width={star.size} height={star.size} viewBox="0 0 14 14" fill="currentColor">
              <rect x="6" y="0" width="2" height="14" />
              <rect x="0" y="6" width="14" height="2" />
              <rect x="4" y="4" width="6" height="6" opacity="0.45" />
            </svg>
          )}
          {star.type === 'dot' && (
            <svg width={star.size} height={star.size} viewBox="0 0 8 8" fill="currentColor">
              <rect x="2" y="2" width="4" height="4" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};
