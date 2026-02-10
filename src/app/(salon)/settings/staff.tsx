import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useStylistsBySalon } from '@/hooks/useStylist';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface StaffMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  specialty: string;
  status: 'active' | 'on_break';
  appointmentsToday: number;
  revenue: number;
  enabled: boolean;
}

const INITIAL_STAFF: StaffMember[] = [
  { id: '1', name: 'Jessica R.', initials: 'JR', role: 'Senior Stylist', specialty: 'Color Specialist', status: 'active', appointmentsToday: 5, revenue: 620, enabled: true },
  { id: '2', name: 'Marcus T.', initials: 'MT', role: 'Stylist', specialty: 'Barbering & Fades', status: 'active', appointmentsToday: 3, revenue: 340, enabled: true },
  { id: '3', name: 'Priya S.', initials: 'PS', role: 'Junior Stylist', specialty: 'Styling & Blowouts', status: 'active', appointmentsToday: 4, revenue: 380, enabled: true },
  { id: '4', name: 'Liam K.', initials: 'LK', role: 'Stylist', specialty: 'Cuts & Treatments', status: 'on_break', appointmentsToday: 2, revenue: 290, enabled: true },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StaffManagementScreen() {
  const router = useRouter();
  const isDemo = useAuthStore((s) => s.isDemo);

  // --- API hook ---
  const { data: stylistsData, isLoading } = useStylistsBySalon();

  const apiStaff: StaffMember[] = useMemo(() => {
    if (isDemo || !stylistsData) return INITIAL_STAFF;
    const list = Array.isArray(stylistsData) ? stylistsData : (stylistsData as any)?.result || (stylistsData as any)?.users || (stylistsData as any)?.stylists || [];
    return list.map((s: any) => ({
      id: s._id || s.id,
      name: s.name || 'Staff',
      initials: (s.name || 'S').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
      role: s.description || 'Stylist',
      specialty: Array.isArray(s.services) && s.services.length > 0
        ? (typeof s.services[0] === 'object' ? s.services[0].title : 'General')
        : 'General',
      status: s.active !== false ? ('active' as const) : ('on_break' as const),
      appointmentsToday: 0,
      revenue: 0,
      enabled: s.active !== false,
    }));
  }, [isDemo, stylistsData]);

  const [staff, setStaff] = useState(INITIAL_STAFF);
  const displayStaff = !isDemo && apiStaff.length > 0 ? apiStaff : staff;

  const toggleStaff = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backButton}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M15 18l-6-6 6-6" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <View style={styles.headerTitleArea}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.title}>Staff</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{displayStaff.length} members</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>Manage your team members</Text>
          </View>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={() => router.push('/(salon)/settings/add-staff')}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M12 5v14M5 12h14" stroke={colors.navy} strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text style={styles.addButtonText}>Add Staff</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {!isDemo && isLoading && (
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <ActivityIndicator size="small" color={colors.gold} />
          </View>
        )}
        {displayStaff.map((member) => (
          <View key={member.id} style={[styles.card, !member.enabled && styles.cardDisabled]}>
            <View style={styles.cardTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{member.initials}</Text>
              </View>
              <View style={styles.memberInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <View style={[styles.statusBadge, member.status === 'active' ? styles.statusActive : styles.statusBreak]}>
                    <View style={[styles.statusDot, { backgroundColor: member.status === 'active' ? colors.success : colors.warning }]} />
                    <Text style={[styles.statusText, { color: member.status === 'active' ? colors.successDark : colors.warningDark }]}>
                      {member.status === 'active' ? 'Active' : 'On Break'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.memberRole}>{member.role}</Text>
                <Text style={styles.memberSpecialty}>{member.specialty}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreButton}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Circle cx={12} cy={5} r={1.5} fill={colors.textTertiary} />
                  <Circle cx={12} cy={12} r={1.5} fill={colors.textTertiary} />
                  <Circle cx={12} cy={19} r={1.5} fill={colors.textTertiary} />
                </Svg>
              </TouchableOpacity>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.cardBottom}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{member.appointmentsToday}</Text>
                <Text style={styles.statLabel}>Appts today</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>${member.revenue}</Text>
                <Text style={styles.statLabel}>Revenue</Text>
              </View>
              <View style={styles.toggleArea}>
                <Switch
                  value={member.enabled}
                  onValueChange={() => toggleStaff(member.id)}
                  trackColor={{ false: colors.border, true: colors.goldLight }}
                  thumbColor={member.enabled ? colors.gold : colors.textTertiary}
                />
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

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
    alignItems: 'flex-start',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  headerTitleArea: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countBadgeText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 11,
    color: colors.goldLight,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.gold,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 2,
  },
  addButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.navy,
  },
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 14 },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardDisabled: {
    opacity: 0.55,
  },
  cardTop: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textWhite,
  },
  memberInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  memberName: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusActive: { backgroundColor: colors.successLight },
  statusBreak: { backgroundColor: colors.warningLight },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  memberRole: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  memberSpecialty: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 1,
  },
  moreButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: 16,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  statValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 17,
    color: colors.textPrimary,
  },
  statLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderLight,
  },
  toggleArea: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
