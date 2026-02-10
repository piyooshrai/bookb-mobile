import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';
import { useAuthStore } from '@/stores/authStore';
import { useMobileAvailability } from '@/hooks/useAvailability';

const STEPS = ['Service', 'Stylist', 'Time'];
const ACTIVE_STEP = 2;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
];

const BOOKED_SLOTS = ['10:30 AM', '11:30 AM', '1:00 PM', '3:30 PM'];

function generateDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: { day: number; isCurrentMonth: boolean }[] = [];
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
  }
  return days;
}

export default function SelectTime() {
  const router = useRouter();
  const params = useLocalSearchParams<{ serviceId: string; serviceName: string; servicePrice: string; serviceDuration: string; stylistId: string; stylistName: string; mainServiceId: string }>();
  const isDemo = useAuthStore((s) => s.isDemo);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedDateForApi = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const { data: availabilityData, isLoading: isSlotsLoading } = useMobileAvailability(selectedDateForApi, !isDemo);

  const { displayTimeSlots, displayBookedSlots } = useMemo(() => {
    if (!isDemo && availabilityData?.timeData) {
      const allSlots = availabilityData.timeData.map((t: { timeAsAString: string }) => t.timeAsAString);
      const booked = availabilityData.timeData
        .filter((t: { isAvailable: boolean }) => !t.isAvailable)
        .map((t: { timeAsAString: string }) => t.timeAsAString);
      return { displayTimeSlots: allSlots, displayBookedSlots: booked };
    }
    return { displayTimeSlots: TIME_SLOTS, displayBookedSlots: BOOKED_SLOTS };
  }, [isDemo, availabilityData]);

  const days = useMemo(() => generateDays(currentYear, currentMonth), [currentYear, currentMonth]);
  const isToday = (day: number) => day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M12 19l-7-7 7-7" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Pick a Time</Text>
            <Text style={styles.subtitle}>{params.serviceName || 'Service'} with {params.stylistName || 'Stylist'}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Step Indicator */}
        <View style={styles.stepContainer}>
          {STEPS.map((step, index) => (
            <View key={step} style={styles.stepItem}>
              <View style={styles.stepRow}>
                <View style={[styles.stepCircle, index === ACTIVE_STEP && styles.stepCircleActive, index < ACTIVE_STEP && styles.stepCircleCompleted]}>
                  {index < ACTIVE_STEP ? (
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Path d="M20 6L9 17l-5-5" stroke={colors.textWhite} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  ) : (
                    <Text style={[styles.stepNumber, (index === ACTIVE_STEP || index < ACTIVE_STEP) && styles.stepNumberActive]}>{index + 1}</Text>
                  )}
                </View>
                {index < STEPS.length - 1 && <View style={[styles.stepLine, index < ACTIVE_STEP && styles.stepLineActive]} />}
              </View>
              <Text style={[styles.stepLabel, index === ACTIVE_STEP && styles.stepLabelActive]}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Calendar */}
        <View style={styles.calCard}>
          <View style={styles.calHeader}>
            <Text style={styles.calMonth}>{MONTH_NAMES[currentMonth]} {currentYear}</Text>
            <View style={styles.calNav}>
              <TouchableOpacity style={styles.calNavBtn} onPress={prevMonth} activeOpacity={0.7}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M15 18l-6-6 6-6" stroke={colors.navy} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
              <TouchableOpacity style={styles.calNavBtn} onPress={nextMonth} activeOpacity={0.7}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M9 18l6-6-6-6" stroke={colors.navy} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.calDayNames}>
            {DAY_NAMES.map((d) => (
              <Text key={d} style={styles.calDayName}>{d}</Text>
            ))}
          </View>
          <View style={styles.calGrid}>
            {days.map((d, i) => {
              const isSelected = d.isCurrentMonth && d.day === selectedDay;
              const isTodayDate = d.isCurrentMonth && isToday(d.day);
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.calDay, isSelected && styles.calDaySelected, isTodayDate && !isSelected && styles.calDayToday]}
                  onPress={() => d.isCurrentMonth && setSelectedDay(d.day)}
                  activeOpacity={0.7}
                  disabled={!d.isCurrentMonth}
                >
                  <Text style={[styles.calDayText, !d.isCurrentMonth && styles.calDayOff, isSelected && styles.calDayTextSelected, isTodayDate && !isSelected && styles.calDayTextToday]}>
                    {d.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Time Slots */}
        <Text style={styles.sectionTitle}>Available Times</Text>
        {isSlotsLoading && !isDemo && (
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <ActivityIndicator size="large" color={colors.gold} />
          </View>
        )}
        <View style={styles.slotsGrid}>
          {displayTimeSlots.map((slot) => {
            const booked = displayBookedSlots.includes(slot);
            const selected = selectedTime === slot;
            return (
              <TouchableOpacity
                key={slot}
                style={[styles.slot, selected && styles.slotSelected, booked && styles.slotBooked]}
                onPress={() => !booked && setSelectedTime(slot)}
                activeOpacity={0.7}
                disabled={booked}
              >
                <Text style={[styles.slotText, selected && styles.slotTextSelected, booked && styles.slotTextBooked]}>{slot}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomSummary}>
          <Text style={styles.bottomDate}>
            {selectedDay} {MONTH_NAMES[currentMonth].slice(0, 3)} {currentYear}
          </Text>
          {selectedTime && <Text style={styles.bottomTime}>{selectedTime}</Text>}
        </View>
        <TouchableOpacity
          style={[styles.continueButton, !selectedTime && styles.continueButtonDisabled]}
          activeOpacity={0.7}
          disabled={!selectedTime}
          onPress={() => {
            router.push({
              pathname: '/(customer)/book/confirm',
              params: {
                ...params,
                date: `${selectedDay} ${MONTH_NAMES[currentMonth].slice(0, 3)} ${currentYear}`,
                time: selectedTime!,
                dateForApi: selectedDateForApi,
              },
            });
          }}
        >
          <Text style={[styles.continueText, !selectedTime && styles.continueTextDisabled]}>CONFIRM</Text>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M5 12h14M12 5l7 7-7 7" stroke={selectedTime ? colors.white : colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmGrey },
  header: { backgroundColor: colors.navy, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  backButton: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fontFamilies.heading, fontSize: 22, color: colors.textWhite, marginBottom: 2 },
  subtitle: { fontFamily: fontFamilies.body, fontSize: 13, color: '#a39e96' },
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 12 },
  stepContainer: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 4 },
  stepItem: { alignItems: 'center', flex: 1 },
  stepRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.offWhite, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  stepCircleCompleted: { backgroundColor: colors.gold, borderColor: colors.gold },
  stepNumber: { fontFamily: fontFamilies.bodySemiBold, fontSize: 12, color: colors.textTertiary },
  stepNumberActive: { color: colors.textWhite },
  stepLine: { flex: 1, height: 1.5, backgroundColor: colors.border },
  stepLineActive: { backgroundColor: colors.gold },
  stepLabel: { fontFamily: fontFamilies.body, fontSize: 11, color: colors.textTertiary, marginTop: 6 },
  stepLabelActive: { fontFamily: fontFamilies.bodySemiBold, color: colors.navy },
  // Calendar
  calCard: { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16 },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  calMonth: { fontFamily: fontFamilies.bodySemiBold, fontSize: 15, color: colors.textPrimary },
  calNav: { flexDirection: 'row', gap: 8 },
  calNavBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.offWhite, alignItems: 'center', justifyContent: 'center' },
  calDayNames: { flexDirection: 'row', marginBottom: 4 },
  calDayName: { flex: 1, textAlign: 'center', fontFamily: fontFamilies.bodySemiBold, fontSize: 10, color: colors.textTertiary, letterSpacing: 0.5 },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calDay: { width: '14.28%', paddingVertical: 8, alignItems: 'center' },
  calDayText: { fontFamily: fontFamilies.bodyMedium, fontSize: 13, color: colors.textPrimary },
  calDayOff: { color: colors.textTertiary, opacity: 0.4 },
  calDaySelected: { backgroundColor: colors.gold, borderRadius: 8 },
  calDayTextSelected: { color: colors.textWhite, fontFamily: fontFamilies.bodySemiBold },
  calDayToday: { backgroundColor: colors.navy, borderRadius: 8 },
  calDayTextToday: { color: colors.textWhite, fontFamily: fontFamilies.bodySemiBold },
  // Time
  sectionTitle: { fontFamily: fontFamilies.bodySemiBold, fontSize: 15, color: colors.textPrimary, marginTop: 4 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white },
  slotSelected: { borderColor: colors.gold, backgroundColor: 'rgba(196,151,61,0.08)' },
  slotBooked: { opacity: 0.25 },
  slotText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 13, color: colors.textPrimary },
  slotTextSelected: { color: colors.gold },
  slotTextBooked: { textDecorationLine: 'line-through' },
  // Bottom
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 34 },
  bottomSummary: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 },
  bottomDate: { fontFamily: fontFamilies.bodyMedium, fontSize: 13, color: colors.textSecondary },
  bottomTime: { fontFamily: fontFamilies.bodySemiBold, fontSize: 13, color: colors.gold },
  continueButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.gold, borderRadius: 12, paddingVertical: 16 },
  continueButtonDisabled: { backgroundColor: colors.offWhite },
  continueText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 14, color: colors.white, letterSpacing: 2 },
  continueTextDisabled: { color: colors.textTertiary },
});
