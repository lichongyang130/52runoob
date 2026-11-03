/* howcompass-style stacked books + globe hero illustration. */

export default function BooksIllustration({ className = "" }) {
  const Book = ({ y, h, x, w, color, edge, label, labelColor = "#fff" }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="7" fill={color} />
      <rect
        x={x}
        y={y}
        width={w}
        height="7"
        rx="3.5"
        fill={edge}
        opacity="0.75"
      />
      <rect
        x={x + w - 12}
        y={y + 5}
        width="12"
        height={h - 9}
        rx="4"
        fill="#fdf8ee"
      />
      <rect
        x={x + 10}
        y={y + h - 9}
        width={w - 34}
        height="3"
        rx="1.5"
        fill="rgba(0,0,0,.08)"
      />
      {label ? (
        <text
          x={x + w / 2}
          y={y + h / 2 + 5}
          textAnchor="middle"
          fontFamily="Trebuchet MS, Verdana, sans-serif"
          fontSize="13"
          fontWeight="700"
          letterSpacing="1.5"
          fill={labelColor}
        >
          {label}
        </text>
      ) : null}
    </g>
  );

  return (
    <svg
      viewBox="0 0 440 372"
      className={`books-illus ${className}`}
      role="img"
      aria-label="Stack of illustrated how-to books with a plant growing from the top and a globe"
    >
      {/* globe stand */}
      <path
        d="M30 316 q56 34 112 0"
        stroke="#c89a63"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="80" y="300" width="12" height="28" rx="5" fill="#c89a63" />
      <rect x="52" y="326" width="68" height="13" rx="6.5" fill="#b9854f" />
      {/* globe */}
      <circle cx="86" cy="272" r="56" fill="#e3f2f8" />
      <path
        d="M66 232 q26 -10 40 4 q10 12 -4 24 q-16 12 -30 2 q-14 -12 -6 -30"
        fill="#9ccf52"
      />
      <path
        d="M118 268 q14 6 10 22 q-4 16 -20 14 q-14 -4 -10 -18 q6 -14 20 -18"
        fill="#8bc34a"
      />
      <path d="M52 292 q16 -8 26 2 q8 8 -2 14 q-16 6 -24 -16" fill="#9ccf52" />
      <ellipse
        cx="86"
        cy="272"
        rx="56"
        ry="56"
        fill="none"
        stroke="#bfd9e4"
        strokeWidth="2"
      />
      <path
        d="M86 216 q-30 56 0 112"
        stroke="#bfd9e4"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M86 216 q30 56 0 112"
        stroke="#bfd9e4"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M32 256 q54 22 108 0"
        stroke="#bfd9e4"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M32 288 q54 22 108 0"
        stroke="#bfd9e4"
        strokeWidth="2"
        fill="none"
      />

      {/* book stack, bottom up */}
      <Book
        x={190}
        y={300}
        w={238}
        h={46}
        color="#2f9fb3"
        edge="#4db6c9"
        label="DO ANYTHING"
      />
      <Book x={206} y={262} w={208} h={40} color="#f2f4ee" edge="#ffffff" />
      <rect
        x="206"
        y="262"
        width="208"
        height="40"
        rx="7"
        fill="none"
        stroke="#dde3d6"
        strokeWidth="2"
      />
      <rect x="214" y="276" width="128" height="12" rx="6" fill="#f0a83c" />
      <rect x="214" y="292" width="72" height="4" rx="2" fill="#d8ddcf" />
      <Book x={198} y={226} w={216} h={38} color="#e8634a" edge="#f28b74" />
      <Book
        x={214}
        y={192}
        w={184}
        h={36}
        color="#7cb342"
        edge="#a6ce39"
        label="how to"
      />
      <Book x={196} y={158} w={220} h={36} color="#4a90d9" edge="#7cb3e8" />
      <Book x={212} y={126} w={188} h={34} color="#f5c518" edge="#ffd95e" />

      {/* open book on top */}
      <g>
        <path
          d="M188 104 q44 -22 88 -6 q44 -16 88 6 l0 20 q-46 -20 -88 -6 q-42 -14 -88 6 Z"
          fill="#eef6e0"
        />
        <path
          d="M188 104 q44 -22 88 -6 q44 -16 88 6 q-46 24 -88 8 q-42 16 -88 -8"
          fill="#ffffff"
        />
        <path
          d="M188 104 q44 -22 88 -6 q44 -16 88 6 l0 6 q-46 -18 -88 -4 q-42 -14 -88 4 Z"
          fill="#7cb342"
        />
        <path d="M274 98 l0 24" stroke="#d7e3c6" strokeWidth="3" />
        <path
          d="M206 118 q16 -6 30 -2 M206 126 q16 -6 30 -2 M312 118 q16 -4 30 2 M312 126 q16 -4 30 2"
          stroke="#cfdcc0"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* sprout growing out of the open book */}
      <path
        d="M300 96 q6 -22 -4 -40"
        stroke="#6aa832"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M294 74 q-24 -2 -26 -24 q24 -2 26 24" fill="#8bc34a" />
      <path d="M298 62 q22 -6 30 10 q-22 10 -30 -10" fill="#9ccf52" />
      <circle cx="298" cy="50" r="8" fill="#e8634a" />
      <circle cx="298" cy="50" r="3" fill="#f7d24a" />

      {/* hearts */}
      <path
        d="M176 150 q-10 -8 -16 -1 q-6 8 16 20 q22 -12 16 -20 q-6 -7 -16 1"
        fill="#e8634a"
        opacity="0.85"
      />
      <path
        d="M160 114 q-7 -6 -11 0 q-4 6 11 14 q15 -8 11 -14 q-4 -6 -11 0"
        fill="#f28b74"
        opacity="0.7"
      />
    </svg>
  );
}
