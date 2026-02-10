import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useAdminDashboard } from '@/hooks/useReports';
import { useUsers } from '@/hooks/useAuth';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const MOCK_USER_MANAGEMENT_ROWS = [
  { label: 'Total Users', value: '8,420', badge: null as number | null },
  { label: 'Active Salons', value: '128', badge: null as number | null },
  { label: 'Pending Approvals', value: '3', badge: 3 as number | null },
];

export default function AdminConfigScreen() {
  const router = useRouter();
  const { logout, isDemo } = useAuthStore();

  const { data: dashboardData, isLoading: dashboardLoading } = useAdminDashboard();
  const { data: usersData, isLoading: usersLoading } = useUsers({ pageNumber: 1, pageSize: 1 });

  // Map API data to user management rows (fallback to mock when demo or no data)
  const userManagementRows = !isDemo && dashboardData
    ? [
        {
          label: 'Total Users',
          value: dashboardData.totalUsers != null
            ? Number(dashboardData.totalUsers).toLocaleString()
            : MOCK_USER_MANAGEMENT_ROWS[0].value,
          badge: null as number | null,
        },
        {
          label: 'Active Salons',
          value: dashboardData.activeSalons != null
            ? String(dashboardData.activeSalons)
            : MOCK_USER_MANAGEMENT_ROWS[1].value,
          badge: null as number | null,
        },
        {
          label: 'Pending Approvals',
          value: dashboardData.pendingApprovals != null
            ? String(dashboardData.pendingApprovals)
            : MOCK_USER_MANAGEMENT_ROWS[2].value,
          badge: dashboardData.pendingApprovals != null
            ? (dashboardData.pendingApprovals > 0 ? Number(dashboardData.pendingApprovals) : null)
            : MOCK_USER_MANAGEMENT_ROWS[2].badge,
        },
      ]
    : MOCK_USER_MANAGEMENT_ROWS;

  // Feature flag toggles
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newOnboarding, setNewOnboarding] = useState(true);
  const [betaFeatures, setBetaFeatures] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleLogout = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    router.replace('/(auth)/login');
  }, [logout, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuration</Text>
        <Text style={styles.subtitle}>Platform settings</Text>
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Platform Settings */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Platform Settings</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Name</Text>
            <Text style={styles.infoValue}>BookB</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.2.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>API Status</Text>
            <View style={styles.healthyBadge}>
              <View style={styles.healthyDot} />
              <Text style={styles.healthyText}>Healthy</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Server Region</Text>
            <Text style={styles.infoValue}>US East</Text>
          </View>
        </View>

        {/* User Management */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>User Management</Text>
          </View>
          {userManagementRows.map((row) => (
            <TouchableOpacity key={row.label} style={styles.navRow} activeOpacity={0.7}>
              <Text style={styles.navLabel}>{row.label}</Text>
              <View style={styles.navRight}>
                <Text style={styles.navValue}>{row.value}</Text>
                {row.badge !== null && (
                  <View style={styles.redBadge}>
                    <Text style={styles.redBadgeText}>{row.badge}</Text>
                  </View>
                )}
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path d="M9 18l6-6-6-6" stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feature Flags */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M4 22v-7" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Feature Flags</Text>
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Maintenance Mode</Text>
            <Switch
              value={maintenanceMode}
              onValueChange={setMaintenanceMode}
              trackColor={{ false: colors.borderLight, true: colors.gold }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>New Onboarding Flow</Text>
            <Switch
              value={newOnboarding}
              onValueChange={setNewOnboarding}
              trackColor={{ false: colors.borderLight, true: colors.gold }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Beta Features</Text>
            <Switch
              value={betaFeatures}
              onValueChange={setBetaFeatures}
              trackColor={{ false: colors.borderLight, true: colors.gold }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: colors.borderLight, true: colors.gold }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Commission Settings */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M12 1v22" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Commission Settings</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform Fee</Text>
            <Text style={styles.infoValueBold}>5%</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Processing</Text>
            <Text style={styles.infoValueBold}>2.9% + $0.30</Text>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerCard}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M12 9v4" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M12 17h.01" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
          </View>
          <TouchableOpacity style={styles.dangerBtn} activeOpacity={0.7}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M3 6h18" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.dangerBtnText}>Clear Cache</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dangerBtn} activeOpacity={0.7}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M1 4v6h6" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.dangerBtnText}>Reset Demo Data</Text>
          </TouchableOpacity>
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

  // Cards
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },

  // Info Rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  infoValueBold: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },

  // Healthy badge
  healthyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  healthyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  healthyText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.successDark,
  },

  // Navigation Rows
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  navLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navValue: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  redBadge: {
    backgroundColor: colors.error,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  redBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    color: colors.textWhite,
  },

  // Toggle Rows
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  toggleLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },

  // Danger Zone
  dangerCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.error,
    padding: 20,
    marginBottom: 16,
  },
  dangerTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.error,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    backgroundColor: colors.errorLight,
    marginBottom: 10,
  },
  dangerBtnText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.error,
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
