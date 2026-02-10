import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const MOCK_TIMELINE = [
  { id: '1', time: '9:00 AM', client: 'Sarah Mitchell', service: 'Balayage + Trim', duration: '90 min', price: 185, status: 'completed' as const },
  { id: '2', time: '10:30 AM', client: 'Emma Thompson', service: 'Blowout', duration: '45 min', price: 65, status: 'completed' as const },
  { id: '3', time: '11:30 AM', client: 'Olivia Chen', service: 'Color Correction', duration: '120 min', price: 250, status: 'in-progress' as const },
  { id: '4', time: '1:30 PM', client: 'Aisha Patel', service: 'Haircut + Style', duration: '60 min', price: 95, status: 'upcoming' as const },
  { id: '5', time: '2:30 PM', client: 'Rachel Adams', service: 'Keratin Treatment', duration: '120 min', price: 220, status: 'upcoming' as const },
  { id: '6', time: '4:30 PM', client: 'Maya Rodriguez', service: 'Highlights', duration: '90 min', price: 175, status: 'upcoming' as const },
];

const MOCK_DAY_STATS = { totalBookings: 6, completed: 2, revenue: 250, nextBreak: '1:00 PM' };

export default function MyDayScreen() {
  const user = useAuthStore((s) => s.user);
  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] || 'Stylist';

  const nextApt = MOCK_TIMELINE.find((a) => a.status === 'in-progress') || MOCK_TIMELINE.find((a) => a.status === 'upcoming');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <View style={styles.dateChip}>
            <Text style={styles.dateText}>{formatToday()}</Text>
          </View>
        </View>
        <View style={styles.quickStats}>
          <View style={styles.qsItem}><Text style={styles.qsValue}>{MOCK_DAY_STATS.totalBookings}</Text><Text style={styles.qsLabel}>Bookings</Text></View>
          <View style={styles.qsDivider} />
          <View style={styles.qsItem}><Text style={styles.qsValue}>{MOCK_DAY_STATS.completed}</Text><Text style={styles.qsLabel}>Done</Text></View>
          <View style={styles.qsDivider} />
          <View style={styles.qsItem}><Text style={styles.qsValue}>${MOCK_DAY_STATS.revenue}</Text><Text style={styles.qsLabel}>Earned</Text></View>
          <View style={styles.qsDivider} />
          <View style={styles.qsItem}><Text style={styles.qsValue}>{MOCK_DAY_STATS.nextBreak}</Text><Text style={styles.qsLabel}>Break</Text></View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {nextApt && (
          <View style={styles.nextCard}>
            <View style={styles.nextHeader}>
              <Text style={styles.nextLabel}>{nextApt.status === 'in-progress' ? 'NOW' : 'NEXT UP'}</Text>
              <Text style={styles.nextTime}>{nextApt.time}</Text>
            </View>
            <Text style={styles.nextClient}>{nextApt.client}</Text>
            <Text style={styles.nextService}>{nextApt.service}</Text>
            <View style={styles.nextMeta}>
              <Text style={styles.nextDuration}>{nextApt.duration}</Text>
              <Text style={styles.nextPrice}>${nextApt.price}</Text>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={10} stroke={colors.navy} strokeWidth={1.8} />
                <Line x1={12} y1={6} x2={12} y2={12} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
                <Line x1={12} y1={12} x2={16} y2={14} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              </Svg>
              <Text style={styles.cardTitle}>Today's Timeline</Text>
            </View>
          </View>
          {MOCK_TIMELINE.map((apt, i) => (
            <View key={apt.id} style={styles.tlRow}>
              <View style={styles.tlLeft}>
                <View style={[styles.tlDot, apt.status === 'completed' && styles.dotDone, apt.status === 'in-progress' && styles.dotNow, apt.status === 'upcoming' && styles.dotNext]} />
                {i < MOCK_TIMELINE.length - 1 && <View style={styles.tlLine} />}
              </View>
              <View style={styles.tlContent}>
                <View style={styles.tlHead}>
                  <Text style={styles.tlTime}>{apt.time}</Text>
                  <View style={[styles.pill, apt.status === 'completed' && styles.pillDone, apt.status === 'in-progress' && styles.pillNow, apt.status === 'upcoming' && styles.pillNext]}>
                    <Text style={[styles.pillText, apt.status === 'completed' && styles.pillTextDone, apt.status === 'in-progress' && styles.pillTextNow, apt.status === 'upcoming' && styles.pillTextNext]}>
                      {apt.status === 'in-progress' ? 'In Progress' : apt.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.tlClient}>{apt.client}</Text>
                <Text style={styles.tlService}>{apt.service} · {apt.duration}</Text>
                <Text style={styles.tlPrice}>${apt.price}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatToday(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmGrey },
  header: { backgroundColor: colors.navy, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontFamily: fontFamilies.body, fontSize: 13, color: '#a39e96' },
  name: { fontFamily: fontFamilies.heading, fontSize: 24, color: colors.textWhite, marginTop: 2 },
  dateChip: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  dateText: { fontFamily: fontFamilies.bodyMedium, fontSize: 12, color: colors.goldLight },
  quickStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, paddingVertical: 16 },
  qsItem: { flex: 1, alignItems: 'center' },
  qsValue: { fontFamily: fontFamilies.heading, fontSize: 18, color: colors.textWhite },
  qsLabel: { fontFamily: fontFamilies.body, fontSize: 10, color: '#a39e96', marginTop: 2 },
  qsDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 16 },
  // Next card
  nextCard: { backgroundColor: colors.navy, borderRadius: 14, padding: 20 },
  nextHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  nextLabel: { fontFamily: fontFamilies.bodySemiBold, fontSize: 11, color: colors.gold, letterSpacing: 2 },
  nextTime: { fontFamily: fontFamilies.bodyMedium, fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  nextClient: { fontFamily: fontFamilies.heading, fontSize: 20, color: colors.textWhite, marginBottom: 4 },
  nextService: { fontFamily: fontFamilies.body, fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 12 },
  nextMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  nextDuration: { fontFamily: fontFamilies.body, fontSize: 13, color: colors.goldLight },
  nextPrice: { fontFamily: fontFamilies.heading, fontSize: 18, color: colors.textWhite },
  // Card
  card: { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontFamily: fontFamilies.bodySemiBold, fontSize: 15, color: colors.textPrimary },
  // Timeline
  tlRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 4 },
  tlLeft: { width: 24, alignItems: 'center' },
  tlDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2 },
  dotDone: { borderColor: colors.success, backgroundColor: colors.successLight },
  dotNow: { borderColor: colors.gold, backgroundColor: colors.warningLight },
  dotNext: { borderColor: colors.border, backgroundColor: colors.offWhite },
  tlLine: { width: 2, flex: 1, backgroundColor: colors.borderLight, marginVertical: 4 },
  tlContent: { flex: 1, paddingLeft: 12, paddingBottom: 20 },
  tlHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  tlTime: { fontFamily: fontFamilies.bodySemiBold, fontSize: 13, color: colors.textPrimary },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  pillDone: { backgroundColor: colors.successLight },
  pillNow: { backgroundColor: colors.warningLight },
  pillNext: { backgroundColor: colors.offWhite },
  pillText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 10, textTransform: 'capitalize' },
  pillTextDone: { color: colors.successDark },
  pillTextNow: { color: colors.warningDark },
  pillTextNext: { color: colors.textTertiary },
  tlClient: { fontFamily: fontFamilies.bodyMedium, fontSize: 14, color: colors.textPrimary },
  tlService: { fontFamily: fontFamilies.body, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  tlPrice: { fontFamily: fontFamilies.heading, fontSize: 14, color: colors.textPrimary, marginTop: 4 },
});
