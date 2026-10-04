import React from 'react';

interface KraftHeinzLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'badge';
}

export const KraftHeinzLogo: React.FC<KraftHeinzLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
}) => {
  const heightClasses = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-16',
    xl: 'h-24',
  };

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {/* Red ABC Crest Badge with Kraft Heinz text */}
        <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl shadow-xs border border-slate-200">
          <svg
            viewBox="0 0 100 80"
            className="w-7 h-6 drop-shadow-xs shrink-0"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top gold sprout */}
            <path d="M 50 4 C 47 12, 42 16, 40 20 C 47 18, 53 18, 60 20 C 58 16, 53 12, 50 4 Z" fill="#F4B400"/>
            <ellipse cx="50" cy="14" rx="7" ry="4" fill="none" stroke="#F4B400" strokeWidth="1.8"/>
            {/* Scalloped Gold & Red ABC Crest */}
            <path
              d="M 50 10 C 66 10, 80 20, 84 32 C 94 37, 98 47, 98 58 C 98 71, 86 80, 72 80 C 66 84, 58 86, 50 86 C 42 86, 34 84, 28 80 C 14 80, 2 71, 2 58 C 2 47, 6 37, 16 32 C 20 20, 34 10, 50 10 Z"
              fill="#F9A825"
            />
            <path
              d="M 50 13 C 64 13, 76 22, 80 33 C 89 38, 93 47, 93 57 C 93 69, 82 77, 70 77 C 64 81, 57 83, 50 83 C 43 83, 36 81, 30 77 C 18 77, 7 69, 7 57 C 7 47, 11 38, 20 33 C 24 22, 36 13, 50 13 Z"
              fill="#D32F2F"
            />
            {/* ABC text */}
            <text x="35" y="60" fontFamily="Times New Roman, serif" fontWeight="900" fontSize="30" fill="#FFFFFF" textAnchor="middle">A</text>
            <text x="50" y="60" fontFamily="Times New Roman, serif" fontWeight="900" fontSize="30" fill="#FFFFFF" textAnchor="middle">B</text>
            <text x="65" y="60" fontFamily="Times New Roman, serif" fontWeight="900" fontSize="30" fill="#FFFFFF" textAnchor="middle">C</text>
          </svg>
          <div className="leading-tight tracking-tight">
            <span className="font-extrabold text-xs text-[#0C3466] font-sans">Kraft</span>
            <span className="font-serif italic font-black text-xs text-[#D8232A] ml-0.5">Heinz</span>
          </div>
        </div>
      </div>
    );
  }

  // Full High-Resolution Vector Representation
  return (
    <div className={`inline-block ${className}`}>
      <svg
        viewBox="0 0 500 295"
        className={`${heightClasses[size]} w-auto drop-shadow-sm transition-transform`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(0, -6)">
          {/* Top sprout element */}
          <path d="M 250 18 C 248 38, 240 45, 235 52 C 245 48, 255 48, 265 52 C 260 45, 252 38, 250 18 Z" fill="#F4B400"/>
          <ellipse cx="250" cy="38" rx="18" ry="11" fill="none" stroke="#F4B400" strokeWidth="4"/>

          {/* Scalloped Gold Background Crest */}
          <path
            d="M 250 8 C 285 8, 315 28, 325 58 C 348 70, 362 94, 362 120 C 362 152, 335 178, 300 182 C 285 194, 268 200, 250 200 C 232 200, 215 194, 200 182 C 165 178, 138 152, 138 120 C 138 94, 152 70, 175 58 C 185 28, 215 8, 250 8 Z"
            fill="#F9A825"
          />

          {/* Inner Crimson Red ABC Shield */}
          <path
            d="M 250 16 C 280 16, 306 34, 316 61 C 338 72, 352 93, 352 118 C 352 145, 328 168, 298 173 C 284 184, 268 190, 250 190 C 232 190, 216 184, 202 173 C 172 168, 148 145, 148 118 C 148 93, 162 72, 184 61 C 194 34, 220 16, 250 16 Z"
            fill="#D32F2F"
          />

          {/* Yellow flame loop on red shield */}
          <path d="M 238 34 Q 250 20 262 34 Q 250 48 238 34 Z" fill="#FBC02D"/>
          <path d="M 250 22 Q 253 45 248 54 Q 247 45 250 22 Z" fill="#FBC02D"/>

          {/* White ABC bold serif typography */}
          <text
            x="215"
            y="146"
            fontFamily="'Times New Roman', Georgia, serif"
            fontWeight="900"
            fontSize="68"
            fill="#FFFFFF"
            textAnchor="middle"
          >
            A
          </text>
          <text
            x="250"
            y="146"
            fontFamily="'Times New Roman', Georgia, serif"
            fontWeight="900"
            fontSize="68"
            fill="#FFFFFF"
            textAnchor="middle"
          >
            B
          </text>
          <text
            x="285"
            y="146"
            fontFamily="'Times New Roman', Georgia, serif"
            fontWeight="900"
            fontSize="68"
            fill="#FFFFFF"
            textAnchor="middle"
          >
            C
          </text>
        </g>

        {/* Kraft Heinz Wordmark */}
        <g transform="translate(10, 10)">
          {/* 'Kraft' in Deep Navy Sans-serif */}
          <text
            x="10"
            y="272"
            fontFamily="'Arial Black', 'Montserrat', 'Trebuchet MS', sans-serif"
            fontWeight="900"
            fontSize="84"
            fill="#0C3466"
            letterSpacing="-3"
          >
            Kraft
          </text>

          {/* 'Heinz' in Red Calligraphic Bold Script */}
          <text
            x="222"
            y="274"
            fontFamily="'Brush Script MT', 'Lucida Calligraphy', 'Edwardian Script ITC', 'Apple Chancery', cursive, serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="98"
            fill="#D8232A"
            letterSpacing="-1"
          >
            Heinz
          </text>
        </g>
      </svg>
    </div>
  );
};
