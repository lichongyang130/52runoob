/* Hand-drawn flat vector illustrations in the Howcompass house style:
   soft tinted background, rounded shapes, no outlines, warm palette. */

const PALETTE = {
  ink: "#2f3e46",
  green: "#a6ce39",
  greenDark: "#7cb342",
  teal: "#1ba39c",
  peach: "#ffd9c0",
  cream: "#fff7ea",
  blue: "#cfe6f7",
  pink: "#ffd6e0",
  mint: "#d9f0dc",
  lemon: "#fff2c2",
  lilac: "#e6dcf7",
  sky: "#dceefb",
  sand: "#fbe9d0",
  wood: "#d9a066",
  woodDark: "#b97a45",
  terracotta: "#d97b5a",
  skin: "#f0c19b",
  skinDark: "#c98b63",
  hair: "#3b2a20",
  white: "#ffffff",
  red: "#e05b4b",
  tomato: "#e14b3b",
  crust: "#e0b072",
  choco: "#4a2c1a",
  gold: "#f2c14e",
  gray: "#dfe6ea",
  steel: "#a8b6c0",
};

function Frame({ bg, children, ratio = "4 / 3", className = "", style = {} }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={`illus ${className}`}
      style={{ aspectRatio: ratio, ...style }}
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="400" height="300" fill={bg} />
      {children}
    </svg>
  );
}

const shadows = (cx, cy, rx, ry, fill = "rgba(0,0,0,0.08)") => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} />
);

/* ---------------------------------- scenes --------------------------------- */

