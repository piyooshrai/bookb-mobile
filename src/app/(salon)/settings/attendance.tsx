import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface StaffAttendance {
  id: string;
  name: string;
  initials: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'working' | 'lunch' | 'not_checked_in';
  note?: string;
}

const TODAY_ATTENDANCE: StaffAttendance[] = [
  { id: '1', name: 'Jessica R.', initials: 'JR', checkIn: '8:45 AM', checkOut: null, status: 'working' },
  { id: '2', name: 'Marcus T.', initials: 'MT', checkIn: '9:02 AM', checkOut: null, status: 'working' },
  { id: '3', name: 'Priya S.', initials: 'PS', checkIn: '9:15 AM', checkOut: null, status: 'lunch', note: 'Lunch 12:00 - 1:00' },
  { id: '4', name: 'Liam K.', initials: 'LK', checkIn: null, checkOut: null, status: 'not_checked_in' },
];

interface DaySummary {
  date: string;
  dayName: string;
  present: number;
  absent: number;
  total: number;
}

const HISTORY: DaySummary[] = [
  { date: 'Feb 9', dayName: 'Sun', present: 0, absent: 4, total: 4 },
  { date: 'Feb 8', dayName: 'Sat', present: 4, absent: 0, total: 4 },
  { date: 'Feb 7', dayName: 'Fri', present: 4, absent: 0, total: 4 },
  { date: 'Feb 6', dayName: 'Thu', present: 3, absent: 1, total: 4 },
  { date: 'Feb 5', dayName: 'Wed', present: 4, absent: 0, total: 4 },
  { date: 'Feb 4', dayName: 'Tue', present: 4, absent: 0, total: 4 },
  { date: 'Feb 3', dayName: 'Mon', present: 3, absent: 1, total: 4 },
];

function getStatusColor(status: StaffAttendance['status']): string {
  switch (status) {
    case 'working':
      return colors.success;
    case 'lunch':
      return colors.warning;
    case 'not_checked_in':
      return colors.textTertiary;
  }
}

function getStatusLabel(status: StaffAttendance['status']): string {
  switch (status) {
    case 'working':
      return 'Working';
    case 'lunch':
      return 'Lunch break';
    case 'not_checked_in':
      return 'Not checked in';
  }
}

const todayFormatted = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AttendanceScreen() {
  const router = useRouter();

  const presentCount = TODAY_ATTENDANCE.filter((s) => s.status !== 'not_checked_in').length;
  const totalCount = TODAY_ATTENDANCE.length;

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
          <View>
            <Text style={styles.title}>Attendance</Text>
            <Text style={styles.subtitle}>{todayFormatted}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Today's Status Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              <Rect x={8} y={2} width={8} height={4} rx={1} stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Today's Status</Text>
          </View>
          {TODAY_ATTENDANCE.map((staff, index) => (
            <View key={staff.id} style={[styles.staffRow, index < TODAY_ATTENDANCE.length - 1 && styles.staffRowBorder]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{staff.initials}</Text>
              </View>
              <View style={styles.staffInfo}>
                <Text style={styles.staffName}>{staff.name}</Text>
                {staff.checkIn ? (
                  <Text style={styles.staffTime}>Checked in {staff.checkIn}</Text>
                ) : (
                  <Text style={[styles.staffTime, { color: colors.textTertiary }]}>--</Text>
                )}
                {staff.note && <Text style={styles.staffNote}>{staff.note}</Text>}
              </View>
              <View style={styles.statusArea}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(staff.status) }]} />
                <Text style={[styles.statusLabel, { color: getStatusColor(staff.status) }]}>
                  {getStatusLabel(staff.status)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Today's Summary</Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{presentCount}/{totalCount}</Text>
              <Text style={styles.summaryLabel}>Present</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>9:01 AM</Text>
              <Text style={styles.summaryLabel}>Avg check-in</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.success }]}>0</Text>
              <Text style={styles.summaryLabel}>Late arrivals</Text>
            </View>
          </View>
        </View>

        {/* History Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.navy} strokeWidth={1.6} />
              <Path d="M12 6v6l4 2" stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Last 7 Days</Text>
          </View>
          {HISTORY.map((day, index) => (
            <View key={day.date} style={[styles.historyRow, index < HISTORY.length - 1 && styles.historyRowBorder]}>
              <View style={styles.historyDate}>
                <Text style={styles.historyDateText}>{day.date}</Text>
                <Text style={styles.historyDayText}>{day.dayName}</Text>
              </View>
              <View style={styles.historyBar}>
                <View style={styles.historyBarBg}>
                  <View style={[styles.historyBarFill, { width: `${(day.present / day.total) * 100}%` }]} />
                </View>
              </View>
              <Text style={styles.historyFraction}>
                {day.present}/{day.total}
              </Text>
            </View>
          ))}
        </View>

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
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
    marginTop: 4,
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
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  cardTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },

  // Staff rows
  staffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  staffRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textWhite,
  },
  staffInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  staffName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  staffTime: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  staffNote: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.warningDark,
    marginTop: 1,
  },
  statusArea: {
    alignItems: 'flex-end',
    gap: 3,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 11,
  },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    color: colors.textPrimary,
  },
  summaryLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
  },

  // History
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  historyRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  historyDate: {
    width: 60,
  },
  historyDateText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  historyDayText: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
  },
  historyBar: {
    flex: 1,
    paddingHorizontal: 12,
  },
  historyBarBg: {
    height: 8,
    backgroundColor: colors.offWhite,
    borderRadius: 4,
    overflow: 'hidden',
  },
  historyBarFill: {
    height: 8,
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  historyFraction: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
    width: 32,
    textAlign: 'right',
  },
});
