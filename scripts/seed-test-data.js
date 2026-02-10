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
 *   2. CLEAN UP all existing data from previous runs
 *   3. Create 3 stylists
 *   4. Create service categories and services
 *   5. Create product categories and products
 *   6. Create client accounts
 *   7. Set up availability for next 2 weeks
 *   8. Create appointments spread across 2 weeks
 *   9. Verify appointments show on dashboard
 *   10. Print all login credentials
 */

var axios = require('axios');

var API_BASE = 'https://bookb.the-algo.com/api/v1';
// Miami EST = UTC-5 = offset 300. Use your local offset if running from a different timezone.
// NOTE: new Date().getTimezoneOffset() returns 0 on servers/containers (UTC), which breaks
// appointment date calculations. Hardcode to Miami EST for this salon.
var OFFSET = 300;

// --- Credentials ---
var SALON_OWNER = {
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

var STYLISTS = [
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

var CLIENTS = [
  { name: 'Ana Martinez', email: 'ana.m@gmail.com', phone: '3055550301', countryCode: '+1', gender: 'female' },
  { name: 'David Park', email: 'david.park@gmail.com', phone: '3055550302', countryCode: '+1', gender: 'male' },
  { name: 'Emily Watson', email: 'emily.watson@gmail.com', phone: '3055550303', countryCode: '+1', gender: 'female' },
  { name: 'James Rodriguez', email: 'james.rod@gmail.com', phone: '3055550304', countryCode: '+1', gender: 'male' },
  { name: 'Olivia Thompson', email: 'olivia.t@gmail.com', phone: '3055550305', countryCode: '+1', gender: 'female' },
  { name: 'Michael Brown', email: 'michael.b@gmail.com', phone: '3055550306', countryCode: '+1', gender: 'male' },
  { name: 'Lucia Fernandez', email: 'lucia.f@gmail.com', phone: '3055550307', countryCode: '+1', gender: 'female' },
  { name: 'Daniel Kim', email: 'daniel.kim@gmail.com', phone: '3055550308', countryCode: '+1', gender: 'male' },
];

var SERVICE_CATEGORIES = [
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

var PRODUCT_CATEGORIES = [
  { categoryName: 'Shampoo' },
  { categoryName: 'Conditioner' },
  { categoryName: 'Styling Products' },
  { categoryName: 'Treatment Oils' },
  { categoryName: 'Tools & Accessories' },
];

var PRODUCTS = [
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

// --- Helper functions ---

var salonToken = null;
var salonId = null;
var stylistIds = [];
var serviceIds = [];
var subServiceFlatList = [];
var categoryMap = {};
var clientUserIds = [];

var api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

function setToken(token) {
  salonToken = token;
  api.defaults.headers.common['token'] = token;
}

function log(emoji, msg) {
  console.log(emoji + '  ' + msg);
}

// Returns YYYY-MM-DD (for appointment API)
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Returns MM/DD/YYYY (for availability - matches backend moment().format('MM/DD/YYYY'))
function formatDateMMDDYYYY(date) {
  var m = String(date.getMonth() + 1).padStart(2, '0');
  var d = String(date.getDate()).padStart(2, '0');
  var y = date.getFullYear();
  return m + '/' + d + '/' + y;
}

function getDateString(date) {
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

// Time slots for appointments
var TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sleep(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

// --- Debug helper ---

function logResponse(label, res) {
  console.log('  [DEBUG ' + label + '] status=' + res.status + ', body=' + JSON.stringify(res.data).substring(0, 500));
}

// --- Try to extract token from any API response ---

function extractToken(data) {
  if (data && data.data && data.data.token) return data.data.token;
  if (data && data.token) return data.token;
  if (data && data.data && data.data.accessToken) return data.data.accessToken;
  return null;
}

function extractUserId(data) {
  if (data && data.userid) return data.userid;
  if (data && data.userId) return data.userId;
  if (data && data.data && data.data.userid) return data.data.userid;
  if (data && data.data && data.data.userId) return data.data.userId;
  if (data && data.data && data.data._id) return data.data._id;
  if (data && data.data && data.data.user && data.data.user._id) return data.data.user._id;
  return null;
}

// --- Step 0: Clean Up Existing Data ---

async function cleanupExistingData() {
  log('[CLEANUP]', 'Cleaning up existing data from previous runs...');

  // --- Delete all appointments ---
  log('[CLEANUP]', '  Deleting appointments...');
  var appointmentsDeleted = 0;
  try {
    var today = new Date();
    var fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 30);
    var toDate = new Date(today);
    toDate.setDate(today.getDate() + 30);
    var res = await api.post('/appointment/get-appointment-from-dashboard', {
      salon: salonId,
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
      offset: OFFSET,
    });
    var appointments = res.data && res.data.data;
    if (Array.isArray(appointments) && appointments.length > 0) {
      log('[INFO]', '    Found ' + appointments.length + ' appointments to delete');
      for (var i = 0; i < appointments.length; i++) {
        var apt = appointments[i];
        try {
          await api.delete('/appointment/delete-appointment-dashboard/' + apt._id);
          appointmentsDeleted++;
        } catch (e) {
          try {
            await api.delete('/appointment/delete-appointment', { params: { appointmentId: apt._id } });
            appointmentsDeleted++;
          } catch (e2) { /* skip */ }
        }
        await sleep(100);
      }
    }
  } catch (e) {
    log('[WARN]', '    Appointment fetch failed: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
  }

  // Also try fetching by each stylist in case dashboard query missed some
  try {
    var stylistRes = await api.get('/stylist/get-stylist-by-salon');
    var stylists = stylistRes.data && stylistRes.data.data;
    var stylistList = Array.isArray(stylists) ? stylists : (stylists && stylists.result ? stylists.result : []);
    for (var si = 0; si < stylistList.length; si++) {
      var sty = stylistList[si];
      var page = 1;
      var hasMore = true;
      while (hasMore) {
        try {
          var res2 = await api.get('/appointment/get-appointment-by-stylist', {
            params: { pageNumber: page, pageSize: 50, stylistId: sty._id },
          });
          var result = (res2.data && res2.data.data && res2.data.data.result) || [];
          if (result.length === 0) { hasMore = false; break; }
          for (var ri = 0; ri < result.length; ri++) {
            var apt2 = result[ri];
            try {
              await api.delete('/appointment/delete-appointment-dashboard/' + apt2._id);
              appointmentsDeleted++;
            } catch (e) {
              try {
                await api.delete('/appointment/delete-appointment', { params: { appointmentId: apt2._id } });
                appointmentsDeleted++;
              } catch (e2) { /* skip */ }
            }
            await sleep(50);
          }
          page++;
          if (page > 20) break;
        } catch (e) { hasMore = false; }
      }
    }
  } catch (e) { /* no stylists yet, fine */ }
  log('[OK]', '    Deleted ' + appointmentsDeleted + ' appointments');

  // --- Delete all sub-services then main services ---
  log('[CLEANUP]', '  Deleting services...');
  var servicesDeleted = 0;
  try {
    var svcRes = await api.get('/service/get-service-groupby-category');
    var groups = (svcRes.data && svcRes.data.data && svcRes.data.data.result) || (svcRes.data && svcRes.data.data) || [];
    if (Array.isArray(groups)) {
      // Delete sub-services first
      for (var gi = 0; gi < groups.length; gi++) {
        var group = groups[gi];
        var subs = group.subService || group.subServices || [];
        for (var sbi = 0; sbi < subs.length; sbi++) {
          try {
            await api.delete('/service/delete-service', { params: { serviceId: subs[sbi]._id } });
            servicesDeleted++;
          } catch (e) { /* skip */ }
          await sleep(50);
        }
      }
      // Then delete main services
      for (var gi2 = 0; gi2 < groups.length; gi2++) {
        var group2 = groups[gi2];
        var mainId = (group2.category && group2.category._id) || (group2.mainService && group2.mainService._id) || group2._id;
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
      var mainRes = await api.get('/service/get-main-service', { params: { pageNumber: 1, pageSize: 100, filterValue: '' } });
      var mainServices = (mainRes.data && mainRes.data.data && mainRes.data.data.result) || [];
      for (var mi = 0; mi < mainServices.length; mi++) {
        var svc = mainServices[mi];
        try {
          var subRes = await api.get('/service/get-enable-sub-service', { params: { mainServiceId: svc._id } });
          var subs2 = (subRes.data && subRes.data.data) || [];
          for (var sbi2 = 0; sbi2 < subs2.length; sbi2++) {
            try { await api.delete('/service/delete-service', { params: { serviceId: subs2[sbi2]._id } }); servicesDeleted++; } catch (e2) { /* skip */ }
            await sleep(50);
          }
        } catch (e2) { /* skip */ }
        try { await api.delete('/service/delete-service', { params: { serviceId: svc._id } }); servicesDeleted++; } catch (e2) { /* skip */ }
        await sleep(50);
      }
    } catch (e2) {
      log('[WARN]', '    Service cleanup failed: ' + ((e2.response && e2.response.data && e2.response.data.message) || e2.message));
    }
  }
  log('[OK]', '    Deleted ' + servicesDeleted + ' services');

  // --- Delete all products then categories ---
  log('[CLEANUP]', '  Deleting products and categories...');
  var productsDeleted = 0;
  var categoriesDeleted = 0;
  // Delete products first
  try {
    var prodPage = 1;
    var prodMore = true;
    while (prodMore) {
      var prodRes = await api.get('/product/get-product-by-salon', { params: { pageNumber: prodPage, pageSize: 50, filterValue: '' } });
      var products = (prodRes.data && prodRes.data.data && prodRes.data.data.result) || [];
      if (products.length === 0) { prodMore = false; break; }
      for (var pi = 0; pi < products.length; pi++) {
        try { await api.delete('/product/delete-product', { params: { productId: products[pi]._id } }); productsDeleted++; } catch (e) { /* skip */ }
        await sleep(50);
      }
      prodPage++;
      if (prodPage > 10) break;
    }
  } catch (e) {
    log('[WARN]', '    Product fetch failed: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
  }
  // Then delete categories
  try {
    var catRes = await api.get('/product/get-category', { params: { pageNumber: 1, pageSize: 100, filterValue: '' } });
    var categories = (catRes.data && catRes.data.data && catRes.data.data.result) || (catRes.data && catRes.data.data) || [];
    if (Array.isArray(categories)) {
      for (var ci = 0; ci < categories.length; ci++) {
        try { await api.delete('/product/delete-category', { params: { categoryId: categories[ci]._id } }); categoriesDeleted++; } catch (e) { /* skip */ }
        await sleep(50);
      }
    }
  } catch (e) {
    log('[WARN]', '    Category fetch failed: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
  }
  log('[OK]', '    Deleted ' + productsDeleted + ' products, ' + categoriesDeleted + ' categories');

  // --- Delete client users (role=user only, NOT stylists or salon owner) ---
  log('[CLEANUP]', '  Deleting client accounts...');
  var clientsDeleted = 0;
  try {
    var userPage = 1;
    var userMore = true;
    while (userMore) {
      var userRes = await api.get('/users/get-user', { params: { pageNumber: userPage, pageSize: 50, filterValue: '' } });
      var users = (userRes.data && userRes.data.data && userRes.data.data.result) || [];
      if (users.length === 0) { userMore = false; break; }
      for (var ui = 0; ui < users.length; ui++) {
        var u = users[ui];
        if (u.role === 'user' && u._id !== salonId) {
          try { await api.delete('/users/delete-user', { params: { userID: u._id } }); clientsDeleted++; } catch (e) { /* skip */ }
          await sleep(50);
        }
      }
      userPage++;
      if (userPage > 10) break;
    }
  } catch (e) {
    log('[WARN]', '    User fetch failed: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
  }
  log('[OK]', '    Deleted ' + clientsDeleted + ' clients');

  log('[CLEANUP]', '  Cleanup complete: ' + appointmentsDeleted + ' appointments, ' + servicesDeleted + ' services, ' + productsDeleted + ' products, ' + categoriesDeleted + ' categories, ' + clientsDeleted + ' clients');
}

// --- Step 1: Create/Login Salon Owner ---

async function setupSalonOwner() {
  log('[SALON]', 'Setting up Salon Owner account...');

  // Try logging in first
  try {
    var loginRes = await api.post('/users/login', {
      email: SALON_OWNER.email,
      password: SALON_OWNER.password,
    });
    logResponse('login', loginRes);

    var token = extractToken(loginRes.data);
    if (token) {
      setToken(token);
      salonId = extractUserId(loginRes.data);
      log('[OK]', 'Salon owner logged in. Token set. UserID: ' + salonId);

      // Get full user to extract salonId
      try {
        var userRes = await api.get('/users/get-user-by-token');
        logResponse('get-user-by-token', userRes);
        if (userRes.data && userRes.data.data) {
          var user = userRes.data.data;
          salonId = (typeof user.salon === 'string') ? user.salon : ((user.salon && user.salon._id) || user._id);
          log('[OK]', 'Salon ID: ' + salonId);
        }
      } catch (ue) {
        log('[WARN]', 'get-user-by-token failed: ' + ((ue.response && ue.response.data && ue.response.data.message) || ue.message));
      }
      return;
    } else {
      log('[WARN]', 'Login response had no token, will try signup...');
    }
  } catch (e) {
    log('[INFO]', 'Login failed: ' + ((e.response && e.response.data && e.response.data.message) || e.message) + '. Trying signup...');
  }

  // If login fails, try to create via mobile signup endpoint (public, no auth needed)
  try {
    log('[INFO]', 'Trying mobile signup endpoint...');
    var signupRes = await api.post('/users/user-signup-for-mobile', {
      name: SALON_OWNER.name,
      email: SALON_OWNER.email,
      phone: SALON_OWNER.phone,
      countryCode: SALON_OWNER.countryCode,
      gender: SALON_OWNER.gender,
      salon: '',
      password: SALON_OWNER.password,
    });
    logResponse('mobile-signup', signupRes);

    var token2 = extractToken(signupRes.data);
    if (token2) {
      setToken(token2);
      salonId = extractUserId(signupRes.data);
      log('[OK]', 'Got token from mobile signup. UserID: ' + salonId);
    } else {
      log('[INFO]', 'No token in signup response, attempting login...');
      await sleep(1500);
      var loginRes2 = await api.post('/users/login', {
        email: SALON_OWNER.email,
        password: SALON_OWNER.password,
      });
      logResponse('login-after-signup', loginRes2);

      token2 = extractToken(loginRes2.data);
      if (token2) {
        setToken(token2);
        salonId = extractUserId(loginRes2.data);
        log('[OK]', 'Logged in after signup. UserID: ' + salonId);
      } else {
        log('[FAIL]', 'Could not get token from login after signup!');
      }
    }

    // Try to get salon ID from user profile
    if (salonToken) {
      try {
        var userRes2 = await api.get('/users/get-user-by-token');
        logResponse('get-user-by-token', userRes2);
        if (userRes2.data && userRes2.data.data) {
          var user2 = userRes2.data.data;
          salonId = (typeof user2.salon === 'string') ? user2.salon : ((user2.salon && user2.salon._id) || user2._id);
          log('[OK]', 'Salon ID resolved: ' + salonId);
        }
      } catch (ue) {
        log('[WARN]', 'get-user-by-token failed: ' + ((ue.response && ue.response.data && ue.response.data.message) || ue.message));
      }

      // Now create the salon entity
      try {
        log('[INFO]', 'Creating salon entity...');
        var salonRes = await api.post('/salon/create-salon', {
          name: SALON_OWNER.salonName,
          address: SALON_OWNER.address,
          description: SALON_OWNER.description,
          packageName: SALON_OWNER.packageName,
        });
        logResponse('create-salon', salonRes);
        if (salonRes.data && salonRes.data.data && salonRes.data.data._id) {
          salonId = salonRes.data.data._id;
          log('[OK]', 'Salon created: ' + salonId);
        }
      } catch (se) {
        log('[WARN]', 'create-salon: ' + ((se.response && se.response.data && se.response.data.message) || se.message));
      }
    }
  } catch (e) {
    console.error('[FAIL] Failed to create salon owner:', (e.response && e.response.data) || e.message);
    console.error('\n[WARN] You may need to create the salon owner through the admin dashboard first.');
    console.error('    Email: ' + SALON_OWNER.email);
    console.error('    Password: ' + SALON_OWNER.password);
    console.error('\n    Then re-run this script.\n');
    process.exit(1);
  }

  if (!salonToken) {
    console.error('[FAIL] FATAL: No auth token obtained. Cannot continue.');
    console.error('   Please check the API responses above and ensure the login endpoint returns a token.');
    process.exit(1);
  }
}

// --- Step 2: Create Stylists ---

async function createStylists() {
  log('[STYLISTS]', 'Creating stylists...');

  for (var i = 0; i < STYLISTS.length; i++) {
    var stylist = STYLISTS[i];
    try {
      var res = await api.post('/stylist/create-stylist', {
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
      if (res.data && res.data.status === false) {
        log('[INFO]', '  Stylist ' + stylist.name + ' already exists');
      } else {
        log('[OK]', '  Created stylist: ' + stylist.name);
      }
    } catch (e) {
      log('[WARN]', '  Stylist ' + stylist.name + ': ' + ((e.response && e.response.data && e.response.data.message) || e.message));
    }
    await sleep(500);
  }

  // Always fetch all stylists for the salon to get their IDs
  try {
    var res2 = await api.get('/stylist/get-stylist-by-salon');
    logResponse('get-stylists', res2);
    var data = res2.data && res2.data.data;
    if (Array.isArray(data) && data.length > 0) {
      stylistIds = data.map(function(s) { return { id: s._id, name: s.name || (s.userId && s.userId.name) || 'Unknown' }; });
    } else if (data && data.result && Array.isArray(data.result)) {
      stylistIds = data.result.map(function(s) { return { id: s._id, name: s.name || (s.userId && s.userId.name) || 'Unknown' }; });
    }
    log('[OK]', '  Found ' + stylistIds.length + ' stylists: ' + stylistIds.map(function(s) { return s.name; }).join(', '));
  } catch (e) {
    log('[FAIL]', '  Could not fetch stylists: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
  }
}

// --- Step 3: Create Services ---

async function createServices() {
  log('[SERVICES]', 'Creating service menu...');

  // 1. Fetch existing main services to avoid duplicates
  var existingMain = [];
  try {
    var res = await api.get('/service/get-enable-main-service');
    if (Array.isArray(res.data && res.data.data)) existingMain = res.data.data;
  } catch (e) { /* empty */ }

  var existingTitles = {};
  for (var i = 0; i < existingMain.length; i++) {
    existingTitles[existingMain[i].title] = true;
  }

  // 2. Create only missing main service categories
  for (var ci = 0; ci < SERVICE_CATEGORIES.length; ci++) {
    var category = SERVICE_CATEGORIES[ci];
    if (existingTitles[category.title]) {
      log('[INFO]', '  Category already exists: ' + category.title);
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
      log('[OK]', '  Created category: ' + category.title);
    } catch (e) {
      log('[WARN]', '  ' + category.title + ': ' + ((e.response && e.response.data && e.response.data.message) || e.message));
    }
    await sleep(300);
  }

  // 3. Re-fetch main services to get IDs (pick ONE per title, most recent)
  var mainServices = [];
  try {
    var res2 = await api.get('/service/get-enable-main-service');
    if (Array.isArray(res2.data && res2.data.data)) mainServices = res2.data.data;
  } catch (e) { /* empty */ }
  log('[INFO]', '  Found ' + mainServices.length + ' main services total');

  // Deduplicate: keep only the FIRST match per title (for our 4 categories)
  var mainServiceMap = {};
  for (var mi = 0; mi < mainServices.length; mi++) {
    var svc = mainServices[mi];
    if (!mainServiceMap[svc.title]) {
      mainServiceMap[svc.title] = svc;
    }
  }

  // 4. For each of our categories, check if sub-services exist; create if not
  for (var ci2 = 0; ci2 < SERVICE_CATEGORIES.length; ci2++) {
    var cat = SERVICE_CATEGORIES[ci2];
    var mainSvc = mainServiceMap[cat.title];
    if (!mainSvc) {
      log('[WARN]', '  No main service found for "' + cat.title + '"');
      continue;
    }
    var mainId = mainSvc._id;

    // Check if this main service already has sub-services
    var existingSubs = [];
    try {
      var subRes = await api.get('/service/get-enable-sub-service', { params: { mainServiceId: mainId } });
      if (Array.isArray(subRes.data && subRes.data.data)) existingSubs = subRes.data.data;
    } catch (e) { /* empty */ }

    if (existingSubs.length > 0) {
      log('[INFO]', '  ' + cat.title + ' already has ' + existingSubs.length + ' sub-services, skipping creation');
      for (var ei = 0; ei < existingSubs.length; ei++) {
        var sub = existingSubs[ei];
        subServiceFlatList.push({
          id: sub._id, mainId: mainId, title: sub.title, charges: sub.charges, requiredTime: sub.requiredTime,
        });
      }
      continue;
    }

    log('[INFO]', '  Creating sub-services for ' + cat.title + ' (' + mainId + ')...');
    for (var si = 0; si < cat.subServices.length; si++) {
      var subDef = cat.subServices[si];
      try {
        await api.post('/service/add-service', {
          title: subDef.title,
          description: subDef.description,
          charges: subDef.charges,
          requiredTime: subDef.requiredTime,
          leadTime: subDef.leadTime,
          breakTime: subDef.breakTime,
          isMainService: false,
          service: mainId,
        });
        log('[OK]', '    - ' + subDef.title + ' ($' + subDef.charges + ', ' + subDef.requiredTime + 'min)');
      } catch (e) {
        log('[WARN]', '    - ' + subDef.title + ': ' + ((e.response && e.response.data && e.response.data.message) || e.message));
      }
      await sleep(200);
    }
  }

  // 5. Fetch all sub-services for our 4 categories to build subServiceFlatList
  if (subServiceFlatList.length === 0) {
    for (var ci3 = 0; ci3 < SERVICE_CATEGORIES.length; ci3++) {
      var cat2 = SERVICE_CATEGORIES[ci3];
      var mainSvc2 = mainServiceMap[cat2.title];
      if (!mainSvc2) continue;
      try {
        var subRes2 = await api.get('/service/get-enable-sub-service', { params: { mainServiceId: mainSvc2._id } });
        var subs = (subRes2.data && subRes2.data.data) || [];
        for (var ssi = 0; ssi < subs.length; ssi++) {
          subServiceFlatList.push({
            id: subs[ssi]._id, mainId: mainSvc2._id, title: subs[ssi].title, charges: subs[ssi].charges, requiredTime: subs[ssi].requiredTime,
          });
        }
      } catch (e) { /* skip */ }
    }
  }

  log('[OK]', '  Total sub-services available: ' + subServiceFlatList.length);
}

// --- Step 4: Create Products ---

async function createProducts() {
  log('[PRODUCTS]', 'Creating product catalog...');

  // Fetch existing categories to avoid duplicates
  var existingCats = [];
  try {
    var res = await api.get('/product/get-enabled-category');
    if (Array.isArray(res.data && res.data.data)) existingCats = res.data.data;
  } catch (e) { /* empty */ }

  var existingCatNames = {};
  for (var i = 0; i < existingCats.length; i++) {
    existingCatNames[existingCats[i].categoryName] = true;
    categoryMap[existingCats[i].categoryName] = existingCats[i]._id;
  }

  // Create only missing categories
  for (var ci = 0; ci < PRODUCT_CATEGORIES.length; ci++) {
    var cat = PRODUCT_CATEGORIES[ci];
    if (existingCatNames[cat.categoryName]) {
      log('[INFO]', '  Category already exists: ' + cat.categoryName);
      continue;
    }
    try {
      await api.post('/product/create-category', { categoryName: cat.categoryName });
      log('[OK]', '  Created category: ' + cat.categoryName);
    } catch (e) {
      log('[WARN]', '  Category ' + cat.categoryName + ': ' + ((e.response && e.response.data && e.response.data.message) || e.message));
    }
    await sleep(200);
  }

  // Re-fetch to fill in any missing IDs
  if (Object.keys(categoryMap).length < PRODUCT_CATEGORIES.length) {
    try {
      var res2 = await api.get('/product/get-enabled-category');
      var cats = res2.data && res2.data.data;
      if (Array.isArray(cats)) {
        for (var j = 0; j < cats.length; j++) {
          if (cats[j]._id && cats[j].categoryName) categoryMap[cats[j].categoryName] = cats[j]._id;
        }
      }
    } catch (e) { /* empty */ }
  }
  log('[OK]', '  Category map: ' + Object.keys(categoryMap).join(', '));

  // Check existing products to avoid duplicates
  var existingProducts = {};
  try {
    var res3 = await api.get('/product/get-product-by-salon', { params: { pageNumber: 1, pageSize: 100, filterValue: '' } });
    var prods = (res3.data && res3.data.data && res3.data.data.result) || [];
    for (var k = 0; k < prods.length; k++) existingProducts[prods[k].productName] = true;
  } catch (e) { /* empty */ }

  // Create only missing products
  for (var pi = 0; pi < PRODUCTS.length; pi++) {
    var product = PRODUCTS[pi];
    var catId = categoryMap[product.category];
    if (!catId) {
      log('[WARN]', '  Skipping ' + product.productName + ' (no category ID for "' + product.category + '")');
      continue;
    }
    if (existingProducts[product.productName]) {
      log('[INFO]', '  Product already exists: ' + product.productName);
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
      log('[OK]', '  ' + product.productName + ' - $' + product.productPrice);
    } catch (e) {
      log('[WARN]', '  ' + product.productName + ': ' + ((e.response && e.response.data && e.response.data.message) || e.message));
    }
    await sleep(200);
  }
}

// --- Step 5: Create Clients ---

async function createClients() {
  log('[CLIENTS]', 'Creating client accounts...');

  // Check existing clients
  var existingEmails = {};
  try {
    var res = await api.get('/users/get-user', { params: { pageNumber: 1, pageSize: 50, filterValue: '' } });
    var result = (res.data && res.data.data && res.data.data.result) || [];
    for (var i = 0; i < result.length; i++) {
      if (result[i].role === 'user') existingEmails[result[i].email] = true;
    }
  } catch (e) { /* empty */ }

  for (var ci = 0; ci < CLIENTS.length; ci++) {
    var client = CLIENTS[ci];
    if (existingEmails[client.email]) {
      log('[INFO]', '  Already exists: ' + client.name + ' (' + client.email + ')');
      continue;
    }
    try {
      var res2 = await api.post('/users/user-signup', {
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
      if (res2.data && res2.data.status === false) {
        log('[INFO]', '  ' + client.name + ': ' + (res2.data && res2.data.message));
      } else {
        log('[OK]', '  ' + client.name + ' (' + client.email + ')');
      }
    } catch (e) {
      log('[WARN]', '  ' + client.name + ': ' + ((e.response && e.response.data && e.response.data.message) || e.message));
    }
    await sleep(200);
  }

  // Fetch users to get their IDs
  try {
    var res3 = await api.get('/users/get-user', { params: { pageNumber: 1, pageSize: 50, filterValue: '' } });
    var result2 = (res3.data && res3.data.data && res3.data.data.result) || (res3.data && res3.data.data);
    if (Array.isArray(result2)) {
      clientUserIds = result2
        .filter(function(u) { return u.role === 'user'; })
        .map(function(u) { return { id: u._id, name: u.name, email: u.email, phone: u.phone, gender: u.gender }; });
      log('[OK]', '  Found ' + clientUserIds.length + ' clients');
    } else {
      log('[WARN]', '  Unexpected response format for get-user');
    }
  } catch (e) {
    log('[WARN]', '  Could not fetch client list: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
  }
}

// --- Step 6: Set Up Availability ---

async function setupAvailability() {
  log('[AVAILABILITY]', 'Setting up availability for next 2 weeks...');

  // IMPORTANT: day names must be 3-letter title-case ("Mon","Tue","Wed") to match
  // moment().format('ddd') used in event/appointment.event.js:655-656
  var businessHours = {
    slots: [
      { day: 'Mon', slot: [{ startTime: '9:00 AM', endTime: '6:00 PM' }] },
      { day: 'Tue', slot: [{ startTime: '9:00 AM', endTime: '6:00 PM' }] },
      { day: 'Wed', slot: [{ startTime: '9:00 AM', endTime: '6:00 PM' }] },
      { day: 'Thu', slot: [{ startTime: '9:00 AM', endTime: '6:00 PM' }] },
      { day: 'Fri', slot: [{ startTime: '9:00 AM', endTime: '6:00 PM' }] },
      { day: 'Sat', slot: [{ startTime: '9:00 AM', endTime: '5:00 PM' }] },
    ],
  };

  for (var i = 0; i < stylistIds.length; i++) {
    var stylist = stylistIds[i];
    try {
      var bulkRes = await api.post('/appointment-availability/create-availability-bulk', businessHours, {
        params: { offset: OFFSET, stylistId: stylist.id },
      });
      logResponse('bulk-availability:' + stylist.name, bulkRes);
      log('[OK]', '  Bulk availability set for ' + stylist.name);
    } catch (e) {
      log('[WARN]', '  Bulk ' + stylist.name + ': ' + ((e.response && e.response.data && e.response.data.message) || e.message));
    }

    // Create day-by-day availability for the next 14 days
    var today = new Date();
    var dayOk = 0;
    var dayFail = 0;
    for (var d = 0; d < 14; d++) {
      var date = new Date(today);
      date.setDate(today.getDate() + d);
      if (date.getDay() === 0) continue; // Skip Sundays

      try {
        var dayRes = await api.post('/appointment-availability/create-availability-day',
          { date: formatDateMMDDYYYY(date) },
          { params: { offset: OFFSET, stylistId: stylist.id } }
        );
        if (dayRes.data && dayRes.data.status === false) {
          dayFail++;
        } else {
          dayOk++;
        }
        // Log first response for debugging
        if (d === 0) {
          logResponse('day-availability:' + formatDateMMDDYYYY(date), dayRes);
        }
      } catch (e) {
        dayFail++;
        if (d === 0) {
          log('[WARN]', '  Day avail error: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
        }
      }
      await sleep(100);
    }
    log('[INFO]', '  Day availability for ' + stylist.name + ': ' + dayOk + ' ok, ' + dayFail + ' failed');
    await sleep(300);
  }

  // --- DIAGNOSTIC: Check what availability actually exists ---
  log('[DIAGNOSTIC]', 'Checking availability after creation...');
  if (stylistIds.length > 0) {
    var firstStylist = stylistIds[0];

    // Check business hours
    try {
      var bhRes = await api.get('/appointment-availability/get-buiness-hours', {
        params: { stylistId: firstStylist.id },
      });
      log('[DIAGNOSTIC]', '  Business hours for ' + firstStylist.name + ': ' + JSON.stringify(bhRes.data).substring(0, 500));
    } catch (e) {
      log('[DIAGNOSTIC]', '  Business hours query failed: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
    }

    // Check mobile availability for tomorrow
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1); // skip Sunday
    var tomorrowStr = formatDate(tomorrow);
    try {
      var mobileRes = await api.get('/appointment-availability/get-availability-by-stylist-for-mobile', {
        params: { date: tomorrowStr },
      });
      log('[DIAGNOSTIC]', '  Mobile availability for ' + tomorrowStr + ': ' + JSON.stringify(mobileRes.data).substring(0, 500));
    } catch (e) {
      log('[DIAGNOSTIC]', '  Mobile availability query failed: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
    }

    // Check availability by salon
    try {
      var salonAvailRes = await api.get('/appointment-availability/get-availability-by-salon', {
        params: { pageNumber: 1, pageSize: 5, filterValue: '' },
      });
      log('[DIAGNOSTIC]', '  Salon availability: ' + JSON.stringify(salonAvailRes.data).substring(0, 500));
    } catch (e) {
      log('[DIAGNOSTIC]', '  Salon availability query failed: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
    }

    // Check block status for tomorrow
    try {
      var blockRes = await api.get('/appointment-availability/get-appointment-list-with-block-unblock-status', {
        params: { date: tomorrowStr, offset: OFFSET, stylistId: firstStylist.id },
      });
      log('[DIAGNOSTIC]', '  Block status for ' + tomorrowStr + ': ' + JSON.stringify(blockRes.data).substring(0, 500));
    } catch (e) {
      log('[DIAGNOSTIC]', '  Block status query failed: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
    }
  }
}

// --- Step 7: Create Appointments ---

async function createAppointments() {
  log('[APPOINTMENTS]', 'Creating appointments for the next 2 weeks...');

  if (subServiceFlatList.length === 0) {
    log('[WARN]', '  No services found. Trying to fetch existing services...');
    try {
      var res = await api.get('/service/get-service-groupby-category');
      var groups = (res.data && res.data.data && res.data.data.result) || (res.data && res.data.data);
      if (Array.isArray(groups)) {
        for (var gi = 0; gi < groups.length; gi++) {
          var group = groups[gi];
          var mainId = (group.category && group.category._id) || (group.mainService && group.mainService._id) || group._id;
          var subs = group.subService || group.subServices || [];
          if (mainId && Array.isArray(subs)) {
            for (var si = 0; si < subs.length; si++) {
              subServiceFlatList.push({
                id: subs[si]._id,
                mainId: mainId,
                title: subs[si].title,
                charges: subs[si].charges,
                requiredTime: subs[si].requiredTime,
              });
            }
          }
        }
        log('[OK]', '  Found ' + subServiceFlatList.length + ' services');
      }
    } catch (e) {
      log('[FAIL]', '  Cannot create appointments without services');
      return;
    }
  }

  if (stylistIds.length === 0 || subServiceFlatList.length === 0 || clientUserIds.length === 0) {
    log('[WARN]', '  Missing stylists, services, or clients. Skipping appointments.');
    return;
  }

  var today = new Date();
  var created = 0;
  var failed = 0;

  // Create 3-5 appointments per day for the next 14 days
  for (var d = 0; d < 14; d++) {
    var date = new Date(today);
    date.setDate(today.getDate() + d);
    if (date.getDay() === 0) continue; // Skip Sundays

    var appointmentsPerDay = 3 + Math.floor(Math.random() * 3); // 3-5
    var usedSlots = {};

    for (var a = 0; a < appointmentsPerDay; a++) {
      var stylist = randomPick(stylistIds);
      var service = randomPick(subServiceFlatList);
      var client = randomPick(clientUserIds);

      // Pick a unique time slot
      var time;
      var attempts = 0;
      do {
        time = randomPick(TIME_SLOTS);
        attempts++;
      } while (usedSlots[stylist.id + '-' + time] && attempts < 20);
      usedSlots[stylist.id + '-' + time] = true;

      // Determine status
      var status;
      if (d < 0) {
        status = Math.random() > 0.1 ? 'completed' : 'canceled';
      } else if (d === 0) {
        status = randomPick(['confirmed', 'waiting', 'requested']);
      } else {
        status = randomPick(['requested', 'confirmed', 'requested']);
      }

      try {
        var appointmentDate = formatDate(date);
        // Convert time string to 24h for API
        var timeParts = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
        var hour = parseInt(timeParts[1]);
        if (timeParts[3].toUpperCase() === 'PM' && hour !== 12) hour += 12;
        if (timeParts[3].toUpperCase() === 'AM' && hour === 12) hour = 0;
        var time24 = String(hour).padStart(2, '0') + ':' + timeParts[2];

        // timeAsADate must be HH:mm 24hr string matching availability slots
        // (backend check-availability-of-time.js queries timeData.timeAsADate against "09:00" etc.)
        var aptRes = await api.post('/appointment/add-appointment-from-dashboard', {
          appointmentDate: appointmentDate,
          timeData: {
            timeAsADate: time24,
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
        if (aptRes.data && aptRes.data.status === false) {
          log('[WARN]', '  ' + getDateString(date) + ' ' + time + ': API returned false - ' + (aptRes.data && aptRes.data.message));
          failed++;
        } else {
          created++;
          if (created <= 3) {
            logResponse('appointment:' + getDateString(date), aptRes);
          }
          log('[OK]', '  ' + getDateString(date) + ' ' + time + ' - ' + client.name + ' -> ' + service.title + ' with ' + stylist.name);
        }
      } catch (e) {
        failed++;
        log('[WARN]', '  ' + getDateString(date) + ' ' + time + ': ' + ((e.response && e.response.data && e.response.data.message) || e.message));
      }
      await sleep(300);
    }
  }

  log('[APPOINTMENTS]', 'Created ' + created + ' appointments total (' + failed + ' failed)');
}

// --- Step 8: Verify Appointments ---

async function verifyAppointments() {
  log('[VERIFY]', 'Verifying appointments are queryable...');

  var today = new Date();
  var fromDate = formatDate(today);
  var toDate = new Date(today);
  toDate.setDate(today.getDate() + 14);
  var toDateStr = formatDate(toDate);

  // Query 1: get-appointment-from-dashboard
  try {
    var res = await api.post('/appointment/get-appointment-from-dashboard', {
      salon: salonId,
      fromDate: fromDate,
      toDate: toDateStr,
      offset: OFFSET,
    });
    var appointments = res.data && res.data.data;
    if (Array.isArray(appointments)) {
      log('[OK]', '  Dashboard query: ' + appointments.length + ' appointments found (' + fromDate + ' to ' + toDateStr + ')');
      if (appointments.length > 0) {
        var apt = appointments[0];
        log('[INFO]', '  Sample: ' + apt.dateAsAString + ' ' + apt.timeAsAString + ' | status=' + apt.status + ' | offset=' + apt.offset);
      }
    } else {
      log('[WARN]', '  Dashboard query returned non-array: ' + JSON.stringify(res.data).substring(0, 300));
    }
  } catch (e) {
    log('[WARN]', '  Dashboard query failed: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
  }

  // Query 2: get-appointment-by-stylist
  if (stylistIds.length > 0) {
    try {
      var res2 = await api.get('/appointment/get-appointment-by-stylist', {
        params: { pageNumber: 1, pageSize: 10, stylistId: stylistIds[0].id },
      });
      var data = res2.data && res2.data.data;
      var count = (data && data.result && data.result.length) || 0;
      var total = (data && data.totalPageSize) || 0;
      log('[OK]', '  Stylist query (' + stylistIds[0].name + '): ' + count + ' appointments (' + total + ' total pages)');
    } catch (e) {
      log('[WARN]', '  Stylist query failed: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
    }
  }

  // Query 3: KPI endpoints
  try {
    var convRes = await api.get('/appointment/appointment-conversion-rate', { params: { salon: salonId } });
    log('[INFO]', '  Conversion rate: ' + JSON.stringify(convRes.data && convRes.data.data));
  } catch (e) {
    log('[WARN]', '  Conversion rate: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
  }

  // Query 4: getAppointmentsByMonth
  try {
    var monthRes = await api.get('/salon/getAppointmentsByMonth/' + salonId);
    log('[INFO]', '  Appointments by month: ' + JSON.stringify(monthRes.data && monthRes.data.data).substring(0, 200));
  } catch (e) {
    log('[WARN]', '  Appointments by month: ' + ((e.response && e.response.data && e.response.data.message) || e.message));
  }
}

// --- Main ---

async function main() {
  console.log('\n========================================================');
  console.log('        BookB Test Data Seed Script');
  console.log('========================================================\n');

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

    console.log('\n========================================================');
    console.log('        LOGIN CREDENTIALS');
    console.log('========================================================');
    console.log('');
    console.log('  SALON OWNER (Dashboard):');
    console.log('  Email:    ' + SALON_OWNER.email);
    console.log('  Password: ' + SALON_OWNER.password);
    console.log('');
    console.log('  STYLISTS (Mobile App):');
    for (var i = 0; i < STYLISTS.length; i++) {
      console.log('  ' + STYLISTS[i].name + '  ' + STYLISTS[i].email);
    }
    console.log('  Password: ' + STYLISTS[0].password);
    console.log('');
    console.log('  CLIENTS (Mobile App):');
    for (var j = 0; j < Math.min(4, CLIENTS.length); j++) {
      console.log('  ' + CLIENTS[j].name + '  ' + CLIENTS[j].email);
    }
    console.log('  Password: BookB2026!');
    console.log('  ... and ' + (CLIENTS.length - 4) + ' more clients');
    console.log('');
    console.log('========================================================\n');

    var totalSubs = 0;
    for (var k = 0; k < SERVICE_CATEGORIES.length; k++) {
      totalSubs += SERVICE_CATEGORIES[k].subServices.length;
    }

    console.log('Data created:');
    console.log('  - 1 Salon: ' + SALON_OWNER.salonName + ' (Owner: ' + SALON_OWNER.name + ')');
    console.log('  - ' + STYLISTS.length + ' Stylists');
    console.log('  - ' + SERVICE_CATEGORIES.length + ' Service categories, ' + totalSubs + ' services');
    console.log('  - ' + PRODUCT_CATEGORIES.length + ' Product categories, ' + PRODUCTS.length + ' products');
    console.log('  - ' + CLIENTS.length + ' Client accounts');
    console.log('  - ~50+ Appointments across the next 2 weeks\n');

  } catch (e) {
    console.error('\n[FAIL] Fatal error: ' + e.message);
    if (e.stack) console.error(e.stack);
    process.exit(1);
  }
}

main();
