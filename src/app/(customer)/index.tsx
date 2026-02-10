import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useLatestAppointment, useAppointmentHistory } from '@/hooks/useAppointments';
import { useRewardInfo } from '@/hooks/useAuth';
import { useEnabledStylists } from '@/hooks/useStylist';
import { Appointment, User } from '@/api/types';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const MOCK_SALON = {
  name: 'Luxe Hair Studio',
  address: '142 West 57th St',
  phone: '(212) 555-0147',
  hours: 'Mon-Sat 9AM-7PM',
  rating: 4.9,
  reviews: 284,
};

const MOCK_UPCOMING = {
  date: 'Tomorrow',
  time: '10:30 AM',
  service: 'Balayage + Trim',
  stylist: 'Jessica R.',
  price: 185,
};

const MOCK_STYLIST = {
  name: 'Jessica R.',
  speciality: 'Color Specialist',
  nextAvailable: 'Today 3:00 PM',
  visits: 42,
};

const MOCK_RECENT_VISITS = [
  { id: '1', date: 'Jan 28, 2026', service: 'Balayage + Trim', stylist: 'Jessica R.', price: 185, status: 'Completed' },
  { id: '2', date: 'Jan 14, 2026', service: 'Blowout', stylist: 'Jessica R.', price: 45, status: 'Completed' },
  { id: '3', date: 'Dec 30, 2025', service: 'Keratin Treatment', stylist: 'Jessica R.', price: 220, status: 'Completed' },
];

function getStylistName(stylist: string | User | undefined): string {
  if (!stylist) return 'Stylist';
  if (typeof stylist === 'string') return 'Stylist';
  return stylist.name || 'Stylist';
}

function getServiceName(service: unknown): string {
  if (!service) return 'Service';
  if (typeof service === 'string') return 'Service';
  if (typeof service === 'object' && service !== null && 'title' in service) return (service as { title: string }).title;
  return 'Service';
}

function getServicePrice(service: unknown): number {
  if (!service) return 0;
  if (typeof service === 'object' && service !== null && 'charges' in service) return (service as { charges: number }).charges;
  return 0;
}

