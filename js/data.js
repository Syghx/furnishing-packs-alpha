// Every pack, price, piece and photo here comes from the live
// furnishingpacks.co.uk package pages (checked 12 October 2026). Photos load
// from the Furnishing Packs CDN, so nothing is stock imagery. Prices are ex VAT.

const CDN = 'https://cdn-furnishingpacks.b-cdn.net/wp-content/uploads/';
// The CDN resizes on request, so each image is fetched at the width it is shown at (about twice
// its on-screen size, for sharp phone and Retina screens) instead of the full original.
export const img = (path, width) => CDN + path + (width ? `?width=${width}` : '');

export const VAT_RATE = 0.2;

export const CONTACT = {
  phone: '0113 870 1057',
  phoneHref: 'tel:+441138701057',
  email: 'info@furnishingpacks.co.uk',
};

// Student packs use the apartment price list and add a desk and chair to
// every bedroom (furnishingpacks.co.uk/student-furniture-packages/).
export const TYPES = {
  apartment: { label: 'Apartment', noun: 'apartment', prices: 'apartment' },
  student: { label: 'Student let', noun: 'student let', prices: 'apartment' },
  hmo: { label: 'HMO', noun: 'HMO', prices: 'hmo' },
  serviced: { label: 'Serviced let', noun: 'serviced let', prices: 'serviced' },
};

const ALL = ['malvern', 'alba', 'ives', 'chevron', 'hoxton', 'madrid', 'scandi', 'leon', 'oliver'];

// The five sections of the current site, each one click in the pricer.
export const SECTORS = [
  {
    id: 'letting', name: 'Landlords and letting', type: 'apartment', packs: ALL,
    photo: '2025/11/Furniture-Packages-for-Landlords-and-Letting-Agents.jpg',
    blurb: 'Tenant-proof furniture, delivered and fitted so the property can let from day one.',
  },
  {
    id: 'hmo', name: 'HMO', type: 'hmo', packs: ['malvern', 'hoxton', 'leon', 'oliver'],
    photo: '2025/11/HMO-Furniture-Packages.jpg',
    blurb: 'Every bedroom furnished for multi-occupancy lets. Every HMO pack meets fire safety and durability standards.',
  },
  {
    id: 'serviced', name: 'Serviced accommodation', type: 'serviced', packs: ['alba', 'ives', 'chevron', 'hoxton', 'leon'],
    photo: '2025/11/Serviced-Accommodation-Furniture-Packages.jpg',
    blurb: 'Guest-ready interiors to an Airbnb-ready standard, professionally installed.',
  },
  {
    id: 'student', name: 'Student lets', type: 'student', packs: ALL, highlight: 'malvern',
    photo: '2025/09/hmo_student_furniture_package_bedroom.jpg',
    blurb: 'Built for annual changeovers, with a desk and chair in every bedroom as standard. Malvern is our most popular student pack.',
  },
  {
    id: 'social', name: 'Social housing and supported living', type: 'apartment', packs: ALL,
    photo: '2025/10/city-centre-apartment-furnishing-pack.png',
    blurb: 'Practical, durable, easy-clean furniture with everything priced up front and installed in one visit.',
  },
];

const room = (src, alt) => ({ kind: 'room', src, alt });
const piece = (src, name) => ({ kind: 'piece', src, alt: name, name });
const DIVAN = piece('2025/09/IMG_2848-1.webp', 'Divan double bed');

