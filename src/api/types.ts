// =============================================================================
// BookB Salon Management App - API Type Definitions
// All TypeScript interfaces matching the MongoDB models from the API spec.
// =============================================================================

// -----------------------------------------------------------------------------
// Base API Response
// -----------------------------------------------------------------------------

/** Base API response wrapper - backend returns HTTP 200 for everything */
export interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data?: T;
  code?: string;
}

export interface PaginatedData<T> {
  result: T[];
  totalPageSize: number;
}

// -----------------------------------------------------------------------------
// Enums / Union Types
// -----------------------------------------------------------------------------

export type UserRole =
  | 'admin'
  | 'superadmin'
  | 'salon'
  | 'stylist'
  | 'user'
  | 'manager';

export type Gender = 'male' | 'female' | 'other';

export type Platform = 'android' | 'ios' | 'web';

export type AppointmentStatus =
  | 'available'
  | 'requested'
  | 'confirmed'
  | 'waiting'
  | 'canceled'
  | 'completed';

export type OrderStatus = 'Pending' | 'Completed' | 'Confirm' | 'Cancel';

export type OrderType = 'by cash' | 'by RazorPay';

export type RecurringType = 'week' | 'month' | 'year' | 'custom';

export type AttendanceAction = 'checkIn' | 'checkOut';

export type AttendanceFrom = 'dashboard' | 'app';

export type CoinActionType =
  | 'reference'
  | 'Sign-up'
  | 'first-appointment'
  | 'complete-profile';

export type CoinTransactionType = 'added' | 'spent' | 'redeemed' | 'deducted';

export type NotificationSendType =
  | 'admin'
  | 'salon'
  | 'stylist'
  | 'user'
  | 'manager'
  | 'superadmin'
  | 'company';

export type VideoAnalyticsType = 'view' | 'like' | 'favorite' | 'share';

export type VideoUploadedBy = 'salon' | 'stylist';

export type WebsiteSettingType =
  | 'logo'
  | 'login'
  | 'register'
  | 'home'
  | 'video'
  | 'shop'
  | 'profile';

export type SessionAddedByRole =
  | 'admin'
  | 'salon'
  | 'stylist'
  | 'salonadmin'
  | 'superadmin';

// -----------------------------------------------------------------------------
// User Model
// -----------------------------------------------------------------------------

