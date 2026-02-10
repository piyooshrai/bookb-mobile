import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

export default function Profile() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { logout, isDemo } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'DU';

  const handleLogout = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    router.replace('/(auth)/login');
  }, [logout, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.headerName}>{user?.name || 'Demo User'}</Text>
        <Text style={styles.headerEmail}>{user?.email || 'demo@bookb.app'}</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx={12} cy={7} r={4} stroke={colors.textSecondary} strokeWidth={1.8} />
            </Svg>
            <Text style={styles.cardTitle}>Profile Info</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{user?.name || 'Demo User'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email || 'demo@bookb.app'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user?.countryCode || '+44'} {user?.phone || '5551234567'}</Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{user?.address || '123 Demo Street'}</Text>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={3} stroke={colors.textSecondary} strokeWidth={1.8} />
              <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Preferences</Text>
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.toggleLabel}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.gold }}
              thumbColor={colors.white}
            />
          </View>
          <View style={[styles.toggleRow, styles.toggleRowLast]}>
            <View style={styles.toggleInfo}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={10} stroke={colors.textSecondary} strokeWidth={1.8} />
                <Polyline points="12 6 12 12 16 14" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.toggleLabel}>Reminders</Text>
            </View>
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              trackColor={{ false: colors.border, true: colors.gold }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Appointment History Summary */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.textSecondary} strokeWidth={1.8} />
              <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.textSecondary} strokeWidth={1.8} />
            </Svg>
            <Text style={styles.cardTitle}>Appointment History</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>total visits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Jan 2023</Text>
              <Text style={styles.statLabel}>member since</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$3,240</Text>
              <Text style={styles.statLabel}>total spent</Text>
            </View>
          </View>
        </View>

        {/* Rewards */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.gold} strokeWidth={1.8} />
              <Path d="M12 6v12M9 9.5c0-.83 1.34-1.5 3-1.5s3 .67 3 1.5S14.66 11 12 11s-3 .67-3 1.5 1.34 1.5 3 1.5 3-.67 3-1.5" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.cardTitle}>Rewards</Text>
          </View>
          <View style={styles.rewardsContent}>
            <View style={styles.rewardsRow}>
              <Text style={styles.rewardsLabel}>Coins Balance</Text>
              <View style={styles.coinsBadge}>
                <Text style={styles.coinsValue}>{user?.coins ?? 100} coins</Text>
              </View>
            </View>
            <View style={[styles.rewardsRow, styles.rewardsRowLast]}>
              <Text style={styles.rewardsLabel}>Referral Code</Text>
              <View style={styles.referralBadge}>
                <Text style={styles.referralCode}>DEMO2024</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} stroke={colors.textSecondary} strokeWidth={1.8} />
              <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Account</Text>
          </View>
          <TouchableOpacity style={styles.accountRow} activeOpacity={0.7}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} stroke={colors.textSecondary} strokeWidth={1.8} />
              <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.accountRowText}>Change Password</Text>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M9 18l6-6-6-6" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.accountRow, styles.accountRowLast]} activeOpacity={0.7}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Polyline points="3 6 5 6 21 6" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.accountRowTextDanger}>Delete Account</Text>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M9 18l6-6-6-6" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Logout / Exit Demo */}
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
    alignItems: 'center',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(196,151,61,0.2)',
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontFamily: fontFamilies.heading,
    fontSize: 26,
    color: colors.gold,
  },
  headerName: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
    marginBottom: 4,
  },
  headerEmail: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
  },
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
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  cardTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoValue: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },

  // Toggle rows
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  toggleRowLast: {
    borderBottomWidth: 0,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: 4,
  },

  // Rewards
  rewardsContent: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rewardsRowLast: {
    borderBottomWidth: 0,
  },
  rewardsLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  coinsBadge: {
    backgroundColor: 'rgba(196,151,61,0.12)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  coinsValue: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.gold,
  },
  referralBadge: {
    backgroundColor: colors.offWhite,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  referralCode: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
    letterSpacing: 1,
  },

  // Account rows
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  accountRowLast: {
    borderBottomWidth: 0,
  },
  accountRowText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  accountRowTextDanger: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.error,
    flex: 1,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
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