// Contents are [count, name] so they can be added up across a whole order.
// `living.sofa[n - 1]` is the sofa line for an n-bedroom pack.
export const PACKS = [
  {
    id: 'malvern',
    name: 'Malvern',
    tone: 'Anthracite grey',
    line: 'Anthracite-grey storage with a grey Tempo sofa and Athens dining. Our lowest-priced apartment pack, alongside Oliver.',
    hero: '2025/09/Gemini_Generated_Image_5t7qvm5t7qvm5t7q-1.jpg',
    gallery: {
      bedroom: [
        room('2026/08/Modern-City-Apartment-Bedroom.png', 'Malvern bedroom by floor-to-ceiling windows'),
        room('2025/11/Malvern-Furniture-Package-from-Furnishing-Packs-1.jpg', 'Malvern bedroom with grey upholstered bed'),
        piece('2025/09/Malvern-2-Door-Wardrobe.jpg', 'Malvern two-door wardrobe'),
        piece('2025/09/Malvern-Drawers-Chest.jpg', 'Malvern trio chest'),
        piece('2025/09/Malvern-Bedside-Table.jpg', 'Malvern trio bedside'),
        DIVAN,
      ],
      living: [
        room('2025/09/Gemini_Generated_Image_5t7qvm5t7qvm5t7q-1.jpg', 'Malvern living room with a grey sofa and dining table by city windows'),
        piece('2025/09/AMALFI-2-SEATER-SOFA-GREY-FABRIC-2024-300-308-075-01-scaled-1.jpg', 'Two-seater sofa'),
        piece('2025/09/Athens-Coffee-Table.jpg', 'Athens coffee table'),
        piece('2025/09/Athens-Dining-Table-Set.jpg', 'Athens dining table set'),
      ],
    },
    prices: {
      apartment: { 1: 1650, 2: 2250, 3: 2800, 4: 3450 },
      hmo: { 4: 3450, 5: 4100, 6: 4750 },
    },
    bed: [[1, 'Divan double bed'], [1, 'Malvern two-door wardrobe'], [1, 'Malvern trio bedside'], [1, 'Malvern trio chest']],
    living: {
      base: [[1, 'Dining table set'], [1, 'Athens coffee table']],
      sofa: [[[1, 'Tempo two-seater sofa']], [[1, 'Tempo three-seater sofa']], [[1, 'Tempo three-seater sofa']], [[2, 'Tempo two-seater sofa']]],
    },
  },
  {
    id: 'alba',
    name: 'Alba',
    tone: 'Soft white and grey',
    line: 'Soft white storage, an upholstered Eloise bed, a Monza sofa and Goya dining chairs around a Miami table.',
    hero: '2026/10/Gemini_Generated_Image_pkox24pkox24pkox.jpg',
    gallery: {
      bedroom: [
        room('2026/10/Gemini_Generated_Image_4vr8fc4vr8fc4vr8.jpg', 'Alba bedroom with a grey panelled bed and white bedsides'),
        room('2026/10/Gemini_Generated_Image_vp2aahvp2aahvp2a.jpg', 'Alba bedroom with abstract art above the bed'),
        piece('2025/10/Eloise-Doube-Bed.jpg', 'Eloise double bed'),
        piece('2025/10/Alba-2-Door-Wardrobe.jpg', 'Alba two-door wardrobe'),
        piece('2025/10/Alba-4-Drawer-Chest.jpg', 'Alba four-drawer chest'),
        piece('2025/10/Alba-Bedside-Table.jpg', 'Alba bedside'),
      ],
      living: [
        room('2026/10/Gemini_Generated_Image_pkox24pkox24pkox.jpg', 'Alba living room with a pale sofa, glass chandelier and city view'),
        piece('2025/10/Monza-2-Seater-Sofa.jpg', 'Monza two-seater sofa'),
        piece('2025/10/Firenze-Coffee-Table.jpg', 'Firenze coffee table'),
        piece('2025/10/Miami-Dining-Table.jpg', 'Miami dining table'),
        piece('2025/10/Goya-Dining-Chair.jpg', 'Goya dining chair'),
      ],
    },
    prices: {
      apartment: { 1: 2750, 2: 3500, 3: 4150, 4: 4800 },
      serviced: { 1: 3750, 2: 4500, 3: 5150 },
    },
    bed: [[1, 'Eloise double bed'], [1, 'Alba two-door wardrobe'], [1, 'Alba bedside'], [1, 'Alba four-drawer chest']],
    living: {
      base: [[1, 'Miami dining table'], [4, 'Goya dining chair'], [1, 'Firenze coffee table']],
      sofa: [[[1, 'Monza two-seater sofa']], [[1, 'Monza two-seater sofa']], [[2, 'Monza two-seater sofa']], [[2, 'Monza two-seater sofa']]],
    },
  },
  {
    id: 'ives',
    name: 'Ives',
    tone: 'Black panelling',
    line: 'Black panelled storage, a silver Berlin bed, a Zuma sofa and Juno dining with Mai chairs. Our premium pack.',
    hero: '2025/10/ives-living-room-furniture-package-lifestyle.jpg',
    gallery: {
      bedroom: [
        room('2025/10/Ives-Black-Double-Wardrobe-LifeStyle-1.jpg', 'Ives bedroom with a black panelled wardrobe'),
        piece('2025/10/Berlin-Silver-Double-Bed.jpg', 'Berlin double bed'),
        piece('2025/10/Ives-2-Door-Wardrobe.jpg', 'Ives two-door wardrobe'),
        piece('2025/10/Ives-Drawers-Chest.jpg', 'Ives three-drawer chest'),
        piece('2025/10/Ives-Bedside-Table.jpg', 'Ives bedside'),
      ],
      living: [
        room('2025/10/ives-living-room-furniture-package-lifestyle.jpg', 'Ives living room with green velvet armchairs and a round black coffee table'),
        piece('2025/10/Zuma-Black-Sofa.webp', 'Zuma two-seater sofa'),
        piece('2025/10/Kenji-Black-Coffee-Table.jpg', 'Kenji coffee table'),
        piece('2025/10/Juno-Dining-Table.jpg', 'Juno dining table'),
        piece('2025/10/Mai-Black-Dining-Chair.jpg', 'Mai dining chair'),
      ],
    },
    board: '2025/10/IMG_2976-1.jpeg',
    prices: {
      apartment: { 1: 4230, 2: 5430, 3: 7100, 4: 8590 },
      serviced: { 1: 5230, 2: 6430, 3: 8100 },
    },
    bed: [[1, 'Berlin double bed'], [1, 'Ives two-door wardrobe'], [1, 'Ives bedside'], [1, 'Ives three-drawer chest']],
    living: {
      base: [[1, 'Juno dining table'], [4, 'Mai dining chair'], [1, 'Kenji coffee table']],
      sofa: [[[1, 'Zuma two-seater sofa']], [[1, 'Zuma two-seater sofa']], [[1, 'Zuma two-seater sofa'], [1, 'Armchair']], [[2, 'Zuma two-seater sofa']]],
    },
  },
  {
    id: 'chevron',
    name: 'Chevron',
    tone: 'Herringbone oak and glass',
    line: 'Herringbone-oak storage, an Eze bed and a Tuba sofa, with black dining chairs around a glass table.',
    hero: '2026/10/Gemini_Generated_Image_ovbcqgovbcqgovbc.jpg',
    gallery: {
      bedroom: [
        room('2026/10/Gemini_Generated_Image_iuvpi9iuvpi9iuvp.jpg', 'Chevron bedroom with a herringbone-oak wardrobe'),
        piece('2026/10/Stockholm-Chevron-Double-Wardrobe-2.jpg', 'Chevron two-door wardrobe'),
        piece('2026/10/Stockholm-Chevron-Chest-of-Drawers-2.jpg', 'Chevron drawer chest'),
        piece('2026/10/Stockholm-Chevron-Bedside-Cabinet-2.jpg', 'Chevron bedside'),
        piece('2025/10/Berlin-Silver-Double-Bed.jpg', 'Double bed'),
      ],
      living: [
        room('2026/10/Gemini_Generated_Image_ovbcqgovbcqgovbc.jpg', 'Chevron living and dining room with black chairs and a city view'),
        piece('2026/10/Carter-Taupe-3-Seater-Sofa.jpg', 'Sofa'),
        piece('2026/10/Eden-Black-Coffee-Table.jpg', 'Coffee table'),
        piece('2026/10/Casa-Glass-Silver-Dining-Table.jpg', 'Glass dining table'),
        piece('2026/10/Smith-Black-Dining-Chair.jpg', 'Dining chair'),
      ],
    },
    prices: {
      apartment: { 1: 2400, 2: 3150, 3: 3900, 4: 4650 },
      serviced: { 1: 2400, 2: 3150, 3: 3900, 4: 4650 },
    },
    bed: [[1, 'Eze double bed'], [1, 'Chevron two-door wardrobe'], [1, 'Chevron bedside'], [1, 'Chevron drawer chest']],
    living: {
      base: [[1, 'Dining table'], [4, 'Dining chair'], [1, 'Coffee table']],
      sofa: [[[1, 'Tuba two-seater sofa']], [[1, 'Tuba three-seater sofa']], [[1, 'Tuba three-seater sofa']], [[2, 'Tuba two-seater sofa']]],
    },
  },
  {
    id: 'hoxton',
    name: 'Hoxton',
    tone: 'Black or oak',
    line: 'Hoxton storage in black or oak, a Luna dining set and a soft grey Newport sofa.',
    hero: '2025/09/Gemini_Generated_Image_1ppnm1ppnm1ppnm1-1.jpg',
    gallery: {
      bedroom: [
        room('2025/09/91d2b123-d0e6-42ff-9c87-cd71ef81797c.jpg', 'Hoxton bedroom with a black wardrobe and black bedside'),
        piece('2025/09/Hoxton-Black-2-Door-Wardrobe-2.jpg', 'Hoxton two-door wardrobe, black'),
        piece('2025/09/Hoxton-Black-3-Drawer-Chest-2.jpg', 'Hoxton three-drawer chest, black'),
        piece('2025/09/Hoxton-Black-Bedside-Cabinet-2.jpg', 'Hoxton bedside, black'),
        piece('2025/09/Hoxton-2-Door-Wardrobe.jpg', 'Hoxton two-door wardrobe, oak'),
        DIVAN,
      ],
      living: [
        room('2025/09/Gemini_Generated_Image_1ppnm1ppnm1ppnm1-1.jpg', 'Hoxton living room with sage walls, a grey sofa and dining table'),
        piece('2025/09/Newport-2-seater-fabric-sofa.jpg', 'Newport two-seater sofa'),
        piece('2025/09/Enzo-Coffee-Table.jpg', 'Coffee table'),
        piece('2025/09/Luna-Dining-table-and-chair-set.jpg', 'Luna dining table and chairs'),
      ],
    },
    prices: {
      apartment: { 1: 2050, 2: 2900, 3: 3750, 4: 4650 },
      hmo: { 4: 3650, 5: 4300, 6: 4950 },
      serviced: { 1: 3050, 2: 3900, 3: 4750 },
    },
    bed: [[1, 'Divan double bed'], [1, 'Hoxton two-door wardrobe'], [1, 'Hoxton bedside'], [1, 'Hoxton three-drawer chest']],
    living: {
      base: [[1, 'Luna dining table'], [4, 'Dining chair'], [1, 'Coffee table']],
      sofa: [[[1, 'Newport two-seater sofa']], [[1, 'Newport two-seater sofa']], [[1, 'Newport three-seater sofa']], [[2, 'Newport two-seater sofa']]],
    },
    hmoMattress: true,
  },
  {
    id: 'madrid',
    name: 'Madrid',
    tone: 'White, grey and mirror',
    line: 'White and grey storage with a mirrored wardrobe, a five-drawer chest and a Madrid sofa.',
    hero: '2025/10/Gemini_Generated_Image_1ppnm1ppnm1ppnm1-1.jpg',
    gallery: {
      bedroom: [
        piece('2025/10/Madrid-2-Door-Wardrobe.jpg', 'Madrid two-door mirrored wardrobe'),
        piece('2025/10/Madrid-5-Drawer-Chest.jpg', 'Madrid five-drawer chest'),
        piece('2025/10/Madrid-Bedside-Table.jpg', 'Madrid three-drawer bedside'),
        DIVAN,
      ],
      living: [
        room('2025/10/Gemini_Generated_Image_1ppnm1ppnm1ppnm1-1.jpg', 'Madrid living room with a grey sofa and lit ceiling'),
        piece('2025/10/Madrid-2-seater-sofa-bed.jpg', 'Madrid sofa'),
        piece('2025/10/300-301-083_01_7.jpg', 'Madrid dining table'),
        piece('2025/10/400-401-328_02_1.jpg', 'Madrid dining table set'),
      ],
    },
    prices: {
      apartment: { 1: 1915, 2: 2550, 3: 3200, 4: 3800 },
    },
    bed: [[1, 'Divan double bed'], [1, 'Madrid two-door mirrored wardrobe'], [1, 'Madrid three-drawer bedside'], [1, 'Madrid five-drawer chest']],
    living: {
      base: [[1, 'Madrid coffee table'], [1, 'Madrid dining table set']],
      sofa: [[[1, 'Madrid two-seater sofa']], [[1, 'Madrid two-seater sofa']], [[1, 'Madrid three-seater sofa']], [[2, 'Madrid two-seater sofa']]],
    },
  },
  {
    id: 'scandi',
    name: 'Scandi',
    tone: 'White and oak',
    line: 'The Stockholm bedroom set in white and oak, with a Casa glass dining set and Smith chairs.',
    hero: '2025/10/Scandi-bedroom-furniture-package.jpg',
    gallery: {
      bedroom: [
        room('2025/10/Scandi-bedroom-furniture-package.jpg', 'Scandi bedroom with a grey bed and white and oak wardrobe'),
        piece('2025/10/Scandi-2-Door-Wardrobe.jpg', 'Stockholm two-door wardrobe'),
        piece('2025/10/Scandi-Drawers-Chest.jpg', 'Stockholm four-drawer chest'),
        piece('2025/10/Scandi-Bedside-Table.jpg', 'Stockholm bedside'),
      ],
      living: [
        piece('2025/10/Burlington-Sofa-Bed.jpg', 'Sofa'),
        piece('2026/10/Casa-Glass-Silver-Dining-Table.jpg', 'Casa glass dining table'),
        piece('2025/10/Smith-dining-chair.jpg', 'Dining chair'),
        piece('2025/10/Scandi-Coffee-Table.jpg', 'Scandi coffee table'),
      ],
    },
    board: '2025/10/IMG_2928-1.jpeg',
    prices: {
      apartment: { 1: 2300, 2: 3200, 3: 4100 },
    },
    bed: [[1, 'Stockholm double bed'], [1, 'Stockholm two-door wardrobe'], [1, 'Stockholm bedside'], [1, 'Stockholm four-drawer chest']],
    living: {
      base: [[1, 'Casa dining set'], [1, 'Scandi coffee table']],
      sofa: [[[1, 'Two-seater sofa']], [[1, 'Three-seater sofa']], [[1, 'Three-seater sofa']]],
    },
  },
  {
    id: 'leon',
    name: 'Leon',
    tone: 'Herringbone oak, black legs',
    line: 'Herringbone-oak storage on slim black legs, Casa dining and a grey Amalfi sofa.',
    hero: '2025/10/100-103-096_1111.jpg',
    gallery: {
      bedroom: [
        room('2025/10/100-103-096_1111.jpg', 'Leon herringbone-oak chest in a white panelled bedroom'),
        piece('2025/10/Leon-2-Door-Wardrobe.jpg', 'Leon two-door wardrobe'),
        piece('2025/10/Leon-3-Drawers-Chest.jpg', 'Leon three-drawer chest'),
        piece('2025/10/Leon-Bedside-Table.jpg', 'Leon bedside'),
        DIVAN,
      ],
      living: [
        piece('2025/10/Amalfi-2-seater-sofa.jpg', 'Amalfi two-seater sofa'),
        piece('2025/10/Leon-Coffee-Table-2-drawer.jpg', 'Leon coffee table'),
        piece('2025/09/Fenton-Dining-Table-and-Chair-Set.jpg', 'Dining table and chairs'),
      ],
    },
    board: '2025/10/IMG_2931-1.jpeg',
    prices: {
      apartment: { 1: 2300, 2: 3000, 3: 3700, 4: 4400 },
      hmo: { 4: 2900, 5: 3500, 6: 4100 },
      serviced: { 1: 3300, 2: 4000, 3: 4700 },
    },
    bed: [[1, 'Divan double bed'], [1, 'Leon two-door wardrobe'], [1, 'Leon three-drawer chest'], [1, 'Leon bedside']],
    living: {
      base: [[1, 'Casa dining table'], [4, 'Casa chair'], [1, 'Leon coffee table']],
      sofa: [[[1, 'Amalfi two-seater sofa']], [[1, 'Amalfi two-seater sofa']], [[1, 'Amalfi three-seater sofa'], [1, 'Armchair']], [[2, 'Amalfi three-seater sofa']]],
    },
    hmoMattress: true,
  },
  {
    id: 'oliver',
    name: 'Oliver',
    tone: 'Washed oak',
    line: 'Washed-oak storage and a grey divan, with Athens dining and a Tempo sofa. Our lowest-priced apartment pack, alongside Malvern.',
    hero: '2025/09/Oliver-Bedroom-Furniture-Package.jpg',
    gallery: {
      bedroom: [
        room('2025/09/Oliver-Bedroom-Furniture-Package.jpg', 'Oliver bedroom with an oak-effect wardrobe, grey divan and green throw'),
        piece('2025/09/Oliver-2-door-wardrobe.jpg', 'Oliver two-door wardrobe'),
        piece('2025/09/Oliver-3-drawer-chest.jpg', 'Oliver trio chest'),
        piece('2025/09/Oliver-Bedside-Table.jpg', 'Oliver bedside'),
        DIVAN,
      ],
      living: [
        piece('2025/09/Ashley-2-seater-sofa.jpg', 'Sofa'),
        piece('2025/09/Marlow-Coffee-Table.jpg', 'Coffee table'),
        piece('2025/09/Fenton-Dining-Table-and-Chair-Set.jpg', 'Dining table and chairs'),
      ],
    },
    board: '2025/09/IMG_2933-1.jpeg',
    prices: {
      apartment: { 1: 1650, 2: 2275, 3: 2900, 4: 3525 },
      hmo: { 4: 2700, 5: 3200, 6: 3700 },
    },
    bed: [[1, 'Divan double bed'], [1, 'Oliver two-door wardrobe'], [1, 'Oliver bedside'], [1, 'Oliver trio chest']],
    living: {
      base: [[1, 'Athens dining table set'], [1, 'Quebec coffee table']],
      sofa: [[[1, 'Tempo sofa']], [[1, 'Tempo sofa']], [[1, 'Tempo sofa']], [[1, 'Tempo sofa']]],
    },
    hmoMattress: true,
  },
];