function Carbonara({ bg = PALETTE.cream }) {
  return (
    <Frame bg={bg}>
      <circle cx="330" cy="60" r="26" fill={PALETTE.lemon} opacity="0.7" />
      {shadows(200, 258, 120, 16)}
      <ellipse cx="200" cy="200" rx="130" ry="78" fill={PALETTE.white} />
      <ellipse cx="200" cy="196" rx="108" ry="60" fill="#fdfaf3" />
      <ellipse cx="200" cy="192" rx="86" ry="44" fill="#f7d98c" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path
          key={i}
          d={`M${120 + i * 12} ${180 + (i % 3) * 6} q26 -22 56 -4 q30 18 60 -2`}
          stroke={i % 2 ? "#f0c455" : "#e8b93f"}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <rect
        x="150"
        y="176"
        width="34"
        height="13"
        rx="5"
        fill={PALETTE.terracotta}
        transform="rotate(-12 167 182)"
      />
      <rect
        x="215"
        y="196"
        width="38"
        height="14"
        rx="5"
        fill={PALETTE.terracotta}
        transform="rotate(9 234 203)"
      />
      <rect
        x="188"
        y="164"
        width="30"
        height="11"
        rx="5"
        fill={PALETTE.wood}
        transform="rotate(-22 203 169)"
      />
      {["#a6ce39", "#7cb342", "#a6ce39"].map((c, i) => (
        <circle
          key={i}
          cx={168 + i * 34}
          cy={182 - (i % 2) * 8}
          r="3.2"
          fill={c}
        />
      ))}
      <path
        d="M300 208 L352 132"
        stroke={PALETTE.steel}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M306 ${196 - i * 6} L348 ${146 - i * 6}`}
          stroke="#c9d4dc"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      ))}
      <path
        d="M96 236 q-16 -6 -10 -22 M96 236 q12 -10 26 -4"
        stroke={PALETTE.greenDark}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </Frame>
  );
}

function Tomatoes({ bg = PALETTE.mint }) {
  return (
    <Frame bg={bg}>
      <circle cx="72" cy="62" r="30" fill={PALETTE.lemon} opacity="0.8" />
      {shadows(196, 264, 92, 14)}
      <path
        d="M142 196 L250 196 L236 262 L156 262 Z"
        fill={PALETTE.terracotta}
      />
      <rect x="134" y="182" width="124" height="20" rx="8" fill="#c96844" />
      <path
        d="M200 186 L200 92"
        stroke={PALETTE.wood}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {[
        [178, 168, -28],
        [222, 150, 24],
        [190, 128, -14],
        [228, 110, 34],
        [166, 118, -40],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <ellipse
            cx={x}
            cy={y}
            rx="26"
            ry="14"
            fill={i % 2 ? "#8fbf4d" : PALETTE.greenDark}
          />
        </g>
      ))}
      <circle cx="196" cy="150" r="15" fill={PALETTE.tomato} />
      <circle cx="188" cy="146" r="4" fill="#f07a6a" opacity="0.9" />
      <circle cx="232" cy="168" r="12" fill="#ef6a58" />
      <circle cx="168" cy="166" r="10" fill="#d9422f" />
      <path
        d="M188 138 l8 -6 l8 6"
        stroke={PALETTE.greenDark}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M300 168 q-6 -40 18 -66"
        stroke={PALETTE.greenDark}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M318 116 q18 6 22 24 q-20 2 -22 -24" fill={PALETTE.green} />
    </Frame>
  );
}

function Guitar({ bg = PALETTE.sky }) {
  return (
    <Frame bg={bg}>
      <circle cx="86" cy="230" r="40" fill={PALETTE.lemon} opacity="0.55" />
      {shadows(210, 266, 96, 14)}
      <g transform="rotate(-18 210 170)">
        <rect
          x="196"
          y="46"
          width="26"
          height="120"
          rx="6"
          fill={PALETTE.woodDark}
        />
        <rect x="200" y="34" width="18" height="22" rx="5" fill="#8c5a34" />
        <circle cx="209" cy="150" r="52" fill={PALETTE.wood} />
        <circle cx="209" cy="216" r="62" fill={PALETTE.wood} />
        <circle cx="209" cy="150" r="17" fill="#5c3a22" />
        <rect x="186" y="196" width="46" height="10" rx="4" fill="#8c5a34" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${201 + i * 4} 44 L${201 + i * 4} 232`}
            stroke="#f6f1e6"
            strokeWidth="1.6"
          />
        ))}
      </g>
      <g fill={PALETTE.skin}>
        <ellipse
          cx="286"
          cy="150"
          rx="30"
          ry="24"
          transform="rotate(-24 286 150)"
        />
        <ellipse
          cx="308"
          cy="196"
          rx="26"
          ry="20"
          transform="rotate(-16 308 196)"
        />
      </g>
      <path
        d="M282 132 q22 10 30 32"
        stroke={PALETTE.skinDark}
        strokeWidth="3"
        fill="none"
        opacity="0.5"
      />
      <circle cx="256" cy="112" r="18" fill={PALETTE.cream} opacity="0.9" />
    </Frame>
  );
}

function Puppy({ bg = PALETTE.sand }) {
  return (
    <Frame bg={bg}>
      <circle cx="322" cy="72" r="34" fill={PALETTE.pink} opacity="0.7" />
      {shadows(196, 258, 88, 14)}
      <ellipse cx="186" cy="220" rx="66" ry="44" fill="#e8b96a" />
      <ellipse cx="238" cy="236" rx="34" ry="14" fill="#f0c785" />
      <circle cx="164" cy="150" r="48" fill="#f0c785" />
      <ellipse
        cx="126"
        cy="142"
        rx="18"
        ry="30"
        fill="#d9a35c"
        transform="rotate(-12 126 142)"
      />
      <ellipse
        cx="204"
        cy="140"
        rx="16"
        ry="28"
        fill="#d9a35c"
        transform="rotate(12 204 140)"
      />
      <ellipse cx="160" cy="176" rx="30" ry="22" fill="#fff0d6" />
      <circle cx="150" cy="150" r="4.5" fill={PALETTE.hair} />
      <circle cx="182" cy="150" r="4.5" fill={PALETTE.hair} />
      <ellipse cx="166" cy="170" rx="7" ry="5" fill={PALETTE.hair} />
      <path
        d="M166 176 q0 8 8 8"
        stroke={PALETTE.hair}
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M160 210 q34 -6 60 6"
        stroke={PALETTE.teal}
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="196" cy="216" r="5" fill={PALETTE.gold} />
      <g>
        <rect x="286" y="150" width="52" height="42" rx="10" fill="#fdf3e0" />
        <path
          d="M286 158 l26 14 l26 -14"
          fill="none"
          stroke="#e3d3b8"
          strokeWidth="3"
        />
        <ellipse cx="300" cy="204" rx="26" ry="16" fill={PALETTE.skin} />
      </g>
    </Frame>
  );
}

