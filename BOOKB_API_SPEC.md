# BookB Salon Management — Complete API Specification

> Generated: 2026-02-09 | Framework: Express.js + Socket.io | Database: MongoDB (Mongoose) | Auth: JWT (express-jwt)

---

## Summary Table

| Domain | Endpoints | Notes |
|---|---|---|
| Auth & Users | 25 | Login, OTP, signup, profile, rewards |
| Salon | 13 | CRUD, analytics, settings |
| Stylist | 21 | CRUD, analytics, dashboard, notes |
| Appointments | 17 | Booking, status, dashboard, public |
| Appointment Availability | 13 | Slots, business hours, blocking |
| Services | 10 | Main/sub services, categories |
| Products & POS | 17 | Categories, products, orders, stock |
| Videos | 14 | Upload, categories, analytics |
| Attendance | 6 | Check-in/out, history |
| Sessions | 3 | Stylist session tracking |
| Notifications | 4 | Send, list |
| Reports & Analytics | 26 | Earnings, sessions, admin dashboards |
| Coupons | 12 | Salon + BookB-level coupons |
| Promo Codes | 4 | Promo code CRUD |
| Subscription Plans | 10 | Stripe plans, pricing |
| Website Settings | 12 | Branding, business hours |
| App Settings | 3 | Mobile app theming |
| Service Photos | 2 | Gallery uploads |
| Version | 5 | App version management |
| Generic | 2 | Bulk upload, generic data |
| Localization | 4 | [unmerged: stripe-payment] |
| **TOTAL** | **~221** | |

---

## Base URL

All API routes are prefixed: `/api/v1`

Additional root-level routes:
- `GET /metrics` — Prometheus metrics (public)
- `GET /share` — App store redirect based on User-Agent (public)
- `POST /test-result-si` — Webhook test endpoint (public)
- `GET /test-result-si` — Webhook results (public)

---

## Authentication

### Mechanism
- **JWT** via `express-jwt`, token passed in `token` header (not `Authorization`)
- Roles: `admin`, `superadmin`, `salon`, `stylist`, `user`, `manager`

### Middleware Levels
- **`middleware.optional`** — Decodes JWT if present, but doesn't require it. Used on most routes.
- **`middleware.required`** — JWT required, request fails with 401 if missing/invalid. Used on attendance, session, report routes.
- **`middleware.admin`** — Requires `req.payload.role === 'admin'`. Used on admin dashboard report routes.

### Standard Response Envelope
```typescript
interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
  code?: string; // e.g., 'credentials_required'
}
```

> **Note:** Almost all errors return HTTP 200 with `status: false`. Only a few analytics endpoints return 400.

---

## 1. AUTH & USERS

**Router mount:** `/api/v1/users`
**Middleware:** `middleware.optional` applied to entire router

### POST /api/v1/users/login
- **Auth:** Public (optional JWT)
- **Body:** `{ email: string, password: string }`
- **Response:** `{ status: true, data: { token: string }, isFirstLogin: boolean, userid: string, role: string, message: string }`
- **Notes:** Uses `userName` field for lookup. Returns isFirstLogin flag, sets it to false after first login.

### POST /api/v1/users/check-mobile-number
- **Auth:** Public
- **Query:** `packageName: string`
- **Body:** `{ phone: string, countryCode: string }`
- **Response:** `{ status: true, data: string (OTP token), message: string }`
- **Notes:** Sends OTP via Twilio SMS. In dev/staging env, OTP is always `1234`. Certain hardcoded phone numbers also get `1234`.

### POST /api/v1/users/check-salon-mobile-number
- **Auth:** Public
- **Body:** `{ phone: string, countryCode: string }`
- **Notes:** Checks mobile number specifically for salon role.

### POST /api/v1/users/otp-verification
- **Auth:** Public
- **Body:** `{ phone: string, otp: number, packageName: string, platform: string, deviceInfo: string, deviceId: string }`
- **Response:** `{ status: true, data: string (JWT token), role: string, isFirstLogin: boolean }`
- **Notes:** Verifies OTP, generates JWT valid for 90 days, updates device info.

### POST /api/v1/users/user-signup-for-mobile
- **Auth:** Public
- **Body:** `{ name: string, email: string, phone: string, gender: string, salon: ObjectId, countryCode: string, referralCode?: string }`
- **Response:** `{ status: true, data: string (JWT token) }`
- **Notes:** Creates user with role `user`, generates referral code via UUID, triggers coin events for signup and referral.

### POST /api/v1/users/send-message
- **Auth:** Optional JWT
- **Body:** `{ userId: ObjectId, message: string }`
- **Notes:** Sends SMS via Twilio to specified user.

### PATCH /api/v1/users/forgot-password
- **Auth:** Public
- **Body:** `{ email: string, phone: string, role: string }`
- **Notes:** Generates new password, sends via email (SES) and SMS (Twilio).

### POST /api/v1/users/onboard-signup
- **Auth:** Public
- **Query:** `offset: number`
- **Body:**
```typescript
{
  payment: { id: string, promotion_code?: string },
  salon: { email: string, phone: string, name: string, address: string, password: string, countryCode: string },
  stylist: Array<{ email: string, phone: string, name: string, gender: string }>,
  subscription: { plan: string },
  businessHours?: Array<{ day: string, slot: Array<{ startTime: string, endTime: string }> }>,
  maxCalendar: number
}
```
- **Notes:** Complete onboarding flow: creates salon, stylists, Stripe subscription, business hours, availability slots. Sends password emails.
- **Middleware:** File upload not used here (despite being a POST).
- **External calls:** Stripe subscription creation.

### POST /api/v1/users/verifySalonDetails
- **Auth:** Public
- **Body:** `{ phone: string, email: string }`
- **Notes:** Checks if salon exists with given phone/email.

### PUT /api/v1/users/change-role
- **Auth:** Optional JWT
- **Body:** `{ role: string }`
- **Notes:** Switches user role (for multi-role users), returns new JWT.

### POST /api/v1/users/onboard-done
- **Auth:** Public
- **Body:** `{ clientId: ObjectId, plan: string }`
- **Notes:** Completes onboarding, retrieves Stripe plan details, sets subscription expiry.

### PUT /api/v1/users/update-users-username
- **Auth:** Optional JWT
- **Notes:** Admin utility — updates all users' `userName` to match their `email`. **No pagination, processes all users.**

### PATCH /api/v1/users/assign-stylist-to-user
- **Auth:** Optional JWT
- **Body:** `{ stylist: ObjectId }`
- **Response:** Returns new JWT token.

### GET /api/v1/users/get-user
- **Auth:** Optional JWT (role-aware: salon, manager, superadmin, stylist)
- **Query:** `pageNumber: number, pageSize: number, filterValue?: string`
- **Response:** `{ status: true, data: { result: User[], totalPageSize: number } }`
- **Notes:** Returns users belonging to the salon of the authenticated user. Paginated with search.

### POST /api/v1/users/user-signup
- **Auth:** Optional JWT
- **Body:** `{ name: string, email: string, phone: string, gender: string, _id?: ObjectId, clientNote?: string, availableRole?: string[] }`
- **Notes:** If `_id` present → update; else → create. For create, salon is derived from JWT payload.

