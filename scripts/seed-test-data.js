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
const OFFSET = new Date().getTimezoneOffset();

// ─── Credentials ────────────────────────────────────────────────────────────
const SALON_OWNER = {
  name: 'Luxe Hair Studio',
  email: 'luxe@bookb.app',
  password: 'BookB2026!',
  phone: '2125550147',
  countryCode: '+1',
  role: 'salon',
  gender: 'other',
  address: '142 West 57th Street, New York, NY 10019',
  description: 'Premier hair salon in Midtown Manhattan specializing in color, cuts, and luxury treatments.',
  packageName: 'com.bookb.app',
};

const STYLISTS = [
  {
    name: 'Jessica Rivera',
    email: 'jessica@luxehair.com',
    password: 'BookB2026!',
    phone: '2125550201',
    countryCode: '+1',
    gender: 'female',
    description: 'Senior Color Specialist with 12 years experience. Balayage and vivid color expert.',
    startTime: '09:00',
    endTime: '18:00',
    intervalTime: '30',
  },
  {
    name: 'Marcus Chen',
    email: 'marcus@luxehair.com',
    password: 'BookB2026!',
    phone: '2125550202',
    countryCode: '+1',
    gender: 'male',
    description: 'Master Barber & Stylist. Precision cuts, fades, and modern mens styling.',
    startTime: '10:00',
    endTime: '19:00',
    intervalTime: '30',
  },
  {
    name: 'Amara Johnson',
    email: 'amara@luxehair.com',
    password: 'BookB2026!',
    phone: '2125550203',
    countryCode: '+1',
    gender: 'female',
    description: 'Texture Specialist. Natural hair, braids, silk press, and keratin treatments.',
    startTime: '09:00',
    endTime: '17:00',
    intervalTime: '30',
  },
];