function Watercolor({ bg = PALETTE.peach }) {
  return (
    <Frame bg={bg}>
      <g transform="rotate(-6 196 176)">
        <rect
          x="86"
          y="96"
          width="200"
          height="150"
          rx="6"
          fill={PALETTE.white}
        />
        <path
          d="M104 214 q46 -78 92 -44 q40 30 74 -18"
          stroke="#8ecae6"
          strokeWidth="0"
        />
        <path
          d="M108 210 q52 -86 96 -52 q36 28 62 -20 L266 236 L108 236 Z"
          fill="#cfe8ef"
        />
        <path
          d="M108 210 q52 -86 96 -52 q36 28 62 -20"
          stroke="#5aa9c9"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="228" cy="132" r="20" fill="#ffd166" opacity="0.85" />
        <path
          d="M120 226 q60 -16 120 0"
          stroke="#7cb342"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
      {shadows(300, 262, 54, 10)}
      <rect x="252" y="212" width="104" height="34" rx="8" fill="#efe3d3" />
      {[
        ["#e05b4b", 268],
        ["#f2c14e", 292],
        ["#4f9dd6", 316],
        ["#7cb342", 338],
      ].map(([c, x], i) => (
        <circle key={i} cx={x} cy={228} r="8" fill={c} />
      ))}
      <g transform="rotate(20 340 150)">
        <rect x="332" y="96" width="9" height="86" rx="4" fill={PALETTE.wood} />
        <rect
          x="330"
          y="176"
          width="13"
          height="20"
          rx="5"
          fill={PALETTE.steel}
        />
        <path d="M336 196 l5 14 l5 -14 Z" fill={PALETTE.teal} />
      </g>
    </Frame>
  );
}

function Resume({ bg = PALETTE.lilac }) {
  return (
    <Frame bg={bg}>
      <circle cx="316" cy="70" r="28" fill={PALETTE.lemon} opacity="0.8" />
      {shadows(196, 262, 96, 13)}
      <g transform="rotate(-4 196 168)">
        <rect
          x="106"
          y="62"
          width="180"
          height="204"
          rx="8"
          fill={PALETTE.white}
        />
        <rect
          x="126"
          y="84"
          width="84"
          height="12"
          rx="6"
          fill={PALETTE.teal}
        />
        <rect
          x="126"
          y="104"
          width="120"
          height="7"
          rx="3.5"
          fill={PALETTE.gray}
        />
        {[130, 152, 174, 196, 218].map((y, i) => (
          <g key={y}>
            <rect
              x="126"
              y={y}
              width={i % 2 ? 96 : 128}
              height="7"
              rx="3.5"
              fill={PALETTE.gray}
            />
          </g>
        ))}
        <rect
          x="126"
          y="240"
          width="60"
          height="14"
          rx="5"
          fill={PALETTE.green}
          opacity="0.8"
        />
      </g>
      <g transform="rotate(24 300 178)">
        <rect x="296" y="112" width="14" height="112" rx="7" fill="#3f4b52" />
        <path d="M296 224 l7 26 l7 -26 Z" fill={PALETTE.wood} />
        <rect x="296" y="120" width="14" height="10" fill={PALETTE.green} />
      </g>
      <path
        d="M78 250 q-4 -46 24 -64"
        stroke={PALETTE.greenDark}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M98 194 q22 4 24 22 q-24 2 -24 -22" fill={PALETTE.green} />
    </Frame>
  );
}

