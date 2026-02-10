import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Polyline, Line } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface DaySchedule {
  day: string;
  short: string;
  enabled: boolean;
  open: string;
  close: string;
}

const INITIAL_SCHEDULE: DaySchedule[] = [
  { day: 'Monday', short: 'Mon', enabled: true, open: '9:00 AM', close: '7:00 PM' },
  { day: 'Tuesday', short: 'Tue', enabled: true, open: '9:00 AM', close: '7:00 PM' },
  { day: 'Wednesday', short: 'Wed', enabled: true, open: '9:00 AM', close: '7:00 PM' },
  { day: 'Thursday', short: 'Thu', enabled: true, open: '9:00 AM', close: '7:00 PM' },
  { day: 'Friday', short: 'Fri', enabled: true, open: '9:00 AM', close: '7:00 PM' },
  { day: 'Saturday', short: 'Sat', enabled: true, open: '9:00 AM', close: '7:00 PM' },
  { day: 'Sunday', short: 'Sun', enabled: false, open: '9:00 AM', close: '7:00 PM' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BusinessHoursScreen() {
  const router = useRouter();
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [lunchBreak, setLunchBreak] = useState(true);
  const [lunchStart] = useState('12:00 PM');
  const [lunchEnd] = useState('1:00 PM');
  const [interval, setInterval] = useState(30);
  const [maxDays, setMaxDays] = useState(30);

  const toggleDay = (index: number) => {
    setSchedule((prev) =>
      prev.map((d, i) => (i === index ? { ...d, enabled: !d.enabled } : d)),
    );
  };

  const adjustInterval = (delta: number) => {
    setInterval((prev) => Math.max(15, Math.min(120, prev + delta)));
  };

  const adjustMaxDays = (delta: number) => {
    setMaxDays((prev) => Math.max(7, Math.min(90, prev + delta)));
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
          <View>
            <Text style={styles.title}>Business Hours</Text>
            <Text style={styles.subtitle}>Set your operating hours</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Weekly Schedule Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.navy} strokeWidth={1.6} />
              <Polyline points="12 6 12 12 16 14" stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Weekly Schedule</Text>
          </View>
          {schedule.map((day, index) => (
            <View key={day.day} style={[styles.dayRow, index < schedule.length - 1 && styles.dayRowBorder]}>
              <Text style={[styles.dayName, !day.enabled && styles.dayNameDisabled]}>{day.day}</Text>
              <Switch
                value={day.enabled}
                onValueChange={() => toggleDay(index)}
                trackColor={{ false: colors.border, true: colors.goldLight }}
                thumbColor={day.enabled ? colors.gold : colors.textTertiary}
                style={styles.daySwitch}
              />
              {day.enabled ? (
                <View style={styles.timeRow}>
                  <TouchableOpacity style={styles.timePill} activeOpacity={0.7}>
                    <Text style={styles.timeText}>{day.open}</Text>
                  </TouchableOpacity>
                  <Text style={styles.timeSeparator}>-</Text>
                  <TouchableOpacity style={styles.timePill} activeOpacity={0.7}>
                    <Text style={styles.timeText}>{day.close}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.closedText}>Closed</Text>
              )}
            </View>
          ))}
        </View>

        {/* Lunch Break Card */}
        <View style={styles.card}>
          <View style={styles.lunchRow}>
            <View style={styles.lunchInfo}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Line x1={6} y1={1} x2={6} y2={4} stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" />
                <Line x1={10} y1={1} x2={10} y2={4} stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" />
                <Line x1={14} y1={1} x2={14} y2={4} stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" />
              </Svg>
              <Text style={styles.lunchLabel}>Lunch Break</Text>
            </View>
            <Switch
              value={lunchBreak}
              onValueChange={setLunchBreak}
              trackColor={{ false: colors.border, true: colors.goldLight }}
              thumbColor={lunchBreak ? colors.gold : colors.textTertiary}
              style={styles.daySwitch}
            />
          </View>
          {lunchBreak && (
            <View style={styles.lunchTimes}>
              <TouchableOpacity style={styles.timePill} activeOpacity={0.7}>
                <Text style={styles.timeText}>{lunchStart}</Text>
              </TouchableOpacity>
              <Text style={styles.timeSeparator}>-</Text>
              <TouchableOpacity style={styles.timePill} activeOpacity={0.7}>
                <Text style={styles.timeText}>{lunchEnd}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Appointment Interval Card */}
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Appointment Interval</Text>
              <Text style={styles.settingDesc}>Time between appointment slots</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustInterval(-15)} activeOpacity={0.6}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Line x1={5} y1={12} x2={19} y2={12} stroke={colors.navy} strokeWidth={2} strokeLinecap="round" />
                </Svg>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{interval} min</Text>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustInterval(15)} activeOpacity={0.6}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Line x1={12} y1={5} x2={12} y2={19} stroke={colors.navy} strokeWidth={2} strokeLinecap="round" />
                  <Line x1={5} y1={12} x2={19} y2={12} stroke={colors.navy} strokeWidth={2} strokeLinecap="round" />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Max Calendar Days Card */}
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Max Calendar Days Ahead</Text>
              <Text style={styles.settingDesc}>How far in advance clients can book</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustMaxDays(-7)} activeOpacity={0.6}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Line x1={5} y1={12} x2={19} y2={12} stroke={colors.navy} strokeWidth={2} strokeLinecap="round" />
                </Svg>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{maxDays} days</Text>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustMaxDays(7)} activeOpacity={0.6}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Line x1={12} y1={5} x2={12} y2={19} stroke={colors.navy} strokeWidth={2} strokeLinecap="round" />
                  <Line x1={5} y1={12} x2={19} y2={12} stroke={colors.navy} strokeWidth={2} strokeLinecap="round" />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.7} onPress={() => Alert.alert('Success', 'Business hours updated', [{ text: 'OK' }])}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
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

  // Day rows
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  dayRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  dayName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
    width: 90,
  },
  dayNameDisabled: {
    color: colors.textTertiary,
  },
  daySwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    marginRight: 8,
  },
  timeRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timePill: {
    backgroundColor: colors.offWhite,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  timeText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 12,
    color: colors.textPrimary,
  },
  timeSeparator: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textTertiary,
    marginHorizontal: 6,
  },
  closedText: {
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'right',
  },

  // Lunch break
  lunchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  lunchInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lunchLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  lunchTimes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  // Setting row
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  settingDesc: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepperBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.offWhite,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textPrimary,
    minWidth: 56,
    textAlign: 'center',
  },

  // Save button
  saveButton: {
    backgroundColor: colors.gold,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
