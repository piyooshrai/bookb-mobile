import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useAppointmentsByStylist } from '@/hooks/useAppointments';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';
import type { Appointment as ApiAppointment } from '@/api/types';

type Client = {
  id: string;
  name: string;
  initials: string;
  lastVisit: string;
  nextVisit: string | null;
  notes: string;
  visitCount: number;
  accentColor: string;
};

const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Sarah Mitchell',
    initials: 'SM',
    lastVisit: 'Feb 4, 2026',
    nextVisit: 'Feb 18, 2026',
    notes: 'Prefers layers, sensitive scalp. Uses sulfate-free products only. Always wants extra volume at the crown.',
    visitCount: 14,
    accentColor: '#7c3aed',
  },
  {
    id: 'c2',
    name: 'Olivia Chen',
    initials: 'OC',
    lastVisit: 'Feb 3, 2026',
    nextVisit: 'Mar 3, 2026',
    notes: 'Going platinum next visit. Currently at level 7 warm blonde. Needs Olaplex treatment before lightening further.',
    visitCount: 8,
    accentColor: '#0891b2',
  },
  {
    id: 'c3',
    name: 'Aisha Patel',
    initials: 'AP',
    lastVisit: 'Jan 28, 2026',
    nextVisit: null,
    notes: 'Thick, coarse hair. Prefers blunt cuts, no thinning shears. Allergic to PPD in hair dye - use PPD-free color only.',
    visitCount: 22,
    accentColor: '#c026d3',
  },
  {
    id: 'c4',
    name: 'Rachel Adams',
    initials: 'RA',
    lastVisit: 'Jan 21, 2026',
    nextVisit: 'Feb 14, 2026',
    notes: 'Keratin treatment every 8 weeks. Fine, frizzy hair. Wants to maintain her shoulder-length bob shape.',
    visitCount: 11,
    accentColor: '#059669',
  },
  {
    id: 'c5',
    name: 'Maya Rodriguez',
    initials: 'MR',
    lastVisit: 'Jan 15, 2026',
    nextVisit: null,
    notes: 'Loves curtain bangs. Natural curly pattern 3A. Wants to grow out previous color - doing gradual balayage transition.',
    visitCount: 6,
    accentColor: '#d97706',
  },
  {
    id: 'c6',
    name: 'Emma Thompson',
    initials: 'ET',
    lastVisit: 'Jan 10, 2026',
    nextVisit: 'Feb 12, 2026',
    notes: 'Blowout regular. Prefers large round brush technique. Sensitive to heat - keep dryer on medium setting.',
    visitCount: 31,
    accentColor: '#dc2626',
  },
  {
    id: 'c7',
    name: 'Hannah Brooks',
    initials: 'HB',
    lastVisit: 'Jan 7, 2026',
    nextVisit: null,
    notes: 'Bridal party prep in April. Wants trial updo in March. Going with champagne blonde highlights for the wedding.',
    visitCount: 4,
    accentColor: '#2563eb',
  },
  {
    id: 'c8',
    name: 'Nadia Petrov',
    initials: 'NP',
    lastVisit: 'Dec 20, 2025',
    nextVisit: 'Feb 20, 2026',
    notes: 'Vivid fashion colors - currently deep teal. Wants to shift to burgundy. Needs full bleach before color change.',
    visitCount: 9,
    accentColor: '#0d9488',
  },
];

