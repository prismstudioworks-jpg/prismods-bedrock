// Crisp Minecraft pixel-art & graphic cover banners for addon cards

function svgToUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

// 1. Monster Structures
export const ART_MONSTER_STRUCTURES = svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <defs>
    <linearGradient id="bg_ms" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#142c1b"/>
      <stop offset="50%" stop-color="#2d502a"/>
      <stop offset="100%" stop-color="#0f1f14"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#bg_ms)"/>
  <!-- Trees and foliage -->
  <rect x="0" y="120" width="320" height="80" fill="#1b3a22"/>
  <rect x="0" y="140" width="320" height="60" fill="#112516"/>
  <!-- Ancient Stone Golem Structure -->
  <rect x="110" y="45" width="100" height="110" fill="#5a6858" rx="6"/>
  <rect x="125" y="60" width="70" height="30" fill="#3a4738"/>
  <rect x="135" y="68" width="16" height="8" fill="#e53e3e"/>
  <rect x="169" y="68" width="16" height="8" fill="#e53e3e"/>
  <!-- Moss on Golem -->
  <rect x="115" y="50" width="24" height="16" fill="#48bb78" opacity="0.8"/>
  <rect x="175" y="110" width="30" height="24" fill="#38a169" opacity="0.8"/>
  <rect x="140" y="100" width="40" height="55" fill="#2d3748"/>
  <!-- Left mini shrine -->
  <rect x="25" y="70" width="55" height="75" fill="#4a5568" rx="4"/>
  <rect x="40" y="85" width="25" height="15" fill="#2d3748"/>
  <rect x="47" y="90" width="11" height="6" fill="#ecc94b"/>
  <!-- Right Void Beast -->
  <rect x="240" y="55" width="55" height="95" fill="#2a1b3d" rx="6"/>
  <rect x="252" y="70" width="12" height="8" fill="#d53f8c"/>
  <rect x="272" y="70" width="12" height="8" fill="#d53f8c"/>
  <!-- Logo badge banner -->
  <rect x="160" y="15" width="145" height="32" rx="4" fill="#1a202c" opacity="0.9" stroke="#718096" stroke-width="1.5"/>
  <text x="232" y="36" fill="#f6ad55" font-family="monospace, sans-serif" font-weight="900" font-size="14" text-anchor="middle" letter-spacing="1">MONSTER</text>
</svg>
`);

// 2. Fungus Hazard
export const ART_FUNGUS_HAZARD = svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <defs>
    <radialGradient id="fungus_glow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#0d9488" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="320" height="200" fill="#040d12"/>
  <rect width="320" height="200" fill="url(#fungus_glow)"/>
  <!-- Warped Nether Floor -->
  <rect x="0" y="130" width="320" height="70" fill="#115e59"/>
  <rect x="0" y="155" width="320" height="45" fill="#0f766e"/>
  <!-- Spores particles -->
  <circle cx="60" cy="70" r="3" fill="#2dd4bf" opacity="0.8"/>
  <circle cx="110" cy="40" r="4" fill="#5eead4" opacity="0.7"/>
  <circle cx="230" cy="50" r="3" fill="#2dd4bf" opacity="0.9"/>
  <circle cx="270" cy="90" r="5" fill="#99f6e4" opacity="0.6"/>
  <circle cx="160" cy="110" r="3" fill="#5eead4" opacity="0.8"/>
  <!-- Massive Warped Giant Mushroom -->
  <rect x="145" y="75" width="30" height="75" fill="#134e4a"/>
  <ellipse cx="160" cy="75" rx="75" ry="32" fill="#0d9488"/>
  <ellipse cx="160" cy="70" rx="65" ry="24" fill="#14b8a6"/>
  <circle cx="130" cy="68" r="7" fill="#ccfbf1"/>
  <circle cx="180" cy="72" r="9" fill="#ccfbf1"/>
  <circle cx="155" cy="58" r="6" fill="#ccfbf1"/>
  <!-- Title Plate -->
  <rect x="70" y="15" width="180" height="34" rx="4" fill="#020617" opacity="0.95" stroke="#0d9488" stroke-width="1.5"/>
  <text x="160" y="38" fill="#2dd4bf" font-family="monospace, sans-serif" font-weight="900" font-size="16" text-anchor="middle" letter-spacing="2">FUNGUS HAZARD</text>
</svg>
`);