function Cookies({ bg = PALETTE.sand }) {
  return (
    <Frame bg={bg}>
      <circle cx="70" cy="66" r="26" fill={PALETTE.pink} opacity="0.7" />
      {shadows(200, 250, 122, 15)}
      <rect x="62" y="130" width="276" height="116" rx="16" fill="#b9c3c9" />
      <rect x="72" y="140" width="256" height="96" rx="10" fill="#cfd8dd" />
      {[
        [116, 178, 34],
        [188, 172, 36],
        [262, 182, 32],
        [150, 218, 30],
        [226, 216, 30],
      ].map(([cx, cy, r], i) => (
        <g key={i}>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill={i % 2 ? PALETTE.crust : "#d8a75f"}
          />
          {[0, 1, 2, 3, 4].map((j) => (
            <circle
              key={j}
              cx={cx + Math.cos(j * 1.7 + i) * r * 0.5}
              cy={cy + Math.sin(j * 1.7 + i) * r * 0.5}
              r={r * 0.12}
              fill={PALETTE.choco}
            />
          ))}
        </g>
      ))}
      <path
        d="M286 96 q22 -24 44 -10 q14 10 -2 22 q-18 14 -42 -12"
        fill="#e8c27f"
      />
      <circle cx="304" cy="96" r="4" fill={PALETTE.choco} />
      <circle cx="324" cy="104" r="4" fill={PALETTE.choco} />
      <path
        d="M186 122 l0 -18"
        stroke={PALETTE.greenDark}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </Frame>
  );
}

function Money({ bg = PALETTE.mint }) {
  return (
    <Frame bg={bg}>
      <circle cx="330" cy="66" r="30" fill={PALETTE.lemon} opacity="0.8" />
      {shadows(196, 262, 92, 13)}
      <path
        d="M128 152 L128 240 q0 22 68 22 q68 0 68 -22 L264 152 Z"
        fill="#e7f4f3"
      />
      <path
        d="M128 152 q0 -16 68 -16 q68 0 68 16 q0 14 -68 14 q-68 0 -68 -14"
        fill="#cfeae7"
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle
          key={i}
          cx={150 + (i % 3) * 28}
          cy={228 - Math.floor(i / 3) * 16}
          r="13"
          fill={PALETTE.gold}
        />
      ))}
      <circle cx="206" cy="212" r="14" fill="#ffd977" />
      <path
        d="M196 152 l14 10 l14 -10"
        stroke={PALETTE.greenDark}
        strokeWidth="3"
        fill="none"
      />
      <g>
        <ellipse cx="300" cy="242" rx="26" ry="8" fill="rgba(0,0,0,0.07)" />
        {[0, 1, 2, 3].map((i) => (
          <ellipse
            key={i}
            cx="300"
            cy={234 - i * 8}
            rx="24"
            ry="7"
            fill={i % 2 ? PALETTE.gold : "#ffd977"}
          />
        ))}
      </g>
      <path
        d="M96 210 q-2 -44 22 -62"
        stroke={PALETTE.greenDark}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M116 152 q22 4 24 22 q-24 2 -24 -22" fill={PALETTE.green} />
      <circle cx="352" cy="196" r="10" fill={PALETTE.green} opacity="0.5" />
    </Frame>
  );
}

function Camera({ bg = PALETTE.sky }) {
  return (
    <Frame bg={bg}>
      <circle cx="320" cy="66" r="28" fill={PALETTE.lemon} />
      {shadows(198, 244, 96, 14)}
      <rect x="104" y="128" width="196" height="118" rx="18" fill="#3f4b52" />
      <rect x="126" y="108" width="60" height="24" rx="8" fill="#2f3e46" />
      <circle cx="212" cy="186" r="46" fill="#5c6b73" />
      <circle cx="212" cy="186" r="34" fill="#22303a" />
      <circle cx="212" cy="186" r="20" fill="#8ecae6" />
      <circle cx="202" cy="176" r="7" fill="#e8f6fb" />
      <rect
        x="270"
        y="140"
        width="18"
        height="12"
        rx="4"
        fill={PALETTE.green}
      />
      <path
        d="M104 150 q-26 -6 -22 -34 q4 -20 24 -12"
        stroke="#3f4b52"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <g>
        <ellipse cx="300" cy="252" rx="30" ry="8" fill={PALETTE.skin} />
        <ellipse cx="318" cy="222" rx="22" ry="16" fill={PALETTE.skin} />
      </g>
      <path
        d="M74 244 l0 -50 M50 220 l48 0"
        stroke={PALETTE.white}
        strokeWidth="0"
      />
      <circle cx="70" cy="200" r="6" fill="#ffffff" opacity="0.8" />
      <circle cx="88" cy="228" r="4" fill="#ffffff" opacity="0.6" />
    </Frame>
  );
}

