import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useGeneralCount } from '@/hooks/useReports';
import { useSalonAnalytics } from '@/hooks/useSalon';
import { useDashboardAppointments } from '@/hooks/useAppointments';
import { useStylistsBySalon } from '@/hooks/useStylist';
import { useAppointmentMetrics } from '@/hooks/useAppointments';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Demo mock data
// ---------------------------------------------------------------------------

const MOCK_STATS = {
  todayRevenue: 1284,
  weekRevenue: 8420,
  todayAppointments: 12,
  completedToday: 7,
  cancelledToday: 1,
  activeStylists: 4,
  totalClients: 312,
  newClientsThisWeek: 8,
};

const MOCK_UPCOMING = [
  { id: '1', client: 'Sarah Mitchell', service: 'Balayage + Trim', stylist: 'Jessica', time: '11:30 AM', duration: '90 min', price: 185 },
  { id: '2', client: 'Emma Thompson', service: 'Blowout', stylist: 'Marcus', time: '12:00 PM', duration: '45 min', price: 65 },
  { id: '3', client: 'Olivia Chen', service: 'Color Correction', stylist: 'Jessica', time: '1:00 PM', duration: '120 min', price: 250 },
  { id: '4', client: 'Aisha Patel', service: 'Haircut + Style', stylist: 'Priya', time: '1:30 PM', duration: '60 min', price: 95 },
  { id: '5', client: 'Rachel Adams', service: 'Keratin Treatment', stylist: 'Liam', time: '2:00 PM', duration: '120 min', price: 220 },
];

const MOCK_STYLISTS = [
  { id: '1', name: 'Jessica R.', appointments: 5, revenue: 620, status: 'busy' as const },
  { id: '2', name: 'Marcus T.', appointments: 3, revenue: 340, status: 'available' as const },
  { id: '3', name: 'Priya S.', appointments: 4, revenue: 380, status: 'busy' as const },
  { id: '4', name: 'Liam K.', appointments: 2, revenue: 290, status: 'break' as const },
];