// 3. Bed Wars Classic
export const ART_BED_WARS = svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <defs>
    <linearGradient id="sky_bw" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="60%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#f0f9ff"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#sky_bw)"/>
  <!-- Floating Island 1 -->
  <polygon points="50,90 150,90 120,150 70,145" fill="#854d0e"/>
  <rect x="50" y="80" width="100" height="15" fill="#16a34a" rx="2"/>
  <!-- Red Bed -->
  <rect x="70" y="72" width="24" height="10" fill="#dc2626" rx="2"/>
  <rect x="66" y="72" width="8" height="10" fill="#ffffff" rx="1"/>
  <!-- Red Warrior with sword -->
  <rect x="105" y="55" width="14" height="26" fill="#ef4444" rx="2"/>
  <rect x="107" y="44" width="10" height="11" fill="#fca5a5" rx="1"/>
  <!-- Diamond / Iron Generator -->
  <rect x="135" y="70" width="10" height="12" fill="#38bdf8"/>
  <!-- Floating Island 2 (Enemy) -->
  <polygon points="210,110 290,110 270,165 225,160" fill="#854d0e"/>
  <rect x="210" y="100" width="80" height="14" fill="#16a34a" rx="2"/>
  <!-- Blue Bed -->
  <rect x="240" y="93" width="24" height="9" fill="#2563eb" rx="2"/>
  <!-- Connecting bridge -->
  <rect x="150" y="94" width="60" height="6" fill="#cbd5e1" stroke="#64748b" stroke-width="1"/>
  <!-- Badge -->
  <rect x="175" y="15" width="130" height="34" rx="4" fill="#991b1b" stroke="#f87171" stroke-width="1.5"/>
  <text x="240" y="37" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="14" text-anchor="middle" letter-spacing="1">BED WARS</text>
</svg>
`);

// 4. Japanese Gakkuo School
export const ART_JAPANESE_GAKKUO = svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <defs>
    <linearGradient id="sakura_sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fbcfe8"/>
      <stop offset="70%" stop-color="#fdf2f8"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#sakura_sky)"/>
  <!-- Mount Fuji in background -->
  <polygon points="120,130 180,60 240,130" fill="#94a3b8"/>
  <polygon points="160,83 180,60 200,83" fill="#ffffff"/>
  <!-- School Building -->
  <rect x="40" y="80" width="240" height="90" fill="#f8fafc" stroke="#475569" stroke-width="2"/>
  <!-- Japanese Roof Tiles (Dark Grey curved roof) -->
  <polygon points="20,80 160,50 300,80" fill="#334155"/>
  <rect x="25" y="78" width="270" height="7" fill="#1e293b"/>
  <!-- Windows -->
  <g fill="#38bdf8" opacity="0.8">
    <rect x="60" y="95" width="28" height="20"/>
    <rect x="105" y="95" width="28" height="20"/>
    <rect x="150" y="95" width="28" height="20"/>
    <rect x="195" y="95" width="28" height="20"/>
    <rect x="240" y="95" width="28" height="20"/>
    <rect x="60" y="125" width="28" height="20"/>
    <rect x="105" y="125" width="28" height="20"/>
    <rect x="195" y="125" width="28" height="20"/>
    <rect x="240" y="125" width="28" height="20"/>
  </g>
  <!-- Cherry Blossom Trees -->
  <circle cx="35" cy="115" r="30" fill="#f472b6" opacity="0.9"/>
  <circle cx="50" cy="100" r="22" fill="#ec4899" opacity="0.8"/>
  <circle cx="285" cy="120" r="32" fill="#f472b6" opacity="0.9"/>
  <!-- Torii Gate -->
  <rect x="145" y="125" width="8" height="45" fill="#dc2626"/>
  <rect x="175" y="125" width="8" height="45" fill="#dc2626"/>
  <rect x="135" y="128" width="58" height="8" fill="#dc2626"/>
  <!-- Title -->
  <rect x="60" y="12" width="200" height="30" rx="4" fill="#0f172a" opacity="0.9" stroke="#f472b6" stroke-width="1.5"/>
  <text x="160" y="32" fill="#fbcfe8" font-family="sans-serif" font-weight="900" font-size="13" text-anchor="middle" letter-spacing="1">JAPANESE GAKKUO</text>
</svg>
`);