export const byId = Object.fromEntries(PACKS.map((pk) => [pk.id, pk]));

const list = (pk, type) => pk.prices[TYPES[type].prices];
export const offers = (pk, type) => !!list(pk, type);
export const bedOptions = (pk, type) => Object.keys(list(pk, type) || {}).map(Number);
export const priceOf = (pk, type, beds) => list(pk, type)?.[beds] ?? null;
export const fromPrice = (pk) => Math.min(...Object.values(pk.prices.apartment));

export const plural = (n, word) => (n === 1 ? word : word.replace(/(chair|table|bed|sofa|bedside|wardrobe|chest|set|mattress|armchair|desk)$/i, (w) => (w.toLowerCase() === 'mattress' ? w + 'es' : w + 's')));
export const line = ([n, name]) => (n > 1 ? `${n} ${plural(n, name)}` : name);

export function livingFor(pk, beds) {
  const s = pk.living.sofa;
  return [...pk.living.base, ...s[Math.min(Math.max(beds, 1), s.length) - 1]];
}

// What one property gets for a given type and size, grouped by room.
export function contentsFor(pk, type, beds) {
  let bedroom = pk.bed;
  if (type === 'hmo' && pk.hmoMattress) bedroom = [pk.bed[0], [1, 'Orthopaedic mattress'], ...pk.bed.slice(1)];
  if (type === 'student') bedroom = [...pk.bed, [1, 'Desk'], [1, 'Desk chair']];
  const groups = [{ label: beds === 1 ? 'Bedroom' : `Each of ${beds} bedrooms`, per: beds, items: bedroom }];
  if (type !== 'hmo') groups.push({ label: 'Living and dining', per: 1, items: livingFor(pk, beds) });
  return groups;
}

