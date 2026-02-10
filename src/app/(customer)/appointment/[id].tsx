import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const APPOINTMENT = {
  id: 'appt-001',
  status: 'Confirmed' as const,
  service: {
    name: 'Balayage + Trim',
    duration: '2h 30min',
    price: 185.0,
  },
  stylist: {
    name: 'Jessica Moreno',
    initials: 'JM',
    specialty: 'Color Specialist',
  },
  date: 'Saturday, March 15, 2025',
  time: '10:00 AM - 12:30 PM',
  salon: {
    name: 'BookB Beauty Studio',
    address: '142 King Street West',
    city: 'Toronto, ON M5H 1J8',
    phone: '(416) 555-0192',
  },
  notes: 'I would like to go a bit lighter than last time. Please use toner to reduce brassiness. Also slightly shorter layers in the front.',
};

const STATUS_CONFIG = {
  Confirmed: { bg: colors.successLight, text: colors.successDark, label: 'Confirmed' },
  Pending: { bg: colors.warningLight, text: colors.warningDark, label: 'Pending' },
  Cancelled: { bg: colors.errorLight, text: colors.errorDark, label: 'Cancelled' },
};

export default function AppointmentDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const statusStyle = STATUS_CONFIG[APPOINTMENT.status];

  const handleReschedule = () => {
    Alert.alert(
      'Reschedule Appointment',
      `To reschedule, please call the salon directly at ${APPOINTMENT.salon.phone}.`,
      [{ text: 'OK', style: 'default' }],
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment? This action cannot be undone.',
      [
        { text: 'Keep Appointment', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Navy header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke={colors.textWhite}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointment Details</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status badge */}
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusStyle.text }]} />
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {statusStyle.label}
            </Text>
          </View>
          <Text style={styles.appointmentId}>#{id || APPOINTMENT.id}</Text>
        </View>

        {/* Service card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.gold} strokeWidth={1.8} />
              <Path
                d="M12 6v6l4 2"
                stroke={colors.gold}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.cardLabel}>Service</Text>
          </View>
          <Text style={styles.serviceName}>{APPOINTMENT.service.name}</Text>
          <View style={styles.serviceDetailsRow}>
            <View style={styles.serviceDetail}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={10} stroke={colors.textTertiary} strokeWidth={1.6} />
                <Path
                  d="M12 6v6l4 2"
                  stroke={colors.textTertiary}
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.serviceDetailText}>{APPOINTMENT.service.duration}</Text>
            </View>
            <View style={styles.serviceDetailDot} />
            <Text style={styles.servicePrice}>${APPOINTMENT.service.price.toFixed(2)}</Text>
          </View>
        </View>

        {/* Stylist card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                stroke={colors.textSecondary}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle cx={12} cy={7} r={4} stroke={colors.textSecondary} strokeWidth={1.8} />
            </Svg>
            <Text style={styles.cardLabel}>Stylist</Text>
          </View>
          <View style={styles.stylistRow}>
            <View style={styles.stylistAvatar}>
              <Text style={styles.stylistInitials}>{APPOINTMENT.stylist.initials}</Text>
            </View>
            <View style={styles.stylistInfo}>
              <Text style={styles.stylistName}>{APPOINTMENT.stylist.name}</Text>
              <Text style={styles.stylistSpecialty}>{APPOINTMENT.stylist.specialty}</Text>
            </View>
          </View>
        </View>

        {/* Date & Time card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.textSecondary} strokeWidth={1.8} />
              <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.textSecondary} strokeWidth={1.8} />
            </Svg>
            <Text style={styles.cardLabel}>Date & Time</Text>
          </View>
          <View style={styles.dateTimeContent}>
            <Text style={styles.dateText}>{APPOINTMENT.date}</Text>
            <Text style={styles.timeText}>{APPOINTMENT.time}</Text>
          </View>
        </View>

        {/* Salon location card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                stroke={colors.textSecondary}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle cx={12} cy={10} r={3} stroke={colors.textSecondary} strokeWidth={1.8} />
            </Svg>
            <Text style={styles.cardLabel}>Location</Text>
          </View>
          <View style={styles.locationContent}>
            <Text style={styles.salonName}>{APPOINTMENT.salon.name}</Text>
            <Text style={styles.salonAddress}>{APPOINTMENT.salon.address}</Text>
            <Text style={styles.salonAddress}>{APPOINTMENT.salon.city}</Text>
            <View style={styles.phoneRow}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                  stroke={colors.gold}
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.phoneText}>{APPOINTMENT.salon.phone}</Text>
            </View>
          </View>
        </View>

        {/* Notes card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke={colors.textSecondary}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                stroke={colors.textSecondary}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.cardLabel}>Notes</Text>
          </View>
          <Text style={styles.notesText}>{APPOINTMENT.notes}</Text>
        </View>

        {/* Bottom spacing for sticky buttons */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky bottom action buttons */}
      <View style={styles.stickyBottom}>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.rescheduleButton}
            onPress={handleReschedule}
            activeOpacity={0.7}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.navy} strokeWidth={1.8} />
              <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.navy} strokeWidth={1.8} />
            </Svg>
            <Text style={styles.rescheduleText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.error} strokeWidth={1.8} />
              <Line x1={15} y1={9} x2={9} y2={15} stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={9} y1={9} x2={15} y2={15} stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.cancelText}>Cancel Appointment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.textWhite,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },

  // Body
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 12 },

  // Status row
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  appointmentId: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textTertiary,
  },

  // Cards
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Service
  serviceName: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  serviceDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  serviceDetailText: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  serviceDetailDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textTertiary,
  },
  servicePrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    color: colors.textPrimary,
  },

  // Stylist
  stylistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stylistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(196,151,61,0.15)',
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stylistInitials: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.gold,
  },
  stylistInfo: {
    flex: 1,
  },
  stylistName: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  stylistSpecialty: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },

  // Date & Time
  dateTimeContent: {
    gap: 4,
  },
  dateText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  timeText: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Location
  locationContent: {
    gap: 2,
  },
  salonName: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  salonAddress: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  phoneText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.gold,
  },

  // Notes
  notesText: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  // Sticky bottom
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rescheduleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: colors.navy,
    backgroundColor: colors.white,
  },
  rescheduleText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.navy,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.15)',
  },
  cancelText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.error,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
