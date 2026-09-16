const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Vendor = require('../models/Vendor');
const Category = require('../models/Category');
const Product = require('../models/Product');

// Comprehensive product catalogs tailored to vendor categories and identities
const vendorProductBlueprints = {
  // Coffee / Artisan Kitchen
  // NOTE: The three original BrewCraft Coffee products have been permanently removed
  // from the database and must NOT be re-seeded:
  //   - Artisan Single-Origin Coorg Arabica Coffee Beans  (BC-COF-ARA-01)
  //   - Precision Hand-Hammered Copper Pour-Over Dripper  (BC-POUR-DRP-02)
  //   - Ceramic Burr Manual Hand Coffee Grinder           (BC-GRND-BUR-03)
  'brewcraft-coffee': [],

  // Skincare / Organic Beauty
  'glowleaf-skincare': [
    {
      name: 'Ayurvedic Radiance 20% Vitamin C Facial Serum',
      categorySlug: 'beauty',
      price: 1299,
      discountPrice: 1099,
      stock: 55,
      sku: 'GL-SER-VITC-01',
      brand: 'GlowLeaf',
      description:
        'High-potency stabilized 20% L-Ascorbic Acid and Ferulic Acid serum enriched with Kashmiri saffron extract and wild rosehip. Neutralizes free radicals, clears blemish marks, and visibly revitalizes luminosity.',
      images: [
        '/generated-products/beauty/serum-11-hero.png',
        '/generated-products/beauty/serum-11-detail.png',
        '/generated-products/beauty/serum-11-lifestyle.png',
      ],
      specifications: [
        { key: 'Skin Type', value: 'All Skin Types, Dull or Uneven Tone' },
        { key: 'Key Actives', value: '20% Vitamin C, Ferulic Acid, Saffron' },
        { key: 'Volume', value: '30 ml (1.01 fl oz)' },
        { key: 'Formulation', value: 'Fast-Absorbing, Paraben & Cruelty-Free' },
      ],
      rating: 4.9,
      numReviews: 64,
      featured: true,
      tags: ['serum', 'vitamin c', 'skincare', 'organic', 'ayurvedic', 'beauty'],
    },
    {
      name: 'Kumkumadi Miraculous Night Treatment Elixir',
      categorySlug: 'beauty',
      price: 1799,
      discountPrice: 1499,
      stock: 40,
      sku: 'GL-ELX-KUM-02',
      brand: 'GlowLeaf',
      description:
        'Authentic 16-herb Ayurvedic formulation infused with pure saffron stigma, red sandalwood, Indian madder, and lotus blossom in cold-pressed sesame oil to deeply nourish and restore elasticity overnight.',
      images: [
        '/generated-products/beauty/serum-123-hero.png',
        '/generated-products/beauty/serum-123-detail.png',
        '/generated-products/beauty/serum-123-lifestyle.png',
      ],
      specifications: [
        { key: 'Benefits', value: 'Intensive Nourishment & Cellular Repair' },
        { key: 'Primary Botanicals', value: 'Kashmiri Saffron, Sandalwood, Lotus' },
        { key: 'Volume', value: '25 ml (0.85 fl oz)' },
        { key: 'Application', value: '3–4 Drops Nightly Before Sleep' },
      ],
      rating: 4.9,
      numReviews: 52,
      featured: false,
      tags: ['kumkumadi', 'face oil', 'night elixir', 'anti aging', 'organic', 'beauty'],
    },
    {
      name: 'Hydra-Barrier Botanical Gel Moisturizer',
      categorySlug: 'beauty',
      price: 999,
      discountPrice: 849,
      stock: 60,
      sku: 'GL-MST-HYD-03',
      brand: 'GlowLeaf',
      description:
        'Weightless oil-free water-burst gel infused with Centella Asiatica (Cica), 5-molecular hyaluronic acid, and organic aloe juice to reinforce skin barrier and deliver 72 hours of weightless hydration.',
      images: [
        '/generated-products/beauty/serum-11-lifestyle.png',
        '/generated-products/beauty/serum-11-hero.png',
        '/generated-products/beauty/serum-11-detail.png',
      ],
      specifications: [
        { key: 'Texture', value: 'Ultralight Cooling Aqua-Gel' },
        { key: 'Key Ingredients', value: 'Centella Asiatica, Hyaluronic Acid, Aloe' },
        { key: 'Net Weight', value: '50g (1.76 oz)' },
        { key: 'Safety', value: 'Dermatologically Tested, Non-Comedogenic' },
      ],
      rating: 4.8,
      numReviews: 38,
      featured: false,
      tags: ['moisturizer', 'cica', 'hydrating', 'gel cream', 'clean beauty'],
    },
  ],

  // Footwear & Streetwear Fashion
  'urbanstride': [
    {
      name: 'CloudPace Minimalist Engineered Knit Sneakers',
      categorySlug: 'fashion',
      price: 3499,
      discountPrice: 2999,
      stock: 45,
      sku: 'US-SNK-CLD-01',
      brand: 'UrbanStride',
      description:
        'Breathable sock-fit sneakers engineered with high-tensile recycled yarn knit, dual-density responsive rebound EVA midsoles, and anti-slip natural rubber outsoles designed for dynamic city exploration.',
      images: [
        '/generated-products/fashion/minimalist-sneakers-main.webp',
        '/generated-products/fashion/minimalist-sneakers-angle.webp',
        '/generated-products/fashion/minimalist-sneakers-detail.webp',
      ],
      specifications: [
        { key: 'Upper Material', value: 'Seamless 3D Engineered Knit' },
        { key: 'Sole Technology', value: 'High-Rebound Dual-Density EVA' },
        { key: 'Insole', value: 'Antimicrobial Breathable Memory Foam' },
        { key: 'Weight', value: '235g per shoe' },
      ],
      rating: 4.8,
      numReviews: 76,
      featured: true,
      tags: ['sneakers', 'shoes', 'knit footwear', 'streetwear', 'casual', 'fashion'],
    },
    {
      name: 'MetroShield All-Weather Commuter 24L Backpack',
      categorySlug: 'fashion',
      price: 2799,
      discountPrice: 2399,
      stock: 35,
      sku: 'US-BPK-MET-02',
      brand: 'UrbanStride',
      description:
        'Streamlined waterproof city commuter pack constructed from 900D ballistic matte recycled fabric with magnetic Fidlock roll-top closure, ergonomic ventilated back panel, and fleece-lined 16-inch laptop compartment.',
      images: [
        '/generated-products/fashion/commute-backpack-main.webp',
        '/generated-products/fashion/commute-backpack-angle.webp',
        '/generated-products/fashion/commute-backpack-detail.webp',
      ],
      specifications: [
        { key: 'Capacity', value: '24 Liters (Expandable to 28L)' },
        { key: 'Material', value: '900D Ballistic Recycled Polyurethane' },
        { key: 'Laptop Fit', value: 'Up to 16-inch MacBook Pro / PC' },
        { key: 'Weather Resistance', value: 'IPX4 Water-Resistant Coating' },
      ],
      rating: 4.8,
      numReviews: 43,
      featured: false,
      tags: ['backpack', 'commuter bag', 'laptop backpack', 'waterproof', 'travel', 'fashion'],
    },
    {
      name: 'AeroFlow Heavyweight Cotton Streetwear Hoodie',
      categorySlug: 'fashion',
      price: 2299,
      discountPrice: 1949,
      stock: 50,
      sku: 'US-HOD-AER-03',
      brand: 'UrbanStride',
      description:
        'Contemporary boxy-cut luxury hoodie crafted from 450 GSM combed organic French terry cotton. Features double-layered hood without drawstrings, seamless kangaroo pocket, and heavy-ribbed cuffs.',
      images: [
        '/generated-products/fashion/nordic-sneakers-series-101.webp',
        '/generated-products/fashion/commute-backpack-main.webp',
        '/generated-products/fashion/minimalist-sneakers-main.webp',
      ],
      specifications: [
        { key: 'Fabric Weight', value: '450 GSM Heavyweight French Terry' },
        { key: 'Composition', value: '100% Combed Organic Cotton' },
        { key: 'Fit Profile', value: 'Relaxed Modern Drop-Shoulder Silhouette' },
        { key: 'Care', value: 'Cold Machine Wash, Lay Flat to Dry' },
      ],
      rating: 4.7,
      numReviews: 35,
      featured: false,
      tags: ['hoodie', 'streetwear', 'cotton hoodie', 'apparel', 'mens fashion'],
    },
  ],

  // NOTE: UrbanStride removed — vendor permanently deleted (had 0 products).
  // The array above ends the last valid vendor block before this comment.

  // Luxury Watches & Timepieces
  'chronolux': [
    {
      name: 'Heritage Automatic Chronograph Sapphire Watch',
      categorySlug: 'fashion',
      price: 24999,
      discountPrice: 21999,
      stock: 18,
      sku: 'CL-CHR-HRT-01',
      brand: 'ChronoLux',
      description:
        'Master horology 41mm timepiece encased in 316L surgical stainless steel featuring a dual-register column-wheel automatic movement, scratch-proof double-domed sapphire crystal, and top-grain Italian calfskin leather band.',
      images: [
        '/generated-products/accessories/chronograph-watch-main.webp',
        '/generated-products/accessories/chronograph-watch-angle.webp',
        '/generated-products/accessories/chronograph-watch-detail.webp',
      ],
      specifications: [
        { key: 'Movement', value: '28,800 VPH Automatic Mechanical Caliber' },
        { key: 'Case Diameter', value: '41 mm (12.4 mm thickness)' },
        { key: 'Crystal', value: 'Anti-Reflective Double-Domed Sapphire' },
        { key: 'Water Resistance', value: '10 ATM (100 Meters / 330 Feet)' },
      ],
      rating: 4.9,
      numReviews: 95,
      featured: true,
      tags: ['watch', 'chronograph', 'automatic watch', 'luxury', 'timepiece', 'fashion'],
    },
    {
      name: 'Royal Ocean Titanium Diver 300M Automatic',
      categorySlug: 'fashion',
      price: 32500,
      discountPrice: 28900,
      stock: 12,
      sku: 'CL-DIV-OCN-02',
      brand: 'ChronoLux',
      description:
        'Professional grade-5 satin-finished titanium diver watch engineered with helium escape valve, 120-click unidirectional ceramic bezel with BGW9 Swiss Super-LumiNova markers, and 72-hour power reserve.',
      images: [
        '/generated-products/accessories/pro-chronograph-watch-series-1.webp',
        '/generated-products/accessories/chronograph-watch-main.webp',
        '/generated-products/accessories/chronograph-watch-angle.webp',
      ],
      specifications: [
        { key: 'Case Material', value: 'Grade-5 Hypoallergenic Solid Titanium' },
        { key: 'Bezel', value: 'Scratchproof High-Tech Gloss Ceramic' },
        { key: 'Power Reserve', value: '72 Hours Continuous Reserve' },
        { key: 'Water Resistance', value: '30 ATM (300 Meters / 1000 Feet)' },
      ],
      rating: 5.0,
      numReviews: 42,
      featured: false,
      tags: ['diver watch', 'titanium watch', 'luxury timepiece', 'swiss grade'],
    },
    {
      name: 'Cosmos Moonphase Dual-Time GMT Timepiece',
      categorySlug: 'fashion',
      price: 19800,
      discountPrice: 17499,
      stock: 22,
      sku: 'CL-GMT-MOON-03',
      brand: 'ChronoLux',
      description:
        'Intricate astronomical timepiece showcasing high-accuracy astronomical lunar phases alongside an independent 24-hour second timezone GMT hand, housed in warm rose-gold ion-plated stainless steel.',
      images: [
        '/generated-products/accessories/pro-chronograph-watch-series-113.webp',
        '/generated-products/accessories/chronograph-watch-detail.webp',
        '/generated-products/accessories/chronograph-watch-main.webp',
      ],
      specifications: [
        { key: 'Complications', value: 'Astronomical Moonphase & GMT Dual-Time' },
        { key: 'Plating', value: '5-Micron 18K Rose Gold Vacuum Ion Plating' },
        { key: 'Strap', value: 'Handcrafted Alligator-Grain Leather' },
        { key: 'Glass', value: 'Coated Sapphire Crystal with Anti-Glare' },
      ],
      rating: 4.8,
      numReviews: 38,
      featured: false,
      tags: ['moonphase', 'gmt watch', 'rose gold', 'dress watch', 'luxury'],
    },
  ],

  // Executive Office Desks & Ergonomics
  // NOTE: Elite Workspace removed — vendor permanently deleted (had 0 products).
  'elite-workspace': [],

  // NOTE: Elite Workspace removed — vendor permanently deleted (had 0 products).

  // Heritage Event Decor & Royal Gifts
  // Heritage Event Decor & Royal Gifts
  'occasion-events': [
    {
      name: 'Handcrafted Udaipur Palace Ceramic Floral Vase',
      categorySlug: 'home-living',
      price: 2499,
      discountPrice: 2199,
      stock: 35,
      sku: 'OE-VAS-PLZ-01',
      brand: 'Occasion Events',
      description:
        'Wheel-thrown fine ceramic heirloom urn hand-painted with intricate botanical murals inspired by royal Mewar palace architecture. Sealed with high-gloss glaze for fresh flora or decorative centerpiece display.',
      images: [
        '/generated-products/home-decor/ceramic-vase-main.webp',
        '/generated-products/home-decor/ceramic-vase-angle.webp',
        '/generated-products/home-decor/ceramic-vase-detail.webp',
      ],
      specifications: [
        { key: 'Artisanal Craft', value: 'Hand-Thrown Terracotta & Glazed Ceramic' },
        { key: 'Dimensions', value: '32 cm Height x 18 cm Diameter' },
        { key: 'Heritage Origin', value: 'Udaipur, Rajasthan Artisan Guild' },
        { key: 'Waterproof', value: '100% Watertight Tested Interior' },
      ],
      rating: 4.9,
      numReviews: 44,
      featured: true,
      tags: ['vase', 'ceramic vase', 'heritage decor', 'wedding gift', 'handcrafted', 'decor'],
    },
    {
      name: 'Royal Heritage Hand-Tooled Leather Guest Journal',
      categorySlug: 'books',
      price: 1699,
      discountPrice: 1399,
      stock: 50,
      sku: 'OE-JRN-LTH-02',
      brand: 'Occasion Events',
      description:
        'Archival full-grain saddle leather guestbook featuring hand-embossed floral mandalas, antique brass swing-arm clasp, and 240 blank deckle-edged recycled cotton parchment pages suitable for calligraphy.',
      images: [
        '/generated-products/books/leather-bound-journal-main.webp',
        '/generated-products/books/leather-bound-journal-lifestyle.webp',
        '/generated-products/books/leather-bound-journal-detail.webp',
      ],
      specifications: [
        { key: 'Cover Material', value: 'Vegetable-Tanned Full-Grain Buffalo Leather' },
        { key: 'Pages', value: '240 Unlined Deckle-Edge Recycled Cotton Pages' },
        { key: 'Ink Compatibility', value: 'Bleed-Proof for Fountain Pens & Ink Calligraphy' },
        { key: 'Dimensions', value: '22 cm x 15 cm x 4 cm' },
      ],
      rating: 4.9,
      numReviews: 58,
      featured: false,
      tags: ['journal', 'leather journal', 'wedding guestbook', 'calligraphy', 'handmade gift'],
    },
    {
      name: 'Imperial Brass Architectural Arc Floor Lantern',
      categorySlug: 'home-living',
      price: 8999,
      discountPrice: 7999,
      stock: 20,
      sku: 'OE-LMP-ARC-03',
      brand: 'Occasion Events',
      description:
        'Sweeping brass-finished cantilever floor lamp casting diffused ambient celebration illumination. Features weighted solid black marble base and brushed brass lampshade for regal spatial anchoring.',
      images: [
        '/generated-products/home-decor/arc-floor-lamp-main.webp',
        '/generated-products/home-decor/arc-floor-lamp-angle.webp',
        '/generated-products/home-decor/arc-floor-lamp-detail.webp',
      ],
      specifications: [
        { key: 'Metalwork', value: 'Spun Solid Brass with Brushed Satin Lacquer' },
        { key: 'Base Anchor', value: 'Polished Nero Marquina Natural Marble' },
        { key: 'Total Height', value: '195 cm (Adjustable Cantilever Reach 120 cm)' },
        { key: 'Bulb Standard', value: 'E27 Warm Filament (Dimmable Foot Switch)' },
      ],
      rating: 4.8,
      numReviews: 31,
      featured: false,
      tags: ['floor lamp', 'brass lantern', 'ambient lighting', 'home decor', 'lighting'],
    },
  ],

  // STEM Learning Kits & Academic Resources
  'qezmora-education': [
    {
      name: 'STEM Programmable Robotics & AI Explorer Kit',
      categorySlug: 'toys',
      price: 4499,
      discountPrice: 3899,
      stock: 40,
      sku: 'QE-KIT-ROB-01',
      brand: 'Qezmora',
      description:
        'All-in-one educational robotics lab kit featuring Arduino-compatible microcontroller, infrared obstacle avoidance sensors, ultrasonic tracker, high-torque servos, and 45 project tutorials from beginner block coding to Python.',
      images: [
        '/generated-products/toys/stem-robotics-kit-main.webp',
        '/generated-products/toys/stem-robotics-kit-angle.webp',
        '/generated-products/toys/stem-robotics-kit-detail.webp',
      ],
      specifications: [
        { key: 'Target Age Group', value: 'Ages 9 to 16 Years (Beginner to Advanced)' },
        { key: 'Microcontroller', value: 'Atmega328P with Bluetooth & USB Programming' },
        { key: 'Programming Languages', value: 'Scratch 3.0 Block Coding, C++, Python' },
        { key: 'Curriculum Alignment', value: 'CBSE & ICSE Experiential STEM Curriculum' },
      ],
      rating: 4.9,
      numReviews: 73,
      featured: true,
      tags: ['stem', 'robotics', 'education kit', 'coding for kids', 'toys', 'learning'],
    },
    {
      name: 'Montessori Wooden Sensory Mathematics Board',
      categorySlug: 'toys',
      price: 1899,
      discountPrice: 1599,
      stock: 45,
      sku: 'QE-MON-MTH-02',
      brand: 'Qezmora',
      description:
        'Non-toxic organic beechwood mathematical counting and spatial reasoning tray with 100 counting pegs, geometric pattern tiles, and tactile number tracing grooves to foster early numeracy intuition.',
      images: [
        '/generated-products/toys/wooden-montessori-board-main.webp',
        '/generated-products/toys/wooden-montessori-board-angle.webp',
        '/generated-products/toys/wooden-montessori-board-detail.webp',
      ],
      specifications: [
        { key: 'Material', value: 'Sustainably Harvested FSC Natural Beechwood' },
        { key: 'Safety Standards', value: 'EN71 & ASTM Non-Toxic Water-Based Finishes' },
        { key: 'Recommended Age', value: '3 to 7 Years' },
        { key: 'Includes', value: 'Wooden Board, 100 Pegs, 10 Number Blocks, Cloth Pouch' },
      ],
      rating: 4.8,
      numReviews: 51,
      featured: false,
      tags: ['montessori', 'wooden toys', 'math learning', 'sensory board', 'education'],
    },
    {
      name: 'Precision Physics & Structural Mechanics Laboratory',
      categorySlug: 'toys',
      price: 2799,
      discountPrice: 2399,
      stock: 35,
      sku: 'QE-PHY-LAB-03',
      brand: 'Qezmora',
      description:
        'Hands-on experimental mechanics building system containing 120 interlocking struts, gears, pulleys, and spring dynos with an illustrated 64-page lab guide exploring levers, trusses, and momentum.',
      images: [
        '/generated-products/toys/stem-robotics-kit-angle.webp',
        '/generated-products/toys/wooden-montessori-board-detail.webp',
        '/generated-products/toys/stem-robotics-kit-main.webp',
      ],
      specifications: [
        { key: 'Experiments', value: '35 Guided Physics & Engineering Challenges' },
        { key: 'Core Concepts', value: 'Levers, Pulleys, Structural Trusses, Kinetic Energy' },
        { key: 'Component Count', value: '120+ High-Impact Modular Structural Elements' },
        { key: 'Age Level', value: '8 Years & Above' },
      ],
      rating: 4.8,
      numReviews: 39,
      featured: false,
      tags: ['physics', 'mechanics kit', 'engineering', 'science kit', 'learning toys'],
    },
  ],
};

