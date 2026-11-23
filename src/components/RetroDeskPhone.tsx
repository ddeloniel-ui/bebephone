import React from 'react';
import { PhoneIncoming } from 'lucide-react';

interface RetroDeskPhoneProps {
  isPickedUp: boolean;
  isConnecting: boolean;
  onPickUp: () => void;
}

// Exact rotary-style push-button positions matching the reference vintage telephone
// Angle 0 deg = 12 o'clock, going clockwise
const ROTARY_BUTTONS: { label: string; angleDeg: number }[] = [
  { label: '5', angleDeg: 0 },
  { label: '4', angleDeg: 30 },
  { label: '3', angleDeg: 60 },
  { label: '2', angleDeg: 90 },
  { label: '1', angleDeg: 120 },
  { label: '#', angleDeg: 158 },
  { label: '*', angleDeg: 192 },
  { label: '0', angleDeg: 222 },
  { label: '9', angleDeg: 250 },
  { label: '8', angleDeg: 276 },
  { label: '7', angleDeg: 303 },
  { label: '6', angleDeg: 331 },
];

export const RetroDeskPhone: React.FC<RetroDeskPhoneProps> = ({
  isPickedUp,
  isConnecting,
  onPickUp,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 select-none">
      {/* Telephone + Sound Waves Stage */}
      <div className="relative flex items-center justify-center w-[320px] h-[285px] sm:w-[390px] sm:h-[330px]">
        {/* Animated Concentric Sound Waves while ringing */}
        {!isPickedUp && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="absolute w-[240px] h-[240px] sm:w-[285px] sm:h-[285px] rounded-full border border-[#8EB8C9]/55 animate-sound-ripple" />
            <div className="absolute w-[265px] h-[265px] sm:w-[310px] sm:h-[310px] rounded-full border border-[#171717]/18 animate-sound-ripple-delayed" />

            <svg
              className="w-[330px] sm:w-[390px] h-[230px] opacity-65"
              viewBox="0 0 390 230"
              fill="none"
            >
              <path
                d="M44 58 C26 76, 26 108, 44 126"
                stroke="#333333"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
              <path
                d="M25 46 C4 72, 4 112, 25 138"
                stroke="#8EB8C9"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M346 58 C364 76, 364 108, 346 126"
                stroke="#333333"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
              <path
                d="M365 46 C386 72, 386 112, 365 138"
                stroke="#8EB8C9"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {/* Interactive Clickable Baby-Blue Vintage Corded Telephone (Photo 2 Reference) */}
        <button
          type="button"
          onClick={onPickUp}
          disabled={isPickedUp}
          aria-label="Pick up the baby blue retro telephone"
          className={`group relative cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#171717] rounded-3xl transition-transform duration-300 ${
            !isPickedUp ? 'animate-phone-ring hover:scale-[1.02]' : ''
          }`}
        >
          {/* Soft realistic cast shadow beneath the phone */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[235px] sm:w-[275px] h-9 rounded-[50%] bg-[#171717]/20 blur-md transition-all duration-500"
            style={{
              transform: isPickedUp ? 'scale(0.94)' : 'scale(1)',
            }}
          />

          <svg
            className="w-[295px] sm:w-[345px] h-auto drop-shadow-[0_14px_22px_rgba(23,23,23,0.16)] overflow-visible"
            viewBox="0 0 380 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Powder Baby Blue Glossy Casing */}
              <linearGradient id="refBlueBody" x1="190" y1="78" x2="190" y2="288" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#B8D9E6" />
                <stop offset="48%" stopColor="#A0C7D7" />
                <stop offset="100%" stopColor="#86B1C2" />
              </linearGradient>

              <linearGradient id="refBlueSide" x1="90" y1="180" x2="310" y2="290" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8BB6C7" />
                <stop offset="100%" stopColor="#6D98AA" />
              </linearGradient>

              <linearGradient id="refHandset" x1="210" y1="22" x2="210" y2="122" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#CBE5F0" />
                <stop offset="35%" stopColor="#A9CEDD" />
                <stop offset="80%" stopColor="#85B1C2" />
                <stop offset="100%" stopColor="#6B97A9" />
              </linearGradient>

              <linearGradient id="refCreamRing" x1="215" y1="112" x2="215" y2="248" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FAF3E3" />
                <stop offset="100%" stopColor="#EDE2C8" />
              </linearGradient>

              <linearGradient id="refChromeDial" x1="160" y1="125" x2="270" y2="235" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F5F7F8" />
                <stop offset="30%" stopColor="#B4BAC0" />
                <stop offset="55%" stopColor="#FFFFFF" />
                <stop offset="82%" stopColor="#838990" />
                <stop offset="100%" stopColor="#D6DADF" />
              </linearGradient>

              <linearGradient id="refCordCoil" x1="28" y1="110" x2="110" y2="240" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#94BAC9" />
                <stop offset="50%" stopColor="#779FAD" />
                <stop offset="100%" stopColor="#5D8492" />
              </linearGradient>
            </defs>

            {/* Tightly Coiled Powder-Blue Cord on Left Side (matching Photo 2) */}
            <g
              className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: isPickedUp ? 'translate(8px, -24px) rotate(-5deg)' : 'translate(0, 0)',
                transformOrigin: '105px 220px',
              }}
            >
              {/* Straight lead from handset ear cup into coil */}
              <path
                d="M78 96 L46 136"
                stroke="#7EA5B4"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              {/* Multi-loop coiled cord curving down into the base */}
              {Array.from({ length: 18 }).map((_, idx) => {
                const t = idx / 17;
                const cx = 38 + Math.sin(t * Math.PI * 0.92) * 28 + t * 52;
                const cy = 140 + t * 76 + Math.sin(t * Math.PI) * 14;
                const rot = -22 + t * 48;
                return (
                  <ellipse
                    key={idx}
                    cx={cx}
                    cy={cy}
                    rx="11"
                    ry="4.2"
                    transform={`rotate(${rot} ${cx} ${cy})`}
                    fill="none"
                    stroke="url(#refCordCoil)"
                    strokeWidth="4.5"
                  />
                );
              })}
            </g>

            {/* Lower Base Skirt & Side Bevel */}
            <path
              d="M96 244 L334 244 L338 274 C339 283 331 290 318 290 L112 290 C99 290 91 283 92 274 Z"
              fill="url(#refBlueSide)"
            />

            {/* Main Sloped Trapezoidal Retro Telephone Body */}
            <path
              d="M140 88 C142 78 150 74 162 74 L268 74 C280 74 288 78 290 88 L334 252 C337 265 328 276 314 276 L116 276 C102 276 93 265 96 252 Z"
              fill="url(#refBlueBody)"
              stroke="#7AA5B6"
              strokeWidth="1.4"
            />

            {/* Glossy Left & Right Shoulder Highlights */}
            <path
              d="M142 94 L104 246"
              stroke="#D8EEF7"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M288 94 L326 246"
              stroke="#D8EEF7"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.55"
            />

            {/* Top Cradle Pocket & Hook Switch */}
            <rect x="160" y="76" width="110" height="20" rx="8" fill="#6E99AA" opacity="0.55" />
            <g
              className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: isPickedUp ? 'translateY(-10px)' : 'translateY(0px)',
              }}
            >
              <rect x="174" y="74" width="16" height="12" rx="3" fill="#EBF4F8" stroke="#6E99AA" strokeWidth="1" />
              <rect x="240" y="74" width="16" height="12" rx="3" fill="#EBF4F8" stroke="#6E99AA" strokeWidth="1" />
            </g>

            {/* Warm Cream / Ivory Circular Dial Surround (Photo 2) */}
            <circle
              cx="215"
              cy="182"
              r="76"
              fill="url(#refCreamRing)"
              stroke="#D3C7AC"
              strokeWidth="1.5"
            />

            {/* Chrome Silver Rotary-Style Dial Ring */}
            <circle
              cx="215"
              cy="182"
              r="57"
              fill="url(#refChromeDial)"
              stroke="#7A8087"
              strokeWidth="1.2"
            />
            <circle cx="215" cy="182" r="54" fill="none" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.75" />

            {/* 12 Glossy White Circular Push Buttons Arranged in Rotary Ring */}
            {ROTARY_BUTTONS.map(({ label, angleDeg }) => {
              const rad = ((angleDeg - 90) * Math.PI) / 180;
              const radius = 42.5;
              const bx = 215 + Math.cos(rad) * radius;
              const by = 182 + Math.sin(rad) * radius;
              return (
                <g key={label}>
                  {/* Button Recess Shadow */}
                  <circle cx={bx} cy={by + 1} r="10.2" fill="#4B5259" opacity="0.55" />
                  {/* Glossy Ivory-White Keycap */}
                  <circle
                    cx={bx}
                    cy={by}
                    r="9.4"
                    fill="#FDFDFB"
                    stroke="#C5C9CE"
                    strokeWidth="0.8"
                  />
                  <text
                    x={bx}
                    y={by + 3.6}
                    textAnchor="middle"
                    fill="#262626"
                    fontSize="10.5"
                    fontWeight="600"
                    fontFamily="DM Sans, sans-serif"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* Center Chrome-Rimmed Dial Label Card (DIAL 999 / REDIAL) */}
            <circle cx="215" cy="182" r="28" fill="#B5BBC1" stroke="#6D737A" strokeWidth="1" />
            <circle cx="215" cy="182" r="25" fill="#F4F0E6" />
            {/* Dark Charcoal Upper Half of Center Card */}
            <path
              d="M190.5 182 A24.5 24.5 0 0 1 239.5 182 Z"
              fill="#575B60"
            />
            <text
              x="215"
              y="170"
              textAnchor="middle"
              fill="#F5F5F5"
              fontSize="4.6"
              fontWeight="700"
              letterSpacing="0.5"
              fontFamily="DM Sans, sans-serif"
            >
              DIAL 999
            </text>
            <text
              x="215"
              y="176.5"
              textAnchor="middle"
              fill="#E5E7EB"
              fontSize="3.4"
              fontWeight="600"
              letterSpacing="0.3"
              fontFamily="DM Sans, sans-serif"
            >
              EMERGENCY · 100
            </text>
            <text
              x="215"
              y="194"
              textAnchor="middle"
              fill="#4B5563"
              fontSize="4.8"
              fontWeight="700"
              letterSpacing="0.9"
              fontFamily="DM Sans, sans-serif"
            >
              REDIAL
            </text>

            {/* Classic Curved Baby-Blue Handset (Photo 2) */}
            <g
              className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: isPickedUp
                  ? 'translate(22px, -56px) rotate(-14deg) scale(1.06)'
                  : 'translate(0px, 0px) rotate(0deg) scale(1)',
                transformOrigin: '215px 68px',
              }}
            >
              {/* Handset shadow onto cradle */}
              <ellipse
                cx="215"
                cy="106"
                rx="132"
                ry="16"
                fill="#171717"
                opacity={isPickedUp ? 0.06 : 0.16}
                className="transition-opacity duration-500"
              />

              {/* Left Chunky Earpiece Cup */}
              <path
                d="M66 78 C66 48, 88 32, 120 32 L136 32 C148 32, 152 48, 148 78 L142 104 C138 118, 124 124, 102 124 C80 124, 68 112, 66 92 Z"
                fill="url(#refHandset)"
                stroke="#6E99AA"
                strokeWidth="1.4"
              />

              {/* Right Chunky Mouthpiece Cup */}
              <path
                d="M364 78 C364 48, 342 32, 310 32 L294 32 C282 32, 278 48, 282 78 L288 104 C292 118, 306 124, 328 124 C350 124, 362 112, 364 92 Z"
                fill="url(#refHandset)"
                stroke="#6E99AA"
                strokeWidth="1.4"
              />

              {/* Smooth Arching Handset Handle */}
              <path
                d="M126 34 C180 20, 250 20, 304 34 L300 62 C248 52, 182 52, 130 62 Z"
                fill="url(#refHandset)"
                stroke="#6E99AA"
                strokeWidth="1.3"
              />

              {/* Specular Gloss Highlight along Top of Handset */}
              <path
                d="M92 44 C158 24, 272 24, 338 44"
                stroke="#EDF8FC"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.86"
              />
            </g>
          </svg>
        </button>
      </div>

      {/* Editorial Retro Text & Primary CTA */}
      <div className="mt-3 text-center flex flex-col items-center">
        <p className="font-[family-name:var(--font-pixel)] text-xl sm:text-2xl tracking-wider text-[#171717]">
          {isConnecting ? 'CONNECTING...' : 'RING RING... ☎️'}
        </p>

        <p className="mt-2.5 text-base sm:text-lg text-[#333333] max-w-md leading-relaxed">
          {isConnecting
            ? 'Opening the line for Bebe...'
            : 'Someone has a little message for you.'}
        </p>

        <div className="mt-7">
          <button
            type="button"
            onClick={onPickUp}
            disabled={isPickedUp}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#171717] text-[#F5F5F5] text-sm font-semibold tracking-wider uppercase shadow-[0_10px_24px_-6px_rgba(23,23,23,0.38)] hover:bg-[#333333] active:translate-y-0.5 transition-all duration-150 disabled:opacity-60 disabled:cursor-wait cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717] whitespace-nowrap"
          >
            <PhoneIncoming className="w-4 h-4 shrink-0" />
            <span>{isConnecting ? 'CONNECTING...' : 'PICK UP THE PHONE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
