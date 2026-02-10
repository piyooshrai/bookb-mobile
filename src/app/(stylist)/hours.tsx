import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessHours, useCreateBulkAvailability } from '@/hooks/useAvailability';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

type DaySchedule = {
  day: string;
  shortDay: string;
  isOn: boolean;
  start: string;
  end: string;
  lunchStart: string;
  lunchEnd: string;
};

const MOCK_HOURS: DaySchedule[] = [
  { day: 'Monday', shortDay: 'Mon', isOn: true, start: '9:00 AM', end: '6:00 PM', lunchStart: '12:30 PM', lunchEnd: '1:30 PM' },
  { day: 'Tuesday', shortDay: 'Tue', isOn: true, start: '9:30 AM', end: '5:30 PM', lunchStart: '12:30 PM', lunchEnd: '1:00 PM' },
  { day: 'Wednesday', shortDay: 'Wed', isOn: true, start: '10:00 AM', end: '7:00 PM', lunchStart: '1:00 PM', lunchEnd: '1:45 PM' },
  { day: 'Thursday', shortDay: 'Thu', isOn: true, start: '9:00 AM', end: '6:00 PM', lunchStart: '12:00 PM', lunchEnd: '1:00 PM' },
  { day: 'Friday', shortDay: 'Fri', isOn: true, start: '9:00 AM', end: '6:00 PM', lunchStart: '12:30 PM', lunchEnd: '1:30 PM' },
  { day: 'Saturday', shortDay: 'Sat', isOn: false, start: '--', end: '--', lunchStart: '--', lunchEnd: '--' },
  { day: 'Sunday', shortDay: 'Sun', isOn: false, start: '--', end: '--', lunchStart: '--', lunchEnd: '--' },
];

const THIS_WEEK_HOURS = 41.25;
const NEXT_WEEK_HOURS = 39.5;

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHORT_DAYS: Record<string, string> = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };

function mapBusinessHoursToSchedule(slots: { day: string; slot: { startTime: string; endTime: string }[] }[]): DaySchedule[] {
  const slotMap = new Map(slots.map((s) => [s.day, s]));

  return ALL_DAYS.map((day) => {
    const entry = slotMap.get(day);
    const hasSlots = entry && entry.slot && entry.slot.length > 0;
    const firstSlot = hasSlots ? entry!.slot[0] : null;
    const lastSlot = hasSlots ? entry!.slot[entry!.slot.length - 1] : null;

    return {
      day,
      shortDay: SHORT_DAYS[day] || day.slice(0, 3),
      isOn: !!hasSlots,
      start: firstSlot ? firstSlot.startTime : '--',
      end: lastSlot ? lastSlot.endTime : '--',
      lunchStart: '--',
      lunchEnd: '--',
    };
  });
}