const MOCK_RECENT_ACTIVITY = [
  { id: '1', text: 'Sarah Mitchell checked in', time: '2 min ago' },
  { id: '2', text: 'New booking from Rachel Adams', time: '18 min ago' },
  { id: '3', text: 'Emma Thompson confirmed appointment', time: '25 min ago' },
  { id: '4', text: 'Payment received - $95.00 from Aisha Patel', time: '42 min ago' },
  { id: '5', text: 'Marcus T. went on break', time: '1 hr ago' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SalonDashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isDemo = useAuthStore((s) => s.isDemo);
  const salonId = useAuthStore((s) => s.salonId);

  // --- API hooks (only fire when NOT in demo mode) ---
  const todayStr = new Date().toISOString().slice(0, 10);
  const offset = new Date().getTimezoneOffset();

  const { data: generalCount, isLoading: loadingGeneral } = useGeneralCount();
  const { data: analytics, isLoading: loadingAnalytics } = useSalonAnalytics('monthly');
  const { data: appointmentsData, isLoading: loadingAppointments } = useDashboardAppointments(
    { salon: salonId || '', fromDate: todayStr, toDate: todayStr, offset },
    !isDemo && !!salonId,
  );
  const { data: stylistsData, isLoading: loadingStylists } = useStylistsBySalon();
  const metrics = useAppointmentMetrics(salonId || '');

  const isApiLoading = !isDemo && (loadingGeneral || loadingAnalytics || loadingAppointments || loadingStylists);

  // --- Map API data to display values ---
  const stats = useMemo(() => {
    if (isDemo || !generalCount) return MOCK_STATS;
    return {
      todayRevenue: generalCount.todayRevenue ?? MOCK_STATS.todayRevenue,
      weekRevenue: generalCount.weekRevenue ?? MOCK_STATS.weekRevenue,
      todayAppointments: generalCount.todayAppointments ?? MOCK_STATS.todayAppointments,
      completedToday: generalCount.completedToday ?? MOCK_STATS.completedToday,
      cancelledToday: generalCount.cancelledToday ?? MOCK_STATS.cancelledToday,
      activeStylists: generalCount.activeStylists ?? MOCK_STATS.activeStylists,
      totalClients: generalCount.totalClients ?? MOCK_STATS.totalClients,
      newClientsThisWeek: generalCount.newClientsThisWeek ?? MOCK_STATS.newClientsThisWeek,
    };
  }, [isDemo, generalCount]);

  const upcomingAppointments = useMemo(() => {
    if (isDemo || !appointmentsData) return MOCK_UPCOMING;
    const list = Array.isArray(appointmentsData) ? appointmentsData : appointmentsData.appointments || [];
    return list.slice(0, 5).map((apt: any) => ({
      id: apt._id || apt.id,
      client: typeof apt.user === 'object' ? apt.user?.name : 'Client',
      service: typeof apt.mainService === 'object' ? apt.mainService?.title : (typeof apt.subService === 'object' ? apt.subService?.title : 'Service'),
      stylist: typeof apt.stylist === 'object' ? apt.stylist?.name : 'Stylist',
      time: apt.timeAsAString || '',
      duration: apt.mainService?.requiredTime ? `${apt.mainService.requiredTime} min` : '60 min',
      price: typeof apt.mainService === 'object' ? (apt.mainService?.charges ?? 0) : 0,
    }));
  }, [isDemo, appointmentsData]);

  const staffList = useMemo(() => {
    if (isDemo || !stylistsData) return MOCK_STYLISTS;
    const list = Array.isArray(stylistsData) ? stylistsData : stylistsData.users || stylistsData.stylists || [];
    return list.slice(0, 6).map((s: any) => ({
      id: s._id || s.id,
      name: s.name || 'Staff',
      appointments: 0,
      revenue: 0,
      status: s.active !== false ? ('available' as const) : ('break' as const),
    }));
  }, [isDemo, stylistsData]);

  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] || 'Owner';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <TouchableOpacity style={styles.notifButton} activeOpacity={0.7}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={colors.textWhite} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={colors.textWhite} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        {/* Quick stats row */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>${stats.todayRevenue.toLocaleString()}</Text>
            <Text style={styles.quickStatLabel}>Today</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{stats.todayAppointments}</Text>
            <Text style={styles.quickStatLabel}>Appointments</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{stats.activeStylists}</Text>
            <Text style={styles.quickStatLabel}>Stylists</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {isApiLoading && (
          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <ActivityIndicator size="small" color={colors.gold} />
          </View>
        )}

        {/* Revenue Overview Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Line x1={12} y1={1} x2={12} y2={23} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
                <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.cardTitle}>Revenue Overview</Text>
            </View>
            <Text style={styles.cardSubtext}>This week</Text>
          </View>
          <View style={styles.revenueRow}>
            <View>
              <Text style={styles.revenueBig}>${stats.weekRevenue.toLocaleString()}</Text>
              <Text style={styles.revenueLabel}>Weekly total</Text>
            </View>
            <View style={styles.revenueMiniStats}>
              <View style={styles.revenueMiniItem}>
                <View style={[styles.revenueDot, { backgroundColor: colors.success }]} />
                <Text style={styles.revenueMiniText}>{stats.completedToday} completed</Text>
              </View>
              <View style={styles.revenueMiniItem}>
                <View style={[styles.revenueDot, { backgroundColor: colors.error }]} />
                <Text style={styles.revenueMiniText}>{stats.cancelledToday} cancelled</Text>
              </View>
              <View style={styles.revenueMiniItem}>
                <View style={[styles.revenueDot, { backgroundColor: colors.info }]} />
                <Text style={styles.revenueMiniText}>{stats.newClientsThisWeek} new clients</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
                <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
                <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              </Svg>
              <Text style={styles.cardTitle}>Upcoming Today</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(salon)/schedule/')} activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {upcomingAppointments.map((apt) => (
            <View key={apt.id} style={styles.appointmentRow}>
              <View style={styles.appointmentTime}>
                <Text style={styles.aptTimeText}>{apt.time}</Text>
                <Text style={styles.aptDuration}>{apt.duration}</Text>
              </View>
              <View style={styles.appointmentDetails}>
                <Text style={styles.aptClient}>{apt.client}</Text>
                <Text style={styles.aptService}>{apt.service}</Text>
                <Text style={styles.aptStylist}>with {apt.stylist}</Text>
              </View>
              <Text style={styles.aptPrice}>${apt.price}</Text>
            </View>
          ))}
        </View>

        {/* Staff Activity */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx={9} cy={7} r={4} stroke={colors.navy} strokeWidth={1.8} />
                <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.cardTitle}>Staff Activity</Text>
            </View>
          </View>
          {staffList.map((stylist) => (
            <View key={stylist.id} style={styles.stylistRow}>
              <View style={styles.stylistAvatar}>
                <Text style={styles.stylistInitial}>{stylist.name[0]}</Text>
              </View>
              <View style={styles.stylistInfo}>
                <Text style={styles.stylistName}>{stylist.name}</Text>
                <Text style={styles.stylistMeta}>{stylist.appointments} appts  ·  ${stylist.revenue}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                stylist.status === 'available' && styles.statusAvailable,
                stylist.status === 'busy' && styles.statusBusy,
                stylist.status === 'break' && styles.statusBreak,
              ]}>
                <Text style={[
                  styles.statusText,
                  stylist.status === 'available' && styles.statusTextAvailable,
                  stylist.status === 'busy' && styles.statusTextBusy,
                  stylist.status === 'break' && styles.statusTextBreak,
                ]}>
                  {stylist.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(salon)/schedule/new')}
            activeOpacity={0.7}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.gold} strokeWidth={1.8} />
              <Line x1={12} y1={8} x2={12} y2={16} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={8} y1={12} x2={16} y2={12} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.actionText}>New Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(salon)/clients/')}
            activeOpacity={0.7}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx={12} cy={7} r={4} stroke={colors.gold} strokeWidth={1.8} />
            </Svg>
            <Text style={styles.actionText}>Clients</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(salon)/pos/')}
            activeOpacity={0.7}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Rect x={1} y={4} width={22} height={16} rx={2} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Line x1={1} y1={10} x2={23} y2={10} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.actionText}>POS</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.cardTitle}>Recent Activity</Text>
            </View>
          </View>
          {MOCK_RECENT_ACTIVITY.map((activity) => (
            <View key={activity.id} style={styles.activityRow}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{activity.text}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmGrey },
  // Header
  header: {
    backgroundColor: colors.navy,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
  },
  name: {
    fontFamily: fontFamilies.heading,
    fontSize: 24,
    color: colors.textWhite,
    marginTop: 2,
  },
  notifButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    paddingVertical: 16,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    color: colors.textWhite,
  },
  quickStatLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: '#a39e96',
    marginTop: 2,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  // Body
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 16 },
  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  cardSubtext: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  seeAll: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.gold,
  },
  // Revenue
  revenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  revenueBig: {
    fontFamily: fontFamilies.heading,
    fontSize: 32,
    color: colors.textPrimary,
  },
  revenueLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  revenueMiniStats: {
    gap: 6,
  },
  revenueMiniItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  revenueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  revenueMiniText: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  // Appointments
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  appointmentTime: {
    width: 68,
  },
  aptTimeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  aptDuration: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  appointmentDetails: {
    flex: 1,
    paddingLeft: 8,
  },
  aptClient: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  aptService: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  aptStylist: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 1,
  },
  aptPrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 15,
    color: colors.textPrimary,
  },
  // Stylists
  stylistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  stylistAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stylistInitial: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textWhite,
  },
  stylistInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  stylistName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  stylistMeta: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusAvailable: { backgroundColor: colors.successLight },
  statusBusy: { backgroundColor: colors.infoLight },
  statusBreak: { backgroundColor: colors.warningLight },
  statusText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    textTransform: 'capitalize',
  },
  statusTextAvailable: { color: colors.successDark },
  statusTextBusy: { color: colors.infoDark },
  statusTextBreak: { color: colors.warningDark },
  // Quick actions
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 12,
    color: colors.textPrimary,
  },
  // Activity
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.goldLight,
    marginTop: 5,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textPrimary,
  },
  activityTime: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  bottomSpacer: { height: 20 },
});
