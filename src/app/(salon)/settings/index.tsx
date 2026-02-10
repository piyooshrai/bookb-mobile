import { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Menu items
// ---------------------------------------------------------------------------

interface MenuItem {
  label: string;
  route: string;
  icon: (color: string) => React.ReactNode;
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Staff Management',
    route: '/(salon)/settings/staff',
    icon: (c) => (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx={9} cy={7} r={4} stroke={c} strokeWidth={1.6} />
        <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
  },
  {
    label: 'Services & Pricing',
    route: '/(salon)/settings/services',
    icon: (c) => (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx={6} cy={6} r={3} stroke={c} strokeWidth={1.6} />
        <Path d="M8.12 8.12L12 12" stroke={c} strokeWidth={1.6} strokeLinecap="round" />
        <Circle cx={18} cy={18} r={3} stroke={c} strokeWidth={1.6} />
        <Path d="M15.88 15.88L12 12" stroke={c} strokeWidth={1.6} strokeLinecap="round" />
        <Line x1={20} y1={4} x2={8.12} y2={15.88} stroke={c} strokeWidth={1.6} strokeLinecap="round" />
      </Svg>
    ),
  },
  {
    label: 'Business Hours',
    route: '/(salon)/settings/hours',
    icon: (c) => (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={10} stroke={c} strokeWidth={1.6} />
        <Polyline points="12 6 12 12 16 14" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
  },
  {
    label: 'Products',
    route: '/(salon)/settings/products',
    icon: (c) => (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Line x1={12} y1={22.08} x2={12} y2={12} stroke={c} strokeWidth={1.6} strokeLinecap="round" />
      </Svg>
    ),
  },
  {
    label: 'Coupons & Offers',
    route: '/(salon)/settings/coupons',
    icon: (c) => (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Line x1={7} y1={7} x2={7.01} y2={7} stroke={c} strokeWidth={2} strokeLinecap="round" />
      </Svg>
    ),
  },
  {
    label: 'Attendance',
    route: '/(salon)/settings/attendance',
    icon: (c) => (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Rect x={8} y={2} width={8} height={4} rx={1} stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M9 14l2 2 4-4" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
  },
  {
    label: 'Subscription',
    route: '/(salon)/settings/subscription',
    icon: (c) => (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Rect x={1} y={4} width={22} height={16} rx={2} stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Line x1={1} y1={10} x2={23} y2={10} stroke={c} strokeWidth={1.6} strokeLinecap="round" />
      </Svg>
    ),
  },
  {
    label: 'Notifications',
    route: '/(salon)/settings/notifications',
    icon: (c) => (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SettingsHubScreen() {
  const router = useRouter();
  const { logout, isDemo } = useAuthStore();

  const handleLogout = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    router.replace('/(auth)/login');
  }, [logout, router]);

  const handleNavigate = useCallback(
    (route: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(route as any);
    },
    [router],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your salon</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Salon Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>LH</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Luxe Hair Studio</Text>
            <Text style={styles.profileAddress}>123 Mayfair Lane, London W1K 3QR</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
            <Text style={styles.editProfileLink}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Card */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.route}
              style={[styles.menuRow, index < MENU_ITEMS.length - 1 && styles.menuRowBorder]}
              onPress={() => handleNavigate(item.route)}
              activeOpacity={0.6}
            >
              <View style={styles.menuIconWrap}>{item.icon(colors.navy)}</View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M9 18l6-6-6-6" stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M16 17l5-5-5-5" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M21 12H9" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.logoutText}>{isDemo ? 'Exit Demo Mode' : 'Sign Out'}</Text>
        </TouchableOpacity>

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
  bodyContent: { padding: 20, gap: 16 },

  // Profile Card
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 16,
    color: colors.textWhite,
  },
  profileInfo: {
    flex: 1,
    paddingLeft: 14,
  },
  profileName: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  profileAddress: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  editProfileLink: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.gold,
  },

  // Menu Card
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 14,
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
