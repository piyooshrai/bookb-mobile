import { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useDashboardAppointments } from '@/hooks/useAppointments';
import { useStylistsBySalon } from '@/hooks/useStylist';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const DAYS = [
  { label: 'Mon', date: 10, isToday: true },
  { label: 'Tue', date: 11, isToday: false },
  { label: 'Wed', date: 12, isToday: false },
  { label: 'Thu', date: 13, isToday: false },
  { label: 'Fri', date: 14, isToday: false },
  { label: 'Sat', date: 15, isToday: false },
  { label: 'Sun', date: 16, isToday: false },
];

type AppointmentStatus = 'confirmed' | 'waiting' | 'completed' | 'in-progress';

interface Appointment {
  id: string;
  time: string;
  duration: string;
  client: string;
  service: string;
  stylist: string;
  price: number;
  status: AppointmentStatus;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', time: '9:00 AM', duration: '45 min', client: 'Sarah Mitchell', service: 'Blowout & Style', stylist: 'Jessica R.', price: 65, status: 'completed' },
  { id: '2', time: '9:30 AM', duration: '60 min', client: 'Natalie Brooks', service: 'Haircut + Layers', stylist: 'Marcus T.', price: 85, status: 'completed' },
  { id: '3', time: '10:00 AM', duration: '120 min', client: 'Olivia Chen', service: 'Full Balayage', stylist: 'Jessica R.', price: 220, status: 'completed' },
  { id: '4', time: '10:30 AM', duration: '90 min', client: 'Aisha Patel', service: 'Color + Gloss', stylist: 'Priya S.', price: 175, status: 'in-progress' },
  { id: '5', time: '11:00 AM', duration: '45 min', client: 'Emma Thompson', service: 'Root Touch-Up', stylist: 'Marcus T.', price: 95, status: 'in-progress' },
  { id: '6', time: '12:00 PM', duration: '60 min', client: 'Rachel Adams', service: 'Keratin Treatment', stylist: 'Liam K.', price: 180, status: 'confirmed' },
  { id: '7', time: '1:00 PM', duration: '30 min', client: 'Lauren Kim', service: 'Bang Trim', stylist: 'Priya S.', price: 35, status: 'confirmed' },
  { id: '8', time: '1:30 PM', duration: '90 min', client: 'Megan Rivera', service: 'Highlights + Toner', stylist: 'Jessica R.', price: 195, status: 'confirmed' },
  { id: '9', time: '2:30 PM', duration: '60 min', client: 'Diana Foster', service: 'Haircut + Blowout', stylist: 'Liam K.', price: 110, status: 'waiting' },
  { id: '10', time: '3:00 PM', duration: '45 min', client: 'Priscilla Okafor', service: 'Silk Press', stylist: 'Marcus T.', price: 85, status: 'waiting' },
];

const STATUS_CONFIG: Record<AppointmentStatus, { bg: string; text: string; label: string }> = {
  confirmed: { bg: colors.infoLight, text: colors.infoDark, label: 'Confirmed' },
  waiting: { bg: colors.warningLight, text: colors.warningDark, label: 'Waiting' },
  completed: { bg: colors.successLight, text: colors.successDark, label: 'Completed' },
  'in-progress': { bg: '#f0e6ff', text: '#7c3aed', label: 'In Progress' },
};