// 5. Duck Friends Skin Pack
export const ART_DUCK_FRIENDS = svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <defs>
    <linearGradient id="duck_bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#fed7aa"/>
      <stop offset="100%" stop-color="#fbcfe8"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#duck_bg)"/>
  <!-- 4 Character models with duck hoodies -->
  <!-- Character 1 (Pink) -->
  <g transform="translate(30, 45)">
    <rect x="12" y="30" width="24" height="45" fill="#f472b6" rx="3"/>
    <rect x="8" y="0" width="32" height="32" fill="#fde047" rx="4"/>
    <rect x="14" y="14" width="20" height="12" fill="#fed7aa" rx="2"/>
    <rect x="18" y="18" width="4" height="4" fill="#1e293b"/>
    <rect x="26" y="18" width="4" height="4" fill="#1e293b"/>
    <polygon points="20,10 28,10 24,14" fill="#f97316"/>
  </g>
  <!-- Character 2 (Navy / Purple) -->
  <g transform="translate(95, 35)">
    <rect x="14" y="32" width="26" height="50" fill="#3b82f6" rx="3"/>
    <rect x="10" y="0" width="34" height="34" fill="#facc15" rx="4"/>
    <rect x="16" y="15" width="22" height="14" fill="#fed7aa" rx="2"/>
    <rect x="20" y="20" width="4" height="4" fill="#1e293b"/>
    <rect x="28" y="20" width="4" height="4" fill="#1e293b"/>
    <polygon points="23,10 31,10 27,15" fill="#ea580c"/>
  </g>
  <!-- Character 3 (Pastel Cyan) -->
  <g transform="translate(165, 38)">
    <rect x="12" y="32" width="26" height="48" fill="#06b6d4" rx="3"/>
    <rect x="9" y="0" width="32" height="32" fill="#fde047" rx="4"/>
    <rect x="14" y="14" width="22" height="13" fill="#fecdd3" rx="2"/>
    <rect x="19" y="18" width="4" height="4" fill="#1e293b"/>
    <rect x="27" y="18" width="4" height="4" fill="#1e293b"/>
    <polygon points="21,9 29,9 25,14" fill="#f97316"/>
  </g>
  <!-- Character 4 (Peach) -->
  <g transform="translate(230, 48)">
    <rect x="12" y="30" width="24" height="42" fill="#fb923c" rx="3"/>
    <rect x="8" y="0" width="32" height="32" fill="#facc15" rx="4"/>
    <rect x="14" y="14" width="20" height="12" fill="#fef08a" rx="2"/>
    <rect x="18" y="18" width="4" height="4" fill="#1e293b"/>
    <rect x="26" y="18" width="4" height="4" fill="#1e293b"/>
  </g>
  <!-- Title Badge -->
  <rect x="65" y="145" width="190" height="32" rx="6" fill="#1e293b" opacity="0.95" stroke="#f59e0b" stroke-width="2"/>
  <text x="160" y="167" fill="#fbbf24" font-family="sans-serif" font-weight="900" font-size="14" text-anchor="middle" letter-spacing="1">DUCK FRIENDS</text>
</svg>
`);

// 6. Cozy Up Winter Knits
export const ART_COZY_UP = svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <defs>
    <linearGradient id="cozy_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="50%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#cozy_bg)"/>
  <!-- Cozy characters in oversized sweaters & knit beanies -->
  <g transform="translate(70, 35)">
    <rect x="8" y="36" width="36" height="52" fill="#d97706" rx="4"/>
    <rect x="14" y="6" width="24" height="30" fill="#fde68a" rx="2"/>
    <rect x="10" y="0" width="32" height="14" fill="#b45309" rx="3"/>
    <circle cx="26" cy="20" r="2" fill="#1e293b"/>
    <circle cx="34" cy="20" r="2" fill="#1e293b"/>
  </g>
  <g transform="translate(130, 25)">
    <rect x="10" y="40" width="42" height="58" fill="#f5f5f4" rx="4"/>
    <rect x="18" y="10" width="26" height="32" fill="#fed7aa" rx="2"/>
    <rect x="14" y="2" width="34" height="16" fill="#0284c7" rx="3"/>
    <circle cx="28" cy="24" r="2.5" fill="#1e293b"/>
    <circle cx="38" cy="24" r="2.5" fill="#1e293b"/>
  </g>
  <g transform="translate(200, 35)">
    <rect x="8" y="36" width="36" height="52" fill="#0f766e" rx="4"/>
    <rect x="14" y="6" width="24" height="30" fill="#ffedd5" rx="2"/>
    <rect x="10" y="0" width="32" height="14" fill="#115e59" rx="3"/>
    <circle cx="26" cy="20" r="2" fill="#1e293b"/>
    <circle cx="34" cy="20" r="2" fill="#1e293b"/>
  </g>
  <!-- Snowflake overlays -->
  <text x="40" y="60" fill="#ffffff" opacity="0.5" font-size="20">❄</text>
  <text x="280" y="70" fill="#ffffff" opacity="0.5" font-size="22">❄</text>
  <text x="160" y="150" fill="#ffffff" opacity="0.3" font-size="16">❄</text>
  <!-- Banner -->
  <rect x="80" y="145" width="160" height="32" rx="6" fill="#1c1917" opacity="0.9" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="160" y="167" fill="#fef3c7" font-family="sans-serif" font-weight="900" font-size="14" text-anchor="middle" letter-spacing="1">COZY UP !</text>
</svg>
`);