### GET /api/v1/users/get-user-by-token
- **Auth:** Optional JWT
- **Response:** Full user object with populated `salon`, `stylist`, `services`.
- **Notes:** Excludes `salt`, `hash`, `__v`, `subscription`.

### DELETE /api/v1/users/delete-user
- **Auth:** Optional JWT
- **Query:** `userID: ObjectId`
- **Notes:** Hard delete.

### PATCH /api/v1/users/enable-disable-user
- **Auth:** Optional JWT
- **Query:** `userID: ObjectId`
- **Body:** `{ enable: boolean }`
- **Notes:** Toggles `active` field.

### PATCH /api/v1/users/update-salon-for-superadmin
- **Auth:** Optional JWT
- **Query:** `userID: ObjectId`
- **Body:** `{ salon: ObjectId }`

### PATCH /api/v1/users/change-password
- **Auth:** Optional JWT
- **Body:** `{ password: string }`

### PATCH /api/v1/users/update-device-id
- **Auth:** Optional JWT
- **Body:** `{ userDeviceID: string }`

### PATCH /api/v1/users/update-profile-image
- **Auth:** Optional JWT
- **Middleware:** `uploadImage.single('photo')` — multer, PNG/JPG only, memory storage
- **Body (multipart):** `photo: File`

### POST /api/v1/users/get-user-by-token (POST variant)
- **Auth:** Optional JWT
- **Body:** `{ platform: string, deviceInfo: string, deviceId: string }`
- **Notes:** Updates device info and returns user. Checks `accessToken` validity.

### PATCH /api/v1/users/logout-user
- **Auth:** Optional JWT
- **Notes:** Clears `userDeviceID` and `accessToken`.

### PUT /api/v1/users/update-profile
- **Auth:** Optional JWT
- **Middleware:** `uploadImage.single('photo')`
- **Body (multipart):** `{ name, description, phone, email, lunchStartTime, lunchEndTime, photo?: File }`
- **Notes:** Triggers `complete-profile` coin reward if profile is fully filled.

### PATCH /api/v1/users/update-password
- **Auth:** Optional JWT
- **Body:** `{ oldPassword: string, password: string }`

### DELETE /api/v1/users/removeUser
- **Auth:** Optional JWT
- **Notes:** Soft delete — moves user to `Userhistory` collection with `deletedBy: 'self'`.

### GET /api/v1/users/getRewardInfo
- **Auth:** Optional JWT
- **Response:** `{ status: true, data: { coinsHistory: CoinsHistory[], coinSettings: CoinSettings[], coins: number } }`

### GET /api/v1/users/getDynamicFlags
- **Auth:** Optional JWT
- **Response:** `{ status: true, data: DynamicFlag[] }`

---

## 2. SALON

**Router mount:** `/api/v1/salon`
**Middleware:** `middleware.optional` applied after public routes

### GET /api/v1/salon/get-enable-salon (public)
- **Response:** `{ status: true, data: { result: User[] } }`

### GET /api/v1/salon/get-salon-setting-by-type (public)
- **Query:** `SalonID: ObjectId, type: 'logo'|'login'|'register'|'home'|'video'|'shop'|'profile'`
- **Notes:** Returns specific WebsiteSetting fields based on type.

### GET /api/v1/salon/get-salon-by-package (public)
- **Query:** `packageName: string`

### GET /api/v1/salon/get-salon-by-url (public)
- **Query:** `webUrl: string`

### GET /api/v1/salon/getGenderPercentageReport/:id/:type (public)
- **Params:** `id: ObjectId (salon), type: 'monthly'|'yearly'|'custom'`
- **Query:** `startDate?: string, endDate?: string` (for custom type)
- **Response:** `{ status: true, data: [{ value: number, color: string, text: string }] }`

### GET /api/v1/salon/getSalonAnalytics/:salonId/:type (public)
- **Params:** `salonId: ObjectId, type: 'monthly'|'yearly'`
- **Response:** Analytics array with appointments, users, services, total sales + percentage changes.

### POST /api/v1/salon/getSalonCustomAnalytics (public)
- **Body:** `{ startDate: string, endDate: string, salonId: ObjectId }`

### GET /api/v1/salon/getAppointmentsByMonth/:id (public)
- **Params:** `id: ObjectId (salon)`
- **Response:** Monthly appointment counts for current year as bar chart data.

### POST /api/v1/salon/create-salon (token optional)
- **Middleware:** `uploadImage.single('image')`
- **Body (multipart):** `{ name, email, phone, address, password, id?: ObjectId, image?: File }`
- **Notes:** If `id` present → update; else → create salon. Sends password email.

### GET /api/v1/salon/get-salon (token optional)
- **Query:** `pageNumber, pageSize, filterValue?`
- **Response:** Paginated salon list.

### DELETE /api/v1/salon/delete-salon (token optional)
- **Query:** `salonID: ObjectId`

### PATCH /api/v1/salon/enable-disable-salon (token optional)
- **Query:** `userID: ObjectId`
- **Body:** `{ enable: boolean }`

### PATCH /api/v1/salon/change-menu-setting (token optional)
- **Query:** `userID: ObjectId`
- **Body:** `{ appMenu: object }`

### GET /api/v1/salon/get-salon-menu-setting-by-token (token optional)
- **Query:** `id?: ObjectId`

---

## 3. STYLIST

**Router mount:** `/api/v1/stylist`
**Middleware:** `middleware.optional`

### POST /api/v1/stylist/create-stylist
- **Auth:** Token optional (role: salon, manager, superadmin)
- **Middleware:** `uploadImage.single('image')`
- **Body (multipart):** `{ name, email, phone, address, password, startTime, endTime, services (comma-separated), id?: ObjectId, image?: File }`
- **Notes:** Checks subscription calendar limit. If `id` → update; else → create. Sends password email. Awards signup coins.

### GET /api/v1/stylist/get-stylist
- **Query:** `pageNumber, pageSize, filterValue?`
- **Notes:** Role-aware (salon → own stylists).

### DELETE /api/v1/stylist/delete-stylist
- **Query:** `stylistId: ObjectId`

### PATCH /api/v1/stylist/enable-disable-stylist
- **Query:** `userID: ObjectId`
- **Body:** `{ enable: boolean }`

### GET /api/v1/stylist/get-enable-stylist
- **Notes:** Role-aware, returns active stylists for the salon.

### PATCH /api/v1/stylist/update-stylist-services
- **Body:** `{ services: ObjectId[] }`

### POST /api/v1/stylist/add-stylist-settings
- **Body:** `{ id: ObjectId, intervalTime: string, recurringType: string, startTime: string, endTime: string, services: string (comma-separated), isBreakTimeCompulsory: boolean }`

### GET /api/v1/stylist/get-stylist-settings
- **Query:** `stylistId: ObjectId`
- **Response:** Stylist settings with populated services.

### PUT /api/v1/stylist/note
- **Query:** `user: ObjectId`
- **Body:** `{ userNote: string }`

### GET /api/v1/stylist/note
- **Query:** `user: ObjectId`

### GET /api/v1/stylist/get-stylist-by-salon
- **Query:** `filterValue?: string`
- **Notes:** Role-aware (salon, manager, superadmin, user).

### GET /api/v1/stylist/getRecentAppointment/:stylistId/:status
- **Params:** `stylistId: ObjectId, status: 'upcoming'|'past'|'canceled'`
- **Response:** Transformed appointment list with service details.