// Generic category fallback generator if any other vendor ever has 0 products
function generateFallbackProductsForVendor(vendor, category) {
  const vName = vendor.storeName;
  const brand = vName.split(' ')[0];
  const catSlug = category.slug;

  return [
    {
      name: `${brand} Signature Edition ${category.name} Item`,
      categorySlug: catSlug,
      price: 3499,
      discountPrice: 2999,
      stock: 30,
      sku: `${brand.toUpperCase().slice(0, 3)}-${catSlug.toUpperCase().slice(0, 3)}-01`,
      brand,
      description: `Curated exclusively by ${vName}, this authentic signature offering combines premium craftsmanship with durable performance designed for discerning buyers.`,
      images: ['/generated-products/accessories/chronograph-watch-main.webp'],
      specifications: [
        { key: 'Craftsmanship', value: 'Hand-Inspected Master Quality' },
        { key: 'Warranty', value: '2-Year Manufacturer Warranty' },
        { key: 'Origin', value: `Crafted & Inspected in ${vendor.location || 'India'}` },
      ],
      rating: 4.8,
      numReviews: 24,
      featured: true,
      tags: [catSlug, 'signature', 'curated', 'bestseller'],
    },
    {
      name: `${brand} Essential Everyday ${category.name}`,
      categorySlug: catSlug,
      price: 1999,
      discountPrice: 1699,
      stock: 45,
      sku: `${brand.toUpperCase().slice(0, 3)}-${catSlug.toUpperCase().slice(0, 3)}-02`,
      brand,
      description: `Designed for daily utility and reliability, the Essential series by ${vName} provides unmatched quality, ease of use, and lasting satisfaction.`,
      images: ['/generated-products/accessories/chronograph-watch-angle.webp'],
      specifications: [
        { key: 'Material', value: 'Eco-Composite & Premium Alloys' },
        { key: 'Warranty', value: '1-Year Limited Warranty' },
        { key: 'Origin', value: `Crafted & Inspected in ${vendor.location || 'India'}` },
      ],
      rating: 4.7,
      numReviews: 18,
      featured: false,
      tags: [catSlug, 'essential', 'quality', 'recommended'],
    },
    {
      name: `${brand} Pro Performance Series`,
      categorySlug: catSlug,
      price: 4999,
      discountPrice: 4299,
      stock: 20,
      sku: `${brand.toUpperCase().slice(0, 3)}-${catSlug.toUpperCase().slice(0, 3)}-03`,
      brand,
      description: `Engineered to exacting commercial standards, the Pro Performance edition by ${vName} represents top-tier innovation and robust build quality.`,
      images: ['/generated-products/accessories/chronograph-watch-detail.webp'],
      specifications: [
        { key: 'Performance Grade', value: 'Commercial / High-End Utility' },
        { key: 'Warranty', value: '3-Year Extended Warranty' },
        { key: 'Origin', value: `Crafted & Inspected in ${vendor.location || 'India'}` },
      ],
      rating: 4.9,
      numReviews: 31,
      featured: false,
      tags: [catSlug, 'pro', 'performance', 'premium'],
    },
  ];
}