function Stretch({ bg = PALETTE.mint }) {
  return (
    <Frame bg={bg}>
      <rect x="238" y="42" width="118" height="104" rx="10" fill="#eaf6fb" />
      <circle cx="296" cy="94" r="24" fill={PALETTE.lemon} />
      <path d="M238 122 l118 0" stroke="#cfe6f7" strokeWidth="6" />
      {shadows(190, 254, 108, 12)}
      <rect
        x="66"
        y="234"
        width="264"
        height="26"
        rx="13"
        fill="#c8a9e8"
        opacity="0.75"
      />
      <path
        d="M116 234 q-6 -52 38 -60 q50 -8 66 26 q10 24 42 34 Z"
        fill={PALETTE.teal}
      />
      <circle cx="136" cy="196" r="22" fill={PALETTE.skin} />
      <path
        d="M120 184 q10 -18 34 -10 q10 6 6 16 q-22 -8 -40 -6"
        fill={PALETTE.hair}
      />
      <path
        d="M150 216 q-20 8 -34 18"
        stroke={PALETTE.skinDark}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M236 216 q26 10 42 20"
        stroke="#147f79"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M92 246 q-26 -8 -22 -34"
        stroke={PALETTE.greenDark}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M70 208 q22 2 24 20 q-24 2 -24 -20" fill={PALETTE.green} />
      <circle cx="66" cy="86" r="5" fill="#ffffff" opacity="0.8" />
      <circle cx="92" cy="62" r="3.4" fill="#ffffff" opacity="0.6" />
    </Frame>
  );
}

function Laptop({ bg = PALETTE.lilac }) {
  return (
    <Frame bg={bg}>
      <circle cx="300" cy="66" r="30" fill={PALETTE.lemon} opacity="0.8" />
      {shadows(196, 252, 104, 14)}
      <path
        d="M112 96 h168 q10 0 10 10 v112 h-188 v-112 q0 -10 10 -10"
        fill="#3f4b52"
      />
      <rect x="112" y="106" width="168" height="102" rx="4" fill="#eaf6fb" />
      <rect x="130" y="124" width="58" height="8" rx="4" fill={PALETTE.teal} />
      {[142, 156, 170, 184].map((y, i) => (
        <rect
          key={y}
          x="130"
          y={y}
          width={i % 2 ? 78 : 104}
          height="6"
          rx="3"
          fill="#c3d8e2"
        />
      ))}
      <rect
        x="206"
        y="150"
        width="56"
        height="40"
        rx="6"
        fill={PALETTE.green}
        opacity="0.55"
      />
      <path
        d="M92 218 h216 l18 22 q0 6 -8 6 h-236 q-8 0 -8 -6 Z"
        fill="#5c6b73"
      />
      <path
        d="M170 232 h52"
        stroke="#8b9aa3"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M312 232 q18 -6 22 -26"
        stroke={PALETTE.greenDark}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M330 200 q20 6 22 24 q-24 0 -22 -24" fill={PALETTE.green} />
    </Frame>
  );
}

