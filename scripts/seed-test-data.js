#!/usr/bin/env node
/**
 * BookB Test Data Seed Script
 *
 * Creates a realistic salon with stylists, clients, services, products,
 * and appointments for the next 2 weeks.
 *
 * Usage:
 *   node scripts/seed-test-data.js
 *
 * Prerequisites:
 *   npm install axios (or run from the project root where axios is installed)
 *
 * The script will:
 *   1. Create a salon owner account (or login if exists)
 *   2. Create 3 stylists
 *   3. Create service categories and services
 *   4. Create product categories and products
 *   5. Create client accounts
 *   6. Set up availability for next 2 weeks
 *   7. Create appointments spread across 2 weeks
 *   8. Print all login credentials
 */

const axios = require('axios');

const API_BASE = 'https://bookb.the-algo.com/api/v1';
// Miami EST = UTC-5 = offset 300. Use your local offset if running from a different timezone.
// NOTE: new Date().getTimezoneOffset() returns 0 on servers/containers (UTC), which breaks
// appointment date calculations. Hardcode to Miami EST for this salon.
const OFFSET = 300;

// ─── Credentials ────────────────────────────────────────────────────────────
const SALON_OWNER = {
  name: 'Sophia Chen',
  salonName: 'Luxe',
  email: 'sophia.chen@bookb.app',
  password: 'BookB2026!',
  phone: '3055550147',
  countryCode: '+1',
  role: 'salon',
  gender: 'female',
  address: '1200 Brickell Avenue, Miami, FL 33131',
  description: 'Premier hair salon in Brickell, Miami specializing in color, cuts, and luxury treatments.',
  packageName: 'com.bookb.app',
};

const STYLISTS = [
  {
    name: 'Isabella Torres',
    email: 'isabella@luxemiami.com',
    password: 'BookB2026!',
    phone: '3055550201',
    countryCode: '+1',
    gender: 'female',
    description: 'Senior Color Specialist with 12 years experience. Balayage and vivid color expert.',
    startTime: '09:00',
    endTime: '18:00',
    intervalTime: '30',
  },
  {
    name: 'Marcus Williams',
    email: 'marcus@luxemiami.com',
    password: 'BookB2026!',
    phone: '3055550202',
    countryCode: '+1',
    gender: 'male',
    description: 'Master Barber & Stylist. Precision cuts, fades, and modern mens styling.',
    startTime: '10:00',
    endTime: '19:00',
    intervalTime: '30',
  },
  {
    name: 'Camila Reyes',
    email: 'camila@luxemiami.com',
    password: 'BookB2026!',
    phone: '3055550203',
    countryCode: '+1',
    gender: 'female',
    description: 'Texture Specialist. Natural hair, braids, silk press, and keratin treatments.',
    startTime: '09:00',
    endTime: '17:00',
    intervalTime: '30',
  },
];

const CLIENTS = [
  { name: 'Ana Martinez', email: 'ana.m@gmail.com', phone: '3055550301', countryCode: '+1', gender: 'female' },
  { name: 'David Park', email: 'david.park@gmail.com', phone: '3055550302', countryCode: '+1', gender: 'male' },
  { name: 'Emily Watson', email: 'emily.watson@gmail.com', phone: '3055550303', countryCode: '+1', gender: 'female' },
  { name: 'James Rodriguez', email: 'james.rod@gmail.com', phone: '3055550304', countryCode: '+1', gender: 'male' },
  { name: 'Olivia Thompson', email: 'olivia.t@gmail.com', phone: '3055550305', countryCode: '+1', gender: 'female' },
  { name: 'Michael Brown', email: 'michael.b@gmail.com', phone: '3055550306', countryCode: '+1', gender: 'male' },
  { name: 'Lucia Fernandez', email: 'lucia.f@gmail.com', phone: '3055550307', countryCode: '+1', gender: 'female' },
  { name: 'Daniel Kim', email: 'daniel.kim@gmail.com', phone: '3055550308', countryCode: '+1', gender: 'male' },
];