const ACCENT_COLORS = ['#7c3aed', '#0891b2', '#c026d3', '#059669', '#d97706', '#dc2626', '#2563eb', '#0d9488'];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function buildClientsFromAppointments(appointments: ApiAppointment[]): Client[] {
  const clientMap = new Map<string, { name: string; visitCount: number; lastVisit: string; nextVisit: string | null }>();

  for (const apt of appointments) {
    const userId = typeof apt.user === 'object' ? (apt.user as any)?._id : apt.user;
    const userName = apt.userName || (typeof apt.user === 'object' ? (apt.user as any)?.name : '') || 'Client';
    if (!userId) continue;

    const existing = clientMap.get(userId);
    const dateStr = apt.dateAsAString || apt.createdAt || '';

    if (existing) {
      existing.visitCount += 1;
      // Keep most recent as last visit
      if (dateStr > existing.lastVisit) {
        existing.lastVisit = dateStr;
      }
    } else {
      clientMap.set(userId, {
        name: userName,
        visitCount: 1,
        lastVisit: dateStr,
        nextVisit: null,
      });
    }
  }

  // Convert to Client array
  let idx = 0;
  const clients: Client[] = [];
  for (const [id, info] of clientMap) {
    const formattedDate = info.lastVisit
      ? new Date(info.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '';
    clients.push({
      id,
      name: info.name,
      initials: getInitials(info.name),
      lastVisit: formattedDate,
      nextVisit: info.nextVisit,
      notes: '',
      visitCount: info.visitCount,
      accentColor: ACCENT_COLORS[idx % ACCENT_COLORS.length],
    });
    idx++;
  }

  // Sort by visit count descending
  clients.sort((a, b) => b.visitCount - a.visitCount);
  return clients;
}

export default function ClientNotesScreen() {
  const isDemo = useAuthStore((s) => s.isDemo);
  const stylistId = useAuthStore((s) => s.stylistId);

  const { data: apiData, isLoading } = useAppointmentsByStylist(
    { pageNumber: 1, pageSize: 200, stylistId: stylistId || undefined },
    !isDemo && !!stylistId,
  );

  const clients = useMemo(() => {
    if (isDemo || !apiData) return MOCK_CLIENTS;
    const rawResult = Array.isArray(apiData) ? apiData : (apiData as any)?.result ?? [];
    if (!Array.isArray(rawResult) || rawResult.length === 0) return MOCK_CLIENTS;
    const derived = buildClientsFromAppointments(rawResult);
    return derived.length > 0 ? derived : MOCK_CLIENTS;
  }, [isDemo, apiData]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Client Notes</Text>
        <Text style={styles.subtitle}>{clients.length} clients with notes</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {!isDemo && isLoading && (
          <ActivityIndicator size="small" color={colors.gold} style={{ marginVertical: 12 }} />
        )}

        {clients.map((client) => (
          <View key={client.id} style={styles.clientCard}>
            <View style={styles.clientTop}>
              {/* Avatar */}
              <View style={[styles.avatar, { backgroundColor: client.accentColor + '18' }]}>
                <Text style={[styles.avatarText, { color: client.accentColor }]}>{client.initials}</Text>
              </View>

              {/* Name & visit info */}
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <View style={styles.visitRow}>
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={12} r={10} stroke={colors.textTertiary} strokeWidth={2} />
                    <Line x1={12} y1={6} x2={12} y2={12} stroke={colors.textTertiary} strokeWidth={2} strokeLinecap="round" />
                    <Line x1={12} y1={12} x2={16} y2={14} stroke={colors.textTertiary} strokeWidth={2} strokeLinecap="round" />
                  </Svg>
                  <Text style={styles.lastVisit}>Last: {client.lastVisit}</Text>
                </View>
              </View>

              {/* Visit count badge */}
              <View style={styles.visitBadge}>
                <Text style={styles.visitBadgeNum}>{client.visitCount}</Text>
                <Text style={styles.visitBadgeLabel}>visits</Text>
              </View>
            </View>

            {/* Notes */}
            <View style={styles.notesSection}>
              <View style={styles.notesHeader}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M14 2v6h6" stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                  <Line x1={8} y1={13} x2={16} y2={13} stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" />
                  <Line x1={8} y1={17} x2={13} y2={17} stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" />
                </Svg>
                <Text style={styles.notesLabel}>Notes</Text>
              </View>
              <Text style={styles.notesText}>{client.notes}</Text>
            </View>

            {/* Next appointment */}
            {client.nextVisit && (
              <View style={styles.nextVisitRow}>
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Path d="M5 12h14M12 5l7 7-7 7" stroke={colors.gold} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.nextVisitText}>Next: {client.nextVisit}</Text>
              </View>
            )}
          </View>
        ))}

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
  bodyContent: { padding: 20, gap: 12 },
  // Client Card
  clientCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  clientTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 3,
  },
  visitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastVisit: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  visitBadge: {
    alignItems: 'center',
    backgroundColor: colors.warmGrey,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  visitBadgeNum: {
    fontFamily: fontFamilies.heading,
    fontSize: 16,
    color: colors.navy,
  },
  visitBadgeLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 9,
    color: colors.textTertiary,
    marginTop: 1,
  },
  // Notes
  notesSection: {
    backgroundColor: colors.warmGrey,
    borderRadius: 10,
    padding: 12,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  notesLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  notesText: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  // Next visit
  nextVisitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  nextVisitText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.gold,
  },
});
