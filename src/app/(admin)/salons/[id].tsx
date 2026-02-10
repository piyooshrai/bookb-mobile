import { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useSalonList, useEnableDisableSalon, useDeleteSalon } from '@/hooks/useSalon';
import { User } from '@/api/types';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const MOCK_SALON_STATS = [
  { label: 'Stylists', value: '4' },
  { label: 'Appts/month', value: '284' },
  { label: 'Monthly Rev', value: '$8,420' },
  { label: 'Clients', value: '312' },
];

const MOCK_PERFORMANCE_METRICS = [
  { label: 'Conversion Rate', value: '73%' },
  { label: 'Retention Rate', value: '78%' },
  { label: 'Avg Ticket', value: '$89' },
];

export default function SalonDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isDemo = useAuthStore((s) => s.isDemo);

  // Fetch salon list and find the specific salon by id
  const { data: salonListData, isLoading } = useSalonList({
    pageNumber: 1,
    pageSize: 50,
  });

  const enableDisableMutation = useEnableDisableSalon();
  const deleteMutation = useDeleteSalon();

  // Find the specific salon from the list
  const apiSalon = !isDemo && salonListData?.result
    ? salonListData.result.find((u: User) => u._id === id)
    : null;

  // Map API data to display values (fallback to mock data)
  const salonName = apiSalon?.name || 'Luxe Hair Studio';
  const salonLocation = apiSalon?.address || '142 West 57th St, New York';
  const isActive = apiSalon ? apiSalon.active : true;
  const joinedDate = apiSalon?.createdAt
    ? `Joined ${new Date(apiSalon.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    : 'Joined Jan 2024';
  const planName = apiSalon?.subscription?.[0]?.plan || 'Professional';
  const ownerName = apiSalon?.name || 'John Mitchell';
  const ownerEmail = apiSalon?.email || 'john@luxehairstudio.com';
  const ownerPhone = apiSalon?.phone || '(212) 555-0142';

  const salonStats = apiSalon
    ? [
        { label: 'Stylists', value: String(apiSalon.stylistCount || 0) },
        { label: 'Appts/month', value: MOCK_SALON_STATS[1].value },
        { label: 'Monthly Rev', value: MOCK_SALON_STATS[2].value },
        { label: 'Clients', value: MOCK_SALON_STATS[3].value },
      ]
    : MOCK_SALON_STATS;

  const performanceMetrics = MOCK_PERFORMANCE_METRICS;

  const handleSuspendToggle = useCallback(() => {
    if (isDemo || !apiSalon) return;
    const action = isActive ? 'suspend' : 'enable';
    Alert.alert(
      `${isActive ? 'Suspend' : 'Enable'} Salon`,
      `Are you sure you want to ${action} ${salonName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: isActive ? 'destructive' : 'default',
          onPress: () => {
            enableDisableMutation.mutate(
              { userID: apiSalon._id, enable: !isActive },
              {
                onSuccess: () => Alert.alert('Success', `Salon ${action}d successfully.`),
                onError: () => Alert.alert('Error', `Failed to ${action} salon. Please try again.`),
              },
            );
          },
        },
      ],
    );
  }, [isDemo, apiSalon, isActive, salonName, enableDisableMutation]);

  if (!isDemo && isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M19 12H5" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M12 19l-7-7 7-7" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <Text style={styles.title}>Salon Detail</Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.gold} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M12 19l-7-7 7-7" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.title}>Salon Detail</Text>
        </View>
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Salon Info Card */}
        <View style={styles.card}>
          <View style={styles.salonHeaderRow}>
            <View style={styles.salonIcon}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M9 22V12h6v10" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <View style={styles.salonHeaderInfo}>
              <Text style={styles.salonName}>{salonName}</Text>
              <Text style={styles.salonLocation}>{salonLocation}</Text>
            </View>
          </View>
          <View style={styles.salonMetaRow}>
            <View style={[styles.statusBadge, !isActive && { backgroundColor: colors.errorLight }]}>
              <View style={[styles.statusDot, !isActive && { backgroundColor: colors.error }]} />
              <Text style={[styles.statusText, !isActive && { color: colors.errorDark }]}>{isActive ? 'Active' : 'Suspended'}</Text>
            </View>
            <Text style={styles.joinedText}>{joinedDate}</Text>
          </View>
        </View>

        {/* Plan Card */}
        <View style={styles.card}>
          <View style={styles.planHeaderRow}>
            <Text style={styles.cardTitle}>Subscription Plan</Text>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>{planName}</Text>
            </View>
          </View>
          <View style={styles.planDetailRow}>
            <Text style={styles.planLabel}>Monthly Fee</Text>
            <Text style={styles.planValue}>$79/month</Text>
          </View>
          <View style={styles.planDetailRow}>
            <Text style={styles.planLabel}>Next Billing</Text>
            <Text style={styles.planValue}>Feb 15, 2024</Text>
          </View>
          <View style={styles.planDetailRow}>
            <Text style={styles.planLabel}>Payment Status</Text>
            <View style={styles.paymentCurrentBadge}>
              <Text style={styles.paymentCurrentText}>Current</Text>
            </View>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Salon Stats</Text>
          <View style={styles.statsGrid}>
            {salonStats.map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Owner Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Owner Information</Text>
          <View style={styles.ownerRow}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.ownerValue}>{ownerName}</Text>
          </View>
          <View style={styles.ownerRow}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M22 6l-10 7L2 6" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.ownerValue}>{ownerEmail}</Text>
          </View>
          <View style={styles.ownerRow}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.ownerValue}>{ownerPhone}</Text>
          </View>
        </View>

        {/* Salon Performance */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Salon Performance</Text>
          {performanceMetrics.map((metric) => (
            <View key={metric.label} style={styles.perfRow}>
              <Text style={styles.perfLabel}>{metric.label}</Text>
              <Text style={styles.perfValue}>{metric.value}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionBtnNavy} activeOpacity={0.7}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M22 6l-10 7L2 6" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.actionBtnNavyText}>Contact Owner</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnGold} activeOpacity={0.7}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M12 20h9" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.actionBtnGoldText}>Change Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnRed} activeOpacity={0.7} onPress={handleSuspendToggle}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M4.93 4.93l14.14 14.14" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.actionBtnRedText}>{isActive ? 'Suspend Salon' : 'Enable Salon'}</Text>
          </TouchableOpacity>
        </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.frostedWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
  },
  body: { flex: 1 },
  bodyContent: { padding: 20 },

  // Cards
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 16,
  },

  // Salon Info
  salonHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  salonIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  salonHeaderInfo: {
    flex: 1,
  },
  salonName: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  salonLocation: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  salonMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.successDark,
  },
  joinedText: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textTertiary,
  },

  // Plan
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  planBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    color: colors.textWhite,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  planDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  planLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  planValue: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  paymentCurrentBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paymentCurrentText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.successDark,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statItem: {
    width: '47%',
    backgroundColor: colors.offWhite,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
  },

  // Owner
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  ownerValue: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },

  // Performance
  perfRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  perfLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  perfValue: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },

  // Actions
  actionsCard: {
    gap: 10,
    marginBottom: 32,
  },
  actionBtnNavy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.navy,
    backgroundColor: colors.white,
  },
  actionBtnNavyText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.navy,
  },
  actionBtnGold: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: colors.white,
  },
  actionBtnGoldText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.gold,
  },
  actionBtnRed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.error,
    backgroundColor: colors.white,
  },
  actionBtnRedText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.error,
  },
});
