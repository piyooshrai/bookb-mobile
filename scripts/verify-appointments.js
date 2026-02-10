#!/usr/bin/env node
/**
 * BookB Appointment Verification Script
 * Checks if appointments exist in the API and diagnoses why they might not show on dashboard.
 */

const axios = require('axios');

const API_BASE = 'https://bookb.the-algo.com/api/v1';
const OFFSET = new Date().getTimezoneOffset();

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

async function main() {
  console.log('\n=== BookB Appointment Verification ===\n');
  console.log(`Timezone offset: ${OFFSET} minutes`);

  // 1. Login
  console.log('\n--- Step 1: Login ---');
  const loginRes = await api.post('/users/login', {
    email: 'sophia.chen@bookb.app',
    password: 'BookB2026!',
  });
  const token = loginRes.data?.data?.token;
  const userId = loginRes.data?.userid;
  console.log(`Token: ${token ? token.substring(0, 20) + '...' : 'NONE'}`);
  console.log(`UserID: ${userId}`);
  api.defaults.headers.common['token'] = token;

  // Get salon ID
  const userRes = await api.get('/users/get-user-by-token');
  const user = userRes.data?.data;
  const salonId = typeof user.salon === 'string' ? user.salon : user.salon?._id || user._id;
  console.log(`Salon ID: ${salonId}`);
  console.log(`User role: ${user.role}`);

  // 2. Try get-appointment-from-dashboard with a wide date range
  console.log('\n--- Step 2: get-appointment-from-dashboard ---');
  const today = new Date();
  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() - 7);
  const toDate = new Date(today);
  toDate.setDate(today.getDate() + 21);

  const fromStr = fromDate.toISOString().split('T')[0];
  const toStr = toDate.toISOString().split('T')[0];
  console.log(`Date range: ${fromStr} to ${toStr}`);

  try {
    const dashRes = await api.post('/appointment/get-appointment-from-dashboard', {
      salon: salonId,
      fromDate: fromStr,
      toDate: toStr,
      offset: OFFSET,
    });
    console.log(`Status: ${dashRes.data?.status}`);
    console.log(`Message: ${dashRes.data?.message}`);
    const appointments = dashRes.data?.data;
    if (Array.isArray(appointments)) {
      console.log(`Appointments found: ${appointments.length}`);
      if (appointments.length > 0) {
        console.log('\nFirst 3 appointments:');
        for (const apt of appointments.slice(0, 3)) {
          console.log(`  - ${apt.dateAsAString} ${apt.timeAsAString} | Status: ${apt.status} | Stylist: ${apt.stylist?.name || apt.stylist} | User: ${apt.userName || apt.user?.name || apt.user}`);
          console.log(`    Service: ${apt.subService?.title || apt.subService} | Offset: ${apt.offset}`);
        }
      }
    } else {
      console.log(`Response data type: ${typeof appointments}`);
      console.log(`Full response: ${JSON.stringify(dashRes.data).substring(0, 1000)}`);
    }
  } catch (e) {
    console.log(`Error: ${e.response?.data?.message || e.message}`);
    console.log(`Full error response: ${JSON.stringify(e.response?.data).substring(0, 500)}`);
  }

  // 3. Try different date formats (maybe the API expects a different format)
  console.log('\n--- Step 3: Try different date formats ---');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fromDateStr2 = `${months[fromDate.getMonth()]} ${fromDate.getDate()}, ${fromDate.getFullYear()}`;
  const toDateStr2 = `${months[toDate.getMonth()]} ${toDate.getDate()}, ${toDate.getFullYear()}`;
  console.log(`Date range (formatted): ${fromDateStr2} to ${toDateStr2}`);

  try {
    const dashRes2 = await api.post('/appointment/get-appointment-from-dashboard', {
      salon: salonId,
      fromDate: fromDateStr2,
      toDate: toDateStr2,
      offset: OFFSET,
    });
    console.log(`Status: ${dashRes2.data?.status}`);
    const appointments2 = dashRes2.data?.data;
    if (Array.isArray(appointments2)) {
      console.log(`Appointments found: ${appointments2.length}`);
    } else {
      console.log(`Response: ${JSON.stringify(dashRes2.data).substring(0, 500)}`);
    }
  } catch (e) {
    console.log(`Error: ${e.response?.data?.message || e.message}`);
  }

  // 4. Try get-appointment-by-stylist (for each stylist)
  console.log('\n--- Step 4: get-appointment-by-stylist ---');
  try {
    const stylistRes = await api.get('/stylist/get-stylist-by-salon');
    const stylists = stylistRes.data?.data;
    const stylistList = Array.isArray(stylists) ? stylists : stylists?.result || [];
    console.log(`Stylists: ${stylistList.length}`);

    for (const stylist of stylistList.slice(0, 2)) {
      const sId = stylist._id;
      const sName = stylist.name || stylist.userId?.name || 'Unknown';
      console.log(`\n  Checking stylist: ${sName} (${sId})`);
      try {
        const aptRes = await api.get('/appointment/get-appointment-by-stylist', {
          params: { pageNumber: 1, pageSize: 10, stylistId: sId },
        });
        const aptData = aptRes.data?.data;
        if (aptData?.result) {
          console.log(`  Appointments: ${aptData.result.length} (total pages: ${aptData.totalPageSize})`);
          for (const apt of aptData.result.slice(0, 2)) {
            console.log(`    - ${apt.dateAsAString} ${apt.timeAsAString} | Status: ${apt.status} | User: ${apt.userName}`);
          }
        } else {
          console.log(`  Response: ${JSON.stringify(aptRes.data).substring(0, 300)}`);
        }
      } catch (e) {
        console.log(`  Error: ${e.response?.data?.message || e.message}`);
      }
    }
  } catch (e) {
    console.log(`Error fetching stylists: ${e.response?.data?.message || e.message}`);
  }

  // 5. Try get-latest-appointment-by-user
  console.log('\n--- Step 5: get-latest-appointment-by-user ---');
  try {
    const latestRes = await api.get('/appointment/get-latest-appointment-by-user');
    console.log(`Status: ${latestRes.data?.status}`);
    console.log(`Message: ${latestRes.data?.message}`);
    if (latestRes.data?.data) {
      const apt = latestRes.data.data;
      console.log(`Latest: ${apt.dateAsAString} ${apt.timeAsAString} | Status: ${apt.status}`);
    } else {
      console.log(`Response: ${JSON.stringify(latestRes.data).substring(0, 300)}`);
    }
  } catch (e) {
    console.log(`Error: ${e.response?.data?.message || e.message}`);
  }

  // 6. Try get-appointment-detail with the appointment ID
  console.log('\n--- Step 6: get-appointment-status-list ---');
  try {
    const statusRes = await api.get('/appointment/get-appointment-status-list');
    console.log(`Status list: ${JSON.stringify(statusRes.data?.data)}`);
  } catch (e) {
    console.log(`Error: ${e.response?.data?.message || e.message}`);
  }

  // 7. Check appointment-conversion-rate to see if any data registered
  console.log('\n--- Step 7: KPI endpoints ---');
  try {
    const convRes = await api.get('/appointment/appointment-conversion-rate', { params: { salon: salonId } });
    console.log(`Conversion rate: ${JSON.stringify(convRes.data?.data)}`);
  } catch (e) {
    console.log(`Conversion rate error: ${e.response?.data?.message || e.message}`);
  }
  try {
    const retRes = await api.get('/appointment/customer-retention-rate', { params: { salon: salonId } });
    console.log(`Retention rate: ${JSON.stringify(retRes.data?.data)}`);
  } catch (e) {
    console.log(`Retention rate error: ${e.response?.data?.message || e.message}`);
  }
  try {
    const ticketRes = await api.get('/appointment/average-ticket-value', { params: { salon: salonId } });
    console.log(`Avg ticket value: ${JSON.stringify(ticketRes.data?.data)}`);
  } catch (e) {
    console.log(`Avg ticket error: ${e.response?.data?.message || e.message}`);
  }

  // 8. Check appointment availability
  console.log('\n--- Step 8: get-available-appointment-by-date ---');
  try {
    const stylistRes = await api.get('/stylist/get-stylist-by-salon');
    const stylists = stylistRes.data?.data;
    const stylistList = Array.isArray(stylists) ? stylists : stylists?.result || [];
    if (stylistList.length > 0) {
      const todayStr = today.toISOString().split('T')[0];
      const availRes = await api.post('/appointment/get-available-appointment-by-date', {
        salon: salonId,
        stylistId: stylistList[0]._id,
        date: todayStr,
      }, { params: { offset: OFFSET } });
      console.log(`Available slots for ${todayStr}: ${JSON.stringify(availRes.data).substring(0, 500)}`);
    }
  } catch (e) {
    console.log(`Error: ${e.response?.data?.message || e.message}`);
  }

  // 9. Try get-user-activity
  console.log('\n--- Step 9: get-user-activity ---');
  try {
    const actRes = await api.get('/appointment/get-user-activity', {
      params: { pageNumber: 1, pageSize: 10 },
    });
    console.log(`User activity: ${JSON.stringify(actRes.data).substring(0, 500)}`);
  } catch (e) {
    console.log(`Error: ${e.response?.data?.message || e.message}`);
  }

  // 10. Try getAppointmentsByMonth
  console.log('\n--- Step 10: getAppointmentsByMonth ---');
  try {
    const monthRes = await api.get(`/salon/getAppointmentsByMonth/${salonId}`);
    console.log(`Appointments by month: ${JSON.stringify(monthRes.data).substring(0, 500)}`);
  } catch (e) {
    console.log(`Error: ${e.response?.data?.message || e.message}`);
  }

  console.log('\n=== Verification Complete ===\n');
}

main().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