export default function CustomerHomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isDemo = useAuthStore((s) => s.isDemo);
  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] || 'there';

  // API hooks - disabled in demo mode
  const { data: latestAppt, isLoading: loadingAppt } = useLatestAppointment();
  const { data: rewardData } = useRewardInfo();
  const { data: historyData, isLoading: loadingHistory } = useAppointmentHistory(
    { pageNumber: 1, pageSize: 5 },
    !isDemo,
  );
  const { data: stylistsData } = useEnabledStylists();

  // Derive display data from API or mock fallback
  const coins = rewardData?.coins ?? user?.coins ?? 100;

  const salonUser = user?.salon && typeof user.salon === 'object' ? user.salon as User : null;
  const salon = !isDemo && salonUser ? {
    name: salonUser.name || MOCK_SALON.name,
    address: salonUser.address || MOCK_SALON.address,
    phone: salonUser.phone ? `${salonUser.countryCode || ''} ${salonUser.phone}` : MOCK_SALON.phone,
    hours: MOCK_SALON.hours,
    rating: MOCK_SALON.rating,
    reviews: MOCK_SALON.reviews,
  } : MOCK_SALON;

  const upcoming = !isDemo && latestAppt ? {
    id: latestAppt._id,
    date: latestAppt.dateAsAString || 'Upcoming',
    time: latestAppt.timeAsAString || '',
    service: getServiceName(latestAppt.subService || latestAppt.mainService),
    stylist: getStylistName(latestAppt.stylist),
    price: getServicePrice(latestAppt.subService || latestAppt.mainService),
  } : { ...MOCK_UPCOMING, id: 'appt-001' };

  const favStylist = !isDemo && stylistsData && stylistsData.length > 0 ? {
    name: stylistsData[0].name || MOCK_STYLIST.name,
    initial: (stylistsData[0].name || 'S').charAt(0),
    speciality: stylistsData[0].description || MOCK_STYLIST.speciality,
    nextAvailable: MOCK_STYLIST.nextAvailable,
    visits: MOCK_STYLIST.visits,
  } : { ...MOCK_STYLIST, initial: 'J' };

  const recentVisits = !isDemo && historyData?.result ? historyData.result.slice(0, 3).map((appt: Appointment) => ({
    id: appt._id,
    date: appt.dateAsAString || '',
    service: getServiceName(appt.subService || appt.mainService),
    stylist: getStylistName(appt.stylist),
    price: getServicePrice(appt.subService || appt.mainService),
    status: appt.status === 'completed' ? 'Completed' : appt.status === 'canceled' ? 'Cancelled' : 'Pending',
  })) : MOCK_RECENT_VISITS;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <View style={styles.coinsChip}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.gold} strokeWidth={2} />
              <Path d="M12 6v12M9 9.5c0-.83 1.34-1.5 3-1.5s3 .67 3 1.5S14.66 11 12 11s-3 .67-3 1.5 1.34 1.5 3 1.5 3-.67 3-1.5" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.coinsText}>{coins} coins</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* My Salon Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.salonAvatar}>
              <Text style={styles.salonInitial}>L</Text>
            </View>
            <View style={styles.salonHeaderInfo}>
              <Text style={styles.salonCardLabel}>MY SALON</Text>
              <Text style={styles.salonName}>{salon.name}</Text>
            </View>
          </View>
          <View style={styles.salonDetails}>
            <View style={styles.salonDetailRow}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx={12} cy={10} r={3} stroke={colors.textTertiary} strokeWidth={1.8} />
              </Svg>
              <Text style={styles.salonDetailText}>{salon.address}</Text>
            </View>
            <View style={styles.salonDetailRow}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.salonDetailText}>{salon.phone}</Text>
            </View>
            <View style={styles.salonDetailRow}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={10} stroke={colors.textTertiary} strokeWidth={1.8} />
                <Polyline points="12 6 12 12 16 14" stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.salonDetailText}>{salon.hours}</Text>
            </View>
            <View style={styles.salonDetailRow}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={colors.gold} stroke={colors.gold} strokeWidth={1} />
              </Svg>
              <Text style={styles.salonRatingText}>{salon.rating}</Text>
              <Text style={styles.salonReviewsText}>({salon.reviews} reviews)</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.bookNowButton}
            activeOpacity={0.7}
            onPress={() => router.push('/(customer)/book/')}
          >
            <Text style={styles.bookNowText}>BOOK NOW</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Appointment */}
        <View style={styles.upcomingCard}>
          <View style={styles.upcomingHeader}>
            <Text style={styles.upcomingLabel}>UPCOMING</Text>
            <Text style={styles.upcomingDate}>{upcoming.date} · {upcoming.time}</Text>
          </View>
          <Text style={styles.upcomingService}>{upcoming.service} with {upcoming.stylist}</Text>
          <View style={styles.upcomingFooter}>
            <Text style={styles.upcomingPrice}>${upcoming.price}</Text>
            <TouchableOpacity style={styles.manageButton} activeOpacity={0.7} onPress={() => router.push(`/(customer)/appointment/${upcoming.id}`)}>
              <Text style={styles.manageText}>Manage</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Your Stylist */}
        <View style={styles.card}>
          <View style={styles.stylistCardHeader}>
            <View style={styles.stylistAvatar}>
              <Text style={styles.stylistInitial}>{favStylist.initial || favStylist.name.charAt(0)}</Text>
            </View>
            <View style={styles.stylistInfo}>
              <Text style={styles.stylistName}>{favStylist.name}</Text>
              <Text style={styles.stylistSpeciality}>{favStylist.speciality}</Text>
            </View>
          </View>
          <View style={styles.stylistStatsRow}>
            <View style={styles.stylistStat}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={10} stroke={colors.textTertiary} strokeWidth={1.8} />
                <Polyline points="12 6 12 12 16 14" stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.stylistStatLabel}>Next available</Text>
              <Text style={styles.stylistStatValue}>{favStylist.nextAvailable}</Text>
            </View>
            <View style={styles.stylistStatDivider} />
            <View style={styles.stylistStat}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.textTertiary} strokeWidth={1.8} />
                <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" />
                <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" />
                <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.textTertiary} strokeWidth={1.8} />
              </Svg>
              <Text style={styles.stylistStatLabel}>Your visits</Text>
              <Text style={styles.stylistStatValue}>{favStylist.visits} visits</Text>
            </View>
          </View>
          <View style={styles.stylistActions}>
            <TouchableOpacity style={styles.stylistActionBtn} activeOpacity={0.7}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.stylistActionText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.stylistActionBtn, styles.stylistActionBtnPrimary]}
              activeOpacity={0.7}
              onPress={() => router.push('/(customer)/book/')}
            >
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.white} strokeWidth={1.8} />
                <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.white} strokeWidth={1.8} strokeLinecap="round" />
                <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.white} strokeWidth={1.8} strokeLinecap="round" />
                <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.white} strokeWidth={1.8} />
              </Svg>
              <Text style={styles.stylistActionTextPrimary}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Visits */}
        <View style={styles.card}>
          <View style={styles.recentHeader}>
            <Text style={styles.cardTitle}>Recent Visits</Text>
          </View>
          {recentVisits.map((visit, index) => (
            <View
              key={visit.id}
              style={[
                styles.visitRow,
                index > 0 && styles.visitRowBorder,
              ]}
            >
              <View style={styles.visitInfo}>
                <Text style={styles.visitService}>{visit.service}</Text>
                <Text style={styles.visitMeta}>{visit.date} · {visit.stylist}</Text>
              </View>
              <View style={styles.visitRight}>
                <Text style={styles.visitPrice}>${visit.price}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{visit.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(customer)/book/')}
            activeOpacity={0.7}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.gold} strokeWidth={1.8} />
              <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.actionText}>Book Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(customer)/rewards')}
            activeOpacity={0.7}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.gold} strokeWidth={1.8} />
              <Path d="M12 6v12M9 9.5c0-.83 1.34-1.5 3-1.5s3 .67 3 1.5S14.66 11 12 11s-3 .67-3 1.5 1.34 1.5 3 1.5 3-.67 3-1.5" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.actionText}>Rewards</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(customer)/shop/')}
            activeOpacity={0.7}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Rect x={4} y={8} width={16} height={14} rx={2} stroke={colors.gold} strokeWidth={1.8} />
              <Path d="M8 8V6a4 4 0 0 1 8 0v2" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.actionText}>Shop</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmGrey },
  header: {
    backgroundColor: colors.navy,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  coinsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(196,151,61,0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  coinsText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.gold,
  },
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 16 },

  // Card base
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  // My Salon Card
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  salonAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  salonInitial: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.textWhite,
  },
  salonHeaderInfo: {
    marginLeft: 12,
    flex: 1,
  },
  salonCardLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  salonName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 16,
    color: colors.textPrimary,
  },
  salonDetails: {
    paddingHorizontal: 16,
    gap: 8,
  },
  salonDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  salonDetailText: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  salonRatingText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.gold,
    marginLeft: 0,
  },
  salonReviewsText: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  bookNowButton: {
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  bookNowText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.white,
    letterSpacing: 2,
  },

  // Upcoming Appointment
  upcomingCard: {
    backgroundColor: colors.navy,
    borderRadius: 14,
    padding: 20,
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  upcomingLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 2,
  },
  upcomingDate: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  upcomingService: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.textWhite,
    marginBottom: 16,
  },
  upcomingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upcomingPrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
  },
  manageButton: {
    backgroundColor: 'rgba(196,151,61,0.2)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  manageText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.gold,
  },

  // Your Stylist
  stylistCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  stylistAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stylistInitial: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.navy,
  },
  stylistInfo: {
    marginLeft: 12,
    flex: 1,
  },
  stylistName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 15,
    color: colors.textPrimary,
  },
  stylistSpeciality: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  stylistStatsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  stylistStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  stylistStatDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: 12,
  },
  stylistStatLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
  },
  stylistStatValue: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.textPrimary,
    width: '100%',
    paddingLeft: 20,
  },
  stylistActions: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 4,
    gap: 10,
  },
  stylistActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  stylistActionBtnPrimary: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  stylistActionText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.navy,
  },
  stylistActionTextPrimary: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.white,
  },

  // Recent Visits
  recentHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  cardTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  visitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  visitRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  visitInfo: {
    flex: 1,
  },
  visitService: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  visitMeta: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  visitRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  visitPrice: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  statusBadge: {
    backgroundColor: colors.successLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    color: colors.successDark,
    letterSpacing: 0.5,
  },

  // Quick Actions
  actionsRow: { flexDirection: 'row', gap: 12 },
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
});