const completedCount = MOCK_APPOINTMENTS.filter((a) => a.status === 'completed').length;
const totalCount = MOCK_APPOINTMENTS.length;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AppointmentsCalendarScreen() {
  const router = useRouter();
  const isDemo = useAuthStore((s) => s.isDemo);
  const salonId = useAuthStore((s) => s.salonId);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedStylistId, setSelectedStylistId] = useState<string | null>(null);

  // Fetch stylists for this salon so we can pass stylistId to the dashboard query
  const { data: stylistsData } = useStylistsBySalon();
  const stylists: { _id: string; name: string }[] = useMemo(() => {
    if (!stylistsData) return [];
    const list = Array.isArray(stylistsData) ? stylistsData : (stylistsData as any).result || [];
    return list.map((s: any) => ({ _id: s._id, name: s.name }));
  }, [stylistsData]);

  // Auto-select first stylist when list loads
  useEffect(() => {
    if (!selectedStylistId && stylists.length > 0) {
      setSelectedStylistId(stylists[0]._id);
    }
  }, [stylists, selectedStylistId]);

  // Compute the date for the selected day — try YYYY-MM-DD (ISO) for querying
  const selectedDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + selectedDayIndex);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }, [selectedDayIndex]);

  const offset = new Date().getTimezoneOffset();

  const { data: appointmentsData, isLoading } = useDashboardAppointments(
    { salon: salonId || '', stylistId: selectedStylistId || '', fromDate: selectedDate, toDate: selectedDate, offset },
    !isDemo && !!selectedStylistId,
  );

  const displayAppointments: Appointment[] = useMemo(() => {
    if (isDemo) return MOCK_APPOINTMENTS;
    if (!appointmentsData) return [];
    console.log('[Schedule] raw appointmentsData:', JSON.stringify(appointmentsData).slice(0, 800));
    const raw = Array.isArray(appointmentsData) ? appointmentsData : (appointmentsData as any).result || (appointmentsData as any).data || [];
    const list = Array.isArray(raw) ? raw : [];
    console.log('[Schedule] parsed list length:', list.length, 'query params:', { salon: salonId, stylistId: selectedStylistId, fromDate: selectedDate, toDate: selectedDate });
    return list.map((apt: any, idx: number) => ({
      id: apt._id || String(idx),
      time: apt.timeAsAString || apt.timeData?.timeAsAString || '',
      duration: apt.requiredDuration ? `${apt.requiredDuration} min` : (apt.mainService?.requiredTime ? `${apt.mainService.requiredTime} min` : '60 min'),
      client: typeof apt.user === 'object' ? apt.user?.name : (apt.name || 'Client'),
      service: typeof apt.subService === 'object' ? apt.subService?.title : (typeof apt.mainService === 'object' ? apt.mainService?.title : 'Service'),
      stylist: typeof apt.stylist === 'object' ? apt.stylist?.name : 'Stylist',
      price: typeof apt.subService === 'object' ? (apt.subService?.charges ?? 0) : (typeof apt.mainService === 'object' ? (apt.mainService?.charges ?? 0) : 0),
      status: (apt.status === 'complete' ? 'completed' : apt.status === 'pending' ? 'waiting' : apt.status || 'confirmed') as AppointmentStatus,
    }));
  }, [isDemo, appointmentsData]);

  const displayCompleted = displayAppointments.filter((a) => a.status === 'completed').length;
  const displayTotal = displayAppointments.length;

  // Build dynamic DAYS from today
  const dynamicDays = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return { label: dayNames[d.getDay()], date: d.getDate(), isToday: i === selectedDayIndex };
    });
  }, [selectedDayIndex]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Schedule</Text>
            <Text style={styles.subtitle}>February 2026 · {displayCompleted}/{displayTotal} completed</Text>
          </View>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={() => router.push('/(salon)/schedule/new')}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.textWhite} strokeWidth={1.8} />
              <Line x1={12} y1={8} x2={12} y2={16} stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={8} y1={12} x2={16} y2={12} stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Day selector */}
        <View style={styles.dayRow}>
          {dynamicDays.map((day, idx) => (
            <TouchableOpacity
              key={day.label + day.date}
              style={[styles.dayItem, day.isToday && styles.dayItemActive]}
              activeOpacity={0.7}
              onPress={() => setSelectedDayIndex(idx)}
            >
              <Text style={[styles.dayLabel, day.isToday && styles.dayLabelActive]}>{day.label}</Text>
              <Text style={[styles.dayDate, day.isToday && styles.dayDateActive]}>{day.date}</Text>
              {day.isToday && <View style={styles.dayDot} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stylist selector */}
      {!isDemo && stylists.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stylistRow} contentContainerStyle={styles.stylistRowContent}>
          {stylists.map((s) => {
            const isActive = s._id === selectedStylistId;
            return (
              <TouchableOpacity
                key={s._id}
                style={[styles.stylistPill, isActive && styles.stylistPillActive]}
                activeOpacity={0.7}
                onPress={() => setSelectedStylistId(s._id)}
              >
                <Text style={[styles.stylistPillText, isActive && styles.stylistPillTextActive]}>{s.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Appointments list */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {!isDemo && isLoading && (
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <ActivityIndicator size="small" color={colors.gold} />
          </View>
        )}
        {!isDemo && !isLoading && displayAppointments.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ fontFamily: fontFamilies.body, fontSize: 14, color: colors.textTertiary }}>No appointments for this day</Text>
          </View>
        )}
        {displayAppointments.map((apt) => {
          const statusCfg = STATUS_CONFIG[apt.status];
          return (
            <View key={apt.id} style={styles.card}>
              <View style={styles.cardTop}>
                {/* Time column */}
                <View style={styles.timeCol}>
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={12} r={10} stroke={colors.textTertiary} strokeWidth={1.6} />
                    <Path d="M12 6v6l4 2" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <Text style={styles.timeText}>{apt.time}</Text>
                </View>
                {/* Status badge */}
                <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                  <Text style={[styles.statusText, { color: statusCfg.text }]}>{statusCfg.label}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.clientName}>{apt.client}</Text>
                <Text style={styles.serviceText}>{apt.service}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                      <Circle cx={12} cy={7} r={4} stroke={colors.textTertiary} strokeWidth={1.8} />
                    </Svg>
                    <Text style={styles.metaText}>{apt.stylist}</Text>
                  </View>
                  <View style={styles.metaDot} />
                  <Text style={styles.metaText}>{apt.duration}</Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.priceText}>${apt.price}</Text>
                </View>
              </View>
            </View>
          );
        })}
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
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
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Day selector
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  dayItemActive: {
    backgroundColor: colors.gold,
  },
  dayLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 11,
    color: '#a39e96',
    marginBottom: 4,
  },
  dayLabelActive: {
    color: colors.textWhite,
  },
  dayDate: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 16,
    color: colors.textWhite,
  },
  dayDateActive: {
    color: colors.textWhite,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.textWhite,
    marginTop: 4,
  },
  // Body
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 12 },
  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  timeCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    textTransform: 'capitalize',
  },
  // Card body
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  clientName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  serviceText: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
    marginHorizontal: 8,
  },
  metaText: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  priceText: {
    fontFamily: fontFamilies.heading,
    fontSize: 13,
    color: colors.textPrimary,
  },
  bottomSpacer: { height: 20 },
  // Stylist selector
  stylistRow: {
    maxHeight: 48,
    backgroundColor: colors.warmGrey,
  },
  stylistRowContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  stylistPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stylistPillActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  stylistPillText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  stylistPillTextActive: {
    color: colors.textWhite,
  },
});
