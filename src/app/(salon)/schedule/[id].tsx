import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_APPOINTMENT = {
  id: '1',
  status: 'Confirmed' as const,
  client: {
    name: 'Sarah Mitchell',
    initials: 'SM',
    phone: '(212) 555-0147',
    email: 'sarah.mitchell@email.com',
    visits: 42,
  },
  service: 'Balayage + Trim',
  duration: '90 min',
  stylist: 'Jessica R.',
  date: 'Feb 12, 2026',
  time: '11:30 AM',
  price: 185,
  notes: 'Client prefers warm tones. Allergic to ammonia-based products.',
  payment: {
    subtotal: 185.0,
    tax: 14.80,
    total: 199.80,
    method: 'Card ending 4242',
  },
  history: [
    { id: '1', date: 'Jan 28, 2026', service: 'Root Touch-Up', amount: 95 },
    { id: '2', date: 'Jan 10, 2026', service: 'Blowout & Style', amount: 65 },
    { id: '3', date: 'Dec 18, 2025', service: 'Balayage + Trim', amount: 185 },
  ],
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AppointmentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const apt = MOCK_APPOINTMENT;

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
            <Text style={styles.title}>Appointment</Text>
            <Text style={styles.subtitle}>#{id || '1'}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <View style={styles.statusRow}>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{apt.status}</Text>
          </View>
        </View>

        {/* Client Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx={12} cy={7} r={4} stroke={colors.navy} strokeWidth={1.8} />
            </Svg>
            <Text style={styles.cardTitle}>Client</Text>
          </View>
          <View style={styles.clientRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{apt.client.initials}</Text>
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{apt.client.name}</Text>
              <Text style={styles.clientDetail}>{apt.client.phone}</Text>
              <Text style={styles.clientDetail}>{apt.client.email}</Text>
            </View>
            <View style={styles.visitsBadge}>
              <Text style={styles.visitsBadgeText}>{apt.client.visits} visits</Text>
            </View>
          </View>
        </View>

        {/* Appointment Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.cardTitle}>Details</Text>
          </View>
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Service</Text>
              <Text style={styles.detailValue}>{apt.service}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{apt.duration}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Stylist</Text>
              <Text style={styles.detailValue}>{apt.stylist}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{apt.date}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{apt.time}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValuePrice}>${apt.price}</Text>
            </View>
          </View>
        </View>

        {/* Notes Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M14 2v6h6" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Notes</Text>
          </View>
          <View style={styles.notesBody}>
            <Text style={styles.notesText}>{apt.notes}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionOutline} activeOpacity={0.7}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.actionOutlineText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCancel} activeOpacity={0.7}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.error} strokeWidth={1.8} />
              <Line x1={15} y1={9} x2={9} y2={15} stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={9} y1={9} x2={15} y2={15} stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.actionCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionComplete} activeOpacity={0.7}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M20 6L9 17l-5-5" stroke={colors.textWhite} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.actionCompleteText}>Complete</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect x={1} y={4} width={22} height={16} rx={2} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Line x1={1} y1={10} x2={23} y2={10} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.cardTitle}>Payment</Text>
          </View>
          <View style={styles.paymentBody}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Subtotal</Text>
              <Text style={styles.paymentValue}>${apt.payment.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Tax</Text>
              <Text style={styles.paymentValue}>${apt.payment.tax.toFixed(2)}</Text>
            </View>
            <View style={styles.paymentDivider} />
            <View style={styles.paymentRow}>
              <Text style={styles.paymentTotalLabel}>Total</Text>
              <Text style={styles.paymentTotalValue}>${apt.payment.total.toFixed(2)}</Text>
            </View>
            <View style={styles.paymentMethodRow}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Rect x={1} y={4} width={22} height={16} rx={2} stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Line x1={1} y1={10} x2={23} y2={10} stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" />
              </Svg>
              <Text style={styles.paymentMethodText}>{apt.payment.method}</Text>
            </View>
          </View>
        </View>

        {/* History Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.navy} strokeWidth={1.8} />
              <Path d="M12 6v6l4 2" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Previous Visits</Text>
          </View>
          {apt.history.map((visit) => (
            <View key={visit.id} style={styles.historyRow}>
              <View style={styles.historyInfo}>
                <Text style={styles.historyService}>{visit.service}</Text>
                <Text style={styles.historyDate}>{visit.date}</Text>
              </View>
              <Text style={styles.historyAmount}>${visit.amount}</Text>
            </View>
          ))}
        </View>

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
  // Status
  statusRow: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.successLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.successDark,
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
  // Client
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 18,
    color: colors.textWhite,
  },
  clientInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  clientName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  clientDetail: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  visitsBadge: {
    backgroundColor: colors.goldLight + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  visitsBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    color: colors.goldDark,
  },
  // Details
  detailGrid: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  detailLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  detailValue: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  detailValuePrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 16,
    color: colors.textPrimary,
  },
  // Notes
  notesBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  notesText: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  // Actions
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  actionOutlineText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.navy,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionCancel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.errorLight,
    backgroundColor: colors.white,
  },
  actionCancelText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.error,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionComplete: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.gold,
  },
  actionCompleteText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.textWhite,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // Payment
  paymentBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  paymentLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  paymentValue: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  paymentDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 8,
  },
  paymentTotalLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  paymentTotalValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.textPrimary,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    backgroundColor: colors.offWhite,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  paymentMethodText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  // History
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  historyInfo: {
    flex: 1,
  },
  historyService: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  historyDate: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  historyAmount: {
    fontFamily: fontFamilies.heading,
    fontSize: 14,
    color: colors.textPrimary,
  },
  bottomSpacer: { height: 20 },
});