export interface User {
  _id: string;
  name: string;
  email: string;
  userName: string;
  phone: string;
  address: string;
  photo: string;
  photoKey: string;
  photoDark: string;
  photoKeyDark: string;
  role: UserRole;
  stylistCount: number;
  salon: string | User;
  stylist: string | User;
  passwordChangedAt: string;
  active: boolean;
  gender: Gender;
  age: number;
  userDeviceID: string;
  dob: string;
  appMenu: Record<string, unknown>;
  packageName: string;
  appID: string;
  isSpecialApp: boolean;
  webUrl: string;
  services: string[] | Service[];
  startTime: string;
  endTime: string;
  lunchStartTime: string;
  lunchEndTime: string;
  recurringType: RecurringType;
  intervalTime: string;
  isBreakTimeCompulsory: boolean;
  clientNote: string;
  shippingAddress: Record<string, unknown>;
  billingAddress: Record<string, unknown>;
  maxCalendar: number;
  subscription: SubscriptionEntry[];
  cancel_at_period_end: boolean;
  platform: Platform;
  deviceInfo: string;
  deviceId: string;
  accessToken: string;
  description: string;
  userNote: string;
  countryCode: string;
  currency: string;
  availableRole: UserRole[];
  isMultiRole: boolean;
  addedFrom: 'bulk' | 'dashboard';
  referralCode: string;
  referredBy: string;
  coins: number;
  isFirstLogin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionEntry {
  package: string;
  plan: string;
  startDate: string;
  packageExpiry: string;
  maxCalendar: number;
  active: boolean;
}

// -----------------------------------------------------------------------------
// Appointment Model
// -----------------------------------------------------------------------------

export interface Appointment {
  _id: string;
  dateAsAString: string;
  dateAsADate: string;
  timeAsAString: string;
  timeAsADate: string;
  isUser: boolean;
  salon: string | User;
  stylist: string | User;
  user: string | User;
  availability: string | AppointmentAvailability;
  mainService: string | Service;
  subService: string | Service;
  userName: string;
  userEmail: string;
  userMobile: string;
  gender: Gender;
  comment: string;
  week: number;
  appointmentTimestamp: number;
  year: number;
  month: number;
  weekDay: string;
  date: number;
  offset: number;
  appointmentCompletedStatus: boolean;
  stylistConfirmationStatus: boolean;
  requiredDuration: number;
  servicePhoto: string | ServicePhoto;
  status: AppointmentStatus;
  appointmentId: string;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Appointment Availability
// -----------------------------------------------------------------------------

export interface TimeSlot {
  timeAsAString: string;
  timeAsADate: string;
  isAvailable: boolean;
  slotStatus: AppointmentStatus;
  _id?: string;
}

export interface AppointmentAvailability {
  _id: string;
  dateAsAString: string;
  dateAsADate: string;
  isAvailable: boolean;
  salon: string | User;
  stylist: string | User;
  appointmentId: string | Appointment;
  week: number;
  year: number;
  month: number;
  date: number;
  offset: number;
  weekDay: string;
  timeData: TimeSlot[];
  appointmentList: string[] | Appointment[];
  isBusinessHour: boolean;
  startAppointment: string;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Business Hour
// -----------------------------------------------------------------------------

export interface BusinessHourSlot {
  startTime: string;
  endTime: string;
}

export interface BusinessHourDay {
  day: string;
  slot: BusinessHourSlot[];
}

export interface BusinessHour {
  _id: string;
  slots: BusinessHourDay[];
  salon: string | User;
  stylist: string | User;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Service
// -----------------------------------------------------------------------------

export interface Service {
  _id: string;
  title: string;
  description: string;
  charges: number;
  requiredTime: number;
  leadTime: number;
  breakTime: number;
  isMainService: boolean;
  enable: boolean;
  salon: string | User;
  service: string | Service;
  rank: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceGroup {
  mainService: Service;
  subServices: Service[];
}

// -----------------------------------------------------------------------------
// Product
// -----------------------------------------------------------------------------

export interface Product {
  _id: string;
  productName: string;
  productDescription: string;
  enable: boolean;
  productPrice: number;
  quantity: number;
  productCash: number;
  stock: number;
  productImageURL: string;
  productImageKey: string;
  category: string | ProductCategory;
  salon: string | User;
  actualPrice: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  _id: string;
  categoryName: string;
  categoryImage: string;
  categoryThreshold: number;
  enable: boolean;
  salon: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface ProductOrder {
  _id: string;
  orderStatus: OrderStatus;
  enable: boolean;
  totalAmount: number;
  amount: number;
  otherAmount: number;
  orderId: string;
  orderResponse: string;
  week: number;
  year: number;
  month: number;
  date: number;
  weekDay: string;
  orderType: OrderType;
  items: OrderItem[];
  orderBy: string | User;
  salon: string | User;
  offset: number;
  shippingAddress: Record<string, unknown>;
  billingAddress: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string | Product;
  quantity: number;
  price: number;
  productName?: string;
}

export interface ProductStock {
  _id: string;
  enable: boolean;
  credit: number;
  debit: number;
  userReference: string | User;
  salon: string | User;
  category: string | ProductCategory;
  product: string | Product;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Attendance
// -----------------------------------------------------------------------------

export interface Attendance {
  _id: string;
  user: string | User;
  stylist: string | User;
  salon: string | User;
  checkInDate: string;
  checkOutDate: string;
  checkInDateString: string;
  checkOutDateString: string;
  checkInTimeString: string;
  checkOutTimeString: string;
  workOutMinute: number;
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  offset: number;
  enable: boolean;
  checkInFrom: AttendanceFrom;
  checkOutFrom: AttendanceFrom;
  note: string;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Session
// -----------------------------------------------------------------------------

export interface Session {
  _id: string;
  stylist: string | User;
  salon: string | User;
  session: number;
  sessionDate: string;
  sessionDateString: string;
  offset: number;
  enable: boolean;
  sessionAddedBy: string | User;
  sessionAddedByRole: SessionAddedByRole;
  week: number;
  year: number;
  month: number;
  date: number;
  weekDay: string;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Notification
// -----------------------------------------------------------------------------

export interface Notification {
  _id: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  response: Record<string, unknown>;
  enable: boolean;
  dateByOffset: string;
  entryAddedFrom: 'dashboard' | 'app';
  salon: string | User;
  sender: string | User;
  receiver: string | User;
  sendType: NotificationSendType;
  offset: number;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Coupon
// -----------------------------------------------------------------------------

export interface Coupon {
  _id: string;
  title: string;
  description: string;
  code: string;
  enable: boolean;
  dateByOffset: string;
  isExpired: boolean;
  isAdmin: boolean;
  startDate: string;
  expireDate: string;
  discount: string;
  salon: string | User;
  stylist: string | User;
  offset: number;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Subscription Plan
// -----------------------------------------------------------------------------

export interface SubscriptionPlan {
  _id: string;
  productId: string;
  name: string;
  description: string;
  metadata: {
    calendars: number;
    users: number;
  };
  enable: boolean;
  dateByOffset: string;
  offset: number;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Video
// -----------------------------------------------------------------------------

export interface Video {
  _id: string;
  enable: boolean;
  videoTitle: string;
  videoDescription: string;
  videoUrl: string;
  videoKey: string;
  videoThumbnailUrl: string;
  salon: string | User;
  stylist: string | User;
  likeCount: number;
  viewCount: number;
  shareCount: number;
  favoriteCount: number;
  uploadedBy: VideoUploadedBy;
  videoCategory: string | VideoCategory;
  createdAt: string;
  updatedAt: string;
}

export interface VideoCategory {
  _id: string;
  categoryName: string;
  categoryId: string;
  enable: boolean;
  salon: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface VideoAnalytics {
  _id: string;
  salon: string | User;
  stylist: string | User;
  user: string | User;
  video: string | Video;
  analyticsType: VideoAnalyticsType;
  week: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// OTP
// -----------------------------------------------------------------------------

export interface OTP {
  _id: string;
  mobile: string;
  token: string;
  offset: number;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Website Setting
// -----------------------------------------------------------------------------

export interface WebsiteSetting {
  _id: string;
  websiteLogoImageURL: string;
  websiteBannerImageURL: string;
  appLogoImageURL: string;
  loginBackgroundImageURL: string;
  registerBackgroundImageURL: string;
  headerImageURL: string;
  shopHeaderImageURL: string;
  profileHeaderImageURL: string;
  type: WebsiteSettingType;
  enable: boolean;
  salon: string | User;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Coins
// -----------------------------------------------------------------------------

export interface CoinsHistory {
  _id: string;
  userId: string | User;
  actionType: CoinActionType;
  transactionType: CoinTransactionType;
  amount: number;
  coin: number;
  transactionDate: string;
  description: string;
  currentBalance: number;
  referredUsedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoinSettings {
  _id: string;
  userType: 'end-user' | 'salon' | 'stylist';
  actionType:
    | 'referral'
    | 'login'
    | 'first-appointment'
    | 'review'
    | 'Sign-up'
    | 'complete-profile';
  coins: number;
  description: string;
  isDeleted: boolean;
  title: string;
  goalTarget: number;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Dynamic Flags
// -----------------------------------------------------------------------------

export interface DynamicFlag {
  _id: string;
  name: string;
  label: string;
  isEnabled: boolean;
  isDeleted: boolean;
}

// -----------------------------------------------------------------------------
// Version
// -----------------------------------------------------------------------------

export interface Version {
  _id: string;
  versionTitleIOS: string;
  versionTitleAndroid: string;
  enable: boolean;
  isCompulsory: boolean;
  versionDescription: string;
  packageName: string;
  bundleID: string;
  salon: string | User;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Service Photo
// -----------------------------------------------------------------------------

export interface ServicePhoto {
  _id: string;
  mainService: string | Service;
  subService: string | Service;
  enable: boolean;
  user: string | User;
  salon: string | User;
  stylist: string | User;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Request / Response Types for Specific Endpoints
// =============================================================================

// -----------------------------------------------------------------------------
// Auth
// -----------------------------------------------------------------------------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  isFirstLogin: boolean;
  userid: string;
  role: UserRole;
}

export interface CheckMobileRequest {
  phone: string;
  countryCode: string;
}

export interface OtpVerificationRequest {
  phone: string;
  otp: number;
  packageName: string;
  platform: string;
  deviceInfo: string;
  deviceId: string;
}

export interface OtpVerificationResponse {
  token: string;
  role: UserRole;
  isFirstLogin: boolean;
}

export interface UserSignupRequest {
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  salon: string;
  countryCode: string;
  referralCode?: string;
}

export interface ChangeRoleRequest {
  role: UserRole;
}

export interface UpdateProfileRequest {
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  lunchStartTime?: string;
  lunchEndTime?: string;
}

// -----------------------------------------------------------------------------
// Appointments
// -----------------------------------------------------------------------------

export interface CreateAppointmentRequest {
  appointmentDate: string;
  timeData: {
    timeAsADate: string;
    timeAsAString: string;
    id: string;
  };
  salon?: string;
  stylistId?: string;
  email?: string;
  mobile?: string;
  name?: string;
  gender?: Gender;
  comment?: string;
  mainService: string;
  subService: string;
  availability?: string;
  servicePhoto?: string;
  requiredDuration: number;
  id?: string;
}

export interface GetAppointmentsRequest {
  salon?: string;
  stylistId?: string;
  status?: string;
  fromDate: string;
  toDate: string;
  offset: number;
}

export interface AvailableSlotsRequest {
  salon: string;
  stylistId: string;
  date: string;
}

export interface ChangeAppointmentStatusRequest {
  status: AppointmentStatus;
  availabilityId: string;
  timeDataId: string;
}

export interface ConfirmAppointmentRequest {
  appointmentId: string;
  availabilityId: string;
  timeDataId: string;
}

// -----------------------------------------------------------------------------
// Availability
// -----------------------------------------------------------------------------

export interface CreateAvailabilityRequest {
  dateArray: string[];
  timeArray: string[];
  id?: string;
}

export interface CreateBulkAvailabilityRequest {
  slots: BusinessHourDay[];
  id?: string;
  recurringType?: RecurringType;
  customStartDate?: string;
  customEndDate?: string;
}

export interface AvailabilityRangeRequest {
  stylistId: string;
  fromDate: string;
  toDate: string;
  salon?: string;
}

export interface TodayActivityRequest {
  stylistId: string;
  fromDate: string;
}

// -----------------------------------------------------------------------------
// Services
// -----------------------------------------------------------------------------

export interface CreateServiceRequest {
  title: string;
  description: string;
  charges: number;
  requiredTime: number;
  leadTime: number;
  breakTime: number;
  isMainService: boolean;
  salon?: string;
  service?: string;
  id?: string;
}

export interface RankUpdateRequest {
  services: Array<{ id: string; rank: number }>;
}

// -----------------------------------------------------------------------------
// Products
// -----------------------------------------------------------------------------

export interface CreateProductCategoryRequest {
  categoryName: string;
  categoryImage?: string;
  categoryThreshold?: number;
  id?: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  totalAmount: number;
  amount: number;
  otherAmount: number;
  orderType: OrderType;
  salon?: string;
  shippingAddress?: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
}

export interface AddStockRequest {
  product: string;
  credit: number;
  debit: number;
  userReference?: string;
  salon?: string;
  category?: string;
}

// -----------------------------------------------------------------------------
// Stylist
// -----------------------------------------------------------------------------

export interface StylistSettingsRequest {
  id: string;
  intervalTime: string;
  recurringType: string;
  startTime: string;
  endTime: string;
  services: string;
  isBreakTimeCompulsory: boolean;
}

export interface StylistNoteRequest {
  userNote: string;
}

// -----------------------------------------------------------------------------
// Attendance
// -----------------------------------------------------------------------------

export interface AttendanceRequest {
  stylistId: string;
  action: AttendanceAction;
  note?: string;
}

// -----------------------------------------------------------------------------
// Session
// -----------------------------------------------------------------------------

export interface AddSessionRequest {
  stylist: string;
  session: number;
  sessionDate: string;
  sessionDateString: string;
}

// -----------------------------------------------------------------------------
// Notifications
// -----------------------------------------------------------------------------

export interface SendNotificationRequest {
  title: string;
  body: string;
  salon?: string;
  sendType: NotificationSendType;
}

// -----------------------------------------------------------------------------
// Coupons
// -----------------------------------------------------------------------------

export interface CreateCouponRequest {
  title: string;
  description: string;
  code: string;
  startDate: string;
  expireDate: string;
  discount: string;
  salon?: string;
}

// -----------------------------------------------------------------------------
// Analytics
// -----------------------------------------------------------------------------

export interface AnalyticsItem {
  label: string;
  value: number;
  percentage?: number;
  trend?: 'up' | 'down';
}

export interface GenderReport {
  value: number;
  color: string;
  text: string;
}

export interface SalonAnalytics {
  appointments: AnalyticsItem;
  users: AnalyticsItem;
  services: AnalyticsItem;
  totalSales: AnalyticsItem;
}

export interface StylistDayAppointment {
  startTime: string;
  endTime: string;
  userName: string;
  service: string;
  availability: string;
  description: string;
  id: string;
  price: number;
  status: AppointmentStatus;
  timeDataId: string;
}

// -----------------------------------------------------------------------------
// Rewards
// -----------------------------------------------------------------------------

export interface RewardInfo {
  coinsHistory: CoinsHistory[];
  coinSettings: CoinSettings[];
  coins: number;
}

// -----------------------------------------------------------------------------
// Socket Events
// -----------------------------------------------------------------------------

export interface AppointmentRequestEvent {
  message: string;
  data: Appointment;
  eventType: string;
}

export interface OnlineUsersEvent {
  onlineUsers: Array<{
    user: string;
    stylist: string;
    socketId: string;
    role: UserRole;
    salon: string;
  }>;
}

export interface RewardEvent {
  title: string;
  description: string;
  coins: number;
  user_id?: string;
}

// -----------------------------------------------------------------------------
// Pagination
// -----------------------------------------------------------------------------

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  filterValue?: string;
}

// -----------------------------------------------------------------------------
// Subscription Plans
// -----------------------------------------------------------------------------

export interface PackagePlan {
  _id: string;
  name: string;
  price: number;
  calendars: number;
  users: number;
  features: string[];
}