// Adds up every piece in an order: lines are { pack, type, beds, qty }.
// Pieces one property gets, before any changes: Map of name -> count.
export function basePieces(pk, type, beds) {
  const m = new Map();
  for (const g of contentsFor(pk, type, beds)) {
    for (const [n, name] of g.items) m.set(name, (m.get(name) || 0) + n * g.per);
  }
  return m;
}

// Every piece a pack is ever sold with, for "add a piece from this pack".
export function catalogue(pk) {
  const names = new Set(pk.bed.map(([, n]) => n));
  for (const [, n] of pk.living.base) names.add(n);
  for (const s of pk.living.sofa) for (const [, n] of s) names.add(n);
  if (pk.hmoMattress) names.add('Orthopaedic mattress');
  return [...names];
}

// One property's pieces with the customer's changes applied. A line may carry
// `mods` ({ name: change in count }) and `extras` ([{ pack, name, n }]).
export function customPieces(l) {
  const m = basePieces(byId[l.pack], l.type, l.beds);
  for (const [name, d] of Object.entries(l.mods || {})) m.set(name, Math.max(0, (m.get(name) || 0) + d));
  for (const x of l.extras || []) {
    const label = x.pack === l.pack ? x.name : `${x.name} (${byId[x.pack].name})`;
    m.set(label, (m.get(label) || 0) + x.n);
  }
  return m;
}

// Human-readable list of a line's changes, per property.
export function changesOf(l) {
  const out = [];
  for (const [name, d] of Object.entries(l.mods || {})) if (d) out.push({ d, name });
  for (const x of l.extras || []) if (x.n) out.push({ d: x.n, name: x.name, from: x.pack === l.pack ? '' : byId[x.pack].name });
  return out;
}

// Adds up every piece in an order: lines are { pack, type, beds, qty, mods?, extras? }.
export function piecesFor(lines) {
  const total = new Map();
  for (const l of lines) {
    for (const [name, n] of customPieces(l)) if (n) total.set(name, (total.get(name) || 0) + n * l.qty);
  }
  return [...total].map(([name, n]) => [n, name]);
}

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
const gbp2 = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const money = (n) => gbp.format(Math.round(n));
// VAT can land on pence, so totals that include it show pence.
export const money2 = (n) => gbp2.format(Math.round(n * 100) / 100);