### GET /api/v1/stylist/getStylistAnalytics/:stylistId/:type
- **Params:** `stylistId: ObjectId, type: 'monthly'|'yearly'`
- **Response:** Analytics array (appointments, users, services, total sales + comparisons).

### POST /api/v1/stylist/getStylistCustomAnalytics
- **Body:** `{ startDate: string, endDate: string, stylistId: ObjectId }`

### GET /api/v1/stylist/appointmentInfo/:id
- **Params:** `id: ObjectId (appointment)`
- **Response:** Appointment details with service, user info.

### GET /api/v1/stylist/getLatestAppointment/:id
- **Params:** `id: ObjectId (stylist)`
- **Response:** Next upcoming appointment with service data + `isToday` flag.

### GET /api/v1/stylist/getAppointmentsByMonth/:id
- **Params:** `id: ObjectId (stylist)`
- **Response:** Monthly completed appointment counts (bar chart data).

### GET /api/v1/stylist/getGenderPercentageReport/:id/:type
- **Params:** `id: ObjectId (stylist), type: 'monthly'|'yearly'|'custom'`
- **Query:** `startDate?, endDate?`

### GET /api/v1/stylist/getDayWiseAppointment/:id
- **Params:** `id: ObjectId (stylist)`
- **Query:** `date: string (YYYY-MM-DD)`
- **Response:** `{ data: Array<{ startTime, endTime, userName, service, availability, description, id, price, status, timeDataId }> }`

---

## 4. APPOINTMENTS

**Router mount:** `/api/v1/appointment`
**Middleware:** `middleware.optional`

### POST /api/v1/appointment/add-appointment-from-dashboard
- **Auth:** Token optional
- **Query:** `offset: number`
- **Body:**
```typescript
{
  appointmentDate: string,
  timeData: { timeAsADate: string, timeAsAString: string, id: string },
  salon?: ObjectId,
  stylistId?: ObjectId,
  email?: string,
  mobile?: string,
  name?: string,
  gender?: string,
  comment?: string,
  mainService: ObjectId,
  subService: ObjectId,
  availability?: ObjectId,
  servicePhoto?: ObjectId,
  requiredDuration: number,
  id?: ObjectId // if present, update existing
}
```
- **Notes:** Checks time availability, creates/updates appointment, updates availability slot status, sends email + push notification, emits socket events.
- **External:** Firebase push notifications, SES email.

### POST /api/v1/appointment/get-appointment-from-dashboard
- **Body:** `{ salon?: ObjectId, stylistId?: ObjectId, status?: string, fromDate: string, toDate: string, offset: number }`
- **Response:** Appointments with populated user, stylist, service, availability details.

### POST /api/v1/appointment/get-available-appointment-by-date
- **Body:** `{ salon: ObjectId, stylistId: ObjectId, date: string }`
- **Query:** `offset: number`
- **Response:** Available time slots for the date with appointment details.

### POST /api/v1/appointment/confirm-appointment
- **Body:** `{ appointmentId: ObjectId, availabilityId: ObjectId, timeDataId: ObjectId }`
- **Notes:** Sets status to 'confirmed', sends confirmation email + notification.

### GET /api/v1/appointment/get-appointment-by-stylist
- **Query:** `pageNumber, pageSize, filterValue?, stylistId?`

### GET /api/v1/appointment/get-appointment-history-by-user
- **Query:** `pageNumber, pageSize, filterValue?`
- **Notes:** Role-aware, returns appointments for authenticated user.

### DELETE /api/v1/appointment/delete-appointment
- **Query:** `appointmentId: ObjectId`

### DELETE /api/v1/appointment/delete-appointment-dashboard/:appointmentId
- **Params:** `appointmentId: ObjectId`
- **Notes:** Also updates availability slot back to 'available'.

### PATCH /api/v1/appointment/change-status-of-appointment
- **Query:** `id: ObjectId`
- **Body:** `{ status: 'available'|'requested'|'confirmed'|'waiting'|'canceled'|'completed', availabilityId: ObjectId, timeDataId: ObjectId }`
- **Notes:** Updates appointment status and availability slot. Sends email + push notification. Awards coins for first appointment (user + stylist). Emits socket `appointment-request` event.

### GET /api/v1/appointment/get-latest-appointment-by-user
- **Notes:** Returns latest appointment for authenticated user.

### POST /api/v1/appointment/test-api
- **Notes:** Test endpoint.

### GET /api/v1/appointment/appointment-conversion-rate
- **Query:** `salon: ObjectId`
- **Response:** `{ conversionRate: number }`

### GET /api/v1/appointment/customer-retention-rate
- **Query:** `salon: ObjectId`
- **Response:** `{ retentionRate: number }`

### GET /api/v1/appointment/average-ticket-value
- **Query:** `salon: ObjectId`
- **Response:** `{ averageTicketValue: number }`

### GET /api/v1/appointment/get-availability-detail-by-appointment
- **Query:** `appointment: ObjectId`

### GET /api/v1/appointment/get-appointment-status-list
- **Response:** `['available', 'requested', 'confirmed', 'waiting', 'canceled', 'completed']`

### GET /api/v1/appointment/get-user-activity
- **Query:** `pageNumber, pageSize, filterValue?`
- **Notes:** Returns all appointments for authenticated user with service + stylist details.

### GET /api/v1/appointment/get-appointment-detail
- **Query:** `appointmentId: ObjectId`

### POST /api/v1/appointment/bookAppointmentWithoutSlot
- **Body:** `{ appointmentDate, salon, stylistId, timeData, mainService, subService, name, email, mobile, gender, comment, requiredDuration }`
- **Notes:** Books appointment without requiring a pre-existing availability slot.

### Public Appointment Routes

**Router mount:** `/api/v1/public/appointment` (NO auth middleware)

### POST /api/v1/public/appointment/add-appointment-from-website
- **Auth:** Public
- **Notes:** Same as addAppointmentV2 — creates appointment from website booking widget.

### POST /api/v1/public/appointment/get-appointment-from-dashboard
- **Auth:** Public

### POST /api/v1/public/appointment/get-available-appointment-by-date
- **Auth:** Public

---

## 5. APPOINTMENT AVAILABILITY

**Router mount:** `/api/v1/appointment-availability`
**Middleware:** `middleware.optional`

### POST /api/v1/appointment-availability/create-availability
- **Auth:** Token required (stylist role only)
- **Query:** `offset: number`
- **Body:** `{ dateArray: string[], timeArray: string[], id?: ObjectId }`

### GET /api/v1/appointment-availability/get-availability-by-salon
- **Auth:** Token (role: salon, manager, superadmin)
- **Query:** `pageNumber, pageSize, filterValue?`

### GET /api/v1/appointment-availability/get-availability-by-stylist
- **Auth:** Token (role: stylist)
- **Query:** `pageNumber, pageSize, filterValue?`

### DELETE /api/v1/appointment-availability/delete-availability
- **Query:** `id: ObjectId`

### GET /api/v1/appointment-availability/get-availability-by-stylist-for-mobile
- **Auth:** Token required
- **Query:** `date: string`
- **Response:** Available time slots + grouped services for the stylist.

### POST /api/v1/appointment-availability/create-availability-daily
- **Query:** `offset, stylistId?`
- **Body:** `{ time: string, date: string, slotId?: ObjectId, timeData?: object, appointmentList?: ObjectId[] }`

