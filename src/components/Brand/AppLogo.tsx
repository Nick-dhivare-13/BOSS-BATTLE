import React from 'react';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  className?: string;
  showText?: boolean;
  variant?: 'full' | 'shield-only' | 'icon-only';
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  variant = 'full',
}) => {
  const pixelSize = typeof size === 'number'
    ? size
    : size === 'xs'
    ? 28
    : size === 'sm'
    ? 36
    : size === 'md'
    ? 48
    : size === 'lg'
    ? 72
    : size === 'xl'
    ? 128
    : 220;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Main Shield Gradients */}
          <linearGradient id="shieldBg" x1="250" y1="20" x2="250" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#09140f" />
            <stop offset="50%" stopColor="#050d0a" />
            <stop offset="100%" stopColor="#020504" />
          </linearGradient>

          <linearGradient id="emeraldBorder" x1="100" y1="30" x2="400" y2="470" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="neonGreen" x1="250" y1="50" x2="250" y2="450" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          <linearGradient id="silverBlade" x1="80" y1="80" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="40%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <linearGradient id="helmetPlume" x1="250" y1="30" x2="250" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>

          <linearGradient id="bossTextGrad" x1="250" y1="240" x2="250" y2="330" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="45%" stopColor="#4ade80" />
            <stop offset="55%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          <filter id="emeraldGlow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="4" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Outer White / Slate Outline */}
        <path
          d="M 250 15 C 330 15 440 65 440 160 C 440 310 350 420 250 485 C 150 420 60 310 60 160 C 60 65 170 15 250 15 Z"
          fill="#000000"
          stroke="#ffffff"
          strokeWidth="6"
        />

        {/* Secondary Green Crest Border */}
        <path
          d="M 250 25 C 325 25 425 72 425 160 C 425 295 340 405 250 468 C 160 405 75 295 75 160 C 75 72 175 25 250 25 Z"
          fill="url(#shieldBg)"
          stroke="url(#emeraldBorder)"
          strokeWidth="10"
        />

        {/* Inner Emerald Accent Line */}
        <path
          d="M 250 38 C 315 38 405 80 405 160 C 405 285 330 388 250 448 C 170 388 95 285 95 160 C 95 80 185 38 250 38 Z"
          fill="none"
          stroke="#10b981"
          strokeWidth="3.5"
          opacity="0.9"
        />

        {/* ── Left Diagonal Sword ── */}
        <g transform="translate(10, 10)">
          {/* Pommel */}
          <circle cx="100" cy="115" r="14" fill="#15803d" stroke="#4ade80" strokeWidth="4" />
          {/* Handle Grip */}
          <rect x="94" y="125" width="12" height="38" rx="3" fill="#0f172a" stroke="#4ade80" strokeWidth="2.5" transform="rotate(-40 100 144)" />
          {/* Crossguard */}
          <polygon points="90,140 155,195 145,208 80,152" fill="#22c55e" stroke="#000000" strokeWidth="3" />
          {/* Sword Blade */}
          <polygon points="140,195 170,230 155,242 125,208" fill="url(#silverBlade)" stroke="#000000" strokeWidth="2.5" />
        </g>

        {/* ── Right Shield with Book Symbol ── */}
        <g transform="translate(305, 125)">
          {/* Book Shield Outline */}
          <path
            d="M 50 10 C 75 10 105 25 105 55 C 105 105 75 145 50 165 C 25 145 -5 105 -5 55 C -5 25 25 10 50 10 Z"
            fill="#052e16"
            stroke="#22c55e"
            strokeWidth="7"
          />
          <path
            d="M 50 18 C 70 18 95 30 95 55 C 95 98 70 135 50 152 C 30 135 5 98 5 55 C 5 30 30 18 50 18 Z"
            fill="#021a0d"
            stroke="#4ade80"
            strokeWidth="2"
          />
          {/* Mini Open Book on Shield */}
          <path
            d="M 50 78 C 38 68 22 68 18 72 L 18 106 C 24 102 38 102 50 112 C 62 102 76 102 82 106 L 82 72 C 78 68 62 68 50 78 Z"
            fill="#4ade80"
            stroke="#022c16"
            strokeWidth="3"
          />
          <line x1="50" y1="78" x2="50" y2="112" stroke="#022c16" strokeWidth="3" />
        </g>

        {/* ── Warrior Knight Helmet ── */}
        <g>
          {/* Plume / Top Crest */}
          <path
            d="M 250 42 C 265 42 285 58 285 78 C 285 92 272 106 250 112 C 228 106 215 92 215 78 C 215 58 235 42 250 42 Z"
            fill="url(#helmetPlume)"
            stroke="#052e16"
            strokeWidth="4"
          />
          <path
            d="M 250 48 C 260 55 272 65 272 78 C 265 72 255 70 250 70 C 245 70 235 72 228 78 C 228 65 240 55 250 48 Z"
            fill="#bbf7d0"
          />

          {/* Shoulders / Pauldrons */}
          <path
            d="M 180 160 C 200 130 230 125 250 125 C 270 125 300 130 320 160 L 335 195 C 300 215 200 215 165 195 Z"
            fill="#092615"
            stroke="#22c55e"
            strokeWidth="6"
          />
          {/* Pauldron Orbs */}
          <circle cx="210" cy="188" r="8" fill="#15803d" stroke="#86efac" strokeWidth="2.5" />
          <circle cx="290" cy="188" r="8" fill="#15803d" stroke="#86efac" strokeWidth="2.5" />

          {/* Helmet Faceplate & Visor */}
          <path
            d="M 250 68 L 290 108 L 285 168 L 250 198 L 215 168 L 210 108 Z"
            fill="#14532d"
            stroke="#22c55e"
            strokeWidth="6"
          />
          {/* Dark Face Grid */}
          <polygon points="250,85 280,115 276,160 250,185 224,160 220,115" fill="#021a0d" />

          {/* T-Shape / Cross Visor Glow */}
          <path
            d="M 230 115 H 270 V 125 H 255 V 158 H 245 V 125 H 230 Z"
            fill="#4ade80"
            filter="url(#emeraldGlow)"
          />
          <path
            d="M 232 117 H 268 V 123 H 253 V 156 H 247 V 123 H 232 Z"
            fill="#ffffff"
          />
        </g>

        {/* ── Open Foreground Book ── */}
        <g transform="translate(0, 195)">
          {/* Book Shadow & Backing */}
          <path
            d="M 250 20 C 205 2 155 4 140 18 L 140 54 C 158 40 208 38 250 56 C 292 38 342 40 360 54 L 360 18 C 345 4 295 2 250 20 Z"
            fill="#020f07"
            stroke="#000000"
            strokeWidth="7"
          />
          {/* Left Book Page */}
          <path
            d="M 250 20 C 208 3 158 5 142 20 L 142 54 C 160 38 208 36 250 54 Z"
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth="3"
          />
          {/* Right Book Page */}
          <path
            d="M 250 20 C 292 3 342 5 358 20 L 358 54 C 340 38 292 36 250 54 Z"
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth="3"
          />
          {/* Page Lines Left */}
          <line x1="165" y1="28" x2="232" y2="28" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="165" y1="36" x2="232" y2="36" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="168" y1="44" x2="228" y2="44" stroke="#94a3b8" strokeWidth="2.5" />

          {/* Page Lines Right */}
          <line x1="268" y1="28" x2="335" y2="28" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="268" y1="36" x2="335" y2="36" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="272" y1="44" x2="332" y2="44" stroke="#94a3b8" strokeWidth="2.5" />

          {/* Spine Center */}
          <line x1="250" y1="20" x2="250" y2="56" stroke="#16a34a" strokeWidth="4" />
        </g>

        {/* ── BOSS BATTLES Main Banner Typography ── */}
        <g>
          {/* Banner Ribbon Backing Bar */}
          <polygon
            points="35,250 80,240 420,240 465,250 435,340 380,340 370,355 130,355 120,340 65,340"
            fill="#020804"
            stroke="#ffffff"
            strokeWidth="6"
          />
          <polygon
            points="42,254 82,246 418,246 458,254 430,334 70,334"
            fill="#04160b"
            stroke="#22c55e"
            strokeWidth="4"
          />

          {/* "BOSS" Wordmark */}
          <text
            x="250"
            y="302"
            textAnchor="middle"
            fill="url(#bossTextGrad)"
            stroke="#000000"
            strokeWidth="8"
            paintOrder="stroke fill"
            fontSize="74"
            fontWeight="950"
            fontFamily="'Impact', 'Arial Black', 'Montserrat', sans-serif"
            letterSpacing="6"
          >
            BOSS
          </text>
          <text
            x="250"
            y="302"
            textAnchor="middle"
            fill="url(#bossTextGrad)"
            fontSize="74"
            fontWeight="950"
            fontFamily="'Impact', 'Arial Black', 'Montserrat', sans-serif"
            letterSpacing="6"
          >
            BOSS
          </text>

          {/* "BATTLES" Wordmark */}
          <text
            x="250"
            y="360"
            textAnchor="middle"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="8"
            paintOrder="stroke fill"
            fontSize="46"
            fontWeight="950"
            fontFamily="'Impact', 'Arial Black', 'Montserrat', sans-serif"
            letterSpacing="6"
          >
            BATTLES
          </text>
        </g>

        {/* ── Subtitle: STUDY. FIGHT. WIN. ── */}
        <g transform="translate(0, 20)">
          <line x1="135" y1="365" x2="165" y2="365" stroke="#22c55e" strokeWidth="2.5" />
          <text
            x="250"
            y="370"
            textAnchor="middle"
            fill="#4ade80"
            fontSize="18"
            fontWeight="900"
            fontFamily="'Montserrat', 'Arial Black', sans-serif"
            letterSpacing="3.5"
          >
            STUDY. FIGHT. WIN.
          </text>
          <line x1="335" y1="365" x2="365" y2="365" stroke="#22c55e" strokeWidth="2.5" />
        </g>

        {/* ── 3 Sub-Icons: Target, Book, Growth Chart ── */}
        <g transform="translate(180, 400)">
          {/* Target Icon */}
          <g transform="translate(0, 0)">
            <circle cx="20" cy="18" r="14" fill="none" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="20" cy="18" r="8" fill="none" stroke="#ffffff" strokeWidth="2" />
            <circle cx="20" cy="18" r="3" fill="#22c55e" />
            <line x1="28" y1="10" x2="36" y2="2" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="36" y1="2" x2="32" y2="2" stroke="#22c55e" strokeWidth="2.5" />
            <line x1="36" y1="2" x2="36" y2="6" stroke="#22c55e" strokeWidth="2.5" />
          </g>

          {/* Book Icon */}
          <g transform="translate(50, 4)">
            <path
              d="M 20 5 C 15 1 6 1 2 4 L 2 24 C 6 21 15 21 20 25 C 25 21 34 21 38 24 L 38 4 C 34 1 25 1 20 5 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <line x1="20" y1="5" x2="20" y2="25" stroke="#ffffff" strokeWidth="2.5" />
          </g>

          {/* Rising Chart Icon */}
          <g transform="translate(100, 4)">
            <rect x="2" y="16" width="6" height="10" fill="#ffffff" rx="1" />
            <rect x="12" y="10" width="6" height="16" fill="#ffffff" rx="1" />
            <rect x="22" y="4" width="6" height="22" fill="#ffffff" rx="1" />
            {/* Trend Arrow */}
            <path d="M 0 12 L 10 6 L 26 -2" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="26,-6 29,-1 23,0" fill="#22c55e" />
          </g>
        </g>

        {/* ── Green Bottom Star ── */}
        <polygon
          points="250,442 254,452 265,452 256,458 259,468 250,462 241,468 244,458 235,452 246,452"
          fill="#4ade80"
          stroke="#052e16"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};
