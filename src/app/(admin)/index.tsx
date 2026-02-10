import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useAdminDashboard, useAdminSalonChart, useAdminSubscription } from '@/hooks/useReports';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const MOCK_PLATFORM_STATS = {
  totalSalons: 142,
  activeSalons: 128,
  totalUsers: 8420,
  totalStylists: 567,
  monthlyRevenue: 284600,
  activeSubscriptions: 118,
  newSignupsThisWeek: 12,
  appointmentsToday: 1843,
};

const MOCK_RECENT_SIGNUPS = [
  { id: '1', name: 'Glamour Studio', location: 'Brooklyn, NY', plan: 'Professional', date: '2 hrs ago' },
  { id: '2', name: 'Shears & Styles', location: 'Austin, TX', plan: 'Starter', date: '5 hrs ago' },
  { id: '3', name: 'Crown & Glory', location: 'Miami, FL', plan: 'Professional', date: '1 day ago' },
  { id: '4', name: 'The Hair Lab', location: 'Denver, CO', plan: 'Enterprise', date: '1 day ago' },
  { id: '5', name: 'Curl Culture', location: 'Atlanta, GA', plan: 'Starter', date: '2 days ago' },
];

const MOCK_TOP_SALONS = [
  { id: '1', name: 'Luxe Hair Studio', revenue: 24800, appointments: 342, rating: 4.9 },
  { id: '2', name: 'Bella Vita Salon', revenue: 21200, appointments: 298, rating: 4.8 },
  { id: '3', name: 'The Grooming Room', revenue: 18500, appointments: 276, rating: 4.7 },
  { id: '4', name: 'Urban Cuts', revenue: 15300, appointments: 245, rating: 4.6 },
];

const MOCK_PLAN_BREAKDOWN = [
  { plan: 'Starter', count: 42, color: colors.info },
  { plan: 'Professional', count: 58, color: colors.gold },
  { plan: 'Enterprise', count: 18, color: colors.navy },
  { plan: 'Trial', count: 24, color: colors.textTertiary },
];