async function seedMissingProducts() {
  console.log('=== VENMA AUTO-SEED MISSING VENDOR PRODUCTS ===\n');

  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/venma';
    console.log(`Connecting to MongoDB (${mongoUri})...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.\n');

    // 1. Fetch all categories and create lookup map
    const categories = await Category.find();
    const categoryMapBySlug = {};
    categories.forEach((c) => {
      categoryMapBySlug[c.slug] = c;
    });

    // 2. Fetch all vendors
    const allVendors = await Vendor.find();
    console.log(`Auditing ${allVendors.length} marketplace vendors...\n`);

    let vendorsFixed = 0;
    let productsAddedTotal = 0;

    for (const vendor of allVendors) {
      const existingProductCount = await Product.countDocuments({ vendor: vendor._id });

      if (existingProductCount > 0) {
        // Vendor already has inventory
        continue;
      }

      console.log(`[!] Vendor with ZERO products detected: "${vendor.storeName}" (${vendor.storeSlug})`);

      // Determine product blueprints for this vendor
      let blueprints = vendorProductBlueprints[vendor.storeSlug];

      // An empty array means the vendor's products were intentionally removed — skip seeding
      if (Array.isArray(blueprints) && blueprints.length === 0) {
        console.log(`    Skipping "${vendor.storeName}" — intentionally has no seed products.\n`);
        continue;
      }

      if (!blueprints) {
        // Fallback: choose category based on specialty or description
        let fallbackCat = categories[0];
        const spec = (vendor.specialty + ' ' + vendor.description).toLowerCase();
        if (/tech|electr/i.test(spec)) fallbackCat = categoryMapBySlug['electronics'] || fallbackCat;
        else if (/sport|fit/i.test(spec)) fallbackCat = categoryMapBySlug['sports'] || fallbackCat;
        else if (/coffee|kitchen|culin/i.test(spec)) fallbackCat = categoryMapBySlug['kitchen'] || fallbackCat;
        else if (/beauty|skin|care/i.test(spec)) fallbackCat = categoryMapBySlug['beauty'] || fallbackCat;
        else if (/fashion|watch|wear|apparel/i.test(spec)) fallbackCat = categoryMapBySlug['fashion'] || fallbackCat;
        else if (/auto|car/i.test(spec)) fallbackCat = categoryMapBySlug['automotive'] || fallbackCat;
        else if (/office|work/i.test(spec)) fallbackCat = categoryMapBySlug['office'] || fallbackCat;
        else if (/book|educat|stem|learn/i.test(spec)) fallbackCat = categoryMapBySlug['books'] || categoryMapBySlug['toys'] || fallbackCat;
        else if (/home|decor|living/i.test(spec)) fallbackCat = categoryMapBySlug['home-living'] || fallbackCat;

        blueprints = generateFallbackProductsForVendor(vendor, fallbackCat);
      }

      let vendorAddedCount = 0;

      for (const bp of blueprints) {
        // Safety rule: check if product with this name already exists for this vendor
        const exists = await Product.exists({
          name: bp.name,
          vendor: vendor._id,
        });

        if (exists) {
          console.log(`    - Product already exists: "${bp.name}", skipping.`);
          continue;
        }

        const targetCategory = categoryMapBySlug[bp.categorySlug] || categories[0];

        // Ensure specifications include Origin
        const specs = [...(bp.specifications || [])];
        if (!specs.some((s) => s.key === 'Origin')) {
          specs.push({
            key: 'Origin',
            value: `Crafted & Inspected in ${vendor.location || 'India'}`,
          });
        }

        const slug = bp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        // Ensure slug uniqueness
        let finalSlug = slug;
        let slugCounter = 1;
        while (await Product.exists({ slug: finalSlug })) {
          finalSlug = `${slug}-${slugCounter++}`;
        }

        const newProduct = await Product.create({
          name: bp.name,
          slug: finalSlug,
          description: bp.description,
          category: targetCategory._id,
          vendor: vendor._id,
          price: bp.price,
          discountPrice: bp.discountPrice || 0,
          stock: bp.stock || 25,
          sku: bp.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          brand: bp.brand || vendor.storeName.split(' ')[0],
          images: bp.images,
          thumbnail: bp.images[0],
          imageValid: true,
          specifications: specs,
          rating: bp.rating || 4.8,
          numReviews: bp.numReviews || 15,
          featured: !!bp.featured,
          isPublished: true,
          tags: bp.tags || ['marketplace', 'authentic'],
        });

        vendorAddedCount++;
        productsAddedTotal++;
      }

      if (vendorAddedCount > 0) {
        // Synchronize vendor product count and categories sold
        const newTotal = await Product.countDocuments({ vendor: vendor._id, isPublished: true });
        const categoriesSoldDocs = await Product.find({ vendor: vendor._id, isPublished: true })
          .populate('category', 'name')
          .then((prods) => [...new Set(prods.map((p) => p.category?.name).filter(Boolean))]);

        vendor.totalProducts = newTotal;
        vendor.categoriesSold = categoriesSoldDocs;
        await vendor.save();

        console.log(`✓ ${vendor.storeName} → ${vendorAddedCount} products added (Total now: ${newTotal})`);
        vendorsFixed++;
      }
    }

    console.log('\n--------------------------------------------------');
    console.log(`Total vendors fixed: ${vendorsFixed}`);
    console.log(`Total products added: ${productsAddedTotal}`);
    console.log('--------------------------------------------------\n');

    // Final audit
    const finalZeroVendors = [];
    const vendorsAfter = await Vendor.find();
    for (const v of vendorsAfter) {
      const cnt = await Product.countDocuments({ vendor: v._id });
      if (cnt === 0) finalZeroVendors.push(v.storeName);
    }

    if (finalZeroVendors.length === 0) {
      console.log('✨ SUCCESS: Every vendor in VENMA now has at least one active product!');
    } else {
      console.warn(`WARNING: The following vendors still have 0 products: ${finalZeroVendors.join(', ')}`);
    }

    if (require.main === module) {
      process.exit(0);
    }
    return { vendorsFixed, productsAddedTotal };
  } catch (err) {
    console.error('Error seeding missing products:', err);
    if (require.main === module) {
      process.exit(1);
    }
    throw err;
  }
}

if (require.main === module) {
  seedMissingProducts();
}

module.exports = { seedMissingProducts, vendorProductBlueprints };