const SERVICE_CATEGORIES = [
  {
    title: 'Hair Cutting',
    description: 'Professional cutting services',
    isMainService: true,
    charges: 0,
    requiredTime: 0,
    leadTime: 0,
    breakTime: 0,
    subServices: [
      { title: 'Womens Haircut & Style', description: 'Shampoo, precision cut, and blowout styling', charges: 75, requiredTime: 60, leadTime: 0, breakTime: 10 },
      { title: 'Mens Haircut', description: 'Classic or modern mens cut with detail work', charges: 45, requiredTime: 30, leadTime: 0, breakTime: 5 },
      { title: 'Kids Haircut (Under 12)', description: 'Gentle haircut for children', charges: 30, requiredTime: 30, leadTime: 0, breakTime: 5 },
      { title: 'Bang Trim', description: 'Quick bang/fringe trim between appointments', charges: 15, requiredTime: 15, leadTime: 0, breakTime: 5 },
    ],
  },
  {
    title: 'Coloring',
    description: 'Hair color and highlighting services',
    isMainService: true,
    charges: 0,
    requiredTime: 0,
    leadTime: 0,
    breakTime: 0,
    subServices: [
      { title: 'Full Color (Single Process)', description: 'All-over color application with premium products', charges: 120, requiredTime: 90, leadTime: 0, breakTime: 10 },
      { title: 'Balayage / Highlights', description: 'Hand-painted highlights for natural sun-kissed look', charges: 185, requiredTime: 120, leadTime: 0, breakTime: 15 },
      { title: 'Root Touch-Up', description: 'Color refresh at the roots', charges: 75, requiredTime: 45, leadTime: 0, breakTime: 10 },
      { title: 'Color Correction', description: 'Complex color fix or transformation', charges: 250, requiredTime: 180, leadTime: 0, breakTime: 15 },
    ],
  },
  {
    title: 'Treatments',
    description: 'Hair treatments and conditioning',
    isMainService: true,
    charges: 0,
    requiredTime: 0,
    leadTime: 0,
    breakTime: 0,
    subServices: [
      { title: 'Keratin Smoothing Treatment', description: 'Frizz-free smooth hair for up to 3 months', charges: 220, requiredTime: 120, leadTime: 0, breakTime: 15 },
      { title: 'Deep Conditioning Treatment', description: 'Intensive moisture and repair treatment', charges: 45, requiredTime: 30, leadTime: 0, breakTime: 5 },
      { title: 'Scalp Treatment', description: 'Exfoliating and nourishing scalp therapy', charges: 55, requiredTime: 30, leadTime: 0, breakTime: 5 },
    ],
  },
  {
    title: 'Styling',
    description: 'Blowouts and special styling',
    isMainService: true,
    charges: 0,
    requiredTime: 0,
    leadTime: 0,
    breakTime: 0,
    subServices: [
      { title: 'Blowout', description: 'Shampoo and professional blowdry styling', charges: 45, requiredTime: 45, leadTime: 0, breakTime: 5 },
      { title: 'Updo / Special Occasion', description: 'Formal styling for events, weddings, or galas', charges: 95, requiredTime: 60, leadTime: 0, breakTime: 10 },
      { title: 'Braiding', description: 'Individual braids, cornrows, or protective styles', charges: 150, requiredTime: 120, leadTime: 0, breakTime: 10 },
    ],
  },
];

const PRODUCT_CATEGORIES = [
  { categoryName: 'Shampoo' },
  { categoryName: 'Conditioner' },
  { categoryName: 'Styling Products' },
  { categoryName: 'Treatment Oils' },
  { categoryName: 'Tools & Accessories' },
];

const PRODUCTS = [
  { productName: 'Olaplex No.4 Bond Maintenance Shampoo', productDescription: 'Repairs and maintains bonds while gently cleansing. Sulfate-free formula for all hair types.', productPrice: 28, category: 'Shampoo', stock: 24, actualPrice: 32 },
  { productName: 'Moroccanoil Moisture Repair Shampoo', productDescription: 'Strengthens and restores with argan oil and keratin.', productPrice: 24, category: 'Shampoo', stock: 18, actualPrice: 28 },
  { productName: 'Olaplex No.5 Bond Maintenance Conditioner', productDescription: 'Restores, repairs, and hydrates without weighing hair down.', productPrice: 28, category: 'Conditioner', stock: 22, actualPrice: 32 },
  { productName: 'Redken All Soft Conditioner', productDescription: 'Softens and smooths dry, brittle hair with argan oil.', productPrice: 22, category: 'Conditioner', stock: 15, actualPrice: 26 },
  { productName: 'Bumble and Bumble Surf Spray', productDescription: 'Creates tousled, windswept texture with light hold.', productPrice: 29, category: 'Styling Products', stock: 12, actualPrice: 34 },
  { productName: 'Living Proof Full Dry Volume Blast', productDescription: 'Instant volume and texture for fine or flat hair.', productPrice: 32, category: 'Styling Products', stock: 10, actualPrice: 38 },
  { productName: 'Moroccanoil Treatment Original', productDescription: 'The original argan oil treatment for shine, manageability, and frizz control.', productPrice: 34, category: 'Treatment Oils', stock: 20, actualPrice: 44 },
  { productName: 'Olaplex No.7 Bonding Oil', productDescription: 'Highly concentrated, ultra-lightweight reparative styling oil.', productPrice: 30, category: 'Treatment Oils', stock: 16, actualPrice: 36 },
  { productName: 'Dyson Supersonic Hair Dryer (Rose Gold)', productDescription: 'Professional-grade fast-drying with intelligent heat control.', productPrice: 399, category: 'Tools & Accessories', stock: 3, actualPrice: 429 },
  { productName: 'Mason Pearson Pocket Bristle Brush', productDescription: 'Handcrafted boar bristle brush for daily grooming.', productPrice: 115, category: 'Tools & Accessories', stock: 6, actualPrice: 130 },
];

// ─── Helper functions ───────────────────────────────────────────────────────

let salonToken = null;
let salonId = null;
let stylistIds = [];
let serviceIds = []; // { mainId, subIds: [] }
let subServiceFlatList = []; // all sub-service IDs
let categoryMap = {}; // categoryName -> categoryId
let clientUserIds = [];

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

function setToken(token) {
  salonToken = token;
  api.defaults.headers.common['token'] = token;
}

