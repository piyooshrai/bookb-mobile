import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

type Period = 'week' | 'month' | 'all';

const periodLabels: Record<Period, string> = {
  week: 'This Week',
  month: 'This Month',
  all: 'All Time',
};

const appointmentStatuses = [
  { label: 'Completed', count: 134, color: colors.success },
  { label: 'Cancelled', count: 8, color: colors.error },
  { label: 'No-show', count: 4, color: colors.warning },
  { label: 'Rescheduled', count: 10, color: colors.info },
];

const topServices = [
  { rank: 1, name: 'Balayage', bookings: 42, revenue: '$7,770' },
  { rank: 2, name: 'Haircut & Style', bookings: 38, revenue: '$2,470' },
  { rank: 3, name: 'Keratin Treatment', bookings: 28, revenue: '$6,160' },
  { rank: 4, name: 'Color Correction', bookings: 18, revenue: '$4,500' },
  { rank: 5, name: 'Blowout', bookings: 30, revenue: '$1,350' },
];

const miniStats = [
  { label: 'Clients served', value: '89' },
  { label: 'Avg Rating', value: '4.9' },
  { label: 'Appointments', value: '156' },
];

export default function MyStatsScreen() {
  const router = useRouter();
  const { logout, isDemo } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');

  const handleLogout = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    router.replace('/(auth)/login');
  }, [logout, router]);

  const handlePeriodChange = useCallback(async (period: Period) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPeriod(period);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Stats</Text>
        <Text style={styles.subtitle}>Performance overview</Text>
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Period Selector */}
        <View style={styles.periodRow}>
          {(Object.keys(periodLabels) as Period[]).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodTab,
                selectedPeriod === period && styles.periodTabActive,
              ]}
              onPress={() => handlePeriodChange(period)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodTabText,
                  selectedPeriod === period && styles.periodTabTextActive,
                ]}
              >
                {periodLabels[period]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Earnings Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Earnings</Text>
          <Text style={styles.earningsAmount}>$2,840</Text>
          <Text style={styles.earningsPeriod}>this month</Text>
          <View style={styles.comparisonRow}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M18 15l-6-6-6 6" stroke={colors.success} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.comparisonText}>+12% vs last month</Text>
          </View>
        </View>

        {/* Mini Stats Row */}
        <View style={styles.miniStatsRow}>
          {miniStats.map((stat) => (
            <View key={stat.label} style={styles.miniStatCard}>
              <Text style={styles.miniStatValue}>{stat.value}</Text>
              <Text style={styles.miniStatLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Appointments by Status */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Appointments by Status</Text>
          {appointmentStatuses.map((status) => (
            <View key={status.label} style={styles.statusRow}>
              <View style={styles.statusLeft}>
                <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                <Text style={styles.statusLabel}>{status.label}</Text>
              </View>
              <Text style={styles.statusCount}>{status.count}</Text>
            </View>
          ))}
        </View>

        {/* Top Services */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Services</Text>
          {topServices.map((service) => (
            <View key={service.rank} style={styles.serviceRow}>
              <View style={styles.serviceRankBadge}>
                <Text style={styles.serviceRankText}>{service.rank}</Text>
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDetail}>
                  {service.bookings} bookings
                </Text>
              </View>
              <Text style={styles.serviceRevenue}>{service.revenue}</Text>
            </View>
          ))}
        </View>

        {/* Client Retention */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Client Retention</Text>
          <Text style={styles.retentionValue}>78% return rate</Text>
          <View style={styles.retentionBarBg}>
            <View style={styles.retentionBarFill} />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M16 17l5-5-5-5" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M21 12H9" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.logoutText}>
            {isDemo ? 'Exit Demo Mode' : 'Sign Out'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
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
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
  },
  body: { flex: 1 },
  bodyContent: { padding: 20 },

  // Period Selector
  periodRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginBottom: 16,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  periodTabActive: {
    backgroundColor: colors.navy,
  },
  periodTabText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  periodTabTextActive: {
    color: colors.textWhite,
  },

  // Cards
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 16,
  },
  cardLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 16,
  },

  // Earnings
  earningsAmount: {
    fontFamily: fontFamilies.heading,
    fontSize: 36,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  earningsPeriod: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  comparisonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.success,
  },

  // Mini Stats
  miniStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  miniStatCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
  },
  miniStatValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  miniStatLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Appointment Status
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  statusCount: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },

  // Top Services
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  serviceRankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceRankText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  serviceDetail: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  serviceRevenue: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.gold,
  },

  // Client Retention
  retentionValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  retentionBarBg: {
    height: 10,
    backgroundColor: colors.offWhite,
    borderRadius: 5,
    overflow: 'hidden',
  },
  retentionBarFill: {
    width: '78%',
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 5,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 32,
    paddingVertical: 16,
    backgroundColor: colors.errorLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.15)',
  },
  logoutText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.error,
  },
});