// 7. Smooth Moves Animations
export const ART_SMOOTH_MOVES = svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <defs>
    <linearGradient id="smooth_bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#15803d"/>
      <stop offset="50%" stop-color="#166534"/>
      <stop offset="100%" stop-color="#14532d"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#smooth_bg)"/>
  <!-- Action Lines -->
  <path d="M 20 50 L 300 30" stroke="#86efac" stroke-width="2" stroke-dasharray="8 8" opacity="0.4"/>
  <path d="M 10 160 L 290 140" stroke="#86efac" stroke-width="2" stroke-dasharray="12 6" opacity="0.4"/>
  <!-- Steve running with sword in mid-air -->
  <g transform="translate(100, 40) rotate(-8)">
    <rect x="25" y="30" width="30" height="40" fill="#0284c7" rx="3"/>
    <rect x="28" y="2" width="24" height="28" fill="#d97706" rx="2"/>
    <!-- Diamond Sword -->
    <rect x="58" y="10" width="6" height="35" fill="#38bdf8" transform="rotate(30 60 25)"/>
  </g>
  <!-- Enderman with glowing purple eyes running -->
  <g transform="translate(200, 30)">
    <rect x="18" y="35" width="16" height="70" fill="#0f172a" rx="2"/>
    <rect x="14" y="6" width="24" height="28" fill="#020617" rx="2"/>
    <rect x="18" y="18" width="6" height="4" fill="#d946ef"/>
    <rect x="28" y="18" width="6" height="4" fill="#d946ef"/>
  </g>
  <!-- Title Badge -->
  <rect x="40" y="142" width="240" height="34" rx="4" fill="#052e16" stroke="#4ade80" stroke-width="2"/>
  <text x="160" y="165" fill="#bbf7d0" font-family="monospace, sans-serif" font-weight="900" font-size="14" text-anchor="middle" letter-spacing="1.5">SMOOTH MOVES</text>
</svg>
`);

// 8. Lush Visuals Texture Pack
export const ART_LUSH_VISUALS = svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <defs>
    <radialGradient id="lush_glow" cx="40%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.5"/>
      <stop offset="60%" stop-color="#064e3b" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#022c22" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="320" height="200" fill="#022c22"/>
  <rect width="320" height="200" fill="url(#lush_glow)"/>
  <!-- Glowing cave stalactites & azalea moss -->
  <polygon points="40,0 60,0 50,50" fill="#047857"/>
  <polygon points="120,0 150,0 135,70" fill="#059669"/>
  <polygon points="220,0 260,0 240,60" fill="#047857"/>
  <!-- Glowing Spore Blossoms (Pink) -->
  <circle cx="135" cy="72" r="8" fill="#f472b6"/>
  <circle cx="135" cy="72" r="4" fill="#ffffff"/>
  <!-- Subterranean Amethyst & Ore blocks -->
  <rect x="50" y="120" width="50" height="50" fill="#334155" stroke="#10b981" stroke-width="1.5"/>
  <polygon points="65,130 80,120 75,145" fill="#34d399"/>
  <rect x="220" y="115" width="55" height="55" fill="#334155" stroke="#a855f7" stroke-width="1.5"/>
  <polygon points="240,125 255,118 250,148" fill="#c084fc"/>
  <!-- Glow berries -->
  <circle cx="90" cy="80" r="5" fill="#f59e0b"/>
  <circle cx="95" cy="95" r="5" fill="#fbbf24"/>
  <!-- Title Badge -->
  <rect x="65" y="145" width="190" height="32" rx="4" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
  <text x="160" y="167" fill="#ecfdf5" font-family="monospace, sans-serif" font-weight="900" font-size="14" text-anchor="middle" letter-spacing="2">LUSH VISUALS</text>
</svg>
`);

