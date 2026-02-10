import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useAppointmentsByStylist, useChangeAppointmentStatus } from '@/hooks/useAppointments';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';
import type { Appointment as ApiAppointment } from '@/api/types';

type Appointment = {
  id: string;
  time: string;
  endTime: string;
  client: string;
  service: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'completed';
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;
const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

const MOCK_SCHEDULE: Record<string, Appointment[]> = {
  Mon: [
    { id: 'm1', time: '9:00 AM', endTime: '10:30 AM', client: 'Sarah Mitchell', service: 'Balayage + Trim', duration: '90 min', status: 'confirmed' },
    { id: 'm2', time: '10:45 AM', endTime: '11:30 AM', client: 'Emma Thompson', service: 'Blowout & Style', duration: '45 min', status: 'confirmed' },
    { id: 'm3', time: '11:45 AM', endTime: '12:30 PM', client: 'Priya Sharma', service: 'Root Touch-Up', duration: '45 min', status: 'pending' },
    { id: 'm4', time: '1:30 PM', endTime: '2:30 PM', client: 'Aisha Patel', service: 'Haircut + Layers', duration: '60 min', status: 'confirmed' },
    { id: 'm5', time: '3:00 PM', endTime: '5:00 PM', client: 'Rachel Adams', service: 'Keratin Treatment', duration: '120 min', status: 'confirmed' },
    { id: 'm6', time: '5:15 PM', endTime: '6:00 PM', client: 'Tina Nguyen', service: 'Trim + Deep Condition', duration: '45 min', status: 'pending' },
  ],
  Tue: [
    { id: 't1', time: '9:30 AM', endTime: '11:00 AM', client: 'Olivia Chen', service: 'Color Correction', duration: '90 min', status: 'confirmed' },
    { id: 't2', time: '11:15 AM', endTime: '12:00 PM', client: 'Maya Rodriguez', service: 'Blow Dry + Curls', duration: '45 min', status: 'confirmed' },
    { id: 't3', time: '1:00 PM', endTime: '2:30 PM', client: 'Hannah Brooks', service: 'Full Highlights', duration: '90 min', status: 'confirmed' },
    { id: 't4', time: '2:45 PM', endTime: '3:45 PM', client: 'Jessica Liu', service: 'Bob Cut + Style', duration: '60 min', status: 'pending' },
    { id: 't5', time: '4:00 PM', endTime: '5:30 PM', client: 'Lauren Kim', service: 'Balayage', duration: '90 min', status: 'confirmed' },
  ],
  Wed: [
    { id: 'w1', time: '10:00 AM', endTime: '11:00 AM', client: 'Isabella Wright', service: 'Haircut + Blowout', duration: '60 min', status: 'confirmed' },
    { id: 'w2', time: '11:15 AM', endTime: '12:45 PM', client: 'Diana Foster', service: 'Ombre + Toner', duration: '90 min', status: 'confirmed' },
    { id: 'w3', time: '1:45 PM', endTime: '2:45 PM', client: 'Caroline Hayes', service: 'Scalp Treatment + Trim', duration: '60 min', status: 'confirmed' },
    { id: 'w4', time: '3:00 PM', endTime: '4:30 PM', client: 'Nadia Petrov', service: 'Highlights + Gloss', duration: '90 min', status: 'pending' },
    { id: 'w5', time: '4:45 PM', endTime: '5:45 PM', client: 'Zoe Campbell', service: 'Haircut + Style', duration: '60 min', status: 'confirmed' },
    { id: 'w6', time: '6:00 PM', endTime: '6:30 PM', client: 'Amara Johnson', service: 'Bang Trim + Blowout', duration: '30 min', status: 'confirmed' },
  ],
  Thu: [
    { id: 'th1', time: '9:00 AM', endTime: '10:30 AM', client: 'Sophie Taylor', service: 'Brazilian Blowout', duration: '90 min', status: 'confirmed' },
    { id: 'th2', time: '10:45 AM', endTime: '11:45 AM', client: 'Rebecca Moore', service: 'Haircut + Layers', duration: '60 min', status: 'confirmed' },
    { id: 'th3', time: '12:00 PM', endTime: '12:45 PM', client: 'Eva Martinez', service: 'Root Touch-Up', duration: '45 min', status: 'confirmed' },
    { id: 'th4', time: '2:00 PM', endTime: '3:30 PM', client: 'Grace Okafor', service: 'Full Color + Cut', duration: '90 min', status: 'pending' },
    { id: 'th5', time: '3:45 PM', endTime: '5:15 PM', client: 'Lily Chang', service: 'Balayage + Trim', duration: '90 min', status: 'confirmed' },
  ],
  Fri: [
    { id: 'f1', time: '9:00 AM', endTime: '10:00 AM', client: 'Mia Anderson', service: 'Blowout + Style', duration: '60 min', status: 'confirmed' },
    { id: 'f2', time: '10:15 AM', endTime: '11:45 AM', client: 'Chloe Bennett', service: 'Highlights + Toner', duration: '90 min', status: 'confirmed' },
    { id: 'f3', time: '12:00 PM', endTime: '1:00 PM', client: 'Natalie Ross', service: 'Haircut + Deep Condition', duration: '60 min', status: 'pending' },
    { id: 'f4', time: '2:00 PM', endTime: '3:30 PM', client: 'Victoria Diaz', service: 'Color Correction', duration: '90 min', status: 'confirmed' },
    { id: 'f5', time: '3:45 PM', endTime: '4:45 PM', client: 'Jasmine Torres', service: 'Haircut + Blowout', duration: '60 min', status: 'confirmed' },
    { id: 'f6', time: '5:00 PM', endTime: '5:45 PM', client: 'Elena Vasquez', service: 'Trim + Style', duration: '45 min', status: 'confirmed' },
  ],
};

function getTodayIndex(): number {
  const day = new Date().getDay();
  // Sunday=0, Monday=1 ... Saturday=6; clamp to Mon-Fri
  if (day >= 1 && day <= 5) return day - 1;
  return 0; // default to Monday on weekends
}

function mapApiToScreenStatus(status: string): 'confirmed' | 'pending' | 'completed' {
  if (status === 'completed') return 'completed';
  if (status === 'confirmed') return 'confirmed';
  return 'pending';
}

function mapApiAppointment(apt: ApiAppointment): Appointment {
  const serviceName = typeof apt.mainService === 'object' ? (apt.mainService as any)?.name || '' : '';
  return {
    id: apt._id,
    time: apt.timeAsAString || '',
    endTime: '',
    client: apt.userName || (typeof apt.user === 'object' ? (apt.user as any)?.name || '' : ''),
    service: serviceName || 'Appointment',
    duration: apt.requiredDuration ? `${apt.requiredDuration} min` : '',
    status: mapApiToScreenStatus(apt.status),
  };
}

export default function WeeklyScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState(getTodayIndex());
  const isDemo = useAuthStore((s) => s.isDemo);
  const stylistId = useAuthStore((s) => s.stylistId);

  // API hook - fetch appointments for the stylist
  const { data: apiData, isLoading } = useAppointmentsByStylist(
    { pageNumber: 1, pageSize: 100, stylistId: stylistId || undefined },
    !isDemo && !!stylistId,
  );

  const changeStatus = useChangeAppointmentStatus();

  // Group API appointments by weekday
  const apiSchedule = useMemo(() => {
    if (isDemo || !apiData) return null;
    const rawResult = Array.isArray(apiData) ? apiData : (apiData as any)?.result ?? [];
    if (!Array.isArray(rawResult) || rawResult.length === 0) return null;
    const grouped: Record<string, Appointment[]> = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [] };
    const dayMap: Record<string, string> = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri' };

    for (const apt of rawResult) {
      const dayKey = apt.weekDay ? dayMap[apt.weekDay] : null;
      // Also try deriving from dateAsAString
      let resolvedDay = dayKey;
      if (!resolvedDay && apt.dateAsAString) {
        const d = new Date(apt.dateAsAString);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const name = dayNames[d.getDay()];
        if (name && grouped[name] !== undefined) resolvedDay = name;
      }
      if (resolvedDay && grouped[resolvedDay]) {
        grouped[resolvedDay].push(mapApiAppointment(apt));
      }
    }
    return grouped;
  }, [isDemo, apiData]);

  const schedule = apiSchedule || MOCK_SCHEDULE;
  const appointments = schedule[DAYS[selectedDay]] || [];

  const handleAccept = (apt: Appointment) => {
    if (isDemo) return;
    changeStatus.mutate({ id: apt.id, data: { status: 'confirmed', availabilityId: '', timeDataId: '' } });
  };

  const handleReject = (apt: Appointment) => {
    if (isDemo) return;
    changeStatus.mutate({ id: apt.id, data: { status: 'canceled', availabilityId: '', timeDataId: '' } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Schedule</Text>
        <Text style={styles.subtitle}>{DAY_FULL[selectedDay]} — {appointments.length} appointments</Text>
      </View>

      {/* Day Tabs */}
      <View style={styles.dayTabs}>
        {DAYS.map((day, i) => {
          const isActive = i === selectedDay;
          const count = (schedule[day] || []).length;
          return (
            <Pressable
              key={day}
              style={[styles.dayTab, isActive && styles.dayTabActive]}
              onPress={() => setSelectedDay(i)}
            >
              <Text style={[styles.dayTabLabel, isActive && styles.dayTabLabelActive]}>{day}</Text>
              <Text style={[styles.dayTabCount, isActive && styles.dayTabCountActive]}>{count}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Appointments */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {!isDemo && isLoading && (
          <ActivityIndicator size="small" color={colors.gold} style={{ marginVertical: 12 }} />
        )}

        {appointments.map((apt, i) => (
          <View key={apt.id} style={styles.aptCard}>
            <View style={styles.aptTimeCol}>
              <Text style={styles.aptTimeStart}>{apt.time}</Text>
              <View style={styles.aptTimeLine} />
              <Text style={styles.aptTimeEnd}>{apt.endTime}</Text>
            </View>
            <View style={styles.aptDetailCol}>
              <View style={styles.aptTop}>
                <Text style={styles.aptClient}>{apt.client}</Text>
                <View style={[styles.statusDot, apt.status === 'confirmed' && styles.statusConfirmed, apt.status === 'pending' && styles.statusPending, apt.status === 'completed' && styles.statusCompleted]} />
              </View>
              <Text style={styles.aptService}>{apt.service}</Text>
              <View style={styles.aptMeta}>
                <View style={styles.aptMetaItem}>
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={12} r={10} stroke={colors.textTertiary} strokeWidth={2} />
                    <Line x1={12} y1={6} x2={12} y2={12} stroke={colors.textTertiary} strokeWidth={2} strokeLinecap="round" />
                    <Line x1={12} y1={12} x2={16} y2={14} stroke={colors.textTertiary} strokeWidth={2} strokeLinecap="round" />
                  </Svg>
                  <Text style={styles.aptMetaText}>{apt.duration}</Text>
                </View>
                <View style={[styles.statusPill, apt.status === 'confirmed' && styles.pillConfirmed, apt.status === 'pending' && styles.pillPendingBg]}>
                  <Text style={[styles.statusPillText, apt.status === 'confirmed' && styles.pillConfirmedText, apt.status === 'pending' && styles.pillPendingText]}>
                    {apt.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </Text>
                </View>
              </View>
              {/* Accept / Reject for pending appointments */}
              {apt.status === 'pending' && !isDemo && (
                <View style={styles.actionRow}>
                  <Pressable style={styles.acceptBtn} onPress={() => handleAccept(apt)}>
                    <Text style={styles.acceptBtnText}>Accept</Text>
                  </Pressable>
                  <Pressable style={styles.rejectBtn} onPress={() => handleReject(apt)}>
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Day Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Day Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{appointments.length}</Text>
              <Text style={styles.summaryLabel}>Appointments</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {appointments.filter((a) => a.status === 'confirmed').length}
              </Text>
              <Text style={styles.summaryLabel}>Confirmed</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {appointments.filter((a) => a.status === 'pending').length}
              </Text>
              <Text style={styles.summaryLabel}>Pending</Text>
            </View>
          </View>
        </View>

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
  // Day Tabs
  dayTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  dayTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayTabActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  dayTabLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  dayTabLabelActive: {
    color: colors.textWhite,
  },
  dayTabCount: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  dayTabCountActive: {
    color: colors.goldLight,
  },
  // Body
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 12 },
  // Appointment Card
  aptCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 14,
  },
  aptTimeCol: {
    alignItems: 'center',
    width: 62,
  },
  aptTimeStart: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.textPrimary,
  },
  aptTimeLine: {
    width: 1,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
    minHeight: 16,
  },
  aptTimeEnd: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
  },
  aptDetailCol: {
    flex: 1,
  },
  aptTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  aptClient: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 15,
    color: colors.textPrimary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusConfirmed: {
    backgroundColor: colors.success,
  },
  statusPending: {
    backgroundColor: colors.warning,
  },
  statusCompleted: {
    backgroundColor: colors.textTertiary,
  },
  aptService: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  aptMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aptMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aptMetaText: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillConfirmed: {
    backgroundColor: colors.successLight,
  },
  pillPendingBg: {
    backgroundColor: colors.warningLight,
  },
  statusPillText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillConfirmedText: {
    color: colors.successDark,
  },
  pillPendingText: {
    color: colors.warningDark,
  },
  // Summary Card
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginTop: 4,
  },
  summaryTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.navy,
  },
  summaryLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  // Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: colors.successLight,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptBtnText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.successDark,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: colors.errorLight,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectBtnText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.error,
  },
});