### POST /api/v1/appointment-availability/create-availability-bulk
- **Query:** `offset, stylistId?`
- **Body:**
```typescript
{
  slots: Array<{ day: string, slot: Array<{ startTime: string, endTime: string }> }>,
  id?: ObjectId, // BusinessHour ID for update
  recurringType?: 'week'|'month'|'year'|'custom',
  customStartDate?: string, // YYYY-MM-DD
  customEndDate?: string
}
```
- **Notes:** Creates bulk availability slots based on business hours. If custom type, date range up to 365 days.

### POST /api/v1/appointment-availability/create-availability-day
- **Query:** `offset, stylistId?`
- **Body:** `{ date: string }`
- **Notes:** Creates default 9AM-5PM slots in 30-min intervals for a single day.

### GET /api/v1/appointment-availability/get-appointment-list-with-block-unblock-status
- **Query:** `date, offset, stylistId?`

### DELETE /api/v1/appointment-availability/block-availability
- **Query:** `date, stylistId?`

### POST /api/v1/appointment-availability/get-available-list-by-range
- **Body:** `{ stylistId: ObjectId, fromDate: string, toDate: string, salon?: ObjectId }`
- **Response:** Availability records with appointment details, user, service lookups.

### GET /api/v1/appointment-availability/get-buiness-hours
- **Query:** `stylistId?`
- **Response:** Business hour configuration for stylist.

### POST /api/v1/appointment-availability/get-today-activity
- **Body:** `{ stylistId: ObjectId, fromDate: string }`
- **Query:** `offset`
- **Response:** `{ appointments: [], stylistData: {} }`

---

## 6. SERVICES

**Router mount:** `/api/v1/service`
**Middleware:** `middleware.optional` (after public routes)

### GET /api/v1/service/get-website-service-groupby-category (public)
- **Query:** `name: string` (salon name)
- **Response:** Services grouped by main service (category).

### GET /api/v1/service/get-website-service-groupby-category-salon (public)
- **Query:** `salon: ObjectId`

### POST /api/v1/service/add-service (token optional)
- **Body:** `{ title, description, charges, requiredTime, leadTime, breakTime, isMainService, salon?, service? (parent ID), id? (for update) }`

### GET /api/v1/service/get-main-service
- **Query:** `pageNumber, pageSize, filterValue?`

### GET /api/v1/service/get-sub-service
- **Query:** `pageNumber, pageSize, filterValue?, mainServiceId`

### GET /api/v1/service/get-enable-main-service
- **Notes:** Returns enabled main services for salon.

### PATCH /api/v1/service/enable-disable-service
- **Query:** `serviceId: ObjectId`
- **Body:** `{ enable: boolean }`

### DELETE /api/v1/service/delete-service
- **Query:** `serviceId: ObjectId`

### GET /api/v1/service/get-enable-sub-service
- **Query:** `mainServiceId: ObjectId`

### GET /api/v1/service/get-service-groupby-category
- **Notes:** Returns all services grouped by main service category.

### PATCH /api/v1/service/rank-update-service
- **Body:** `{ services: Array<{ id: ObjectId, rank: number }> }`

---

## 7. PRODUCTS & POS

**Router mount:** `/api/v1/product`
**Middleware:** `middleware.optional` (after public routes)

### Product Categories

#### POST /api/v1/product/create-category
- **Body:** `{ categoryName, categoryImage?, categoryThreshold?, id? }`

#### GET /api/v1/product/get-category
- **Query:** `pageNumber, pageSize, filterValue?`

#### DELETE /api/v1/product/delete-category
- **Query:** `categoryId: ObjectId`

#### PATCH /api/v1/product/enable-disable-category
- **Query:** `categoryId: ObjectId`
- **Body:** `{ enable: boolean }`

#### GET /api/v1/product/get-enabled-category

#### GET /api/v1/product/get-enabled-website-category (public)
- **Query:** `name: string` (salon name)

### Products

#### POST /api/v1/product/add-product
- **Middleware:** `uploadImage.single('image')`
- **Body (multipart):** `{ productName, productDescription, productPrice, category, salon?, id?, actualPrice, rating, image?: File }`

#### GET /api/v1/product/get-product-by-category
- **Query:** `pageNumber, pageSize, filterValue?, categoryId`

#### DELETE /api/v1/product/delete-product
- **Query:** `productId: ObjectId`

#### PATCH /api/v1/product/enable-disable-product
- **Query:** `productId: ObjectId`
- **Body:** `{ enable: boolean }`

#### GET /api/v1/product/get-product-by-id
- **Query:** `productId: ObjectId`

#### GET /api/v1/product/get-product-by-salon
- **Query:** `pageNumber, pageSize, filterValue?`

#### GET /api/v1/product/get-product-by-salon-for-mobile

#### GET /api/v1/product/get-similar-product
- **Query:** `productId: ObjectId`

#### POST /api/v1/product/get-product-by-salon-for-website (public)
- **Body:** `{ name: string }` (salon name)

#### POST /api/v1/product/get-product-by-salon-for-website-using-id (public)
- **Body:** `{ salon: ObjectId }`

#### GET /api/v1/product/get-similar-website-product (public)
- **Query:** `productId: ObjectId`

### Orders

#### POST /api/v1/product/add-order
- **Body:** `{ items: object[], totalAmount, amount, otherAmount, orderType: 'by cash'|'by RazorPay', salon?, shippingAddress?, billingAddress? }`

#### GET /api/v1/product/get-order-by-user
- **Query:** `pageNumber, pageSize`

#### GET /api/v1/product/get-order-by-salon
- **Query:** `pageNumber, pageSize`

#### PATCH /api/v1/product/change-order-status
- **Query:** `orderId: ObjectId`
- **Body:** `{ orderStatus: 'Pending'|'Completed'|'Confirm'|'Cancel' }`

#### GET /api/v1/product/get-order-by-id (public)
- **Query:** `orderId: ObjectId`

#### POST /api/v1/product/payment (public)
- **Notes:** Payment processing endpoint.

### Stock

#### POST /api/v1/product/add-stock
- **Body:** `{ product: ObjectId, credit, debit, userReference?, salon?, category? }`
- **Notes:** Triggers event to recalculate product stock.

#### GET /api/v1/product/get-stock-by-product
- **Query:** `productId: ObjectId, pageNumber, pageSize`

---

## 8. VIDEOS

**Router mount:** `/api/v1/video`
**Middleware:** `middleware.optional`

### Video Categories

#### POST /api/v1/video/create-category
- **Body:** `{ categoryName, id? }`

#### GET /api/v1/video/get-category
- **Query:** `pageNumber, pageSize, filterValue?`

#### DELETE /api/v1/video/delete-category
- **Query:** `categoryId: ObjectId`

#### PATCH /api/v1/video/enable-disable-category
- **Query:** `categoryId: ObjectId`
- **Body:** `{ enable: boolean }`

#### GET /api/v1/video/get-enabled-category

### Videos

#### POST /api/v1/video/add-video
- **Middleware:** `uploadVideo.single('video')` — MP4 only, disk storage
- **Body (multipart):** `{ videoTitle, videoDescription, videoCategory, video: File }`
- **Notes:** Video is compressed via ffmpeg in background, uploaded to S3, thumbnail extracted.

