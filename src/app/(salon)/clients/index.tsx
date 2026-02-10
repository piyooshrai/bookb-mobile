import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useDashboardAppointments } from '@/hooks/useAppointments';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface Client {
  id: string;
  name: string;
  lastVisit: string;
  totalVisits: number;
  totalSpend: number;
  phone: string;
}

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Sarah Mitchell', lastVisit: 'Feb 8, 2026', totalVisits: 24, totalSpend: 3420, phone: '(212) 555-0147' },
  { id: '2', name: 'Emma Thompson', lastVisit: 'Feb 7, 2026', totalVisits: 18, totalSpend: 2680, phone: '(646) 555-0231' },
  { id: '3', name: 'Olivia Chen', lastVisit: 'Feb 5, 2026', totalVisits: 31, totalSpend: 5840, phone: '(917) 555-0389' },
  { id: '4', name: 'Aisha Patel', lastVisit: 'Feb 3, 2026', totalVisits: 12, totalSpend: 1560, phone: '(347) 555-0412' },
  { id: '5', name: 'Rachel Adams', lastVisit: 'Jan 28, 2026', totalVisits: 9, totalSpend: 1890, phone: '(718) 555-0573' },
  { id: '6', name: 'Lauren Kim', lastVisit: 'Jan 25, 2026', totalVisits: 15, totalSpend: 2250, phone: '(212) 555-0694' },
  { id: '7', name: 'Megan Rivera', lastVisit: 'Jan 22, 2026', totalVisits: 7, totalSpend: 1120, phone: '(929) 555-0718' },
  { id: '8', name: 'Diana Foster', lastVisit: 'Jan 18, 2026', totalVisits: 22, totalSpend: 4180, phone: '(646) 555-0826' },
  { id: '9', name: 'Natalie Brooks', lastVisit: 'Jan 15, 2026', totalVisits: 5, totalSpend: 625, phone: '(917) 555-0953' },
  { id: '10', name: 'Priscilla Okafor', lastVisit: 'Jan 10, 2026', totalVisits: 11, totalSpend: 1870, phone: '(347) 555-0187' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ClientListScreen() {
  const router = useRouter();
  const isDemo = useAuthStore((s) => s.isDemo);
  const salonId = useAuthStore((s) => s.salonId);
  const [searchText, setSearchText] = useState('');

  // Derive clients from appointments data (no dedicated salon-scoped user list hook)
  const offset = new Date().getTimezoneOffset();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);

  const { data: appointmentsData, isLoading } = useDashboardAppointments(
    { salon: salonId || '', fromDate: thirtyDaysAgo, toDate: today, offset },
    !isDemo && !!salonId,
  );

  const displayClients: Client[] = useMemo(() => {
    if (isDemo || !appointmentsData) return MOCK_CLIENTS;
    const list = Array.isArray(appointmentsData) ? appointmentsData : appointmentsData.appointments || [];
    if (list.length === 0) return MOCK_CLIENTS;
    // Deduplicate by user id
    const clientMap = new Map<string, { name: string; visits: number; spend: number; lastDate: string; phone: string }>();
    list.forEach((apt: any) => {
      const userId = typeof apt.user === 'object' ? apt.user?._id : apt.user;
      if (!userId) return;
      const existing = clientMap.get(userId);
      const name = typeof apt.user === 'object' ? apt.user?.name : 'Client';
      const phone = typeof apt.user === 'object' ? (apt.user?.phone || '') : '';
      const price = typeof apt.mainService === 'object' ? (apt.mainService?.charges ?? 0) : 0;
      const dateStr = apt.dateAsAString || '';
      if (existing) {
        existing.visits += 1;
        existing.spend += price;
        if (dateStr > existing.lastDate) existing.lastDate = dateStr;
      } else {
        clientMap.set(userId, { name, visits: 1, spend: price, lastDate: dateStr, phone });
      }
    });
    return Array.from(clientMap.entries()).map(([id, c]) => ({
      id,
      name: c.name,
      lastVisit: c.lastDate ? new Date(c.lastDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      totalVisits: c.visits,
      totalSpend: c.spend,
      phone: c.phone,
    }));
  }, [isDemo, appointmentsData]);

  const filteredClients = searchText
    ? displayClients.filter((c) => c.name.toLowerCase().includes(searchText.toLowerCase()) || c.phone.includes(searchText))
    : displayClients;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Clients</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{displayClients.length}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Manage your client relationships</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
            <Circle cx={11} cy={11} r={8} stroke={colors.textTertiary} strokeWidth={1.8} />
            <Line x1={21} y1={21} x2={16.65} y2={16.65} stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" />
          </Svg>
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients by name or phone..."
            placeholderTextColor={colors.textTertiary}
            editable={true}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Client list */}
        {!isDemo && isLoading && (
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <ActivityIndicator size="small" color={colors.gold} />
          </View>
        )}
        {filteredClients.map((client) => (
          <TouchableOpacity key={client.id} style={styles.card} activeOpacity={0.7} onPress={() => router.push(`/(salon)/clients/${client.id}`)}>
            <View style={styles.cardRow}>
              {/* Avatar */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{client.name[0]}</Text>
              </View>

              {/* Info */}
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <View style={styles.clientMeta}>
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path d="M12 6v6l4 2" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                    <Circle cx={12} cy={12} r={10} stroke={colors.textTertiary} strokeWidth={1.6} />
                  </Svg>
                  <Text style={styles.lastVisitText}>Last visit {client.lastVisit}</Text>
                </View>
              </View>
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.statValue}>{client.totalVisits}</Text>
                <Text style={styles.statLabel}>visits</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Line x1={12} y1={1} x2={12} y2={23} stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" />
                  <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.statValue}>${client.totalSpend.toLocaleString()}</Text>
                <Text style={styles.statLabel}>spent</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.statValue}>{client.phone}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
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
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
  },
  countBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.textWhite,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
  },
  // Body
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 12 },
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  // Avatar
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
    fontSize: 18,
    color: colors.textWhite,
  },
  // Client info
  clientInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  clientName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  clientMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  lastVisitText: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statValue: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  statLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.borderLight,
    marginHorizontal: 8,
  },
  bottomSpacer: { height: 20 },
});