function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`);
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getDateString(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Time slots for appointments
const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Debug helper ─────────────────────────────────────────────────────────────

function logResponse(label, res) {
  console.log(`  [DEBUG ${label}] status=${res.status}, body=${JSON.stringify(res.data).substring(0, 500)}`);
}

// ─── Try to extract token from any API response ──────────────────────────────

function extractToken(data) {
  // Try common locations where token might appear
  if (data?.data?.token) return data.data.token;
  if (data?.token) return data.token;
  if (data?.data?.accessToken) return data.data.accessToken;
  return null;
}

function extractUserId(data) {
  if (data?.userid) return data.userid;
  if (data?.userId) return data.userId;
  if (data?.data?.userid) return data.data.userid;
  if (data?.data?.userId) return data.data.userId;
  if (data?.data?._id) return data.data._id;
  if (data?.data?.user?._id) return data.data.user._id;
  return null;
}

// ─── Step 0: Clean Up Existing Data ──────────────────────────────────────────

async function cleanupExistingData() {
  log('🧹', 'Cleaning up existing data from previous runs...');

  // --- Delete all appointments ---
  log('🧹', '  Deleting appointments...');
  let appointmentsDeleted = 0;
  try {
    // Fetch appointments over a wide range
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 30);
    const toDate = new Date(today);
    toDate.setDate(today.getDate() + 30);
    const res = await api.post('/appointment/get-appointment-from-dashboard', {
      salon: salonId,
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
      offset: OFFSET,
    });
    const appointments = res.data?.data;
    if (Array.isArray(appointments) && appointments.length > 0) {
      log('ℹ️', `    Found ${appointments.length} appointments to delete`);
      for (const apt of appointments) {
        try {
          await api.delete(`/appointment/delete-appointment-dashboard/${apt._id}`);
          appointmentsDeleted++;
        } catch (e) {
          // Try alternate endpoint
          try {
            await api.delete('/appointment/delete-appointment', { params: { appointmentId: apt._id } });
            appointmentsDeleted++;
          } catch (e2) { /* skip */ }
        }
        await sleep(100);
      }
    }
  } catch (e) {
    log('⚠️', `    Appointment fetch failed: ${e.response?.data?.message || e.message}`);
  }
  // Also try fetching by each stylist in case dashboard query missed some
  try {
    const stylistRes = await api.get('/stylist/get-stylist-by-salon');
    const stylists = stylistRes.data?.data;
    const stylistList = Array.isArray(stylists) ? stylists : stylists?.result || [];
    for (const sty of stylistList) {
      let page = 1;
      let hasMore = true;
      while (hasMore) {
        try {
          const res = await api.get('/appointment/get-appointment-by-stylist', {
            params: { pageNumber: page, pageSize: 50, stylistId: sty._id },
          });
          const result = res.data?.data?.result || [];
          if (result.length === 0) { hasMore = false; break; }
          for (const apt of result) {
            try {
              await api.delete(`/appointment/delete-appointment-dashboard/${apt._id}`);
              appointmentsDeleted++;
            } catch (e) {
              try {
                await api.delete('/appointment/delete-appointment', { params: { appointmentId: apt._id } });
                appointmentsDeleted++;
              } catch (e2) { /* skip */ }
            }
            await sleep(50);
          }
          page++;
          if (page > 20) break; // safety limit
        } catch (e) { hasMore = false; }
      }
    }
  } catch (e) { /* no stylists yet, that's fine */ }
  log('✅', `    Deleted ${appointmentsDeleted} appointments`);

  // --- Delete all sub-services then main services ---
  log('🧹', '  Deleting services...');
  let servicesDeleted = 0;
  try {
    const res = await api.get('/service/get-service-groupby-category');
    const groups = res.data?.data?.result || res.data?.data || [];
    if (Array.isArray(groups)) {
      // Delete sub-services first
      for (const group of groups) {
        const subs = group.subService || group.subServices || [];
        for (const sub of subs) {
          try {
            await api.delete('/service/delete-service', { params: { serviceId: sub._id } });
            servicesDeleted++;
          } catch (e) { /* skip */ }
          await sleep(50);
        }
      }
      // Then delete main services
      for (const group of groups) {
        const mainId = group.category?._id || group.mainService?._id || group._id;
        if (mainId) {
          try {
            await api.delete('/service/delete-service', { params: { serviceId: mainId } });
            servicesDeleted++;
          } catch (e) { /* skip */ }
          await sleep(50);
        }
      }
    }
  } catch (e) {
    // Fallback: try paginated endpoint
    try {
      const res = await api.get('/service/get-main-service', { params: { pageNumber: 1, pageSize: 100, filterValue: '' } });
      const mainServices = res.data?.data?.result || [];
      for (const svc of mainServices) {
        // Delete sub-services for this main service
        try {
          const subRes = await api.get('/service/get-enable-sub-service', { params: { mainServiceId: svc._id } });
          const subs = subRes.data?.data || [];
          for (const sub of subs) {
            try { await api.delete('/service/delete-service', { params: { serviceId: sub._id } }); servicesDeleted++; } catch (e2) { /* skip */ }
            await sleep(50);
          }
        } catch (e2) { /* skip */ }
        try { await api.delete('/service/delete-service', { params: { serviceId: svc._id } }); servicesDeleted++; } catch (e2) { /* skip */ }
        await sleep(50);
      }
    } catch (e2) {
      log('⚠️', `    Service cleanup failed: ${e2.response?.data?.message || e2.message}`);
    }
  }
  log('✅', `    Deleted ${servicesDeleted} services`);

  // --- Delete all products then categories ---
  log('🧹', '  Deleting products and categories...');
  let productsDeleted = 0;
  let categoriesDeleted = 0;
  // Delete products first
  try {
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const res = await api.get('/product/get-product-by-salon', { params: { pageNumber: page, pageSize: 50, filterValue: '' } });
      const products = res.data?.data?.result || [];
      if (products.length === 0) { hasMore = false; break; }
      for (const prod of products) {
        try { await api.delete('/product/delete-product', { params: { productId: prod._id } }); productsDeleted++; } catch (e) { /* skip */ }
        await sleep(50);
      }
      page++;
      if (page > 10) break;
    }
  } catch (e) {
    log('⚠️', `    Product fetch failed: ${e.response?.data?.message || e.message}`);
  }
  // Then delete categories
  try {
    const res = await api.get('/product/get-category', { params: { pageNumber: 1, pageSize: 100, filterValue: '' } });
    const categories = res.data?.data?.result || res.data?.data || [];
    if (Array.isArray(categories)) {
      for (const cat of categories) {
        try { await api.delete('/product/delete-category', { params: { categoryId: cat._id } }); categoriesDeleted++; } catch (e) { /* skip */ }
        await sleep(50);
      }
    }
  } catch (e) {
    log('⚠️', `    Category fetch failed: ${e.response?.data?.message || e.message}`);
  }
  log('✅', `    Deleted ${productsDeleted} products, ${categoriesDeleted} categories`);

  // --- Delete client users (role=user only, NOT stylists or salon owner) ---
  log('🧹', '  Deleting client accounts...');
  let clientsDeleted = 0;
  try {
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const res = await api.get('/users/get-user', { params: { pageNumber: page, pageSize: 50, filterValue: '' } });
      const users = res.data?.data?.result || [];
      if (users.length === 0) { hasMore = false; break; }
      for (const u of users) {
        if (u.role === 'user' && u._id !== salonId) {
          try { await api.delete('/users/delete-user', { params: { userID: u._id } }); clientsDeleted++; } catch (e) { /* skip */ }
          await sleep(50);
        }
      }
      page++;
      if (page > 10) break;
    }
  } catch (e) {
    log('⚠️', `    User fetch failed: ${e.response?.data?.message || e.message}`);
  }
  log('✅', `    Deleted ${clientsDeleted} clients`);

  log('🧹', `  Cleanup complete: ${appointmentsDeleted} appointments, ${servicesDeleted} services, ${productsDeleted} products, ${categoriesDeleted} categories, ${clientsDeleted} clients`);
}

// ─── Step 1: Create/Login Salon Owner ────────────────────────────────────────

async function setupSalonOwner() {
  log('🏪', 'Setting up Salon Owner account...');

  // Try logging in first
  try {
    const loginRes = await api.post('/users/login', {
      email: SALON_OWNER.email,
      password: SALON_OWNER.password,
    });
    logResponse('login', loginRes);

    const token = extractToken(loginRes.data);
    if (token) {
      setToken(token);
      salonId = extractUserId(loginRes.data);
      log('✅', `Salon owner logged in. Token set. UserID: ${salonId}`);

      // Get full user to extract salonId
      try {
        const userRes = await api.get('/users/get-user-by-token');
        logResponse('get-user-by-token', userRes);
        if (userRes.data?.data) {
          const user = userRes.data.data;
          salonId = typeof user.salon === 'string' ? user.salon : user.salon?._id || user._id;
          log('✅', `Salon ID: ${salonId}`);
        }
      } catch (ue) {
        log('⚠️', `get-user-by-token failed: ${ue.response?.data?.message || ue.message}`);
      }
      return;
    } else {
      log('⚠️', 'Login response had no token, will try signup...');
    }
  } catch (e) {
    log('ℹ️', `Login failed: ${e.response?.data?.message || e.message}. Trying signup...`);
  }

  // If login fails, try to create via mobile signup endpoint (public, no auth needed)
  try {
    log('ℹ️', 'Trying mobile signup endpoint...');
    const signupRes = await api.post('/users/user-signup-for-mobile', {
      name: SALON_OWNER.name,
      email: SALON_OWNER.email,
      phone: SALON_OWNER.phone,
      countryCode: SALON_OWNER.countryCode,
      gender: SALON_OWNER.gender,
      salon: '',
      password: SALON_OWNER.password,
    });
    logResponse('mobile-signup', signupRes);

    // Check if signup returned a token
    let token = extractToken(signupRes.data);
    if (token) {
      setToken(token);
      salonId = extractUserId(signupRes.data);
      log('✅', `Got token from mobile signup. UserID: ${salonId}`);
    } else {
      // Try logging in after signup
      log('ℹ️', 'No token in signup response, attempting login...');
      await sleep(1500);
      const loginRes = await api.post('/users/login', {
        email: SALON_OWNER.email,
        password: SALON_OWNER.password,
      });
      logResponse('login-after-signup', loginRes);

      token = extractToken(loginRes.data);
      if (token) {
        setToken(token);
        salonId = extractUserId(loginRes.data);
        log('✅', `Logged in after signup. UserID: ${salonId}`);
      } else {
        log('❌', 'Could not get token from login after signup!');
      }
    }

    // Try to get salon ID from user profile
    if (salonToken) {
      try {
        const userRes = await api.get('/users/get-user-by-token');
        logResponse('get-user-by-token', userRes);
        if (userRes.data?.data) {
          const user = userRes.data.data;
          salonId = typeof user.salon === 'string' ? user.salon : user.salon?._id || user._id;
          log('✅', `Salon ID resolved: ${salonId}`);
        }
      } catch (ue) {
        log('⚠️', `get-user-by-token failed: ${ue.response?.data?.message || ue.message}`);
      }

      // Now create the salon entity
      try {
        log('ℹ️', 'Creating salon entity...');
        const salonRes = await api.post('/salon/create-salon', {
          name: SALON_OWNER.salonName,
          address: SALON_OWNER.address,
          description: SALON_OWNER.description,
          packageName: SALON_OWNER.packageName,
        });
        logResponse('create-salon', salonRes);
        if (salonRes.data?.data?._id) {
          salonId = salonRes.data.data._id;
          log('✅', `Salon created: ${salonId}`);
        }
      } catch (se) {
        log('⚠️', `create-salon: ${se.response?.data?.message || se.message}`);
      }
    }
  } catch (e) {
    console.error('❌ Failed to create salon owner:', e.response?.data || e.message);
    console.error('\n⚠️  You may need to create the salon owner through the admin dashboard first.');
    console.error('    Email: ' + SALON_OWNER.email);
    console.error('    Password: ' + SALON_OWNER.password);
    console.error('\n    Then re-run this script.\n');
    process.exit(1);
  }

  if (!salonToken) {
    console.error('❌ FATAL: No auth token obtained. Cannot continue.');
    console.error('   Please check the API responses above and ensure the login endpoint returns a token.');
    process.exit(1);
  }
}

// ─── Step 2: Create Stylists ─────────────────────────────────────────────────

async function createStylists() {
  log('💇', 'Creating stylists...');

  for (const stylist of STYLISTS) {
    try {
      const res = await api.post('/stylist/create-stylist', {
        name: stylist.name,
        email: stylist.email,
        password: stylist.password,
        phone: stylist.phone,
        countryCode: stylist.countryCode,
        gender: stylist.gender,
        description: stylist.description,
        startTime: stylist.startTime,
        endTime: stylist.endTime,
        intervalTime: stylist.intervalTime,
        recurringType: 'week',
      });
      if (res.data?.status === false) {
        log('ℹ️', `  Stylist ${stylist.name} already exists`);
      } else {
        log('✅', `  Created stylist: ${stylist.name}`);
      }
    } catch (e) {
      log('⚠️', `  Stylist ${stylist.name}: ${e.response?.data?.message || e.message}`);
    }
    await sleep(500);
  }

  // Always fetch all stylists for the salon to get their IDs
  try {
    const res = await api.get('/stylist/get-stylist-by-salon');
    logResponse('get-stylists', res);
    const data = res.data?.data;
    if (Array.isArray(data) && data.length > 0) {
      stylistIds = data.map(s => ({ id: s._id, name: s.name || s.userId?.name || 'Unknown' }));
    } else if (data?.result && Array.isArray(data.result)) {
      stylistIds = data.result.map(s => ({ id: s._id, name: s.name || s.userId?.name || 'Unknown' }));
    }
    log('✅', `  Found ${stylistIds.length} stylists: ${stylistIds.map(s => s.name).join(', ')}`);
  } catch (e) {
    log('❌', '  Could not fetch stylists: ' + (e.response?.data?.message || e.message));
  }
}

// ─── Step 3: Create Services ─────────────────────────────────────────────────

async function createServices() {
  log('✂️', 'Creating service menu...');

  // 1. Fetch existing main services to avoid duplicates
  let existingMain = [];
  try {
    const res = await api.get('/service/get-enable-main-service');
    if (Array.isArray(res.data?.data)) existingMain = res.data.data;
  } catch (e) { /* empty */ }

  const existingTitles = new Set(existingMain.map(s => s.title));

  // 2. Create only missing main service categories
  for (const category of SERVICE_CATEGORIES) {
    if (existingTitles.has(category.title)) {
      log('ℹ️', `  Category already exists: ${category.title}`);
      continue;
    }
    try {
      await api.post('/service/add-service', {
        title: category.title,
        description: category.description,
        charges: category.charges,
        requiredTime: category.requiredTime,
        leadTime: category.leadTime,
        breakTime: category.breakTime,
        isMainService: true,
      });
      log('✅', `  Created category: ${category.title}`);
    } catch (e) {
      log('⚠️', `  ${category.title}: ${e.response?.data?.message || e.message}`);
    }
    await sleep(300);
  }

  // 3. Re-fetch main services to get IDs (pick ONE per title, most recent)
  let mainServices = [];
  try {
    const res = await api.get('/service/get-enable-main-service');
    if (Array.isArray(res.data?.data)) mainServices = res.data.data;
  } catch (e) { /* empty */ }
  log('ℹ️', `  Found ${mainServices.length} main services total`);

  // Deduplicate: keep only the FIRST match per title (for our 4 categories)
  const mainServiceMap = {}; // title -> { _id, title }
  for (const svc of mainServices) {
    if (!mainServiceMap[svc.title]) {
      mainServiceMap[svc.title] = svc;
    }
  }

  // 4. For each of our categories, check if sub-services exist; create if not
  for (const category of SERVICE_CATEGORIES) {
    const mainSvc = mainServiceMap[category.title];
    if (!mainSvc) {
      log('⚠️', `  No main service found for "${category.title}"`);
      continue;
    }
    const mainId = mainSvc._id;

    // Check if this main service already has sub-services
    let existingSubs = [];
    try {
      const res = await api.get('/service/get-enable-sub-service', { params: { mainServiceId: mainId } });
      if (Array.isArray(res.data?.data)) existingSubs = res.data.data;
    } catch (e) { /* empty */ }

    if (existingSubs.length > 0) {
      log('ℹ️', `  ${category.title} already has ${existingSubs.length} sub-services, skipping creation`);
      for (const sub of existingSubs) {
        subServiceFlatList.push({
          id: sub._id, mainId, title: sub.title, charges: sub.charges, requiredTime: sub.requiredTime,
        });
      }
      continue;
    }

    log('ℹ️', `  Creating sub-services for ${category.title} (${mainId})...`);
    for (const sub of category.subServices) {
      try {
        await api.post('/service/add-service', {
          title: sub.title,
          description: sub.description,
          charges: sub.charges,
          requiredTime: sub.requiredTime,
          leadTime: sub.leadTime,
          breakTime: sub.breakTime,
          isMainService: false,
          service: mainId,
        });
        log('✅', `    - ${sub.title} ($${sub.charges}, ${sub.requiredTime}min)`);
      } catch (e) {
        log('⚠️', `    - ${sub.title}: ${e.response?.data?.message || e.message}`);
      }
      await sleep(200);
    }
  }

  // 5. Fetch all sub-services for our 4 categories to build subServiceFlatList
  if (subServiceFlatList.length === 0) {
    for (const category of SERVICE_CATEGORIES) {
      const mainSvc = mainServiceMap[category.title];
      if (!mainSvc) continue;
      try {
        const res = await api.get('/service/get-enable-sub-service', { params: { mainServiceId: mainSvc._id } });
        const subs = res.data?.data || [];
        for (const sub of subs) {
          subServiceFlatList.push({
            id: sub._id, mainId: mainSvc._id, title: sub.title, charges: sub.charges, requiredTime: sub.requiredTime,
          });
        }
      } catch (e) { /* skip */ }
    }
  }

  log('✅', `  Total sub-services available: ${subServiceFlatList.length}`);
}

// ─── Step 4: Create Products ─────────────────────────────────────────────────

async function createProducts() {
  log('🛍️', 'Creating product catalog...');

  // Fetch existing categories to avoid duplicates
  let existingCats = [];
  try {
    const res = await api.get('/product/get-enabled-category');
    if (Array.isArray(res.data?.data)) existingCats = res.data.data;
  } catch (e) { /* empty */ }

  const existingCatNames = new Set(existingCats.map(c => c.categoryName));
  for (const cat of existingCats) {
    categoryMap[cat.categoryName] = cat._id;
  }

  // Create only missing categories
  for (const cat of PRODUCT_CATEGORIES) {
    if (existingCatNames.has(cat.categoryName)) {
      log('ℹ️', `  Category already exists: ${cat.categoryName}`);
      continue;
    }
    try {
      await api.post('/product/create-category', { categoryName: cat.categoryName });
      log('✅', `  Created category: ${cat.categoryName}`);
    } catch (e) {
      log('⚠️', `  Category ${cat.categoryName}: ${e.response?.data?.message || e.message}`);
    }
    await sleep(200);
  }

  // Re-fetch to fill in any missing IDs
  if (Object.keys(categoryMap).length < PRODUCT_CATEGORIES.length) {
    try {
      const res = await api.get('/product/get-enabled-category');
      const cats = res.data?.data;
      if (Array.isArray(cats)) {
        for (const cat of cats) {
          if (cat._id && cat.categoryName) categoryMap[cat.categoryName] = cat._id;
        }
      }
    } catch (e) { /* empty */ }
  }
  log('✅', `  Category map: ${Object.keys(categoryMap).join(', ')}`);

  // Check existing products to avoid duplicates
  let existingProducts = new Set();
  try {
    const res = await api.get('/product/get-product-by-salon', { params: { pageNumber: 1, pageSize: 100, filterValue: '' } });
    const prods = res.data?.data?.result || [];
    for (const p of prods) existingProducts.add(p.productName);
  } catch (e) { /* empty */ }

  // Create only missing products
  for (const product of PRODUCTS) {
    const catId = categoryMap[product.category];
    if (!catId) {
      log('⚠️', `  Skipping ${product.productName} (no category ID for "${product.category}")`);
      continue;
    }
    if (existingProducts.has(product.productName)) {
      log('ℹ️', `  Product already exists: ${product.productName}`);
      continue;
    }
    try {
      await api.post('/product/add-product', {
        productName: product.productName,
        productDescription: product.productDescription,
        productPrice: product.productPrice,
        actualPrice: product.actualPrice,
        quantity: 1,
        stock: product.stock,
        category: catId,
        enable: true,
      });
      log('✅', `  ${product.productName} - $${product.productPrice}`);
    } catch (e) {
      log('⚠️', `  ${product.productName}: ${e.response?.data?.message || e.message}`);
    }
    await sleep(200);
  }
}

// ─── Step 5: Create Clients ──────────────────────────────────────────────────

async function createClients() {
  log('👥', 'Creating client accounts...');

  // Check existing clients
  let existingEmails = new Set();
  try {
    const res = await api.get('/users/get-user', { params: { pageNumber: 1, pageSize: 50, filterValue: '' } });
    const result = res.data?.data?.result || [];
    for (const u of result) {
      if (u.role === 'user') existingEmails.add(u.email);
    }
  } catch (e) { /* empty */ }

  for (const client of CLIENTS) {
    if (existingEmails.has(client.email)) {
      log('ℹ️', `  Already exists: ${client.name} (${client.email})`);
      continue;
    }
    try {
      const res = await api.post('/users/user-signup', {
        name: client.name,
        email: client.email,
        phone: client.phone,
        countryCode: client.countryCode,
        gender: client.gender,
        role: 'user',
        salon: salonId,
        active: true,
        password: 'BookB2026!',
      });
      if (res.data?.status === false) {
        log('ℹ️', `  ${client.name}: ${res.data?.message}`);
      } else {
        log('✅', `  ${client.name} (${client.email})`);
      }
    } catch (e) {
      log('⚠️', `  ${client.name}: ${e.response?.data?.message || e.message}`);
    }
    await sleep(200);
  }

  // Fetch users to get their IDs
  try {
    const res = await api.get('/users/get-user', { params: { pageNumber: 1, pageSize: 50, filterValue: '' } });
    const result = res.data?.data?.result || res.data?.data;
    if (Array.isArray(result)) {
      clientUserIds = result
        .filter(u => u.role === 'user')
        .map(u => ({ id: u._id, name: u.name, email: u.email, phone: u.phone, gender: u.gender }));
      log('✅', `  Found ${clientUserIds.length} clients`);
    } else {
      log('⚠️', '  Unexpected response format for get-user');
    }
  } catch (e) {
    log('⚠️', '  Could not fetch client list: ' + (e.response?.data?.message || e.message));
  }
}

// ─── Step 6: Set Up Availability ─────────────────────────────────────────────

async function setupAvailability() {
  log('📅', 'Setting up availability for next 2 weeks...');

  const businessHours = {
    slots: [
      { day: 'Monday', slot: [{ startTime: '09:00', endTime: '18:00' }] },
      { day: 'Tuesday', slot: [{ startTime: '09:00', endTime: '18:00' }] },
      { day: 'Wednesday', slot: [{ startTime: '09:00', endTime: '18:00' }] },
      { day: 'Thursday', slot: [{ startTime: '09:00', endTime: '18:00' }] },
      { day: 'Friday', slot: [{ startTime: '09:00', endTime: '18:00' }] },
      { day: 'Saturday', slot: [{ startTime: '09:00', endTime: '17:00' }] },
      { day: 'Sunday', slot: [] }, // Closed
    ],
    recurringType: 'week',
  };

  for (const stylist of stylistIds) {
    try {
      await api.post('/appointment-availability/create-availability-bulk', businessHours, {
        params: { offset: OFFSET, stylistId: stylist.id },
      });
      log('✅', `  Availability set for ${stylist.name}`);
    } catch (e) {
      log('⚠️', `  ${stylist.name}: ${e.response?.data?.message || e.message}`);
    }

    // Also create day-by-day availability for the next 14 days
    const today = new Date();
    for (let d = 0; d < 14; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      if (date.getDay() === 0) continue; // Skip Sundays

      try {
        await api.post('/appointment-availability/create-availability-day',
          { date: formatDate(date) },
          { params: { offset: OFFSET, stylistId: stylist.id } }
        );
      } catch (e) {
        // Silently continue - may already exist
      }
      await sleep(100);
    }
    await sleep(300);
  }
}

// ─── Step 7: Create Appointments ─────────────────────────────────────────────

async function createAppointments() {
  log('📋', 'Creating appointments for the next 2 weeks...');

  if (subServiceFlatList.length === 0) {
    log('⚠️', '  No services found. Trying to fetch existing services...');
    try {
      const res = await api.get('/service/get-service-groupby-category');
      const groups = res.data?.data?.result || res.data?.data;
      if (Array.isArray(groups)) {
        for (const group of groups) {
          const mainId = group.category?._id || group.mainService?._id || group._id;
          const subs = group.subService || group.subServices || [];
          if (mainId && Array.isArray(subs)) {
            for (const sub of subs) {
              subServiceFlatList.push({
                id: sub._id,
                mainId,
                title: sub.title,
                charges: sub.charges,
                requiredTime: sub.requiredTime,
              });
            }
          }
        }
        log('✅', `  Found ${subServiceFlatList.length} services`);
      }
    } catch (e) {
      log('❌', '  Cannot create appointments without services');
      return;
    }
  }

  if (stylistIds.length === 0 || subServiceFlatList.length === 0 || clientUserIds.length === 0) {
    log('⚠️', '  Missing stylists, services, or clients. Skipping appointments.');
    return;
  }

  const today = new Date();
  let created = 0;
  let failed = 0;

  // Create 3-5 appointments per day for the next 14 days
  for (let d = 0; d < 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    if (date.getDay() === 0) continue; // Skip Sundays

    const appointmentsPerDay = 3 + Math.floor(Math.random() * 3); // 3-5
    const usedSlots = new Set();

    for (let a = 0; a < appointmentsPerDay; a++) {
      const stylist = randomPick(stylistIds);
      const service = randomPick(subServiceFlatList);
      const client = randomPick(clientUserIds);

      // Pick a unique time slot
      let time;
      let attempts = 0;
      do {
        time = randomPick(TIME_SLOTS);
        attempts++;
      } while (usedSlots.has(`${stylist.id}-${time}`) && attempts < 20);
      usedSlots.add(`${stylist.id}-${time}`);

      // Determine status: past = completed, today = mix, future = requested/confirmed
      let status;
      if (d < 0) {
        status = Math.random() > 0.1 ? 'completed' : 'canceled';
      } else if (d === 0) {
        status = randomPick(['confirmed', 'waiting', 'requested']);
      } else {
        status = randomPick(['requested', 'confirmed', 'requested']);
      }

      try {
        const appointmentDate = formatDate(date);
        // Convert time string to 24h for API
        const timeParts = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
        let hour = parseInt(timeParts[1]);
        if (timeParts[3].toUpperCase() === 'PM' && hour !== 12) hour += 12;
        if (timeParts[3].toUpperCase() === 'AM' && hour === 12) hour = 0;
        const time24 = `${hour.toString().padStart(2, '0')}:${timeParts[2]}`;

        // Match the mobile app salon flow: timeAsADate = current ISO timestamp
        // (not a constructed UTC time, which confuses the API's date processing)
        const res = await api.post('/appointment/add-appointment-from-dashboard', {
          appointmentDate: appointmentDate,
          timeData: {
            timeAsADate: new Date().toISOString(),
            timeAsAString: time,
            id: '',
          },
          salon: salonId,
          stylistId: stylist.id,
          email: client.email,
          mobile: client.phone,
          name: client.name,
          gender: client.gender,
          comment: '',
          mainService: service.mainId,
          subService: service.id,
          requiredDuration: service.requiredTime,
        }, {
          params: { offset: OFFSET },
        });

        // Check actual API response status
        if (res.data?.status === false) {
          log('⚠️', `  ${getDateString(date)} ${time}: API returned false - ${res.data?.message}`);
          failed++;
        } else {
          created++;
          if (created <= 3) {
            // Log first few responses for debugging
            logResponse(`appointment:${getDateString(date)}`, res);
          }
          log('✅', `  ${getDateString(date)} ${time} - ${client.name} → ${service.title} with ${stylist.name}`);
        }
      } catch (e) {
        failed++;
        log('⚠️', `  ${getDateString(date)} ${time}: ${e.response?.data?.message || e.message}`);
      }
      await sleep(300);
    }
  }

  log('📋', `Created ${created} appointments total (${failed} failed)`);
}

// ─── Step 8: Verify Appointments ──────────────────────────────────────────────

async function verifyAppointments() {
  log('🔍', 'Verifying appointments are queryable...');

  const today = new Date();
  const fromDate = formatDate(today);
  const toDate = new Date(today);
  toDate.setDate(today.getDate() + 14);
  const toDateStr = formatDate(toDate);

  // Query 1: get-appointment-from-dashboard (what the web dashboard uses)
  try {
    const res = await api.post('/appointment/get-appointment-from-dashboard', {
      salon: salonId,
      fromDate: fromDate,
      toDate: toDateStr,
      offset: OFFSET,
    });
    const appointments = res.data?.data;
    if (Array.isArray(appointments)) {
      log('✅', `  Dashboard query: ${appointments.length} appointments found (${fromDate} to ${toDateStr})`);
      if (appointments.length > 0) {
        const apt = appointments[0];
        log('ℹ️', `  Sample: ${apt.dateAsAString} ${apt.timeAsAString} | status=${apt.status} | offset=${apt.offset}`);
      }
    } else {
      log('⚠️', `  Dashboard query returned non-array: ${JSON.stringify(res.data).substring(0, 300)}`);
    }
  } catch (e) {
    log('⚠️', `  Dashboard query failed: ${e.response?.data?.message || e.message}`);
  }

  // Query 2: get-appointment-by-stylist (alternate query path)
  if (stylistIds.length > 0) {
    try {
      const res = await api.get('/appointment/get-appointment-by-stylist', {
        params: { pageNumber: 1, pageSize: 10, stylistId: stylistIds[0].id },
      });
      const data = res.data?.data;
      const count = data?.result?.length || 0;
      const total = data?.totalPageSize || 0;
      log('✅', `  Stylist query (${stylistIds[0].name}): ${count} appointments (${total} total pages)`);
    } catch (e) {
      log('⚠️', `  Stylist query failed: ${e.response?.data?.message || e.message}`);
    }
  }

  // Query 3: KPI endpoints
  try {
    const convRes = await api.get('/appointment/appointment-conversion-rate', { params: { salon: salonId } });
    log('ℹ️', `  Conversion rate: ${JSON.stringify(convRes.data?.data)}`);
  } catch (e) {
    log('⚠️', `  Conversion rate: ${e.response?.data?.message || e.message}`);
  }

  // Query 4: getAppointmentsByMonth
  try {
    const monthRes = await api.get(`/salon/getAppointmentsByMonth/${salonId}`);
    log('ℹ️', `  Appointments by month: ${JSON.stringify(monthRes.data?.data).substring(0, 200)}`);
  } catch (e) {
    log('⚠️', `  Appointments by month: ${e.response?.data?.message || e.message}`);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║        BookB Test Data Seed Script                  ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  try {
    await setupSalonOwner();
    await cleanupExistingData();
    await createStylists();
    await createServices();
    await createProducts();
    await createClients();
    await setupAvailability();
    await createAppointments();
    await verifyAppointments();

    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║        LOGIN CREDENTIALS                            ║');
    console.log('╠══════════════════════════════════════════════════════╣');
    console.log('║                                                     ║');
    console.log('║  SALON OWNER (Dashboard):                           ║');
    console.log(`║  Email:    ${SALON_OWNER.email.padEnd(39)}║`);
    console.log(`║  Password: ${SALON_OWNER.password.padEnd(39)}║`);
    console.log('║                                                     ║');
    console.log('║  STYLISTS (Mobile App):                             ║');
    for (const s of STYLISTS) {
      console.log(`║  ${s.name.padEnd(20)} ${s.email.padEnd(28)}║`);
    }
    console.log(`║  Password: ${STYLISTS[0].password.padEnd(39)}║`);
    console.log('║                                                     ║');
    console.log('║  CLIENTS (Mobile App):                              ║');
    for (const c of CLIENTS.slice(0, 4)) {
      console.log(`║  ${c.name.padEnd(20)} ${c.email.padEnd(28)}║`);
    }
    console.log(`║  Password: BookB2026!                                ║`);
    console.log('║  ... and 4 more clients                             ║');
    console.log('║                                                     ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');

    console.log('Data created:');
    console.log(`  - 1 Salon: ${SALON_OWNER.salonName} (Owner: ${SALON_OWNER.name})`);
    console.log(`  - ${STYLISTS.length} Stylists`);
    console.log(`  - ${SERVICE_CATEGORIES.length} Service categories, ${SERVICE_CATEGORIES.reduce((sum, c) => sum + c.subServices.length, 0)} services`);
    console.log(`  - ${PRODUCT_CATEGORIES.length} Product categories, ${PRODUCTS.length} products`);
    console.log(`  - ${CLIENTS.length} Client accounts`);
    console.log(`  - ~50+ Appointments across the next 2 weeks\n`);

  } catch (e) {
    console.error('\n❌ Fatal error:', e.message);
    process.exit(1);
  }
}

main();
