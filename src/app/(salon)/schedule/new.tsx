import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const RECENT_CLIENTS = [
  { id: '1', name: 'Sarah M.' },
  { id: '2', name: 'Emma T.' },
  { id: '3', name: 'Olivia C.' },
  { id: '4', name: 'Aisha P.' },
];

const SERVICE_CATEGORIES = ['All', 'Color', 'Cut', 'Treatment', 'Styling'];

interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  category: string;
}

const SERVICES: Service[] = [
  { id: '1', name: 'Balayage + Trim', duration: '90 min', price: 185, category: 'Color' },
  { id: '2', name: 'Full Color', duration: '120 min', price: 220, category: 'Color' },
  { id: '3', name: 'Haircut + Layers', duration: '60 min', price: 85, category: 'Cut' },
  { id: '4', name: 'Keratin Treatment', duration: '120 min', price: 250, category: 'Treatment' },
  { id: '5', name: 'Blowout & Style', duration: '45 min', price: 65, category: 'Styling' },
  { id: '6', name: 'Root Touch-Up', duration: '60 min', price: 95, category: 'Color' },
];

interface Stylist {
  id: string;
  name: string;
  initial: string;
  status: 'available' | 'busy';
}

const STYLISTS: Stylist[] = [
  { id: '1', name: 'Jessica R.', initial: 'J', status: 'available' },
  { id: '2', name: 'Marcus T.', initial: 'M', status: 'busy' },
  { id: '3', name: 'Priya S.', initial: 'P', status: 'available' },
  { id: '4', name: 'Liam K.', initial: 'L', status: 'available' },
];

function getNext7Days() {
  const days: { key: string; dayName: string; date: number; month: string; full: string }[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      key: `day-${i}`,
      dayName: dayNames[d.getDay()],
      date: d.getDate(),
      month: monthNames[d.getMonth()],
      full: d.toISOString(),
    });
  }
  return days;
}

const DAYS = getNext7Days();

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM',
];