export default function AdminDashboard() {
  const isDemo = useAuthStore((s) => s.isDemo);

  const { data: dashboardData, isLoading: dashboardLoading } = useAdminDashboard();
  const { data: salonChartData, isLoading: chartLoading } = useAdminSalonChart();
  const { data: subscriptionData, isLoading: subLoading } = useAdminSubscription();

  // Map API data to platform stats (fallback to mock when demo or no data)
  const platformStats = !isDemo && dashboardData
    ? {
        totalSalons: dashboardData.totalSalons ?? MOCK_PLATFORM_STATS.totalSalons,
        activeSalons: dashboardData.activeSalons ?? MOCK_PLATFORM_STATS.activeSalons,
        totalUsers: dashboardData.totalUsers ?? MOCK_PLATFORM_STATS.totalUsers,
        totalStylists: dashboardData.totalStylists ?? MOCK_PLATFORM_STATS.totalStylists,
        monthlyRevenue: dashboardData.monthlyRevenue ?? MOCK_PLATFORM_STATS.monthlyRevenue,
        activeSubscriptions: dashboardData.activeSubscriptions ?? MOCK_PLATFORM_STATS.activeSubscriptions,
        newSignupsThisWeek: dashboardData.newSignupsThisWeek ?? MOCK_PLATFORM_STATS.newSignupsThisWeek,
        appointmentsToday: dashboardData.appointmentsToday ?? MOCK_PLATFORM_STATS.appointmentsToday,
      }
    : MOCK_PLATFORM_STATS;

  // Map API subscription data to plan breakdown (fallback to mock when demo or no data)
  const planBreakdown = !isDemo && subscriptionData && Array.isArray(subscriptionData)
    ? subscriptionData.map((item: { plan: string; count: number }, i: number) => ({
        plan: item.plan ?? MOCK_PLAN_BREAKDOWN[i]?.plan ?? 'Unknown',
        count: item.count ?? 0,
        color: item.plan === 'Professional'
          ? colors.gold
          : item.plan === 'Enterprise'
            ? colors.navy
            : item.plan === 'Trial'
              ? colors.textTertiary
              : colors.info,
      }))
    : MOCK_PLAN_BREAKDOWN;

  // Map API salon chart data to top salons (fallback to mock when demo or no data)
  const topSalons = !isDemo && salonChartData && Array.isArray(salonChartData)
    ? salonChartData.map((salon: { _id?: string; name: string; revenue: number; appointments: number; rating: number }, i: number) => ({
        id: salon._id ?? String(i + 1),
        name: salon.name ?? 'Unknown',
        revenue: salon.revenue ?? 0,
        appointments: salon.appointments ?? 0,
        rating: salon.rating ?? 0,
      }))
    : MOCK_TOP_SALONS;

  // Recent signups always use mock data (no specific API endpoint for recent signups)
  const recentSignups = MOCK_RECENT_SIGNUPS;

  const isApiLoading = !isDemo && (dashboardLoading || chartLoading || subLoading);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>BookB Admin</Text>
        <Text style={styles.subtitle}>Platform overview</Text>
        <View style={styles.statsGrid}>
          {isApiLoading ? (
            <View style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}>
              <ActivityIndicator size="small" color={colors.gold} />
            </View>
          ) : (
            <>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{platformStats.totalSalons}</Text>
                <Text style={styles.statLabel}>Salons</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{(platformStats.totalUsers / 1000).toFixed(1)}k</Text>
                <Text style={styles.statLabel}>Users</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{platformStats.totalStylists}</Text>
                <Text style={styles.statLabel}>Stylists</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{(platformStats.appointmentsToday / 1000).toFixed(1)}k</Text>
                <Text style={styles.statLabel}>Appts Today</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Revenue Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Line x1={12} y1={1} x2={12} y2={23} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
                <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.cardTitle}>Platform Revenue</Text>
            </View>
            <Text style={styles.cardSub}>This month</Text>
          </View>
          <View style={styles.revenueRow}>
            <Text style={styles.revenueBig}>${(platformStats.monthlyRevenue / 1000).toFixed(1)}k</Text>
            <View style={styles.revenueMini}>
              <View style={styles.miniItem}>
                <View style={[styles.miniDot, { backgroundColor: colors.success }]} />
                <Text style={styles.miniText}>{platformStats.activeSubscriptions} active subs</Text>
              </View>
              <View style={styles.miniItem}>
                <View style={[styles.miniDot, { backgroundColor: colors.info }]} />
                <Text style={styles.miniText}>{platformStats.newSignupsThisWeek} new this week</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Subscription Breakdown */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Rect x={1} y={4} width={22} height={16} rx={2} stroke={colors.navy} strokeWidth={1.8} />
                <Line x1={1} y1={10} x2={23} y2={10} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              </Svg>
              <Text style={styles.cardTitle}>Plan Breakdown</Text>
            </View>
          </View>
          <View style={styles.planBar}>
            {planBreakdown.map((p) => (
              <View key={p.plan} style={[styles.planSegment, { flex: p.count, backgroundColor: p.color }]} />
            ))}
          </View>
          <View style={styles.planLegend}>
            {planBreakdown.map((p) => (
              <View key={p.plan} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: p.color }]} />
                <Text style={styles.legendText}>{p.plan} ({p.count})</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Signups */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx={8.5} cy={7} r={4} stroke={colors.navy} strokeWidth={1.8} />
                <Line x1={20} y1={8} x2={20} y2={14} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
                <Line x1={23} y1={11} x2={17} y2={11} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              </Svg>
              <Text style={styles.cardTitle}>Recent Signups</Text>
            </View>
          </View>
          {recentSignups.map((salon) => (
            <View key={salon.id} style={styles.signupRow}>
              <View style={styles.signupAvatar}>
                <Text style={styles.signupInitial}>{salon.name[0]}</Text>
              </View>
              <View style={styles.signupInfo}>
                <Text style={styles.signupName}>{salon.name}</Text>
                <Text style={styles.signupLocation}>{salon.location}</Text>
              </View>
              <View style={styles.signupRight}>
                <View style={[styles.planBadge, salon.plan === 'Enterprise' && styles.planEnterprise, salon.plan === 'Professional' && styles.planPro]}>
                  <Text style={[styles.planBadgeText, salon.plan === 'Enterprise' && styles.planEnterpriseText, salon.plan === 'Professional' && styles.planProText]}>
                    {salon.plan}
                  </Text>
                </View>
                <Text style={styles.signupDate}>{salon.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Top Performing Salons */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.cardTitle}>Top Salons</Text>
            </View>
            <Text style={styles.cardSub}>By revenue</Text>
          </View>
          {topSalons.map((salon, i) => (
            <View key={salon.id} style={styles.topRow}>
              <Text style={styles.topRank}>#{i + 1}</Text>
              <View style={styles.topInfo}>
                <Text style={styles.topName}>{salon.name}</Text>
                <Text style={styles.topMeta}>{salon.appointments} appts · {salon.rating} rating</Text>
              </View>
              <Text style={styles.topRevenue}>${(salon.revenue / 1000).toFixed(1)}k</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmGrey },
  header: { backgroundColor: colors.navy, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  title: { fontFamily: fontFamilies.heading, fontSize: 22, color: colors.textWhite, marginBottom: 4 },
  subtitle: { fontFamily: fontFamilies.body, fontSize: 13, color: '#a39e96', marginBottom: 20 },
  statsGrid: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, paddingVertical: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: fontFamilies.heading, fontSize: 18, color: colors.textWhite },
  statLabel: { fontFamily: fontFamilies.body, fontSize: 10, color: '#a39e96', marginTop: 2 },
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 16 },
  // Card
  card: { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontFamily: fontFamilies.bodySemiBold, fontSize: 15, color: colors.textPrimary },
  cardSub: { fontFamily: fontFamilies.body, fontSize: 12, color: colors.textTertiary },
  // Revenue
  revenueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 16, paddingBottom: 16 },
  revenueBig: { fontFamily: fontFamilies.heading, fontSize: 32, color: colors.textPrimary },
  revenueMini: { gap: 6 },
  miniItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniDot: { width: 6, height: 6, borderRadius: 3 },
  miniText: { fontFamily: fontFamilies.body, fontSize: 12, color: colors.textSecondary },
  // Plan breakdown
  planBar: { flexDirection: 'row', height: 8, marginHorizontal: 16, borderRadius: 4, overflow: 'hidden', gap: 2 },
  planSegment: { borderRadius: 4 },
  planLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: fontFamilies.body, fontSize: 12, color: colors.textSecondary },
  // Signups
  signupRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.borderLight },
  signupAvatar: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  signupInitial: { fontFamily: fontFamilies.bodySemiBold, fontSize: 14, color: colors.textWhite },
  signupInfo: { flex: 1, paddingLeft: 12 },
  signupName: { fontFamily: fontFamilies.bodyMedium, fontSize: 14, color: colors.textPrimary },
  signupLocation: { fontFamily: fontFamilies.body, fontSize: 12, color: colors.textTertiary, marginTop: 1 },
  signupRight: { alignItems: 'flex-end', gap: 4 },
  planBadge: { backgroundColor: colors.offWhite, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  planPro: { backgroundColor: 'rgba(196,151,61,0.12)' },
  planEnterprise: { backgroundColor: 'rgba(26,39,68,0.08)' },
  planBadgeText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 10, color: colors.textSecondary },
  planProText: { color: colors.goldDark },
  planEnterpriseText: { color: colors.navy },
  signupDate: { fontFamily: fontFamilies.body, fontSize: 11, color: colors.textTertiary },
  // Top salons
  topRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.borderLight },
  topRank: { fontFamily: fontFamilies.heading, fontSize: 16, color: colors.gold, width: 30 },
  topInfo: { flex: 1 },
  topName: { fontFamily: fontFamilies.bodyMedium, fontSize: 14, color: colors.textPrimary },
  topMeta: { fontFamily: fontFamilies.body, fontSize: 12, color: colors.textTertiary, marginTop: 1 },
  topRevenue: { fontFamily: fontFamilies.heading, fontSize: 16, color: colors.textPrimary },
});