#### GET /api/v1/video/get-video-by-salon
- **Query:** `pageNumber, pageSize, filterValue?`

#### GET /api/v1/video/get-video-by-stylist
- **Query:** `pageNumber, pageSize, filterValue?`

#### GET /api/v1/video/get-video-by-category
- **Query:** `pageNumber, pageSize, filterValue?, categoryId`

#### DELETE /api/v1/video/delete-video
- **Query:** `videoId: ObjectId`

#### PATCH /api/v1/video/enable-disable-video
- **Query:** `videoId: ObjectId`
- **Body:** `{ enable: boolean }`

### Video Analytics

#### POST /api/v1/video/add-analytics
- **Body:** `{ video: ObjectId, analyticsType: 'view'|'like'|'favorite'|'share' }`
- **Notes:** Triggers event to update video counts.

#### GET /api/v1/video/get-most-viewed-video-by-salon

#### GET /api/v1/video/get-similar-video
- **Query:** `videoId: ObjectId`

#### GET /api/v1/video/get-video-by-id
- **Query:** `videoId: ObjectId`

#### GET /api/v1/video/get-favorite-video-by-user

#### GET /api/v1/video/compress-video
- **Notes:** Triggers video compression for a given video.

---

## 9. ATTENDANCE

**Router mount:** `/api/v1/attendance`
**Middleware:** `middleware.required` (JWT required for all routes)

### POST /api/v1/attendance/attendance
- **Body:** `{ stylistId: ObjectId, action: 'checkIn'|'checkOut', note?: string }`
- **Query:** `offset: number`

### GET /api/v1/attendance/get-todays-attendance-by-salon
- **Query:** `offset`

### GET /api/v1/attendance/get-attendance-by-user
- **Query:** `pageNumber, pageSize, offset, userId?`

### PATCH /api/v1/attendance/update-note
- **Query:** `attendanceId: ObjectId`
- **Body:** `{ note: string }`

### GET /api/v1/attendance/get-attendance-history-by-salon
- **Query:** `pageNumber, pageSize, offset, filterValue?`

### DELETE /api/v1/attendance/delete-attendance
- **Query:** `attendanceId: ObjectId`

---

## 10. SESSIONS

**Router mount:** `/api/v1/session`
**Middleware:** `middleware.required`

### POST /api/v1/session/add-session
- **Body:** `{ stylist: ObjectId, session: number, sessionDate: Date, sessionDateString: string }`
- **Query:** `offset`

### GET /api/v1/session/get-session-by-stylist
- **Query:** `pageNumber, pageSize, filterValue?, stylistId`

### GET /api/v1/session/get-total-session-by-stylist
- **Query:** `stylistId, startDate, endDate`

---

## 11. NOTIFICATIONS

**Router mount:** `/api/v1/notification`
**Middleware:** `middleware.optional`

### POST /api/v1/notification/send-notification
- **Body:** `{ title, body, salon?, sendType: 'admin'|'salon'|'stylist'|'user'|'manager'|'superadmin'|'company' }`
- **Notes:** Sends via Firebase Cloud Messaging (FCM) to topic.

### GET /api/v1/notification/get-notification
- **Query:** `pageNumber, pageSize`

### GET /api/v1/notification/get-notification-for-user
- **Query:** `pageNumber, pageSize`

### POST /api/v1/notification/send-notification-by-user
- **Body:** `{ title, body, userId: ObjectId }`
- **Notes:** Sends FCM to specific user's device token.

---

## 12. REPORTS & ANALYTICS

**Router mount:** `/api/v1/report`
**Middleware:** `middleware.required`

### Salon-Level Reports

| Method | Path | Description |
|---|---|---|
| GET | `/get-total-session-by-stylist-month-wise` | Sessions per stylist per month |
| GET | `/get-total-session-by-month` | Total sessions by month |
| GET | `/get-total-earning-by-month` | Total earnings by month |
| GET | `/get-total-earning-by-day-by-stylist` | Daily earnings per stylist |
| GET | `/get-total-sales-by-month` | Product sales by month |
| GET | `/get-total-session-by-stylist-month-wise-for-chart` | Chart data variant |
| GET | `/get-general-count` | General counts (stylists, users, etc.) |
| GET | `/get-total-earning-by-month-for-chart` | Chart data variant |
| GET | `/get-total-sales-by-month-for-chart` | Chart data variant |

**Common query params:** `startDate, endDate, month, year, stylistId?, offset`

### Stylist-Level Reports

| Method | Path | Description |
|---|---|---|
| GET | `/get-general-count-stylist` | General counts for stylist |
| GET | `/get-total-session-by-month-stylist` | Sessions by month |
| GET | `/get-total-session-by-month-stylist-for-chart` | Chart variant |
| GET | `/get-total-earning-by-month-stylist` | Earnings by month |
| GET | `/get-total-earning-by-month-stylist-for-chart` | Chart variant |

