import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useSalonList, useEnableDisableSalon } from '@/hooks/useSalon';
import { User } from '@/api/types';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const MOCK_SALONS = [
  {
    id: '1',
    name: 'Luxe Hair Studio',
    location: 'Manhattan, NY',
    plan: 'Enterprise',
    status: 'active' as const,
    stylists: 12,
    joinDate: 'Jan 15, 2025',
  },
  {
    id: '2',
    name: 'Bella Vita Salon',
    location: 'Beverly Hills, CA',
    plan: 'Professional',
    status: 'active' as const,
    stylists: 8,
    joinDate: 'Feb 3, 2025',
  },
  {
    id: '3',
    name: 'The Grooming Room',
    location: 'Chicago, IL',
    plan: 'Professional',
    status: 'active' as const,
    stylists: 6,
    joinDate: 'Mar 22, 2025',
  },
  {
    id: '4',
    name: 'Crown & Glory',
    location: 'Miami, FL',
    plan: 'Starter',
    status: 'suspended' as const,
    stylists: 3,
    joinDate: 'Apr 10, 2025',
  },
  {
    id: '5',
    name: 'Urban Cuts',
    location: 'Austin, TX',
    plan: 'Enterprise',
    status: 'active' as const,
    stylists: 15,
    joinDate: 'May 8, 2025',
  },
  {
    id: '6',
    name: 'Curl Culture',
    location: 'Atlanta, GA',
    plan: 'Starter',
    status: 'active' as const,
    stylists: 2,
    joinDate: 'Jun 19, 2025',
  },
  {
    id: '7',
    name: 'Shears & Styles',
    location: 'Portland, OR',
    plan: 'Professional',
    status: 'active' as const,
    stylists: 5,
    joinDate: 'Jul 1, 2025',
  },
  {
    id: '8',
    name: 'The Hair Lab',
    location: 'Denver, CO',
    plan: 'Starter',
    status: 'suspended' as const,
    stylists: 2,
    joinDate: 'Aug 14, 2025',
  },
];

const getPlanStyle = (plan: string) => {
  switch (plan) {
    case 'Enterprise':
      return { bg: 'rgba(26,39,68,0.08)', text: colors.navy };
    case 'Professional':
      return { bg: 'rgba(196,151,61,0.12)', text: colors.goldDark };
    default:
      return { bg: colors.offWhite, text: colors.textSecondary };
  }
};

const getStatusStyle = (status: string) => {
  if (status === 'active') {
    return { bg: colors.successLight, text: colors.successDark };
  }
  return { bg: colors.errorLight, text: colors.errorDark };
};

export default function SalonList() {
  const isDemo = useAuthStore((s) => s.isDemo);
  const [searchText, setSearchText] = useState('');

  const { data: salonListData, isLoading } = useSalonList({
    pageNumber: 1,
    pageSize: 50,
    filterValue: searchText || undefined,
  });

  const enableDisableMutation = useEnableDisableSalon();

  // Map API salon data to display format (demo → mock, non-demo → API data or empty)
  const salons = isDemo
    ? MOCK_SALONS
    : salonListData?.result
      ? salonListData.result.map((user: User) => ({
          id: user._id,
          name: user.name || 'Unknown Salon',
          location: user.address || 'No location',
          plan: user.subscription?.[0]?.plan || 'Starter',
          status: user.active ? ('active' as const) : ('suspended' as const),
          stylists: user.stylistCount || 0,
          joinDate: user.createdAt
            ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'N/A',
        }))
      : [];

  const activeSalons = salons.filter((s) => s.status === 'active').length;

  const handleToggleSalonStatus = useCallback((salonId: string, currentlyActive: boolean) => {
    const action = currentlyActive ? 'suspend' : 'enable';
    Alert.alert(
      `${currentlyActive ? 'Suspend' : 'Enable'} Salon`,
      `Are you sure you want to ${action} this salon?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: currentlyActive ? 'destructive' : 'default',
          onPress: () => {
            enableDisableMutation.mutate(
              { userID: salonId, enable: !currentlyActive },
              {
                onSuccess: () => Alert.alert('Success', `Salon ${action}d successfully.`),
                onError: () => Alert.alert('Error', `Failed to ${action} salon. Please try again.`),
              },
            );
          },
        },
      ],
    );
  }, [enableDisableMutation]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.title}>Salons</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{salons.length} total</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>{activeSalons} active · {salons.length - activeSalons} suspended</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
            <Circle cx={11} cy={11} r={8} stroke={colors.textTertiary} strokeWidth={2} />
            <Line x1={21} y1={21} x2={16.65} y2={16.65} stroke={colors.textTertiary} strokeWidth={2} strokeLinecap="round" />
          </Svg>
          <TextInput
            style={styles.searchInput}
            placeholder="Search salons by name or location..."
            placeholderTextColor={colors.textTertiary}
            editable={true}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Salon Cards */}
        {!isDemo && isLoading ? (
          <View style={{ paddingVertical: 32, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.gold} />
          </View>
        ) : salons.length === 0 ? (
          <View style={{ paddingVertical: 32, alignItems: 'center' }}>
            <Text style={{ fontFamily: fontFamilies.body, fontSize: 14, color: colors.textTertiary }}>No salons found</Text>
          </View>
        ) : (
          salons.map((salon) => {
            const planStyle = getPlanStyle(salon.plan);
            const statusStyle = getStatusStyle(salon.status);
            return (
              <TouchableOpacity
                key={salon.id}
                style={styles.card}
                activeOpacity={0.7}
                onLongPress={() => !isDemo && handleToggleSalonStatus(salon.id, salon.status === 'active')}
              >
                <View style={styles.cardTop}>
                  <View style={styles.salonAvatar}>
                    <Text style={styles.salonInitial}>{salon.name[0]}</Text>
                  </View>
                  <View style={styles.salonMain}>
                    <Text style={styles.salonName}>{salon.name}</Text>
                    <View style={styles.locationRow}>
                      <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                        <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={colors.textTertiary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        <Circle cx={12} cy={10} r={3} stroke={colors.textTertiary} strokeWidth={2} />
                      </Svg>
                      <Text style={styles.salonLocation}>{salon.location}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusStyle.text }]} />
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {salon.status.charAt(0).toUpperCase() + salon.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardBottom}>
                  <View style={styles.metaItem}>
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Rect x={2} y={7} width={20} height={14} rx={2} stroke={colors.textSecondary} strokeWidth={1.8} />
                      <Path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" />
                    </Svg>
                    <Text style={styles.metaText}>{salon.plan}</Text>
                    <View style={[styles.planDot, { backgroundColor: planStyle.text }]} />
                  </View>
                  <View style={styles.metaItem}>
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                      <Circle cx={8.5} cy={7} r={4} stroke={colors.textSecondary} strokeWidth={1.8} />
                      <Path d="M20 8v6" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" />
                      <Path d="M23 11h-6" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" />
                    </Svg>
                    <Text style={styles.metaText}>{salon.stylists} stylists</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.textSecondary} strokeWidth={1.8} />
                      <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" />
                      <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" />
                      <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" />
                    </Svg>
                    <Text style={styles.metaText}>{salon.joinDate}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 20 }} />
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
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  countBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.gold,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
  },
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 12 },
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 4,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textPrimary,
    padding: 0,
  },
  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  salonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  salonInitial: {
    fontFamily: fontFamilies.heading,
    fontSize: 16,
    color: colors.textWhite,
  },
  salonMain: {
    flex: 1,
    paddingLeft: 12,
  },
  salonName: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  salonLocation: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: 16,
  },
  cardBottom: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  planDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});