// 9. Hafen Cozy Pixel
export const ART_HAFEN_COZY = svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <defs>
    <linearGradient id="hafen_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="60%" stop-color="#7dd3fc"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#hafen_bg)"/>
  <!-- Whimsical blocky pastel hill -->
  <path d="M 0 130 Q 120 90 220 120 T 320 110 L 320 200 L 0 200 Z" fill="#84cc16"/>
  <!-- Cute stylized blocky Llama with colored blanket -->
  <g transform="translate(130, 75)">
    <rect x="15" y="20" width="30" height="35" fill="#fed7aa" rx="2"/>
    <rect x="35" y="0" width="14" height="35" fill="#fed7aa" rx="2"/>
    <rect x="42" y="5" width="4" height="4" fill="#1e293b"/>
    <!-- Blanket -->
    <rect x="20" y="25" width="20" height="20" fill="#f43f5e"/>
    <rect x="24" y="28" width="12" height="14" fill="#38bdf8"/>
  </g>
  <!-- Little wooden cabin -->
  <rect x="30" y="105" width="45" height="35" fill="#b45309" stroke="#78350f" stroke-width="1.5"/>
  <polygon points="20,105 52,85 85,105" fill="#dc2626"/>
  <!-- Title Badge -->
  <rect x="85" y="145" width="150" height="30" rx="4" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5"/>
  <text x="160" y="166" fill="#f0f9ff" font-family="sans-serif" font-weight="900" font-size="14" text-anchor="middle" letter-spacing="2">HAFEN 16X</text>
</svg>
`);

// 10. Lumina Shaders
export const ART_LUMINA_SHADERS = svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <defs>
    <radialGradient id="sun_glow" cx="80%" cy="25%" r="60%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
      <stop offset="35%" stop-color="#fb923c" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#1e1b4b" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="320" height="200" fill="url(#sun_glow)"/>
  <!-- Water with caustic light reflections -->
  <rect x="0" y="125" width="320" height="75" fill="#0369a1" opacity="0.9"/>
  <path d="M 0 135 Q 80 130 160 138 T 320 133" stroke="#38bdf8" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M 0 155 Q 90 150 180 158 T 320 152" stroke="#7dd3fc" stroke-width="2" fill="none" opacity="0.7"/>
  <path d="M 0 175 Q 100 170 200 178 T 320 172" stroke="#bae6fd" stroke-width="2" fill="none" opacity="0.5"/>
  <!-- Sun disc -->
  <circle cx="255" cy="45" r="24" fill="#fef08a"/>
  <!-- Mountain silhouette -->
  <polygon points="0,128 80,60 170,126" fill="#312e81"/>
  <polygon points="120,127 210,75 280,127" fill="#1e1b4b"/>
  <!-- Title Badge -->
  <rect x="65" y="145" width="190" height="32" rx="4" fill="#1e1b4b" stroke="#facc15" stroke-width="1.5"/>
  <text x="160" y="167" fill="#fef08a" font-family="sans-serif" font-weight="900" font-size="14" text-anchor="middle" letter-spacing="1.5">LUMINA SHADERS</text>
</svg>
`);

// 11. Industrial Machinery (From reference screenshot)
export const ART_INDUSTRIAL_TECH = svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <defs>
    <linearGradient id="ind_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#ind_bg)"/>
  <!-- Floor Grid -->
  <rect x="0" y="130" width="320" height="70" fill="#334155"/>
  <!-- Solar Panels arrays & Machinery -->
  <g transform="translate(40, 40)">
    <!-- Steel Frame -->
    <rect x="20" y="50" width="8" height="60" fill="#64748b"/>
    <rect x="70" y="50" width="8" height="60" fill="#64748b"/>
    <!-- Solar Panels -->
    <rect x="5" y="10" width="90" height="50" fill="#0284c7" stroke="#38bdf8" stroke-width="2" rx="3" transform="skewX(-15)"/>
    <line x1="35" y1="10" x2="35" y2="60" stroke="#38bdf8" stroke-width="1.5"/>
    <line x1="65" y1="10" x2="65" y2="60" stroke="#38bdf8" stroke-width="1.5"/>
    <line x1="5" y1="35" x2="95" y2="35" stroke="#38bdf8" stroke-width="1.5"/>
  </g>
  <!-- Generator Core Box (Right) -->
  <rect x="170" y="65" width="105" height="75" fill="#475569" stroke="#94a3b8" stroke-width="2" rx="4"/>
  <!-- Glowing power coil -->
  <rect x="185" y="80" width="75" height="25" fill="#0369a1" rx="2"/>
  <rect x="190" y="85" width="65" height="15" fill="#38bdf8" rx="2"/>
  <!-- Red & Green indicators -->
  <circle cx="185" cy="120" r="4" fill="#22c55e"/>
  <circle cx="200" cy="120" r="4" fill="#ef4444"/>
  <circle cx="215" cy="120" r="4" fill="#eab308"/>
  <!-- Title Badge -->
  <rect x="60" y="145" width="200" height="32" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="160" y="167" fill="#fbbf24" font-family="monospace, sans-serif" font-weight="900" font-size="14" text-anchor="middle" letter-spacing="1">INDUSTRIAL TECH</text>