function Books({ bg = PALETTE.lemon }) {
  return (
    <Frame bg={bg}>
      <circle cx="80" cy="68" r="26" fill={PALETTE.pink} opacity="0.6" />
      {shadows(200, 252, 96, 13)}
      <rect
        x="112"
        y="196"
        width="176"
        height="30"
        rx="6"
        fill={PALETTE.teal}
      />
      <rect x="124" y="168" width="150" height="30" rx="6" fill={PALETTE.red} />
      <rect x="104" y="140" width="164" height="30" rx="6" fill="#4f9dd6" />
      <rect
        x="140"
        y="114"
        width="104"
        height="28"
        rx="6"
        fill={PALETTE.green}
      />
      <rect
        x="150"
        y="122"
        width="60"
        height="6"
        rx="3"
        fill="#ffffff"
        opacity="0.7"
      />
      <rect
        x="120"
        y="176"
        width="60"
        height="6"
        rx="3"
        fill="#ffffff"
        opacity="0.6"
      />
      <rect
        x="118"
        y="148"
        width="54"
        height="6"
        rx="3"
        fill="#ffffff"
        opacity="0.6"
      />
      <circle cx="302" cy="196" r="30" fill="#e05b4b" />
      <path
        d="M302 172 q10 -12 22 -6"
        stroke={PALETTE.greenDark}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M290 186 q6 8 14 8 q10 0 12 -10"
        stroke="#ffffff"
        strokeWidth="3"
        fill="none"
        opacity="0.5"
      />
    </Frame>
  );
}

function Heart({ bg = PALETTE.pink }) {
  return (
    <Frame bg={bg}>
      {shadows(200, 254, 84, 12)}
      <path
        d="M200 246 C120 190 96 150 118 118 C140 86 186 96 200 128 C214 96 260 86 282 118 C304 150 280 190 200 246 Z"
        fill="#ef6a58"
      />
      <path d="M200 128 q22 -30 54 -20" stroke="#ffffff" strokeWidth="0" />
      <path
        d="M168 150 q-10 -22 8 -34"
        stroke="#ffffff"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M200 246 q40 -30 66 -60"
        stroke={PALETTE.white}
        strokeWidth="0"
      />
      <path d="M228 190 q22 44 62 40" stroke={PALETTE.white} strokeWidth="0" />
      <path
        d="M200 96 q6 -26 34 -24"
        stroke={PALETTE.greenDark}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M240 74 q18 8 8 26 q-20 -2 -8 -26" fill={PALETTE.green} />
      <circle cx="86" cy="86" r="6" fill="#ffffff" opacity="0.7" />
      <circle cx="316" cy="210" r="8" fill="#ffffff" opacity="0.5" />
    </Frame>
  );
}

