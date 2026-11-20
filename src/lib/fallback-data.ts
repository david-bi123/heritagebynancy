/**
 * Bundled catalogue used when MongoDB is not configured or unreachable.
 * Lets the storefront render (and lets `next build` succeed) without a
 * database, and doubles as the seed dataset for scripts/seed.mjs.
 *
 * NOTE: All prices, stock levels and product details here are SAMPLE
 * placeholders. The client manages the real catalogue in the admin
 * dashboard; image URLs are temporary stock photography and can be
 * replaced there too. None of these bottles is the client's physical stock.
 */

export interface StorefrontSize {
  label: string;
  price: number;
}

export interface StorefrontProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string; // category slug
  concentration: string;
  description: string;
  notesTop: string;
  notesHeart: string;
  notesBase: string;
  sizes: StorefrontSize[];
  stock: number;
  featured: boolean;
  active: boolean;
  images: string[];
}

export interface StorefrontCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
}

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

/**
 * Hero: a flacon resting among fresh pink roses — the house mood in one frame.
 * Story: a blush peony bouquet — the florals at the heart of fine fragrance.
 */
export const HERO_IMAGE = img("photo-1592945403244-b3fbafd7f539", 2000);
export const STORY_IMAGE = img("photo-1487530811176-3780de880c2d", 1600).replace(
  "w=1600&q=85",
  "w=1600&h=1280&q=85&crop=focalpoint&fp-x=0.5&fp-y=0.35",
);

/** Editorial banners for interior pages — graded under a deep aubergine wash. */
export const SHOP_HERO_IMAGE = img("photo-1615634260167-c8cdede054de", 2000);
export const CONTACT_HERO_IMAGE = img("photo-1616949755610-8c9bbc08f138", 1600);
export const ABOUT_HERO_IMAGE = img("photo-1487530811176-3780de880c2d", 1600);
export const POLICY_HERO_IMAGE = img("photo-1585386959984-a4155224a1ad", 1400);
export const FAQ_HERO_IMAGE = img("photo-1595425970377-c9703cf48b6d", 1400);

export const FALLBACK_CATEGORIES: StorefrontCategory[] = [
  {
    id: "cat-womens",
    name: "Women's Fragrances",
    slug: "womens",
    description: "Timeless classics and modern signatures for her.",
    image: img("photo-1595425970377-c9703cf48b6d", 1400),
    order: 1,
  },
  {
    id: "cat-mens",
    name: "Men's Fragrances",
    slug: "mens",
    description: "Bold woods, fresh aquatics and refined aromatics for him.",
    image: img("photo-1523293182086-7651a899d37f", 1400),
    order: 2,
  },
];