const CLIENTS = [
  { name: 'Sarah Mitchell', email: 'sarah.m@gmail.com', phone: '2125550301', countryCode: '+1', gender: 'female' },
  { name: 'David Park', email: 'david.park@gmail.com', phone: '2125550302', countryCode: '+1', gender: 'male' },
  { name: 'Emily Watson', email: 'emily.watson@gmail.com', phone: '2125550303', countryCode: '+1', gender: 'female' },
  { name: 'James Rodriguez', email: 'james.rod@gmail.com', phone: '2125550304', countryCode: '+1', gender: 'male' },
  { name: 'Olivia Thompson', email: 'olivia.t@gmail.com', phone: '2125550305', countryCode: '+1', gender: 'female' },
  { name: 'Michael Brown', email: 'michael.b@gmail.com', phone: '2125550306', countryCode: '+1', gender: 'male' },
  { name: 'Sophia Garcia', email: 'sophia.g@gmail.com', phone: '2125550307', countryCode: '+1', gender: 'female' },
  { name: 'Daniel Kim', email: 'daniel.kim@gmail.com', phone: '2125550308', countryCode: '+1', gender: 'male' },
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

// ─── Step 1: Create/Login Salon Owner ────────────────────────────────────────

async function setupSalonOwner() {
  log('🏪', 'Setting up Salon Owner account...');

  // Try logging in first
  try {
    const loginRes = await api.post('/users/login', {
      email: SALON_OWNER.email,
      password: SALON_OWNER.password,
    });

    if (loginRes.data?.status && loginRes.data?.data?.token) {
      setToken(loginRes.data.data.token);
      salonId = loginRes.data.data.userid;
      log('✅', `Salon owner logged in. ID: ${salonId}`);

      // Get full user to extract salonId
      const userRes = await api.get('/users/get-user-by-token');
      if (userRes.data?.data) {
        const user = userRes.data.data;
        salonId = typeof user.salon === 'string' ? user.salon : user.salon?._id || user._id;
        log('✅', `Salon ID: ${salonId}`);
      }
      return;
    }
  } catch (e) {
    log('ℹ️', 'Salon owner not found, creating new account...');
  }

  // If login fails, try to create via dashboard signup
  // This may require admin privileges. We'll try the user-signup endpoint.
  try {
    const signupRes = await api.post('/users/user-signup', {
      name: SALON_OWNER.name,
      email: SALON_OWNER.email,
      password: SALON_OWNER.password,
      phone: SALON_OWNER.phone,
      countryCode: SALON_OWNER.countryCode,
      role: SALON_OWNER.role,
      gender: SALON_OWNER.gender,
      address: SALON_OWNER.address,
      description: SALON_OWNER.description,
      packageName: SALON_OWNER.packageName,
      active: true,
    });
    log('✅', `Salon owner created: ${signupRes.data?.message || 'success'}`);

    // Now login
    await sleep(1000);
    const loginRes = await api.post('/users/login', {
      email: SALON_OWNER.email,
      password: SALON_OWNER.password,
    });

    if (loginRes.data?.data?.token) {
      setToken(loginRes.data.data.token);
      salonId = loginRes.data.data.userid;

      const userRes = await api.get('/users/get-user-by-token');
      if (userRes.data?.data) {
        const user = userRes.data.data;
        salonId = typeof user.salon === 'string' ? user.salon : user.salon?._id || user._id;
      }
      log('✅', `Salon logged in. Salon ID: ${salonId}`);
    }
  } catch (e) {
    console.error('❌ Failed to create salon owner:', e.response?.data || e.message);
    console.error('\n⚠️  You may need to create the salon owner through the admin dashboard first.');
    console.error('    Email: ' + SALON_OWNER.email);
    console.error('    Password: ' + SALON_OWNER.password);
    console.error('\n    Then re-run this script.\n');
    process.exit(1);
  }
}

// ─── Step 2: Create Stylists ─────────────────────────────────────────────────

async function createStylists() {
  log('💇', 'Creating stylists...');

  for (const stylist of STYLISTS) {
    try {
      // Create via dashboard user-signup (requires salon token)
      const formData = new FormData();
      formData.append('name', stylist.name);
      formData.append('email', stylist.email);
      formData.append('password', stylist.password);
      formData.append('phone', stylist.phone);
      formData.append('countryCode', stylist.countryCode);
      formData.append('gender', stylist.gender);
      formData.append('description', stylist.description);
      formData.append('startTime', stylist.startTime);
      formData.append('endTime', stylist.endTime);
      formData.append('intervalTime', stylist.intervalTime);
      formData.append('recurringType', 'week');

      const res = await api.post('/stylist/create-stylist', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      log('✅', `  Created stylist: ${stylist.name}`);
    } catch (e) {
      // May already exist
      log('⚠️', `  Stylist ${stylist.name}: ${e.response?.data?.message || e.message}`);
    }
    await sleep(500);
  }

  // Fetch all stylists for the salon
  try {
    const res = await api.get('/stylist/get-stylist-by-salon');
    if (res.data?.data) {
      stylistIds = res.data.data.map(s => ({ id: s._id, name: s.name }));
      log('✅', `  Found ${stylistIds.length} stylists`);
    }
  } catch (e) {
    log('⚠️', '  Could not fetch stylists: ' + (e.response?.data?.message || e.message));
  }
}

// ─── Step 3: Create Services ─────────────────────────────────────────────────

async function createServices() {
  log('✂️', 'Creating service menu...');

  for (const category of SERVICE_CATEGORIES) {
    try {
      // Create main service (category)
      const mainRes = await api.post('/service/add-service', {
        title: category.title,
        description: category.description,
        charges: category.charges,
        requiredTime: category.requiredTime,
        leadTime: category.leadTime,
        breakTime: category.breakTime,
        isMainService: true,
      });

      const mainId = mainRes.data?.data?._id;
      log('✅', `  Category: ${category.title} (${mainId || 'created'})`);

      if (mainId && category.subServices) {
        const subIds = [];
        for (const sub of category.subServices) {
          try {
            const subRes = await api.post('/service/add-service', {
              title: sub.title,
              description: sub.description,
              charges: sub.charges,
              requiredTime: sub.requiredTime,
              leadTime: sub.leadTime,
              breakTime: sub.breakTime,
              isMainService: false,
              service: mainId,
            });
            const subId = subRes.data?.data?._id;
            if (subId) {
              subIds.push({ id: subId, title: sub.title, charges: sub.charges, requiredTime: sub.requiredTime });
              subServiceFlatList.push({ id: subId, mainId, title: sub.title, charges: sub.charges, requiredTime: sub.requiredTime });
            }
            log('✅', `    - ${sub.title} ($${sub.charges}, ${sub.requiredTime}min)`);
          } catch (e) {
            log('⚠️', `    - ${sub.title}: ${e.response?.data?.message || e.message}`);
          }
          await sleep(200);
        }
        serviceIds.push({ mainId, subIds });
      }
    } catch (e) {
      log('⚠️', `  ${category.title}: ${e.response?.data?.message || e.message}`);
    }
    await sleep(300);
  }
}

// ─── Step 4: Create Products ─────────────────────────────────────────────────

async function createProducts() {
  log('🛍️', 'Creating product catalog...');

  // Create categories first
  for (const cat of PRODUCT_CATEGORIES) {
    try {
      const res = await api.post('/product/create-category', {
        categoryName: cat.categoryName,
      });
      const catId = res.data?.data?._id;
      if (catId) categoryMap[cat.categoryName] = catId;
      log('✅', `  Category: ${cat.categoryName}`);
    } catch (e) {
      log('⚠️', `  Category ${cat.categoryName}: ${e.response?.data?.message || e.message}`);
    }
    await sleep(200);
  }

  // If we didn't get IDs from creation (already existed), fetch them
  if (Object.keys(categoryMap).length === 0) {
    try {
      const res = await api.get('/product/get-enabled-category');
      if (res.data?.data) {
        for (const cat of res.data.data) {
          categoryMap[cat.categoryName] = cat._id;
        }
      }
    } catch (e) {
      log('⚠️', '  Could not fetch categories');
    }
  }

  // Create products
  for (const product of PRODUCTS) {
    const catId = categoryMap[product.category];
    if (!catId) {
      log('⚠️', `  Skipping ${product.productName} (no category ID for ${product.category})`);
      continue;
    }

    try {
      const formData = new FormData();
      formData.append('productName', product.productName);
      formData.append('productDescription', product.productDescription);
      formData.append('productPrice', product.productPrice.toString());
      formData.append('actualPrice', product.actualPrice.toString());
      formData.append('quantity', '1');
      formData.append('stock', product.stock.toString());
      formData.append('category', catId);
      formData.append('enable', 'true');

      const res = await api.post('/product/add-product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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

  for (const client of CLIENTS) {
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
      log('✅', `  ${client.name} (${client.email})`);
    } catch (e) {
      log('⚠️', `  ${client.name}: ${e.response?.data?.message || e.message}`);
    }
    await sleep(200);
  }

  // Fetch users to get their IDs
  try {
    const res = await api.get('/users/get-user', { params: { pageNumber: 1, pageSize: 50, filterValue: '' } });
    if (res.data?.data?.result) {
      clientUserIds = res.data.data.result
        .filter(u => u.role === 'user')
        .map(u => ({ id: u._id, name: u.name, email: u.email, phone: u.phone, gender: u.gender }));
      log('✅', `  Found ${clientUserIds.length} clients`);
    }
  } catch (e) {
    log('⚠️', '  Could not fetch client list');
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
      if (res.data?.data) {
        for (const group of res.data.data) {
          const mainId = group.mainService?._id;
          if (mainId && group.subServices) {
            for (const sub of group.subServices) {
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

        const res = await api.post('/appointment/add-appointment-from-dashboard', {
          appointmentDate: appointmentDate,
          timeData: {
            timeAsADate: `${appointmentDate}T${time24}:00.000Z`,
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

        created++;
        log('✅', `  ${getDateString(date)} ${time} - ${client.name} → ${service.title} with ${stylist.name}`);
      } catch (e) {
        log('⚠️', `  ${getDateString(date)} ${time}: ${e.response?.data?.message || e.message}`);
      }
      await sleep(300);
    }
  }

  log('📋', `Created ${created} appointments total`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║        BookB Test Data Seed Script                  ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  try {
    await setupSalonOwner();
    await createStylists();
    await createServices();
    await createProducts();
    await createClients();
    await setupAvailability();
    await createAppointments();

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
    console.log(`  - 1 Salon: ${SALON_OWNER.name}`);
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