</svg>
`);

// 12. Anime Academia (From reference screenshot)
export const ART_ANIME_ACADEMIA = svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <defs>
    <linearGradient id="anime_sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="60%" stop-color="#bfdbfe"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#anime_sky)"/>
  <!-- Academy Tower & Gates -->
  <rect x="80" y="40" width="160" height="120" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <polygon points="70,40 160,15 250,40" fill="#e11d48"/>
  <!-- Clock on tower -->
  <circle cx="160" cy="55" r="14" fill="#ffffff" stroke="#e11d48" stroke-width="2"/>
  <line x1="160" y1="55" x2="160" y2="46" stroke="#1e293b" stroke-width="2"/>
  <line x1="160" y1="55" x2="167" y2="55" stroke="#1e293b" stroke-width="1.5"/>
  <!-- Campus tree -->
  <circle cx="50" cy="100" r="28" fill="#ec4899" opacity="0.9"/>
  <circle cx="270" cy="110" r="30" fill="#f472b6" opacity="0.9"/>
  <!-- Title Badge -->
  <rect x="65" y="145" width="190" height="32" rx="4" fill="#881337" stroke="#fda4af" stroke-width="1.5"/>
  <text x="160" y="167" fill="#ffe4e6" font-family="sans-serif" font-weight="900" font-size="14" text-anchor="middle" letter-spacing="1">ANIME ACADEMIA</text>
</svg>
`);

// 13. Chibi World Skin Pack (From reference screenshot)
export const ART_CHIBI_WORLD = svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
  <defs>
    <linearGradient id="chibi_bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f472b6"/>
      <stop offset="50%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#chibi_bg)"/>
  <!-- Chibi Characters -->
  <g transform="translate(60, 40)">
    <rect x="15" y="45" width="30" height="40" fill="#4f46e5" rx="4"/>
    <rect x="8" y="0" width="44" height="44" fill="#fde047" rx="8"/>
    <rect x="16" y="16" width="28" height="22" fill="#fed7aa" rx="4"/>
    <circle cx="23" cy="26" r="3" fill="#1e293b"/>
    <circle cx="37" cy="26" r="3" fill="#1e293b"/>
    <!-- Blush -->
    <ellipse cx="20" cy="32" rx="3" ry="1.5" fill="#f43f5e" opacity="0.6"/>
    <ellipse cx="40" cy="32" rx="3" ry="1.5" fill="#f43f5e" opacity="0.6"/>
  </g>
  <g transform="translate(180, 40)">
    <rect x="15" y="45" width="30" height="40" fill="#ec4899" rx="4"/>
    <rect x="8" y="0" width="44" height="44" fill="#67e8f9" rx="8"/>
    <rect x="16" y="16" width="28" height="22" fill="#fed7aa" rx="4"/>
    <circle cx="23" cy="26" r="3" fill="#1e293b"/>
    <circle cx="37" cy="26" r="3" fill="#1e293b"/>
    <!-- Blush -->
    <ellipse cx="20" cy="32" rx="3" ry="1.5" fill="#f43f5e" opacity="0.6"/>
    <ellipse cx="40" cy="32" rx="3" ry="1.5" fill="#f43f5e" opacity="0.6"/>
  </g>
  <!-- Sparkles -->
  <text x="35" y="40" fill="#ffffff" font-size="20">✨</text>
  <text x="270" y="50" fill="#ffffff" font-size="22">✨</text>
  <!-- Title Badge -->
  <rect x="75" y="145" width="170" height="32" rx="6" fill="#312e81" stroke="#f472b6" stroke-width="1.5"/>
  <text x="160" y="167" fill="#fdf2f8" font-family="sans-serif" font-weight="900" font-size="14" text-anchor="middle" letter-spacing="1">CHIBI WORLD</text>
</svg>
`);