export const FALLBACK_PRODUCTS: StorefrontProduct[] = [
  {
    id: "prod-no5",
    name: "Chanel No.5 Eau de Parfum",
    slug: "chanel-no5-eau-de-parfum",
    brand: "Chanel",
    category: "womens",
    concentration: "Eau de Parfum",
    description:
      "The most famous perfume ever created — a sophisticated aldehydic floral bouquet of jasmine, rose and ylang-ylang over warm blushalwood. A timeless signature for the woman who defines her own elegance.",
    notesTop: "Aldehydes, Neroli, Ylang-Ylang",
    notesHeart: "Jasmine, May Rose, Iris",
    notesBase: "Sandalwood, Vetiver, Vanilla",
    sizes: [
      { label: "50ml", price: 1450 },
      { label: "100ml", price: 1950 },
    ],
    stock: 12,
    featured: true,
    active: true,
    images: [img("photo-1541643600914-78b084683601")],
  },
  {
    id: "prod-coco-mademoiselle",
    name: "Chanel Coco Mademoiselle Eau de Parfum",
    slug: "chanel-coco-mademoiselle-eau-de-parfum",
    brand: "Chanel",
    category: "womens",
    concentration: "Eau de Parfum",
    description:
      "A modern, radiant oriental floral. Sparkling Sicilian orange and bergamot open into a heart of Turkish rose and jasmine, settled into an elegant base of patchouli and white musks.",
    notesTop: "Orange, Bergamot, Grapefruit",
    notesHeart: "Turkish Rose, Jasmine, Litchi",
    notesBase: "Patchouli, White Musk, Vanilla",
    sizes: [
      { label: "50ml", price: 1650 },
      { label: "100ml", price: 2400 },
    ],
    stock: 9,
    featured: true,
    active: true,
    images: [img("photo-1592945403244-b3fbafd7f539")],
  },
  {
    id: "prod-coco-noir",
    name: "Chanel Coco Noir Eau de Parfum",
    slug: "chanel-coco-noir-eau-de-parfum",
    brand: "Chanel",
    category: "womens",
    concentration: "Eau de Parfum",
    description:
      "An intense, smoky and enveloping oriental. Bright grapefruit is wrapped in rose and jasmine, deepened with a powerful accord of blushalwood, tonka bean and white amber.",
    notesTop: "Grapefruit, Rose de Mai, Orange",
    notesHeart: "Jasmine, Rose, Coriander",
    notesBase: "Sandalwood, Tonka Bean, White Amber",
    sizes: [
      { label: "50ml", price: 1600 },
      { label: "100ml", price: 2350 },
    ],
    stock: 8,
    featured: false,
    active: true,
    images: [img("photo-1594035910387-fea47794261f")],
  },
  {
    id: "prod-sun-di-gioia",
    name: "Giorgio Armani Sun di Gioia Eau de Parfum",
    slug: "giorgio-armani-sun-di-gioia-eau-de-parfum",
    brand: "Giorgio Armani",
    category: "womens",
    concentration: "Eau de Parfum",
    description:
      "Pure joy in a bottle — a luminous, fruity floral. Italian bergamot and pear sparkle over a heart of jasmine and peony, finished with warm cedar and vanilla.",
    notesTop: "Italian Bergamot, Italian Pear, Calabrian Orange",
    notesHeart: "Jasmine, Red Peony",
    notesBase: "Cedarwood, Vanilla",
    sizes: [
      { label: "30ml", price: 850 },
      { label: "50ml", price: 1350 },
      { label: "100ml", price: 1950 },
    ],
    stock: 0,
    featured: false,
    active: true,
    images: [img("photo-1547887537-6158d64c35b3")],
  },
  {
    id: "prod-bleu-de-chanel",
    name: "Bleu de Chanel Eau de Parfum",
    slug: "bleu-de-chanel-eau-de-parfum",
    brand: "Chanel",
    category: "mens",
    concentration: "Eau de Parfum",
    description:
      "The definitive modern masculine signature — citrus brightness over an energetic heart of ginger and jasmine, grounded by noble blushalwood and incense. Effortlessly sophisticated.",
    notesTop: "Grapefruit, Lemon, Mint",
    notesHeart: "Ginger, Jasmine, Pink Pepper",
    notesBase: "Sandalwood, Incense, Amberwood",
    sizes: [
      { label: "50ml", price: 1250 },
      { label: "100ml", price: 1800 },
      { label: "150ml", price: 2250 },
    ],
    stock: 14,
    featured: true,
    active: true,
    images: [img("photo-1523293182086-7651a899d37f")],
  },
  {
    id: "prod-acqua-di-gio",
    name: "Giorgio Armani Acqua di Giò Pour Homme Eau de Toilette",
    slug: "giorgio-armani-acqua-di-gio-pour-homme-eau-de-toilette",
    brand: "Giorgio Armani",
    category: "mens",
    concentration: "Eau de Toilette",
    description:
      "The legendary marine refreshment. Mediterranean citrus, rosemary and lavender over sensual marine and woody notes — pure coastal elegance for everyday wear.",
    notesTop: "Bergamot, Lemon, Lime, Mandarin",
    notesHeart: "Sea Notes, Jasmine, Rosemary, Lavender",
    notesBase: "Cedarwood, Sandalwood, Musk, Patchouli",
    sizes: [
      { label: "50ml", price: 950 },
      { label: "100ml", price: 1450 },
    ],
    stock: 11,
    featured: false,
    active: true,
    images: [img("photo-1619994403073-2cec844b8e63")],
  },
  {
    id: "prod-versace-eros",
    name: "Versace Eros Eau de Toilette",
    slug: "versace-eros-eau-de-toilette",
    brand: "Versace",
    category: "mens",
    concentration: "Eau de Toilette",
    description:
      "A magnetic, passionate masculine — Sicilian mandarin, fresh mint and green apple over ambroxan, geranium and warm tonka bean. Bold, sensual and unforgettable.",
    notesTop: "Mint, Green Apple, Lemon, Italian Mandarin",
    notesHeart: "Tonka Bean, Ambroxan, Geranium, Flowers",
    notesBase: "Cedarwood, Vetiver, Vanilla, Oakmoss",
    sizes: [
      { label: "50ml", price: 850 },
      { label: "100ml", price: 1400 },
    ],
    stock: 3,
    featured: true,
    active: true,
    images: [img("photo-1587017539504-67cfbddac569")],
  },
];