export default function MyAvailabilityScreen() {
  const isDemo = useAuthStore((s) => s.isDemo);
  const stylistId = useAuthStore((s) => s.stylistId);

  // API hooks
  const { data: businessHoursData, isLoading } = useBusinessHours(!isDemo ? (stylistId || undefined) : undefined);
  const createBulk = useCreateBulkAvailability();

  // Map API data to display format
  const hours: DaySchedule[] = useMemo(() => {
    if (isDemo || !businessHoursData) return MOCK_HOURS;
    const bh = businessHoursData as any;
    // Handle possible { result: [...] } wrapper or direct object
    const unwrapped = Array.isArray(bh) ? bh[0] : bh?.result ? (Array.isArray(bh.result) ? bh.result[0] : bh.result) : bh;
    const slots = unwrapped?.slots || unwrapped?.data?.slots;
    if (!slots || !Array.isArray(slots)) return MOCK_HOURS;
    return mapBusinessHoursToSchedule(slots);
  }, [isDemo, businessHoursData]);

  const workingDays = hours.filter((d) => d.isOn).length;
  const daysOff = hours.length - workingDays;

  // Compute total weekly hours and averages from the hours data
  const totalMinutes = hours
    .filter((d) => d.isOn && d.start !== '--' && d.end !== '--')
    .reduce((sum, d) => sum + getDurationMinutes(d.start, d.end), 0);
  const thisWeekHours = !isDemo && businessHoursData ? +(totalMinutes / 60).toFixed(2) : THIS_WEEK_HOURS;
  const avgPerDay = workingDays > 0 ? +(thisWeekHours / workingDays).toFixed(2) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Hours</Text>
        <Text style={styles.subtitle}>Manage your weekly availability</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {!isDemo && isLoading && (
          <ActivityIndicator size="small" color={colors.gold} style={{ marginVertical: 12 }} />
        )}

        {/* Summary Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={10} stroke={colors.gold} strokeWidth={1.8} />
                <Line x1={12} y1={6} x2={12} y2={12} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
                <Line x1={12} y1={12} x2={16} y2={14} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={styles.statValue}>{thisWeekHours}h</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.gold} strokeWidth={1.8} />
                <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
                <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
                <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={styles.statValue}>{isDemo ? NEXT_WEEK_HOURS : thisWeekHours}h</Text>
            <Text style={styles.statLabel}>Next Week</Text>
          </View>
        </View>

        {/* Weekly Schedule */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.navy} strokeWidth={1.8} />
              <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.cardTitle}>Weekly Hours</Text>
          </View>

          {hours.map((day, i) => (
            <View key={day.day}>
              <View style={styles.dayRow}>
                {/* Toggle indicator */}
                <View style={[styles.toggle, day.isOn ? styles.toggleOn : styles.toggleOff]}>
                  <View style={[styles.toggleDot, day.isOn ? styles.toggleDotOn : styles.toggleDotOff]} />
                </View>

                {/* Day name */}
                <View style={styles.dayNameCol}>
                  <Text style={[styles.dayName, !day.isOn && styles.dayNameOff]}>{day.day}</Text>
                </View>

                {/* Hours */}
                <View style={styles.dayHoursCol}>
                  {day.isOn ? (
                    <Text style={styles.dayHours}>{day.start} - {day.end}</Text>
                  ) : (
                    <Text style={styles.dayOff}>Day Off</Text>
                  )}
                </View>
              </View>
              {i < hours.length - 1 && <View style={styles.dayDivider} />}
            </View>
          ))}
        </View>

        {/* Lunch Break */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Line x1={6} y1={1} x2={6} y2={4} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={10} y1={1} x2={10} y2={4} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={14} y1={1} x2={14} y2={4} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.cardTitle}>Lunch Break</Text>
          </View>

          {hours.filter((d) => d.isOn).map((day, i, arr) => (
            <View key={day.day}>
              <View style={styles.lunchRow}>
                <Text style={styles.lunchDay}>{day.shortDay}</Text>
                <Text style={styles.lunchTime}>{day.lunchStart} - {day.lunchEnd}</Text>
                <View style={styles.lunchDuration}>
                  <Text style={styles.lunchDurationText}>
                    {day.lunchStart !== '--' && day.lunchEnd !== '--' ? `${getDurationMinutes(day.lunchStart, day.lunchEnd)} min` : '--'}
                  </Text>
                </View>
              </View>
              {i < arr.length - 1 && <View style={styles.dayDivider} />}
            </View>
          ))}
        </View>

        {/* Working Days Overview */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M22 4L12 14.01l-3-3" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Overview</Text>
          </View>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{workingDays}</Text>
              <Text style={styles.overviewLabel}>Working Days</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{daysOff}</Text>
              <Text style={styles.overviewLabel}>Days Off</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{avgPerDay}h</Text>
              <Text style={styles.overviewLabel}>Avg / Day</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function getDurationMinutes(start: string, end: string): number {
  const toMin = (t: string) => {
    const [time, period] = t.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };
  return toMin(end) - toMin(start);
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
  bodyContent: { padding: 20, gap: 16 },
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.warmGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 24,
    color: colors.navy,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
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
  // Day Row
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  toggle: {
    width: 36,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOn: {
    backgroundColor: colors.success,
  },
  toggleOff: {
    backgroundColor: colors.border,
  },
  toggleDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  toggleDotOn: {
    backgroundColor: colors.white,
    alignSelf: 'flex-end',
  },
  toggleDotOff: {
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
  },
  dayNameCol: {
    width: 90,
  },
  dayName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  dayNameOff: {
    color: colors.textTertiary,
  },
  dayHoursCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dayHours: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  dayOff: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  dayDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: 16,
  },
  // Lunch
  lunchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  lunchDay: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
    width: 36,
  },
  lunchTime: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  lunchDuration: {
    backgroundColor: colors.warmGrey,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  lunchDurationText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    color: colors.textSecondary,
  },
  // Overview
  overviewGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
  overviewItem: {
    flex: 1,
    alignItems: 'center',
  },
  overviewValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.navy,
  },
  overviewLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  overviewDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
});