function Craft({ bg = PALETTE.peach }) {
  return (
    <Frame bg={bg}>
      <circle cx="316" cy="70" r="28" fill={PALETTE.lemon} opacity="0.75" />
      {shadows(196, 256, 96, 13)}
      <rect x="112" y="152" width="176" height="96" rx="10" fill="#f7f0e4" />
      <path d="M120 160 h160 v80" stroke="#e3d3b8" strokeWidth="0" />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M120 ${172 + i * 12} h160`}
          stroke={i % 2 ? PALETTE.green : PALETTE.teal}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.8"
        />
      ))}
      <g transform="rotate(-28 300 150)">
        <rect
          x="292"
          y="86"
          width="14"
          height="100"
          rx="6"
          fill={PALETTE.wood}
        />
        <circle cx="299" cy="196" r="13" fill={PALETTE.steel} />
        <circle cx="299" cy="196" r="5" fill="#7d8b95" />
        <path
          d="M299 202 l0 26"
          stroke={PALETTE.red}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
      {[
        [110, 116, "#e05b4b"],
        [140, 106, "#4f9dd6"],
        [170, 116, "#f2c14e"],
      ].map(([cx, cy, c], i) => (
        <circle key={i} cx={cx} cy={cy} r="12" fill={c} />
      ))}
    </Frame>
  );
}

function Paw({ bg = PALETTE.sand }) {
  return (
    <Frame bg={bg}>
      <circle cx="80" cy="72" r="26" fill={PALETTE.peach} />
      {shadows(200, 256, 84, 12)}
      <ellipse cx="200" cy="196" rx="62" ry="52" fill="#d9a35c" />
      {[
        [140, 120, -20],
        [176, 100, -8],
        [216, 100, 8],
        [252, 120, 20],
      ].map(([cx, cy, r], i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx="22"
          ry="26"
          fill="#d9a35c"
          transform={`rotate(${r} ${cx} ${cy})`}
        />
      ))}
      <path d="M150 210 q12 -12 26 0" stroke="#b97a45" strokeWidth="0" />
      <circle cx="200" cy="196" r="16" fill="#efd2a8" opacity="0.6" />
      <circle cx="330" cy="196" r="10" fill={PALETTE.green} opacity="0.6" />
      <circle cx="62" cy="212" r="7" fill={PALETTE.teal} opacity="0.4" />
    </Frame>
  );
}

function Idea({ bg = PALETTE.lemon }) {
  return (
    <Frame bg={bg}>
      <circle cx="320" cy="72" r="28" fill={PALETTE.white} opacity="0.6" />
      {shadows(200, 256, 72, 12)}
      <path
        d="M200 78 q-52 0 -52 54 q0 34 24 48 v22 h56 v-22 q24 -14 24 -48 q0 -54 -52 -54"
        fill={PALETTE.lemon}
        stroke="#e8c27f"
        strokeWidth="6"
      />
      <rect
        x="180"
        y="212"
        width="40"
        height="14"
        rx="6"
        fill={PALETTE.steel}
      />
      <rect x="184" y="230" width="32" height="10" rx="5" fill="#8b9aa3" />
      <path
        d="M186 140 q14 16 28 0"
        stroke="#e0b062"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M200 74 l0 -28 M156 92 l-20 -18 M244 92 l20 -18"
        stroke={PALETTE.gold}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M300 210 q-2 -40 20 -58"
        stroke={PALETTE.greenDark}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M318 156 q22 4 22 22 q-22 2 -22 -22" fill={PALETTE.green} />
      <circle cx="76" cy="196" r="8" fill={PALETTE.teal} opacity="0.4" />
    </Frame>
  );
}

const SCENES = {
  carbonara: Carbonara,
  bread: Carbonara,
  cook: Carbonara,
  plate: Carbonara,
  tomatoes: Tomatoes,
  tomatoes2: Tomatoes,
  plant: Tomatoes,
  leaf: Tomatoes,
  home: Tomatoes,
  sparkle: Tomatoes,
  guitar: Guitar,
  music: Guitar,
  puppy: Puppy,
  watercolor: Watercolor,
  draw: Watercolor,
  art: Watercolor,
  resume: Resume,
  key: Resume,
  compass: Resume,
  check: Resume,
  cookies: Cookies,
  coffee: Cookies,
  money: Money,
  camera: Camera,
  stretch: Stretch,
  run: Stretch,
  trophy: Stretch,
  laptop: Laptop,
  phone: Laptop,
  code: Laptop,
  wifi: Laptop,
  books: Books,
  book: Books,
  heart: Heart,
  star: Heart,
  smile: Heart,
  user: Heart,
  craft: Craft,
  puzzle: Craft,
  target: Craft,
  wood: Craft,
  sew: Craft,
  globe: Craft,
  paw: Paw,
  idea: Idea,
};

const ACCENTS = [
  PALETTE.cream,
  PALETTE.mint,
  PALETTE.sky,
  PALETTE.lemon,
  PALETTE.peach,
  PALETTE.lilac,
  PALETTE.pink,
  PALETTE.sand,
];

const KEYWORD_OIL_MAP = {
  carbonara: "/img/thumbs/cat/food-01.jpg",
  pasta: "/img/thumbs/cat/food-02.jpg",
  soup: "/img/thumbs/cat/food-03.jpg",
  salad: "/img/thumbs/cat/food-04.jpg",
  cookies: "/img/thumbs/cat/food-05.jpg",
  bread: "/img/steps/Bake-Bread-at-Home/21.jpg",
  cake: "/img/thumbs/cat/food-06.jpg",
  pie: "/img/thumbs/cat/food-07.jpg",
  egg: "/img/thumbs/cat/food-08.jpg",
  coffee: "/img/thumbs/cat/food-09.jpg",
  tea: "/img/thumbs/cat/food-10.jpg",
  tomatoes: "/img/steps/Keep-Houseplants-Alive/01.jpg",
  plant: "/img/steps/Keep-Houseplants-Alive/02.jpg",
  garden: "/img/categories/home-hero.jpg",
  flower: "/img/steps/Keep-Houseplants-Alive/14.jpg",
  tree: "/img/steps/Keep-Houseplants-Alive/25.jpg",
  guitar: "/img/categories/topic-music.jpg",
  music: "/img/categories/topic-music.jpg",
  piano: "/img/categories/topic-music.jpg",
  watercolor: "/img/categories/topic-artwork.jpg",
  art: "/img/categories/arts-hero.jpg",
  paint: "/img/categories/topic-artwork.jpg",
  draw: "/img/steps/Learn-to-Draw-for-Beginners/01.jpg",
  puppy: "/img/categories/pets-hero.jpg",
  dog: "/img/categories/pets-hero.jpg",
  cat: "/img/thumbs/cat/pets-02.jpg",
  bird: "/img/thumbs/cat/pets-03.jpg",
  fish: "/img/thumbs/cat/pets-04.jpg",
  resume: "/img/categories/work-hero.jpg",
  job: "/img/categories/work-hero.jpg",
  work: "/img/categories/work-hero.jpg",
  tie: "/img/categories/style-hero.jpg",
  money: "/img/categories/finance-hero.jpg",
  camera: "/img/categories/topic-photography.jpg",
  stretch: "/img/categories/health-hero.jpg",
  run: "/img/categories/sports-hero.jpg",
  trophy: "/img/categories/sports-hero.jpg",
  laptop: "/img/steps/Speed-Up-a-Slow-Laptop/01.jpg",
  phone: "/img/steps/Speed-Up-a-Slow-Laptop/05.jpg",
  code: "/img/steps/Speed-Up-a-Slow-Laptop/11.jpg",
  wifi: "/img/categories/computers-hero.jpg",
  books: "/img/categories/topic-books.jpg",
  book: "/img/thumbs/reading.jpg",
  heart: "/img/categories/relationships-hero.jpg",
  star: "/img/categories/holidays-hero.jpg",
  smile: "/img/categories/family-hero.jpg",
  user: "/img/categories/youth-hero.jpg",
  craft: "/img/categories/crafts-hero.jpg",
  puzzle: "/img/categories/games-hero.jpg",
  target: "/img/thumbs/darts.jpg",
  wood: "/img/categories/topic-crafts.jpg",
  sew: "/img/categories/style-hero.jpg",
  globe: "/img/categories/travel-hero.jpg",
  paw: "/img/categories/pets-hero.jpg",
  idea: "/img/categories/philosophy-hero.jpg",
};

export function Illustration({ name = "idea", className = "", ratio, style }) {
  const resolvedSrc =
    typeof name === "string" && name.startsWith("/")
      ? name
      : KEYWORD_OIL_MAP[name] || "/img/categories/travel-hero.jpg";

  return (
    <span className={`illus-wrap ${className}`} style={style}>
      <img
        src={resolvedSrc}
        alt=""
        className="illus"
        style={{ aspectRatio: ratio || "4 / 3", objectFit: "cover", width: "100%", display: "block" }}
        loading="lazy"
      />
    </span>
  );
}

/* Step illustrations reuse the golden-hour oil painting bank with a step badge. */
export function StepIllustration({ name = "idea", index = 0, className = "" }) {
  const num = String((index % 20) + 1).padStart(2, "0");
  const resolvedSrc =
    typeof name === "string" && name.startsWith("/")
      ? name
      : `/img/thumbs/cat/arts-${num}.jpg`;

  return (
    <span className={`illus-wrap step-illus ${className}`}>
      <img
        src={resolvedSrc}
        alt=""
        className="illus"
        style={{ aspectRatio: "1 / 1", objectFit: "cover", width: "100%", display: "block" }}
        loading="lazy"
      />
      <span className="step-illus-badge">{index + 1}</span>
    </span>
  );
}

export { PALETTE, SCENES };
