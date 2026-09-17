const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const CommissionTransaction = require('../models/CommissionTransaction');

async function seedTechNova() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas.');

    // 1. Locate or verify TechNova Vendor User
    let vendorUser = await User.findOne({ email: 'vendor@venma.com' });
    if (!vendorUser) {
      console.log('Creating vendor@venma.com user...');
      vendorUser = await User.create({
        name: 'TechNova Electronics Owner',
        email: 'vendor@venma.com',
        password: 'password123',
        role: 'vendor',
        phone: '+91 98765 43210',
      });
    } else {
      console.log('Found vendor@venma.com:', vendorUser._id.toString());
      if (vendorUser.role !== 'vendor') {
        vendorUser.role = 'vendor';
        await vendorUser.save();
      }
    }

    // 2. Locate or update TechNova Vendor Profile
    let vendor = await Vendor.findOne({ storeSlug: 'technova-electronics' });
    if (!vendor) {
      vendor = await Vendor.findOne({ storeName: 'TechNova Electronics' });
    }

    if (!vendor) {
      console.log('Creating TechNova Electronics vendor document...');
      vendor = await Vendor.create({
        user: vendorUser._id,
        storeName: 'TechNova Electronics',
        storeSlug: 'technova-electronics',
        description: 'Pioneering next-generation consumer electronics, ultra-fast charging accessories, and high-performance computing gadgets.',
        specialty: 'High-Performance Laptops, Audio Gear & Smart Accessories',
        categoriesSold: ['Electronics', 'Workspace Accessories', 'Home & Living'],
        logo: '/generated-vendors/technova-electronics-logo.webp',
        banner: '/generated-vendors/technova-electronics-banner.webp',
        phone: '+91 80 4123 4567',
        address: {
          street: '104 TechNova Tower, Outer Ring Road, Bellandur',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          zipCode: '560103',
        },
        location: 'Bengaluru, Karnataka',
        status: 'approved',
        commissionRate: 10,
        rating: 4.9,
        numReviews: 48,
        followersCount: 240,
      });
    } else {
      console.log('Updating TechNova Electronics vendor document...');
      vendor.user = vendorUser._id;
      vendor.storeName = 'TechNova Electronics';
      vendor.storeSlug = 'technova-electronics';
      vendor.description = 'Pioneering next-generation consumer electronics, ultra-fast charging accessories, and high-performance computing gadgets.';
      vendor.specialty = 'High-Performance Laptops, Audio Gear & Smart Accessories';
      vendor.status = 'approved';
      vendor.rating = 4.9;
      vendor.numReviews = 48;
      vendor.followersCount = 240;
      vendor.address = {
        street: '104 TechNova Tower, Outer Ring Road, Bellandur',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        zipCode: '560103',
      };
      vendor.location = 'Bengaluru, Karnataka';
      await vendor.save();
    }
    console.log('TechNova Vendor ID:', vendor._id.toString(), 'Linked to User:', vendor.user.toString());

    // 3. Find Categories
    const electronicsCat = await Category.findOne({ slug: 'electronics' });
    const workspaceCat = await Category.findOne({ slug: 'workspace-accessories' }) || electronicsCat;
    const catId = electronicsCat ? electronicsCat._id : null;

    if (!catId) {
      throw new Error('Electronics category not found in database');
    }

    // 4. Clean existing TechNova-only products to avoid duplicates, or upsert cleanly
    console.log('Preparing TechNova products...');
    await Product.deleteMany({ vendor: vendor._id });

    const techNovaProductsData = [
      {
        name: 'NovaBook Air 14 Pro M3',
        slug: 'novabook-air-14-pro-m3',
        description: 'Engineered for power users. 14.2-inch Liquid Retina XDR display, 16GB Unified RAM, 512GB NVMe SSD, and up to 18 hours of battery life. Built with aerospace-grade anodized aluminum.',
        category: catId,
        vendor: vendor._id,
        price: 64999,
        discountPrice: 59999,
        stock: 35,
        sku: 'TN-NB-AIR14-01',
        brand: 'TechNova',
        images: ['/generated-products/electronics/novabook-air-14.webp'],
        thumbnail: '/generated-products/electronics/novabook-air-14.webp',
        imageValid: true,
        rating: 4.9,
        numReviews: 24,
        featured: true,
        isPublished: true,
        tags: ['laptop', 'ultrabook', 'technova', 'electronics', 'work'],
        specifications: [
          { key: 'Processor', value: 'Octa-Core High Performance SoC' },
          { key: 'Display', value: '14.2" 120Hz Retina IPS' },
          { key: 'Memory', value: '16GB LPDDR5' },
          { key: 'Storage', value: '512GB PCIe 4.0 SSD' },
        ],
      },
      {
        name: 'Nova X Pro Flagship 5G',
        slug: 'nova-x-pro-flagship-5g',
        description: 'Experience unmatched speed with Snapdragon 8 Gen 3, 200MP OIS camera array, 120Hz Curved AMOLED display, and 100W HyperCharge capability.',
        category: catId,
        vendor: vendor._id,
        price: 49999,
        discountPrice: 46999,
        stock: 42,
        sku: 'TN-SP-NOVAX-02',
        brand: 'TechNova',
        images: ['/generated-products/electronics/nova-x-pro-smartphone.webp'],
        thumbnail: '/generated-products/electronics/nova-x-pro-smartphone.webp',
        imageValid: true,
        rating: 4.8,
        numReviews: 19,
        featured: true,
        isPublished: true,
        tags: ['smartphone', '5g', 'flagship', 'technova', 'mobile'],
        specifications: [
          { key: 'Display', value: '6.78" AMOLED 144Hz HDR10+' },
          { key: 'Camera', value: '200MP + 50MP Ultra-wide + 12MP Telephoto' },
          { key: 'Battery', value: '5400mAh with 100W Charging' },
        ],
      },
      {
        name: 'NovaTab 11 Ultra Tablet',
        slug: 'novatab-11-ultra-tablet',
        description: 'Productivity and cinematic entertainment unified. 11-inch 2.8K display with stylus pencil support and quad stereo speakers tuned by SonicAudio.',
        category: catId,
        vendor: vendor._id,
        price: 29999,
        discountPrice: 27499,
        stock: 28,
        sku: 'TN-TB-TAB11-03',
        brand: 'TechNova',
        images: ['/generated-products/electronics/novatab-11.webp'],
        thumbnail: '/generated-products/electronics/novatab-11.webp',
        imageValid: true,
        rating: 4.7,
        numReviews: 12,
        featured: true,
        isPublished: true,
        tags: ['tablet', 'stylus', 'technova', 'android', 'entertainment'],
        specifications: [
          { key: 'Screen', value: '11.0 inch 2880x1800 120Hz' },
          { key: 'RAM', value: '8GB' },
          { key: 'Storage', value: '256GB' },
        ],
      },
      {
        name: 'Sonic Pro ANC Wireless Headphones',
        slug: 'sonic-pro-anc-wireless-headphones',
        description: 'Audiophile-grade studio acoustic drivers with 42dB Hybrid Active Noise Cancellation, spatial audio tracking, and ultra-plush memory foam earcups.',
        category: catId,
        vendor: vendor._id,
        price: 8999,
        discountPrice: 7999,
        stock: 18,
        sku: 'TN-AUD-SPANC-04',
        brand: 'TechNova',
        images: ['/generated-products/electronics/sonic-pro-anc-headphones.webp'],
        thumbnail: '/generated-products/electronics/sonic-pro-anc-headphones.webp',
        imageValid: true,
        rating: 4.9,
        numReviews: 31,
        featured: true,
        isPublished: true,
        tags: ['headphones', 'anc', 'wireless', 'bluetooth', 'audio'],
        specifications: [
          { key: 'Battery Life', value: 'Up to 50 Hours ANC Off / 38 Hours ANC On' },
          { key: 'Codecs', value: 'LDAC, AAC, aptX HD' },
          { key: 'Microphone', value: 'Quad beamforming with AI noise filtering' },
        ],
      },
      {
        name: 'Vision 27" 4K UHD Ergonomic Monitor',
        slug: 'vision-27-4k-uhd-ergonomic-monitor',
        description: 'Vivid color accuracy covering 99% DCI-P3 gamut. Features 65W USB-C single-cable connectivity, height/pivot adjustable stand, and anti-glare panel.',
        category: workspaceCat ? workspaceCat._id : catId,
        vendor: vendor._id,
        price: 24999,
        discountPrice: 22999,
        stock: 14, // Low stock <= 15 for inventory alert!
        sku: 'TN-DISP-VIS27-05',
        brand: 'TechNova',
        images: ['/generated-products/electronics/vision-27-4k-monitor.webp'],
        thumbnail: '/generated-products/electronics/vision-27-4k-monitor.webp',
        imageValid: true,
        rating: 4.8,
        numReviews: 15,
        featured: true,
        isPublished: true,
        tags: ['monitor', '4k', 'display', 'workspace', 'usb-c'],
        specifications: [
          { key: 'Resolution', value: '3840 x 2160 4K UHD' },
          { key: 'Color Gamut', value: '99% DCI-P3, 100% sRGB' },
          { key: 'Connectivity', value: 'USB-C (65W PD), HDMI 2.1, DisplayPort 1.4' },
        ],
      },
      {
        name: 'Sonic Buds Air ANC Earbuds',
        slug: 'sonic-buds-air-anc-earbuds',
        description: 'Compact wireless earbuds with deep punchy bass, IPX5 sweat resistance, low-latency gaming mode, and fast wireless charging case.',
        category: catId,
        vendor: vendor._id,
        price: 3499,
        discountPrice: 2999,
        stock: 55,
        sku: 'TN-AUD-SBUD-06',
        brand: 'TechNova',
        images: ['/generated-products/electronics/sonic-buds-air.webp'],
        thumbnail: '/generated-products/electronics/sonic-buds-air.webp',
        imageValid: true,
        rating: 4.6,
        numReviews: 22,
        featured: false,
        isPublished: true,
        tags: ['earbuds', 'tws', 'wireless', 'music'],
        specifications: [
          { key: 'Battery', value: '32 Hours with Charging Case' },
          { key: 'Water Resistance', value: 'IPX5' },
        ],
      },
      {
        name: 'NovaWatch Active Smartwatch',
        slug: 'novawatch-active-smartwatch',
        description: 'Premium titanium-cased fitness smartwatch with 1.43" Always-On AMOLED screen, continuous SpO2, heart rate, GPS tracking, and Bluetooth calling.',
        category: catId,
        vendor: vendor._id,
        price: 5999,
        discountPrice: 4999,
        stock: 8, // Low stock <= 15 for inventory alert!
        sku: 'TN-WCH-ACTV-07',
        brand: 'TechNova',
        images: ['/generated-products/electronics/novawatch-active.webp'],
        thumbnail: '/generated-products/electronics/novawatch-active.webp',
        imageValid: true,
        rating: 4.7,
        numReviews: 18,
        featured: true,
        isPublished: true,
        tags: ['smartwatch', 'fitness', 'health', 'wearable'],
        specifications: [
          { key: 'Battery Life', value: 'Up to 12 days typical usage' },
          { key: 'Sensors', value: 'Optical Heart Rate, SpO2, Accelerometer, Barometer' },
        ],
      },
      {
        name: 'MechaKey RGB Wireless Mechanical Keyboard',
        slug: 'mechakey-rgb-wireless-mechanical-keyboard',
        description: 'Hot-swappable custom linear red switches, sound-dampening silicone foam, multi-device Tri-Mode (2.4GHz / Bluetooth 5.2 / USB-C), and per-key RGB backlight.',
        category: workspaceCat ? workspaceCat._id : catId,
        vendor: vendor._id,
        price: 4299,
        discountPrice: 3899,
        stock: 22,
        sku: 'TN-KB-MECHRGB-08',
        brand: 'TechNova',
        images: ['/generated-products/electronics/mechakey-rgb.webp'],
        thumbnail: '/generated-products/electronics/mechakey-rgb.webp',
        imageValid: true,
        rating: 4.9,
        numReviews: 28,
        featured: false,
        isPublished: true,
        tags: ['keyboard', 'mechanical', 'rgb', 'gaming', 'workspace'],
        specifications: [
          { key: 'Switch Type', value: 'Pre-lubed Hot-Swappable Linear Red' },
          { key: 'Battery', value: '4000mAh Rechargeable' },
        ],
      },
      {
        name: 'Nova Precision Pro Wireless Gaming Mouse',
        slug: 'nova-precision-pro-wireless-gaming-mouse',
        description: 'Ultra-lightweight 58g ergonomic mouse with 26,000 DPI optical sensor, optical micro switches rated for 80M clicks, and 80-hour battery life.',
        category: catId,
        vendor: vendor._id,
        price: 2199,
        discountPrice: 1899,
        stock: 31,
        sku: 'TN-MS-PRECPRO-09',
        brand: 'TechNova',
        images: ['/generated-products/electronics/nova-precision-mouse.webp'],
        thumbnail: '/generated-products/electronics/nova-precision-mouse.webp',
        imageValid: true,
        rating: 4.8,
        numReviews: 16,
        featured: false,
        isPublished: true,
        tags: ['mouse', 'gaming', 'wireless', 'accessories'],
        specifications: [
          { key: 'DPI', value: 'Up to 26,000 DPI' },
          { key: 'Weight', value: '58 grams' },
        ],
      },
      {
        name: 'Nova Game Controller Wireless Elite',
        slug: 'nova-game-controller-wireless-elite',
        description: 'Hall Effect anti-drift magnetic analog sticks, mechanical tactile buttons, programmable rear paddles, and cross-platform compatibility (PC, Switch, Mobile).',
        category: catId,
        vendor: vendor._id,
        price: 3499,
        discountPrice: 2999,
        stock: 4, // Low stock <= 15 for inventory alert!
        sku: 'TN-CTRL-NOVAX-10',
        brand: 'TechNova',
        images: ['/generated-products/electronics/nova-game-controller.webp'],
        thumbnail: '/generated-products/electronics/nova-game-controller.webp',
        imageValid: true,
        rating: 4.7,
        numReviews: 14,
        featured: false,
        isPublished: true,
        tags: ['controller', 'gamepad', 'gaming', 'wireless'],
        specifications: [
          { key: 'Joysticks', value: 'Hall Effect Magnetic Anti-Drift' },
          { key: 'Connectivity', value: 'Bluetooth, 2.4G Wireless Dongle, USB Type-C' },
        ],
      },
      {
        name: 'Nova Home Hub Smart AI Display',
        slug: 'nova-home-hub-smart-ai-display',
        description: 'Smart ambient 8-inch HD touch display with integrated smart home Zigbee hub, room-filling sound, and front privacy shutter camera.',
        category: catId,
        vendor: vendor._id,
        price: 6999,
        discountPrice: 5999,
        stock: 19,
        sku: 'TN-IOT-HUB8-11',
        brand: 'TechNova',
        images: ['/generated-products/electronics/nova-home-hub.webp'],
        thumbnail: '/generated-products/electronics/nova-home-hub.webp',
        imageValid: true,
        rating: 4.6,
        numReviews: 9,
        featured: false,
        isPublished: true,
        tags: ['smarthome', 'iot', 'display', 'voice'],
        specifications: [
          { key: 'Display', value: '8.0 inch HD Touchscreen' },
          { key: 'Speakers', value: 'Dual 2-inch Neodymium Drivers' },
        ],
      },
      {
        name: 'NovaSound 360 Portable Waterproof Speaker',
        slug: 'novasound-360-portable-waterproof-speaker',
        description: 'Rugged IP67 waterproof Bluetooth speaker delivering 30W omnidirectional 360-degree sound with deep passive bass radiators and 20-hour playback.',
        category: catId,
        vendor: vendor._id,
        price: 3999,
        discountPrice: 3499,
        stock: 36,
        sku: 'TN-AUD-NS360-12',
        brand: 'TechNova',
        images: ['/generated-products/electronics/novasound-portable-speaker.webp'],
        thumbnail: '/generated-products/electronics/novasound-portable-speaker.webp',
        imageValid: true,
        rating: 4.9,
        numReviews: 25,
        featured: true,
        isPublished: true,
        tags: ['speaker', 'bluetooth', 'waterproof', 'portable'],
        specifications: [
          { key: 'Output Power', value: '30W RMS' },
          { key: 'Water Resistance', value: 'IP67 Submersible' },
        ],
      },
      {
        name: 'PowerCore Ultra 20000mAh 65W Power Bank',
        slug: 'powercore-ultra-20000mah-65w-power-bank',
        description: 'Compact airline-approved 20,000mAh external battery capable of fast charging laptops and phones simultaneously via USB-C Power Delivery 3.0.',
        category: catId,
        vendor: vendor._id,
        price: 2499,
        discountPrice: 2199,
        stock: 45,
        sku: 'TN-BAT-PWR20K-13',
        brand: 'TechNova',
        images: ['/generated-products/electronics/powercore-ultra-20000.webp'],
        thumbnail: '/generated-products/electronics/powercore-ultra-20000.webp',
        imageValid: true,
        rating: 4.8,
        numReviews: 33,
        featured: false,
        isPublished: true,
        tags: ['powerbank', 'battery', 'charger', 'portable'],
        specifications: [
          { key: 'Capacity', value: '20,000mAh / 74Wh' },
          { key: 'Max Output', value: '65W USB-C PD' },
        ],
      },
      {
        name: '100W GaN Pro Multi-Port Wall Charger',
        slug: '100w-gan-pro-multi-port-wall-charger',
        description: 'Next-gen Gallium Nitride (GaN) fast charger featuring 3x USB-C and 1x USB-A ports with intelligent dynamic power distribution in an ultra-compact size.',
        category: catId,
        vendor: vendor._id,
        price: 1899,
        discountPrice: 1599,
        stock: 60,
        sku: 'TN-CHG-GAN100-14',
        brand: 'TechNova',
        images: ['/generated-products/electronics/100w-gan-fast-charger.webp'],
        thumbnail: '/generated-products/electronics/100w-gan-fast-charger.webp',
        imageValid: true,
        rating: 4.9,
        numReviews: 40,
        featured: false,
        isPublished: true,
        tags: ['charger', 'gan', 'fastcharger', 'usb-c'],
        specifications: [
          { key: 'Technology', value: 'GaNFast III' },
          { key: 'Ports', value: '3x USB-C + 1x USB-A' },
        ],
      },
    ];

    const createdProducts = await Product.insertMany(techNovaProductsData);
    console.log(`Created ${createdProducts.length} TechNova products successfully.`);

    // 5. Seed Customer Accounts for Orders & Reviews
    const customerAccounts = await User.find({ role: 'customer' }).limit(10);
    if (customerAccounts.length === 0) {
      console.log('Creating sample customers...');
      const newCust = await User.create({
        name: 'Aarav Patel',
        email: 'aarav.patel@example.com',
        password: 'password123',
        role: 'customer',
        phone: '+91 98200 11223',
      });
      customerAccounts.push(newCust);
    }

    const customers = customerAccounts;

    // 6. Seed Realistic Orders for TechNova
    console.log('Generating realistic demo orders for TechNova...');
    // Remove past techNova specific seeded test orders
    await Order.deleteMany({ 'items.vendor': vendor._id });
    await CommissionTransaction.deleteMany({ vendor: vendor._id });

    const orderStatuses = ['delivered', 'delivered', 'delivered', 'delivered', 'shipped', 'shipped', 'processing', 'pending'];
    const indianCities = [
      { city: 'Bengaluru', state: 'Karnataka', zip: '560001' },
      { city: 'Mumbai', state: 'Maharashtra', zip: '400001' },
      { city: 'Delhi', state: 'Delhi', zip: '110001' },
      { city: 'Hyderabad', state: 'Telangana', zip: '500001' },
      { city: 'Pune', state: 'Maharashtra', zip: '411001' },
      { city: 'Chennai', state: 'Tamil Nadu', zip: '600001' },
      { city: 'Kolkata', state: 'West Bengal', zip: '700001' },
    ];

    const seededOrders = [];
    const now = new Date();
    let totalGrossRevenue = 0;
    let totalVendorEarnings = 0;

    // We generate 24 orders spread across the last 6 months
    for (let i = 1; i <= 24; i++) {
      const orderNum = `TN-${202600 + i}`;
      const cust = customers[(i - 1) % customers.length];
      const cityObj = indianCities[(i - 1) % indianCities.length];
      const status = orderStatuses[(i - 1) % orderStatuses.length];

      // Distribute across last 6 months (0 = current month, 5 = 5 months ago)
      const monthsAgo = Math.floor((24 - i) / 4);
      const orderDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, Math.max(1, (i * 3) % 28 + 1), 10 + (i % 8), 15 + (i * 2) % 40);

      // Pick 1 or 2 products
      const p1 = createdProducts[(i - 1) % createdProducts.length];
      const qty1 = (i % 3 === 0) ? 2 : 1;
      const orderItems = [
        {
          product: p1._id,
          vendor: vendor._id,
          name: p1.name,
          image: p1.images[0],
          price: p1.discountPrice || p1.price,
          quantity: qty1,
          status: status === 'delivered' ? 'delivered' : status === 'shipped' ? 'shipped' : 'pending',
        },
      ];

      // Add second item occasionally
      if (i % 3 === 0) {
        const p2 = createdProducts[(i + 4) % createdProducts.length];
        orderItems.push({
          product: p2._id,
          vendor: vendor._id,
          name: p2.name,
          image: p2.images[0],
          price: p2.discountPrice || p2.price,
          quantity: 1,
          status: status === 'delivered' ? 'delivered' : status === 'shipped' ? 'shipped' : 'pending',
        });
      }

      const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const tax = Math.round(subtotal * 0.18);
      const shippingFee = subtotal > 1000 ? 0 : 99;
      const totalAmount = subtotal + tax + shippingFee;
      const isPaid = status !== 'pending' && status !== 'cancelled';

      const orderDoc = await Order.create({
        orderNumber: orderNum,
        customer: cust._id,
        items: orderItems,
        shippingAddress: {
          name: cust.name,
          street: `${100 + i * 7}, Prestige Tech Park Phase ${1 + (i % 3)}`,
          landmark: 'Opposite Cyber Gateway',
          city: cityObj.city,
          state: cityObj.state,
          zipCode: cityObj.zip,
          country: 'India',
          phone: cust.phone || '+91 98765 00000',
          addressType: 'home',
        },
        paymentMethod: i % 2 === 0 ? 'upi' : 'card',
        subtotal,
        tax,
        shippingFee,
        discount: 0,
        totalAmount,
        isPaid,
        paidAt: isPaid ? orderDate : null,
        orderStatus: status,
        createdAt: orderDate,
        updatedAt: orderDate,
        trackingTimeline: [
          { status: 'Order Placed', note: 'Customer completed checkout', timestamp: orderDate },
          { status: status === 'delivered' ? 'Delivered' : status === 'shipped' ? 'Dispatched' : 'Packed', note: 'Verified by TechNova Fulfillment Center', timestamp: orderDate },
        ],
      });

      // Calculate commission & earnings
      const vendorGross = subtotal;
      const commissionRate = vendor.commissionRate || 10;
      const platformFee = Math.round((vendorGross * commissionRate) / 100);
      const vendorNet = Math.round(vendorGross - platformFee);

      await CommissionTransaction.create({
        order: orderDoc._id,
        orderNumber: orderDoc.orderNumber,
        vendor: vendor._id,
        vendorStoreName: vendor.storeName,
        grossAmount: vendorGross,
        platformFee,
        vendorAmount: vendorNet,
        commissionRate,
        status: isPaid ? 'paid' : 'pending',
        createdAt: orderDate,
      });

      totalGrossRevenue += vendorGross;
      if (isPaid) {
        totalVendorEarnings += vendorNet;
      }
      seededOrders.push(orderDoc);
    }

    console.log(`Created ${seededOrders.length} TechNova orders. Gross Sales: ₹${totalGrossRevenue.toLocaleString('en-IN')}`);

    // Update Vendor financial balances
    vendor.totalProducts = createdProducts.length;
    vendor.totalRevenue = totalGrossRevenue;
    vendor.balance = totalVendorEarnings;
    await vendor.save();

    // 7. Seed Authentic Customer Reviews for TechNova Products
    console.log('Seeding customer reviews...');
    await Review.deleteMany({ product: { $in: createdProducts.map(p => p._id) } });

    const reviewTemplates = [
      { rating: 5, title: 'Outstanding Build Quality & Performance', comment: 'Exceeded my expectations! The speed and thermal efficiency are unbelievable. Solid aluminum finish feels so premium.' },
      { rating: 5, title: 'Best In Class Audio & Noise Cancelling', comment: 'The ANC cuts out all office drone and commute rumble. Bass is deep without muddying vocals. Truly impressed.' },
      { rating: 5, title: 'Crisp Display & Single-Cable USB-C Magic', comment: 'Picture quality is stunning with accurate colors. Charges my laptop with one cable. TechNova shipping was swift too!' },
      { rating: 4, title: 'Very Solid Product, Great Value', comment: 'Premium feel and snappy response. Only small nitpick is the manual, but setup took less than 2 minutes.' },
      { rating: 5, title: 'Top-tier Experience from TechNova', comment: 'Arrived in impeccable packaging. TechNova has become my go-to brand on Venma for electronics.' },
      { rating: 5, title: 'Excellent battery longevity', comment: 'Easily lasts through a busy workday without recharging. Highly recommended for professionals and students.' },
      { rating: 4, title: 'Superb tactile feel and ergonomics', comment: 'Every click feels tactile and responsive. RGB lighting customization looks futuristic on my desk setup.' },
    ];

    let reviewCount = 0;
    for (let idx = 0; idx < createdProducts.length; idx++) {
      const prod = createdProducts[idx];
      const template = reviewTemplates[idx % reviewTemplates.length];
      const cust = customers[idx % customers.length];

      await Review.create({
        product: prod._id,
        customer: cust._id,
        rating: template.rating,
        title: template.title,
        comment: template.comment,
        verifiedPurchase: true,
        createdAt: new Date(now.getTime() - (idx + 1) * 2 * 86400000),
      });
      reviewCount++;
    }
    console.log(`Created ${reviewCount} customer reviews for TechNova products.`);

    // 8. Seed Realistic Vendor Notifications for TechNova User
    console.log('Seeding vendor notifications...');
    await Notification.deleteMany({ recipient: vendorUser._id });

    const notificationsData = [
      {
        recipient: vendorUser._id,
        title: 'New Order Received (#TN-202624)',
        message: 'Aarav Patel placed an order for NovaBook Air 14 Pro M3. Please prepare package for courier dispatch.',
        link: '/vendor/orders',
        type: 'order',
        isRead: false,
        createdAt: new Date(now.getTime() - 15 * 60 * 1000),
      },
      {
        recipient: vendorUser._id,
        title: 'Low Stock Alert: Nova Game Controller',
        message: 'Inventory has dropped to 4 units. Consider reordering stock to avoid fulfillment interruptions.',
        link: '/vendor/products',
        type: 'vendor',
        isRead: false,
        createdAt: new Date(now.getTime() - 2 * 3600 * 1000),
      },
      {
        recipient: vendorUser._id,
        title: 'Payout Disbursed: ₹45,000 Transferred',
        message: 'Your weekly settlement payout of ₹45,000 has been transferred to your registered HDFC bank account.',
        link: '/vendor/dashboard',
        type: 'system',
        isRead: false,
        createdAt: new Date(now.getTime() - 8 * 3600 * 1000),
      },
      {
        recipient: vendorUser._id,
        title: 'New 5-Star Customer Review',
        message: '"Outstanding Build Quality & Performance" — customer review received for NovaBook Air 14 Pro M3.',
        link: '/vendor/dashboard',
        type: 'vendor',
        isRead: true,
        createdAt: new Date(now.getTime() - 24 * 3600 * 1000),
      },
      {
        recipient: vendorUser._id,
        title: 'Promotional Campaign Approved',
        message: 'Your store discount coupon TECHNOVA10 is now live for all verified marketplace shoppers.',
        link: '/vendor/coupons',
        type: 'promotion',
        isRead: true,
        createdAt: new Date(now.getTime() - 48 * 3600 * 1000),
      },
    ];

    await Notification.insertMany(notificationsData);
    console.log(`Created ${notificationsData.length} vendor notifications.`);

    console.log('----------------------------------------------------');
    console.log('TechNova Demo Account Successfully Seeded and Linked!');
    console.log(`- Vendor User ID : ${vendorUser._id}`);
    console.log(`- Vendor Store ID: ${vendor._id}`);
    console.log(`- Total Products : ${createdProducts.length}`);
    console.log(`- Total Orders   : ${seededOrders.length}`);
    console.log(`- Total Sales    : ₹${totalGrossRevenue.toLocaleString('en-IN')}`);
    console.log(`- Vendor Balance : ₹${totalVendorEarnings.toLocaleString('en-IN')}`);
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedTechNova();