### BookB Admin Reports

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/dashboard-count-by-date-range` | required | Dashboard KPIs by date range |
| POST | `/get-user-chart` | required | User registration chart |
| POST | `/get-appointment-chart` | required | Appointment chart data |
| POST | `/stylist-list-with-appointments-by-date-range` | required | Stylist appointment summary |
| POST | `/current-year-appointment-by-month` | required | Monthly appointment breakdown |
| POST | `/upcoming-appointments` | required | Upcoming appointment list |
| POST | `/current-appointments` | required | Currently active appointments |
| GET | `/admin-dashboard-report` | admin only | Number of salons |
| GET | `/admin-salon-report-chart` | admin only | Salon chart data |
| GET | `/admin-salon-subscription` | admin only | Subscription report |

---

## 13. COUPONS

**Router mount:** `/api/v1/coupon`
**Middleware:** `middleware.optional` (after public routes)

### Public Routes

| Method | Path | Description |
|---|---|---|
| GET | `/get-website-coupon-by-salon-name` | `?name=` salon name |
| GET | `/verify-coupon` | `?code=&salon=` |
| GET | `/get-coupons-for-on-boarding` | For registration flow |
| GET | `/get-active-coupon` | All active BookB coupons |

### Authenticated Routes

| Method | Path | Description |
|---|---|---|
| POST | `/add-coupon` | Create salon-level coupon |
| GET | `/get-coupons` | List salon coupons (paginated) |
| GET | `/get-coupon-enable-list` | Active salon coupons |
| DELETE | `/delete-coupon` | `?couponId=` |
| PATCH | `/enable-disable-coupon` | `?couponId=` |

### BookB Admin Coupon Routes

| Method | Path | Description |
|---|---|---|
| GET | `/` | List all BookB coupons |
| POST | `/` | Create BookB coupon |
| GET | `/:id` | Get single BookB coupon |
| PATCH | `/:id` | Update BookB coupon |
| DELETE | `/:id` | Delete BookB coupon |

---

## 14. PROMO CODES

**Router mount:** `/api/v1/promo-codes`
**Middleware:** `middleware.optional` (after public routes)

### Public Routes

| Method | Path | Description |
|---|---|---|
| GET | `/promo-codes/:code` | Look up promo code by code string |
| GET | `/get-promo-codes` | All active promo codes |

### Authenticated Routes

| Method | Path | Description |
|---|---|---|
| GET | `/` | List all promo codes |
| POST | `/` | Create promo code |
| GET | `/:id` | Get single promo code |
| PATCH | `/:id` | Update promo code |

---

## 15. SUBSCRIPTION PLANS

**Router mount:** `/api/v1/plan`
**Middleware:** `middleware.optional` (after public routes)

### Public Routes

| Method | Path | Description |
|---|---|---|
| GET | `/get-packages` | Tiered pricing plans |
| GET | `/total-price/:qty/:code?` | Calculate total price for qty calendars with optional promo code |

### Authenticated Routes

| Method | Path | Description |
|---|---|---|
| POST | `/add-subscription-plan` | Legacy: add plan |
| GET | `/get-subscription-plans` | List all plans (paginated) |
| GET | `/get-subscription-plan-enable-list` | Active plans |
| DELETE | `/delete-subscription-plan` | `?planId=` |
| PATCH | `/enable-disable-subscription-plan` | `?planId=` |
| GET | `/cancel-subscription` | Cancel Stripe subscription |
| GET | `/get-subscription-detail` | Current subscription info |
| POST | `/plans/` | Create Stripe plan |
| PATCH | `/plans/:id` | Update plan |
| DELETE | `/plans/:id` | Delete plan |

---

## 16. WEBSITE SETTINGS

**Router mount:** `/api/v1/website`
**Middleware:** `middleware.optional` (after public routes)

### Public Routes

| Method | Path | Description |
|---|---|---|
| GET | `/get-website-setting-by-name` | `?name=` salon name |
| GET | `/get-website-setting-by-salon` | `?salon=` salon ID |
| GET | `/get-website-stylist-by-name` | `?name=` salon name |
| GET | `/get-website-stylist-by-salon` | `?salon=` salon ID |
| POST | `/register-user` | Website user registration |
| POST | `/contact-us` | Contact form submission (sends email via SES) |
| PATCH | `/forgot-password` | Public password reset |

### Authenticated Routes

| Method | Path | Description |
|---|---|---|
| POST | `/add-website-setting` | Create/update website settings (multipart with multiple image fields) |
| GET | `/get-website-setting` | Get settings for authenticated salon |
| GET | `/get-website-setting-by-id` | `?salonId=` |
| POST | `/create-salon-from-website` | Full salon setup from website |
| GET | `/get-business-hour` | Business hours for salon |
| POST | `/user-delete-flag` | Flag user for deletion |
| POST | `/shop-flag` | Toggle shop visibility |

**Upload fields for `/add-website-setting`:**
- `websiteLogoImageURL`, `websiteBannerImageURL`, `appLogoImageURL`, `loginBackgroundImageURL`, `registerBackgroundImageURL`, `headerImageURL` (max 1 each)

---

## 17. APP SETTINGS

**Router mount:** `/api/v1/app`
**Middleware:** `middleware.optional`

### POST /api/v1/app/add-app-setting
- **Middleware:** Multiple file upload (appLogoImageURL, loginBackgroundImageURL, registerBackgroundImageURL, headerImageURL, shopHeaderImageURL, profileHeaderImageURL)
- **Body (multipart):** All WebsiteSetting fields + image files

### GET /api/v1/app/get-app-setting
### GET /api/v1/app/get-app-setting-by-id
- **Query:** `salonId: ObjectId`

---

## 18. SERVICE PHOTOS

**Router mount:** `/api/v1/service-photo`
**Middleware:** `middleware.optional`

### POST /api/v1/service-photo/add-service-photo
- **Middleware:** `uploadImage.single('image')`
- **Body (multipart):** `{ mainService, subService, image: File }`

### GET /api/v1/service-photo/get-service-photo-by-salon

---

## 19. VERSION

**Router mount:** `/api/v1/version`
**No auth middleware applied**

### POST /api/v1/version/add-version
- **Body:** `{ versionTitleIOS, versionTitleAndroid, isCompulsory, versionDescription, packageName, bundleID, salon? }`

### GET /api/v1/version/get-version
- **Query:** `pageNumber, pageSize`

### PATCH /api/v1/version/enable-disable-version
- **Query:** `versionId: ObjectId`
- **Body:** `{ enable: boolean }`

### DELETE /api/v1/version/delete-version
- **Query:** `versionId: ObjectId`

### GET /api/v1/version/get-enabled-version

---

## 20. GENERIC

**Router mount:** `/api/v1/generic`
**No auth middleware**

### GET /api/v1/generic/get-generic-data
- **Notes:** Returns app-level generic configuration data.

### PUT /api/v1/generic/upload-user-in-bulk
- **Middleware:** `uploadFile.single('file')` — .xlsx only
- **Body (multipart):** `{ salon: ObjectId, file: File (.xlsx) }`
- **Notes:** Parses Excel file, creates users and appointments in bulk via event emitter.

---

## 21. LOCALIZATION [unmerged: stripe-payment]

**Router mount:** `/api/v1/localization`

### GET /api/v1/localization/supported-languages
### GET /api/v1/localization/translations
- **Query:** `language: string`
### POST /api/v1/localization/add-localization
- **Body:** `{ key, translations: { [languageCode]: string } }`
### POST /api/v1/localization/bulk-add-localizations
- **Body:** `{ localizations: Array<{ key, translations }> }`

**Unrouted handlers (defined but not wired):** `updateLocalization`, `deleteLocalization`

---

## Real-Time Events (Socket.io)

### Connection Setup
```
const io = new Server(server, { allowEIO3: true, cors: { origin: true, methods: ['GET', 'POST'], credentials: true } })
```

**Handshake query params:**
- `id` — user ID
- `timezone` — user timezone
- `user` — user ID
- `stylist` — stylist ID
- `role` — user role
- `salon` — salon ID

### Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `connection` | server→client | `{}` | Fired on new connection |
| `online-users` | server→client | `{ onlineUsers: Array<{user, stylist, socketId, role, salon}> }` | Updated online user list |
| `test-message` | client→server | none | Test event |
| `first-appointment-booked` | client→server | `{ user: ObjectId }` | Triggers first appointment reward |
| `first-appointment-reward` | server→client (broadcast) | `[{ title, description, coins }, { title, description, coins, user_id }]` | Reward data for user + referrer |
| `first-login` | client→server | `{ user: ObjectId }` | Triggers first login reward |
| `firstLogin` | server→client (to sender) | `{ title, description, coins }` | Sign-up bonus data |
| `appointment-request` | server→client | `{ message, data, eventType }` | Sent when appointment is created/updated (to stylist + salon admin) |
| `complete-profile` | server→client | `{ title, description, coins }` | Sent when profile completion reward is earned |

---

## Database Models

### User
```typescript
{
  name: string (required),
  email: string (validated email),
  userName: string (validated email, used for login),
  phone: string,
  address: string,
  photo: string (CloudFront URL),
  photoKey: string,
  photoDark: string,
  photoKeyDark: string,
  role: 'admin' | 'salon' | 'stylist' | 'user' | 'manager' | 'superadmin',
  stylistCount: number,
  hash: string,
  salt: string,
  salon: ObjectId → User,
  stylist: ObjectId → User,
  passwordChangedAt: Date,
  active: boolean,
  gender: 'male' | 'female' | 'other',
  age: number,
  userDeviceID: string,
  dob: string,
  appMenu: object,
  packageName: string (default: 'io.thealgorithm.bookb'),
  appID: string,
  isSpecialApp: boolean,
  webUrl: string,
  services: ObjectId[] → Service,
  startTime: string,
  endTime: string,
  lunchStartTime: string,
  lunchEndTime: string,
  recurringType: 'week' | 'month' | 'year',
  intervalTime: string,
  isBreakTimeCompulsory: boolean,
  clientNote: string,
  shippingAddress: object,
  billingAddress: object,
  stripeCustomerID: string (select: false),
  stripeSubscriptionID: string (select: false),
  maxCalendar: number,
  subscription: Array<{ package, plan, startDate, packageExpiry, maxCalendar, active }>,
  cancel_at_period_end: boolean,
  platform: 'android' | 'ios' | 'web',
  deviceInfo: string,
  deviceId: string,
  accessToken: string,
  description: string,
  userNote: string,
  countryCode: string,
  currency: string,
  availableRole: any[],
  isMultiRole: boolean,
  addedFrom: 'bulk' | 'dashboard',
  referralCode: string,
  referredBy: string,
  coins: number,
  isFirstLogin: boolean,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### UserHistory (soft-delete archive)
Same as User + `deletedBy: 'self' | 'admin' | 'super-admin'`

### Appointment
```typescript
{
  dateAsAString: string,
  dateAsADate: Date,
  timeAsAString: string,
  timeAsADate: string,
  isUser: boolean,
  salon: ObjectId → User,
  stylist: ObjectId → User,
  user: ObjectId → User,
  availability: ObjectId → AppointmentAvailability,
  mainService: ObjectId → Service,
  subService: ObjectId → Service,
  userName: string,
  userEmail: string,
  userMobile: string,
  gender: 'male' | 'female' | 'other',
  comment: string,
  week: number,
  appointmentTimestamp: number,
  year: number,
  month: number,
  weekDay: string,
  date: number,
  offset: number,
  appointmentCompletedStatus: boolean,
  stylistConfirmationStatus: boolean,
  requiredDuration: number (default: 30),
  servicePhoto: ObjectId → ServicePhoto,
  status: 'available' | 'requested' | 'confirmed' | 'waiting' | 'canceled' | 'completed',
  appointmentId: string (e.g., '#1001'),
  createdAt/updatedAt: Date
}
```

### AppointmentAvailability
```typescript
{
  dateAsAString: string,
  dateAsADate: Date,
  isAvailable: boolean,
  salon: ObjectId → User,
  stylist: ObjectId → User,
  appointmentId: ObjectId → Appointment,
  week/year/month/date/offset: number,
  weekDay: string,
  timeData: Array<{
    timeAsAString: string,
    timeAsADate: string,
    isAvailable: boolean,
    slotStatus: 'available' | 'requested' | 'confirmed' | 'waiting' | 'canceled' | 'completed'
  }>,
  appointmentList: ObjectId[] → Appointment,
  isBusinessHour: boolean,
  startAppointment: Date
}
```

### BusinessHour
```typescript
{
  slots: Array<{ day: string, slot: Array<{ startTime: string, endTime: string }> }>,
  salon: ObjectId → User,
  stylist: ObjectId → User
}
```

### Service
```typescript
{
  title: string,
  description: string,
  charges: number,
  requiredTime: number (minutes),
  leadTime: number (minutes),
  breakTime: number (minutes),
  isMainService: boolean,
  enable: boolean,
  salon: ObjectId → User,
  service: ObjectId → Service (parent, for sub-services),
  rank: number
}
```

### Attendance
```typescript
{
  user: ObjectId → User,
  stylist: ObjectId → User,
  salon: ObjectId → User,
  checkInDate: Date,
  checkOutDate: Date,
  checkInDateString/checkOutDateString: string,
  checkInTimeString/checkOutTimeString: string,
  workOutMinute: number,
  isCheckedIn/isCheckedOut: boolean,
  offset: number,
  enable: boolean,
  checkInFrom: 'dashboard' | 'app',
  checkOutFrom: 'dashboard' | 'app',
  note: string
}
```

### Session
```typescript
{
  stylist: ObjectId → User,
  salon: ObjectId → User,
  session: number,
  sessionDate: Date,
  sessionDateString: string,
  offset: number,
  enable: boolean,
  sessionAddedBy: ObjectId → User,
  sessionAddedByRole: 'admin' | 'salon' | 'stylist' | 'salonadmin' | 'superadmin',
  week/year/month/date: number,
  weekDay: string
}
```

### Product
```typescript
{
  productName: string,
  productDescription: string,
  enable: boolean,
  productPrice: number,
  quantity: number,
  productCash: number,
  stock: number (auto-calculated from ProductStock),
  productImageURL: string,
  productImageKey: string,
  category: ObjectId → ProductCategory,
  salon: ObjectId → User,
  actualPrice: number,
  rating: number
}
```

### ProductCategory
```typescript
{
  categoryName: string,
  categoryImage: string,
  categoryThreshold: number (default: 5),
  enable: boolean,
  salon: ObjectId → User
}
```

### ProductOrder
```typescript
{
  orderStatus: 'Pending' | 'Completed' | 'Confirm' | 'Cancel',
  enable: boolean,
  totalAmount/amount/otherAmount: number,
  orderId: string,
  orderResponse: string,
  week/year/month/date: number,
  weekDay: string,
  orderType: 'by cash' | 'by RazorPay',
  items: object[],
  orderBy: ObjectId → User,
  salon: ObjectId → User,
  offset: number,
  shippingAddress: object,
  billingAddress: object
}
```

### ProductStock
```typescript
{
  enable: boolean,
  credit: number,
  debit: number,
  userReference: ObjectId → User,
  salon: ObjectId → User,
  category: ObjectId → ProductCategory,
  product: ObjectId → Product
}
```

### Video
```typescript
{
  enable: boolean,
  videoTitle: string,
  videoDescription: string,
  videoUrl: string (CloudFront),
  videoKey: string,
  videoThumbnailUrl: string,
  salon: ObjectId → User,
  stylist: ObjectId → User,
  likeCount/viewCount/shareCount/favoriteCount: number,
  uploadedBy: 'salon' | 'stylist',
  videoCategory: ObjectId → VideoCategory,
  analyticsType: 'view' | 'like' | 'favorite' | 'share'
}
```

### VideoCategory
```typescript
{ categoryName: string, categoryId: string, enable: boolean, salon: ObjectId → User }
```

### VideoAnalytics
```typescript
{
  salon/stylist/user: ObjectId → User,
  video: ObjectId → Video,
  analyticsType: 'view' | 'like' | 'favorite' | 'share',
  week: number,
  year: number
}
```

### Notification
```typescript
{
  title: string,
  body: string,
  data: object,
  response: object,
  enable: boolean,
  dateByOffset: string,
  entryAddedFrom: 'dashboard' | 'app',
  salon: ObjectId → User,
  sender/receiver: ObjectId → User,
  sendType: 'admin' | 'salon' | 'stylist' | 'user' | 'manager' | 'superadmin' | 'company',
  offset: number
}
```

### Coupon
```typescript
{
  title: string,
  description: string,
  code: string,
  enable: boolean,
  dateByOffset: string,
  isExpired: boolean,
  isAdmin: boolean,
  startDate: Date,
  expireDate: Date,
  discount: string,
  salon: ObjectId → User,
  stylist: ObjectId → User,
  offset: number
}
```

### SubscriptionPlan
```typescript
{
  productId: string (Stripe product ID, required),
  name: string,
  description: string,
  metadata: { calendars: number (required), users: number (required) },
  enable: boolean,
  dateByOffset: string,
  offset: number
}
```

### OTP
```typescript
{
  mobile: string,
  token: string (JWT),
  offset: number,
  createdAt: Date (TTL index: expires after 40 seconds)
}
```

### WebsiteSetting
Large schema with branding fields: logo URLs, banner URLs, text content, work hours, service containers, HOP containers, footer containers, login/register/header/shop/profile image URLs and text, type enum, enable flag, salon ref.

### CoinsHistory
```typescript
{
  userId: ObjectId → User,
  actionType: 'reference' | 'Sign-up' | 'first-appointment' | 'complete-profile',
  transactionType: 'added' | 'spent' | 'redeemed' | 'deducted',
  amount: number,
  coin: number,
  transactionDate: Date,
  description: string,
  currentBalance: number,
  referredUsedBy: ObjectId
}
```

### CoinSettings
```typescript
{
  userType: 'end-user' | 'salon' | 'stylist',
  actionType: 'referral' | 'login' | 'first-appointment' | 'review' | 'Sign-up' | 'complete-profile',
  coins: number (required),
  description: string,
  isDeleted: boolean,
  title: string,
  goalTarget: number (default: 1)
}
```

### DynamicFlags
```typescript
{ name: string (required), label: string (required), isEnabled: boolean, isDeleted: boolean }
```

### Version
```typescript
{
  versionTitleIOS: string,
  versionTitleAndroid: string,
  enable: boolean,
  isCompulsory: boolean,
  versionDescription: string,
  packageName: string (Play Store URL),
  bundleID: string (App Store URL),
  salon: ObjectId → User
}
```

### Webhook
```typescript
{ response: object, request: object }
```

### ServicePhoto
```typescript
{
  mainService: ObjectId → Service,
  subService: ObjectId → Service,
  enable: boolean,
  user/salon/stylist: ObjectId → User,
  imageUrl: string
}
```

---

## External Integrations

### 1. Stripe
- **SDK:** `stripe` (Node.js)
- **Secret key:** `process.env.stripeSecretKey`
- **Used in:**
  - `user.api.js` — `onBoardSignUp` (create customer, create subscription)
  - `user.api.js` — `onBoardCompelete` (retrieve plan)
  - `subscription-plan.api.js` — Plan CRUD, cancel subscription, pricing
- **Operations:** Customer creation, subscription creation/cancellation, plan retrieval, price listing

### 2. AWS S3
- **SDK:** `aws-sdk/clients/s3`
- **Bucket:** `process.env.AWS_BUCKET`
- **Region:** `process.env.AWS_REGION`
- **CloudFront URL:** `process.env.CLOUD_FRONT_URL`
- **Used for:** All image uploads (user photos, product images, service photos, salon settings) and video uploads

### 3. AWS SES (Simple Email Service)
- **SDK:** `aws-sdk/clients/ses`
- **Region:** `us-east-1` (hardcoded)
- **Used in:** `email-service.event.js`, `raw-email-service.event.js`
- **Triggers:** Password emails, appointment confirmations, contact form, password resets
- **BCC:** `yogesh@the-algo.com`, `anil@the-algo.com`

### 4. Twilio (SMS)
- **SDK:** `twilio`
- **Credentials:** `process.env.twilioAccountSid`, `process.env.twilioAuthToken`
- **From number:** `+17205730087`
- **Used for:** OTP delivery, forgot password, send-message endpoint

### 5. Firebase Cloud Messaging (FCM)
- **SDK:** `firebase-admin`
- **Credentials:** Hardcoded service account in `send-notification-function.js` (SECURITY ISSUE)
- **Project:** `bookb-production`
- **Used for:** Push notifications (appointment confirmations, status changes, rewards)
- **Methods:** `sendMulticast` (multiple tokens), `send` (single token), `send` (topic)

### 6. Prometheus Metrics
- **SDK:** `prom-client`
- **Endpoint:** `GET /metrics`
- **Metrics collected:** CPU usage, event loop lag, Node.js version, memory usage, active handlers, HTTP request duration histogram, HTTP response size histogram

---

## Identified Gaps & Issues

### Security Issues
1. **Firebase private key hardcoded** in `services/firebase/send-notification-function.js` — should be in environment variables
2. **Admin/superadmin seed credentials hardcoded** in `user.model.js` (`Admin@123`, `Teamwork@1234`)
3. **Most routes use `middleware.optional`** — many write operations (create, update, delete) don't strictly require authentication
4. **No rate limiting** on any endpoints (login, OTP, signup)
5. **All errors return HTTP 200** — makes it hard for clients to distinguish errors
6. **User input in regex** (`filterValue` used directly in `$regex`) — potential ReDoS vulnerability

### Missing Auth on Sensitive Routes
- `POST /salon/create-salon` — uses `middleware.optional`, should require admin role
- `DELETE /salon/delete-salon` — no role check
- `DELETE /stylist/delete-stylist` — no role check
- `DELETE /product/delete-product` — no role check
- Version routes — no auth at all
- All analytics/report routes under salon and stylist — public (no auth before route params)

### Missing Pagination/Filtering
- `GET /salon/get-enable-salon` — no pagination, returns all active salons
- `GET /stylist/get-enable-stylist` — no pagination
- `GET /salon/get-salon-menu-setting-by-token` — no pagination
- `GET /service/get-enable-main-service` — no pagination
- `GET /service/get-enable-sub-service` — no pagination
- `GET /notification/get-notification-for-user` — claimed to have pagination but implementation varies

### Missing CRUD Operations
- **CoinsHistory** — No direct API endpoints (only created via events). No endpoint to view transaction history (only via `getRewardInfo`)
- **CoinSettings** — No CRUD endpoints (only read internally). No admin UI to configure reward settings
- **BusinessHour** — No direct CRUD endpoints (managed through availability bulk creation). No way to read/update business hours independently
- **DynamicFlags** — Read-only endpoint (`getDynamicFlags`), no create/update/delete endpoints
- **UserHistory** — No endpoint to query soft-deleted users
- **Webhook** — Only test endpoints, no management API
- **ServicePhoto** — No delete or update endpoint

### Incomplete/Broken Endpoints
- `updateServices` in `stylist.api.js` uses `req.payload_id` (typo — should be `req.payload._id`)
- `raw-email-service.event.js` uses CommonJS `require()` while rest of codebase uses ES modules — likely broken
- Socket `onlineUsers` filter has bug: `onlineUsers.filter(user => user.userId !== user.userId)` always evaluates to false (comparing property to itself)
- `PUT /users/update-users-username` processes ALL users without pagination — will timeout on large datasets
- Several endpoints reference `req.body.timeData.timeAsAString` which may not be provided by all clients

### Missing Features for Mobile App
- No dedicated endpoint for user registration with OTP flow for salon-specific apps
- No endpoint to list all services + availability in one call (requires multiple requests)
- No appointment reschedule endpoint (must delete + create)
- No client-side search across salons
- No review/rating system endpoints (despite `rating` field on Product model)
- No push notification preference management
- No endpoint to manage user addresses
- No file/image deletion endpoint (S3 keys stored but no cleanup API)
- No health check endpoint
- Queue management endpoints completely absent (despite "Queue" being a listed feature domain)