const UNAVAILABLE_SLOTS = ['10:00 AM', '10:30 AM', '1:00 PM', '3:30 PM', '5:30 PM'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NewAppointmentScreen() {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(DAYS[0].key);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const filteredServices = selectedCategory === 'All'
    ? SERVICES
    : SERVICES.filter((s) => s.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backButton}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M12 19l-7-7 7-7" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>New Appointment</Text>
            <Text style={styles.subtitle}>Schedule a booking</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* ---- Client Section ---- */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx={12} cy={7} r={4} stroke={colors.navy} strokeWidth={1.8} />
            </Svg>
            <Text style={styles.sectionTitle}>Client</Text>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Circle cx={11} cy={11} r={8} stroke={colors.textTertiary} strokeWidth={1.8} />
              <Line x1={21} y1={21} x2={16.65} y2={16.65} stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <TextInput
              style={styles.searchInput}
              placeholder="Search clients..."
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          {/* Quick-pick chips */}
          <View style={styles.chipRow}>
            {RECENT_CLIENTS.map((client) => (
              <TouchableOpacity
                key={client.id}
                style={[styles.chip, selectedClient === client.id && styles.chipActive]}
                onPress={() => setSelectedClient(client.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, selectedClient === client.id && styles.chipTextActive]}>
                  {client.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.chip, styles.chipNew]}
              onPress={() => setSelectedClient('new')}
              activeOpacity={0.7}
            >
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Line x1={12} y1={5} x2={12} y2={19} stroke={colors.gold} strokeWidth={2} strokeLinecap="round" />
                <Line x1={5} y1={12} x2={19} y2={12} stroke={colors.gold} strokeWidth={2} strokeLinecap="round" />
              </Svg>
              <Text style={[styles.chipText, { color: colors.gold }]}>New Client</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ---- Service Section ---- */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={3} width={7} height={7} rx={1} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Rect x={14} y={3} width={7} height={7} rx={1} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Rect x={3} y={14} width={7} height={7} rx={1} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Rect x={14} y={14} width={7} height={7} rx={1} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.sectionTitle}>Service</Text>
          </View>

          {/* Category pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll} contentContainerStyle={styles.pillContent}>
            {SERVICE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.pill, selectedCategory === cat && styles.pillActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, selectedCategory === cat && styles.pillTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Service list */}
          {filteredServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceRow, selectedService === service.id && styles.serviceRowActive]}
              onPress={() => setSelectedService(service.id)}
              activeOpacity={0.7}
            >
              <View style={styles.radioOuter}>
                {selectedService === service.id && <View style={styles.radioInner} />}
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceMeta}>{service.duration}</Text>
              </View>
              <Text style={styles.servicePrice}>${service.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ---- Stylist Section ---- */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx={9} cy={7} r={4} stroke={colors.navy} strokeWidth={1.8} />
              <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.sectionTitle}>Stylist</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stylistScroll}>
            {STYLISTS.map((stylist) => (
              <TouchableOpacity
                key={stylist.id}
                style={[styles.stylistCard, selectedStylist === stylist.id && styles.stylistCardActive]}
                onPress={() => setSelectedStylist(stylist.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.stylistAvatar, selectedStylist === stylist.id && styles.stylistAvatarActive]}>
                  <Text style={styles.stylistInitial}>{stylist.initial}</Text>
                </View>
                <Text style={[styles.stylistName, selectedStylist === stylist.id && styles.stylistNameActive]}>
                  {stylist.name}
                </Text>
                <View style={[
                  styles.stylistBadge,
                  stylist.status === 'available' ? styles.badgeAvailable : styles.badgeBusy,
                ]}>
                  <Text style={[
                    styles.stylistBadgeText,
                    stylist.status === 'available' ? styles.badgeTextAvailable : styles.badgeTextBusy,
                  ]}>
                    {stylist.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ---- Date & Time Section ---- */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.sectionTitle}>Date & Time</Text>
          </View>

          {/* Date pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day.key}
                style={[styles.dayPill, selectedDay === day.key && styles.dayPillActive]}
                onPress={() => setSelectedDay(day.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayPillLabel, selectedDay === day.key && styles.dayPillLabelActive]}>
                  {day.dayName}
                </Text>
                <Text style={[styles.dayPillDate, selectedDay === day.key && styles.dayPillDateActive]}>
                  {day.date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Time slot grid */}
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((slot) => {
              const isUnavailable = UNAVAILABLE_SLOTS.includes(slot);
              const isSelected = selectedTime === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.timeSlot,
                    isUnavailable && styles.timeSlotUnavailable,
                    isSelected && styles.timeSlotActive,
                  ]}
                  onPress={() => !isUnavailable && setSelectedTime(slot)}
                  activeOpacity={isUnavailable ? 1 : 0.7}
                  disabled={isUnavailable}
                >
                  <Text style={[
                    styles.timeSlotText,
                    isUnavailable && styles.timeSlotTextUnavailable,
                    isSelected && styles.timeSlotTextActive,
                  ]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ---- Notes Section ---- */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M14 2v6h6" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Line x1={16} y1={13} x2={8} y2={13} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={16} y1={17} x2={8} y2={17} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.sectionTitle}>Notes</Text>
          </View>
          <TextInput
            style={styles.notesInput}
            placeholder="Special instructions or notes..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sticky bottom button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bookButton} activeOpacity={0.8}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
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
    gap: 14,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
  },
  // Body
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.offWhite,
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.offWhite,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  chipNew: {
    borderColor: colors.gold,
    borderStyle: 'dashed',
    backgroundColor: colors.white,
  },
  chipText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: colors.textWhite,
  },
  // Pills (category)
  pillScroll: {
    marginBottom: 4,
  },
  pillContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.offWhite,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  pillText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: colors.textWhite,
  },
  // Service list
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  serviceRowActive: {
    backgroundColor: 'rgba(196, 151, 61, 0.04)',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gold,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  serviceMeta: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  servicePrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 15,
    color: colors.textPrimary,
  },
  // Stylists
  stylistScroll: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  stylistCard: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    width: 100,
  },
  stylistCardActive: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(196, 151, 61, 0.04)',
  },
  stylistAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stylistAvatarActive: {
    backgroundColor: colors.gold,
  },
  stylistInitial: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 18,
    color: colors.textWhite,
  },
  stylistName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 12,
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  stylistNameActive: {
    color: colors.gold,
  },
  stylistBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeAvailable: { backgroundColor: colors.successLight },
  badgeBusy: { backgroundColor: colors.warningLight },
  stylistBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    textTransform: 'capitalize',
  },
  badgeTextAvailable: { color: colors.successDark },
  badgeTextBusy: { color: colors.warningDark },
  // Date pills
  dayScroll: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  dayPill: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  dayPillActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  dayPillLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 11,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  dayPillLabelActive: {
    color: colors.textWhite,
  },
  dayPillDate: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  dayPillDateActive: {
    color: colors.textWhite,
  },
  // Time grid
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  timeSlot: {
    width: '30%' as unknown as number,
    flexGrow: 1,
    flexBasis: '30%',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  timeSlotUnavailable: {
    backgroundColor: colors.offWhite,
    borderColor: colors.borderLight,
  },
  timeSlotActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  timeSlotText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  timeSlotTextUnavailable: {
    color: colors.textTertiary,
  },
  timeSlotTextActive: {
    color: colors.textWhite,
  },
  // Notes
  notesInput: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textPrimary,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.offWhite,
    borderRadius: 10,
    minHeight: 80,
  },
  // Bottom
  bottomSpacer: { height: 100 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bookButton: {
    backgroundColor: colors.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textWhite,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
