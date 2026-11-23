import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface RoseStampScreenProps {
  onContinue: () => void;
}

export const RoseStampScreen: React.FC<RoseStampScreenProps> = ({ onContinue }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleToggleFlip = () => {
    soundEngine.unlock();
    soundEngine.playPaperFlip();
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 py-2 flex flex-col items-center text-center select-none">
      {/* Top Heading & Subtitle */}
      <div className="mb-6 sm:mb-7">
        <p className="font-[family-name:var(--font-serif-stamp)] italic text-xs sm:text-sm tracking-[0.18em] uppercase text-[#EAEEF5]/85">
          Special Post · Edition 01
        </p>
        <h1 className="mt-1.5 font-[family-name:var(--font-serif-stamp)] text-2xl sm:text-4xl font-semibold tracking-tight text-[#FAF8F2] text-balance">
          A Special Delivery for Bebe
        </h1>
        <p className="mt-1.5 font-[family-name:var(--font-serif-stamp)] italic text-sm sm:text-base text-[#E2E7F0]/85">
          A little secret, wrapped in roses.
        </p>
      </div>

      {/* Interactive 3D Perforated Silver Vintage Postage Stamp */}
      <div className="relative flex flex-col items-center">
        {/* Dynamic Paper Drop Shadow beneath rotating stamp */}
        <div
          className={`pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 h-8 rounded-[50%] bg-[#192030]/55 blur-xl transition-all duration-700 ${
            isFlipped ? 'w-[250px] sm:w-[295px] scale-95 opacity-80' : 'w-[270px] sm:w-[320px] opacity-90'
          }`}
          aria-hidden="true"
        />

        <div className="stamp-perspective">
          <button
            type="button"
            onClick={handleToggleFlip}
            aria-pressed={isFlipped}
            aria-label={
              isFlipped
                ? 'Back of the silver vintage cat and rose postage stamp showing handwritten letter for Bebe. Tap to flip back.'
                : 'Front of the silver vintage postage stamp featuring a cat carrying red roses. Tap to flip over and read the secret message inside.'
            }
            className={`stamp-card-3d relative w-[308px] h-[420px] sm:w-[360px] sm:h-[476px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#FAF8F2] ${
              isFlipped ? 'is-flipped' : 'hover:-translate-y-1'
            }`}
          >
            {/* ==================== FRONT SIDE (SILVER CAT + ROSES STAMP) ==================== */}
            <div className="stamp-face absolute inset-0 stamp-perforated-paper p-5 sm:p-6 shadow-[0_24px_45px_-12px_rgba(18,24,38,0.65)]">
              {/* Silver Foil Metallic Hairline Frame inside Perforations */}
              <div className="relative w-full h-full p-[3px] bg-gradient-to-br from-[#EFEFEF] via-[#A9B0BA] to-[#787F8A] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]">
                {/* Inner Muted Silver-Ash Vintage Print Canvas (matching reference stamp) */}
                <div className="relative w-full h-full bg-gradient-to-b from-[#C7C4C9] via-[#BEB9BD] to-[#B0ACB2] overflow-hidden flex flex-col justify-between">
                  {/* Subtle vintage ink speckles & textured print grain */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply retro-grain"
                    aria-hidden="true"
                  />

                  {/* Top-Left Circular Cancellation Postmark Stamp overlapping corner (matching reference) */}
                  <svg
                    className="pointer-events-none absolute -top-4 -left-4 w-28 h-28 sm:w-32 sm:h-32 text-[#473E40]/65 -rotate-12 z-20"
                    viewBox="0 0 120 120"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="1.6" strokeDasharray="4 2" />
                    <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M16 54 H104 M16 66 H104" stroke="currentColor" strokeWidth="1.1" />
                    <text
                      x="60"
                      y="24"
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize="8.5"
                      fontWeight="700"
                      fontFamily="Playfair Display, serif"
                      letterSpacing="2"
                    >
                      BEBE POST
                    </text>
                    <text
                      x="60"
                      y="62"
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize="7"
                      fontWeight="700"
                      fontFamily="Playfair Display, serif"
                      letterSpacing="1.2"
                    >
                      EXAMINED
                    </text>
                    <text
                      x="60"
                      y="84"
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize="11"
                      fontWeight="700"
                      fontFamily="Playfair Display, serif"
                      letterSpacing="1.5"
                    >
                      1102
                    </text>
                  </svg>

                  {/* Top-Right Stamp Index "01" (matching reference) */}
                  <div className="relative z-20 flex justify-end px-3.5 pt-2.5">
                    <span className="font-[family-name:var(--font-serif-stamp)] text-xl sm:text-2xl font-bold tracking-wider text-[#3A3032]">
                      01
                    </span>
                  </div>

                  {/* Center Main Illustration: Tuxedo Cat Carrying a Bouquet of Deep Red Roses */}
                  <div className="relative z-10 flex-1 w-full flex items-end justify-center overflow-hidden">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 300 330"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="xMidYMax slice"
                    >
                      <defs>
                        <linearGradient id="silverSheet" x1="0" y1="150" x2="300" y2="330" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#E4E2E4" />
                          <stop offset="100%" stopColor="#C9C5C8" />
                        </linearGradient>
                        <linearGradient id="roseStripeBlanket" x1="120" y1="220" x2="300" y2="330" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#D7B2B5" />
                          <stop offset="100%" stopColor="#BD9095" />
                        </linearGradient>
                        <radialGradient id="catRoseDeep" cx="42%" cy="38%" r="62%">
                          <stop offset="0%" stopColor="#D63B48" />
                          <stop offset="55%" stopColor="#9E1A23" />
                          <stop offset="100%" stopColor="#59080E" />
                        </radialGradient>
                        <linearGradient id="catLeaf" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#668262" />
                          <stop offset="100%" stopColor="#354D33" />
                        </linearGradient>
                      </defs>

                      {/* Hand-drawn vintage paper ink speckles & tiny stars in silver sky */}
                      <g stroke="#6D6266" strokeWidth="1" opacity="0.32" strokeLinecap="round">
                        <path d="M28 45 Q34 42 38 47" />
                        <path d="M242 62 Q248 59 254 64" />
                        <path d="M196 34 Q202 38 208 33" />
                        <path d="M62 88 Q68 85 72 90" />
                        <path d="M258 124 Q264 120 270 125" />
                        <circle cx="48" cy="122" r="1.3" fill="#6D6266" />
                        <circle cx="222" cy="96" r="1.4" fill="#6D6266" />
                        <circle cx="176" cy="58" r="1.2" fill="#6D6266" />
                      </g>

                      {/* Diagonal Checkered Silver-Blush Wrap / Tablecloth (inspired by reference blanket fold) */}
                      <path
                        d="M0 282 L300 132 L300 330 L0 330 Z"
                        fill="url(#silverSheet)"
                        stroke="#8E8487"
                        strokeWidth="1"
                      />
                      {/* Subtle Diagonal Grid Lines */}
                      <g stroke="#9D9296" strokeWidth="0.8" opacity="0.45">
                        <path d="M16 320 L292 150" />
                        <path d="M48 330 L300 176" />
                        <path d="M98 330 L300 206" />
                        <path d="M84 240 L124 316" />
                        <path d="M124 218 L172 310" />
                        <path d="M166 196 L216 292" />
                        <path d="M210 174 L258 266" />
                        <path d="M252 152 L292 232" />
                      </g>

                      {/* Lower Striped Vintage Silver-Rose Cloth Fold */}
                      <path
                        d="M92 330 C138 258, 224 202, 300 184 L300 330 Z"
                        fill="url(#roseStripeBlanket)"
                        stroke="#87787C"
                        strokeWidth="1"
                      />
                      <g stroke="#F2E4E4" strokeWidth="2.2" opacity="0.42">
                        <path d="M114 330 C160 264, 232 216, 300 198" />
                        <path d="M136 330 C182 270, 246 228, 300 214" />
                        <path d="M158 330 C202 276, 258 240, 300 228" />
                        <path d="M180 330 C222 284, 270 254, 300 244" />
                        <path d="M204 330 C244 294, 280 268, 300 258" />
                        <path d="M230 330 C264 304, 288 284, 300 274" />
                      </g>

                      {/* ====== FLUFFY TUXEDO CAT ====== */}
                      {/* Cat Torso / Arm & White-Gloved Paws */}
                      <g>
                        {/* Back / Left Black Shoulder & Body */}
                        <path
                          d="M78 148 C68 182, 74 228, 92 256 L168 232 C176 204, 174 166, 152 142 Z"
                          fill="#252023"
                        />

                        {/* Fluffy White Chest Ruff Collar */}
                        <path
                          d="M70 144 C82 154, 96 158, 114 157 C134 156, 148 148, 158 136 C162 146, 154 156, 142 161 C128 168, 102 170, 82 162 C72 158, 66 150, 70 144 Z"
                          fill="#FAF7F2"
                        />

                        {/* Right Arm Reaching Forward */}
                        <path
                          d="M142 150 C166 146, 186 150, 200 158 L190 174 C174 170, 156 170, 140 172 Z"
                          fill="#252023"
                        />
                        {/* Right Cute White Paw */}
                        <ellipse cx="198" cy="164" rx="14" ry="10" transform="rotate(14 198 164)" fill="#FAF7F2" stroke="#D8D2CA" strokeWidth="0.8" />
                        <path d="M204 160 L209 162 M202 166 L207 168" stroke="#C5BEB6" strokeWidth="0.9" strokeLinecap="round" />

                        {/* Cat Head Silhouette (Fluffy Ears & Cheeks) */}
                        <path
                          d="M74 114 C68 98, 72 78, 78 68 L77 44 C78 40, 84 40, 96 54 C106 50, 118 50, 128 54 C138 38, 144 38, 146 44 L147 68 C154 78, 158 98, 152 118 C148 136, 134 150, 114 152 C92 154, 78 136, 74 114 Z"
                          fill="#252023"
                        />

                        {/* Soft Inner Ear Hints */}
                        <path d="M84 56 L86 70 L94 62 Z" fill="#463D40" opacity="0.65" />
                        <path d="M140 54 L138 68 L130 60 Z" fill="#463D40" opacity="0.65" />

                        {/* Classic Tuxedo White Facial Blaze & Muzzle */}
                        <path
                          d="M111 80 C114 80, 116 94, 118 106 C128 110, 136 118, 134 130 C131 142, 120 148, 110 148 C98 148, 89 140, 88 128 C87 116, 98 110, 106 106 C108 94, 108 80, 111 80 Z"
                          fill="#FAF7F2"
                        />

                        {/* Bright Olive-Sage Cat Eyes (matching reference) */}
                        <g>
                          <ellipse cx="98" cy="100" rx="7.5" ry="6.2" transform="rotate(8 98 100)" fill="#98AE5B" />
                          <ellipse cx="99" cy="100" rx="2.6" ry="4.8" fill="#171416" />
                          <circle cx="96.5" cy="98" r="1.4" fill="#FFFFFF" />

                          <ellipse cx="127" cy="99" rx="7.5" ry="6.2" transform="rotate(-8 127 99)" fill="#98AE5B" />
                          <ellipse cx="126" cy="99" rx="2.6" ry="4.8" fill="#171416" />
                          <circle cx="123.5" cy="97" r="1.4" fill="#FFFFFF" />
                        </g>

                        {/* Cute Soft Pink Triangle Nose & Gentle Smile */}
                        <path d="M108 117 L116 117 L112 122 Z" fill="#E39CA4" />
                        <path d="M112 122 L112 126 M106 125 Q109 129 112 126 Q115 129 118 125" stroke="#4D4245" strokeWidth="1.2" strokeLinecap="round" fill="none" />

                        {/* Delicate Whiskers */}
                        <g stroke="#FAF7F2" strokeWidth="0.9" opacity="0.72" strokeLinecap="round">
                          <path d="M88 121 L58 117" />
                          <path d="M88 126 L56 127" />
                          <path d="M136 120 L166 115" />
                          <path d="M136 125 L168 125" />
                        </g>
                      </g>

                      {/* ====== BOUQUET OF DEEP RED ROSES HELD BY THE CAT ====== */}
                      <g transform="translate(152, 166) rotate(-14)">
                        {/* Stems & Leaves */}
                        <path d="M-4 28 Q2 64 10 92" stroke="#3B5638" strokeWidth="4" strokeLinecap="round" />
                        <path d="M12 24 Q10 62 12 92" stroke="#4A6846" strokeWidth="3.5" strokeLinecap="round" />
                        <path d="M-20 34 C-38 28, -42 42, -26 48 C-16 52, -10 42, -20 34 Z" fill="url(#catLeaf)" stroke="#263924" strokeWidth="0.8" />
                        <path d="M24 22 C42 14, 48 28, 30 36 C20 40, 14 30, 24 22 Z" fill="url(#catLeaf)" stroke="#263924" strokeWidth="0.8" />
                        <path d="M18 46 C36 44, 38 60, 20 62 C10 64, 6 52, 18 46 Z" fill="url(#catLeaf)" stroke="#263924" strokeWidth="0.8" />

                        {/* Vintage Silver-Ivory Paper Wrap Cone */}
                        <path
                          d="M-24 38 L28 32 L14 96 L-6 96 Z"
                          fill="#F1EDE5"
                          stroke="#9E9591"
                          strokeWidth="1"
                        />
                        <path d="M-12 40 L4 94" stroke="#B7AFB1" strokeWidth="0.8" opacity="0.6" />

                        {/* Rose 1 (Top Center) */}
                        <g transform="translate(4, 4)">
                          <circle cx="0" cy="0" r="18" fill="#8A141D" />
                          <path d="M-14 -4 C-14 -16, 2 -20, 12 -10 C18 -2, 12 14, -2 15 C-12 16, -16 6, -14 -4 Z" fill="url(#catRoseDeep)" stroke="#49060B" strokeWidth="0.8" />
                          <path d="M-7 -4 C-2 -11, 8 -8, 8 1 C8 8, -3 9, -7 2" fill="#680C13" stroke="#EE9EA4" strokeWidth="0.9" />
                        </g>

                        {/* Rose 2 (Left) */}
                        <g transform="translate(-14, 20)">
                          <circle cx="0" cy="0" r="15" fill="#8A141D" />
                          <path d="M-12 -2 C-10 -14, 4 -16, 11 -6 C15 2, 8 13, -3 13 C-11 12, -13 4, -12 -2 Z" fill="url(#catRoseDeep)" stroke="#49060B" strokeWidth="0.8" />
                          <path d="M-5 -2 C0 -8, 7 -6, 6 2 C5 7, -3 7, -5 1" fill="#680C13" stroke="#EE9EA4" strokeWidth="0.8" />
                        </g>

                        {/* Rose 3 (Right) */}
                        <g transform="translate(18, 22)">
                          <circle cx="0" cy="0" r="16" fill="#8A141D" />
                          <path d="M-13 -3 C-10 -15, 6 -16, 12 -5 C16 4, 8 14, -3 14 C-12 13, -14 4, -13 -3 Z" fill="url(#catRoseDeep)" stroke="#49060B" strokeWidth="0.8" />
                          <path d="M-6 -2 C-1 -8, 8 -6, 7 2 C5 7, -4 7, -6 1" fill="#680C13" stroke="#EE9EA4" strokeWidth="0.8" />
                        </g>

                        {/* Tiny Silver-Red Ribbon Tie */}
                        <path d="M-8 66 C-18 62, -20 72, -6 72 Z" fill="#9E1A23" />
                        <path d="M10 66 C20 62, 22 72, 8 72 Z" fill="#9E1A23" />
                        <circle cx="1" cy="69" r="3.5" fill="#7D1119" />
                      </g>

                      {/* Front Left Black Arm & White Paw Holding the Rose Bouquet */}
                      <g>
                        <path
                          d="M94 176 C106 186, 122 194, 140 198 L134 218 C114 216, 94 206, 84 192 Z"
                          fill="#252023"
                        />
                        <ellipse cx="143" cy="208" rx="16" ry="11.5" transform="rotate(10 143 208)" fill="#FAF7F2" stroke="#D8D2CA" strokeWidth="0.8" />
                        <path d="M150 203 L156 205 M149 209 L155 211" stroke="#C5BEB6" strokeWidth="1" strokeLinecap="round" />
                      </g>
                    </svg>
                  </div>

                  {/* Bottom Stamp Caption & Interactive Flip Badge (matching "LA SIESTA" placement) */}
                  <div className="relative z-20 flex items-end justify-between gap-2 px-3 pb-2.5 pt-1 bg-gradient-to-t from-[#ACA7AE]/85 via-[#ACA7AE]/35 to-transparent">
                    <span className="inline-block border border-[#3A3032]/40 bg-[#FAF7F2]/85 px-2 py-0.5 font-[family-name:var(--font-serif-stamp)] text-[9.5px] sm:text-[10px] font-bold tracking-[0.2em] text-[#3A3032] uppercase">
                      FLIP ME ♡
                    </span>
                    <span className="font-[family-name:var(--font-serif-stamp)] text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.12em] text-[#3A3032] uppercase text-right">
                      A Little Something for You
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== BACK SIDE (SECRET HANDWRITTEN LETTER) ==================== */}
            <div className="stamp-face stamp-face-back absolute inset-0 stamp-perforated-paper p-5 sm:p-6 shadow-[0_24px_45px_-12px_rgba(18,24,38,0.65)]">
              <div className="relative w-full h-full p-[3px] bg-gradient-to-br from-[#EFEFEF] via-[#A9B0BA] to-[#787F8A]">
                <div className="relative w-full h-full bg-[#F7F3EB] p-4 sm:p-5 flex flex-col justify-between text-left overflow-hidden">
                  {/* Faint silver ruled postcard lines */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-22"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(transparent, transparent 24px, rgba(100,110,128,0.28) 25px)',
                    }}
                    aria-hidden="true"
                  />

                  {/* Top Corner Tiny Red Rose Illustration */}
                  <div className="relative z-10 flex items-start justify-between">
                    <span className="font-[family-name:var(--font-serif-stamp)] text-[9.5px] tracking-[0.2em] uppercase text-[#4B5364] border-b border-[#8C94A4]/45 pb-0.5">
                      POSTCARD · PRIVATE NOTE
                    </span>

                    {/* Tiny Red Rose Corner Illustration */}
                    <svg
                      className="w-10 h-10 -mt-1 -mr-1 shrink-0"
                      viewBox="0 0 48 48"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M24 24 Q22 36 18 44" stroke="#3B5638" strokeWidth="2" strokeLinecap="round" />
                      <path d="M22 33 C14 31, 13 38, 20 38" fill="#4E6D4A" />
                      <path d="M24 30 C32 27, 34 34, 25 35" fill="#4E6D4A" />
                      <circle cx="24" cy="18" r="9.5" fill="#9E1B24" />
                      <path d="M18 16 C20 11, 29 11, 30 17 C31 23, 21 25, 18 20" fill="#B7242E" stroke="#F4B7BC" strokeWidth="0.8" />
                      <path d="M22 16 C23 14, 27 14, 27 18 C27 20, 22 21, 21 18" fill="#6A0D14" />
                    </svg>
                  </div>

                  {/* Hidden Handwritten Message */}
                  <div className="relative z-10 flex-1 flex flex-col justify-center py-1 font-[family-name:var(--font-handwriting)] text-[#242934] text-[15px] sm:text-[17px] leading-[1.22]">
                    <p className="font-bold text-[18px] sm:text-[19.5px] text-[#1D2330]">Dear Bebe,</p>

                    <p className="mt-1.5">
                      Some people come into our lives and quietly become one of the most beautiful parts of our story. I&apos;m really grateful that I get to call you my best friend.
                    </p>

                    <p className="mt-1.5">
                      No matter where life takes us, I hope you never forget how special you are to me. This little stamp carries a secret reminder: you are loved, appreciated, and irreplaceable.
                    </p>

                    <div className="mt-2">
                      <p>With love,</p>
                      <p className="font-bold text-[17.5px] sm:text-[19px] text-[#9E1A23]">
                        Your Best Friend ♡
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row: Flip Back Cue & Heart-Shaped Wax Seal */}
                  <div className="relative z-10 flex items-end justify-between pt-1">
                    <span className="font-[family-name:var(--font-serif-stamp)] italic text-[10px] text-[#5B6475]">
                      Tap stamp to flip back
                    </span>

                    {/* Small Heart-Shaped Red Wax Seal */}
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0" aria-hidden="true">
                      <svg className="w-12 h-12 drop-shadow-[0_3px_5px_rgba(23,12,14,0.35)]" viewBox="0 0 64 64" fill="none">
                        <path
                          d="M32 7 C40 6, 48 10, 53 16 C59 23, 58 34, 54 42 C50 51, 41 56, 32 57 C22 57, 13 52, 9 43 C5 34, 7 22, 13 15 C18 9, 25 8, 32 7 Z"
                          fill="#8C141C"
                        />
                        <circle cx="32" cy="32" r="18" fill="#A61D27" stroke="#680B12" strokeWidth="1.5" />
                        <path
                          d="M32 41 C32 41, 21 33.8, 21 26.8 C21 23.2, 23.8 20.8, 27 20.8 C29.2 20.8, 31 22, 32 23.6 C33 22, 34.8 20.8, 37 20.8 C40.2 20.8, 43 23.2, 43 26.8 C43 33.8, 32 41, 32 41 Z"
                          fill="#780E16"
                          stroke="#D4535C"
                          strokeWidth="1"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Gentle Hint Below Stamp & Continue Button */}
      <p className="mt-7 font-[family-name:var(--font-serif-stamp)] italic text-sm sm:text-base text-[#FAF8F2]/90">
        {isFlipped
          ? 'Tap the stamp anytime to flip it back and forth ♡'
          : "There's something hidden inside... tap to discover ♡"}
      </p>

      <div className="mt-5">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-[#FAF8F2] text-[#283142] font-[family-name:var(--font-serif-stamp)] text-sm sm:text-base font-semibold tracking-wide shadow-[0_12px_24px_-6px_rgba(18,24,38,0.45)] hover:bg-[#FFFFFF] active:translate-y-0.5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FAF8F2] whitespace-nowrap"
        >
          <span>Continue →</span>
        </button>
      </div>
    </div>
  );
};
