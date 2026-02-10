import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

type PaymentMethod = 'card' | 'cash' | 'apple-pay';

interface Transaction {
  id: string;
  client: string;
  service: string;
  amount: number;
  method: PaymentMethod;
  time: string;
  stylist: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', client: 'Sarah Mitchell', service: 'Blowout & Style', amount: 65, method: 'card', time: '10:42 AM', stylist: 'Jessica R.' },
  { id: '2', client: 'Natalie Brooks', service: 'Haircut + Layers', amount: 85, method: 'apple-pay', time: '10:28 AM', stylist: 'Marcus T.' },
  { id: '3', client: 'Olivia Chen', service: 'Full Balayage', amount: 220, method: 'card', time: '10:05 AM', stylist: 'Jessica R.' },
  { id: '4', client: 'Aisha Patel', service: 'Color + Gloss + Add-Ons', amount: 195, method: 'cash', time: '9:48 AM', stylist: 'Priya S.' },
  { id: '5', client: 'Lauren Kim', service: 'Bang Trim', amount: 35, method: 'card', time: '9:30 AM', stylist: 'Liam K.' },
  { id: '6', client: 'Diana Foster', service: 'Keratin Treatment', amount: 180, method: 'card', time: '9:12 AM', stylist: 'Liam K.' },
  { id: '7', client: 'Megan Rivera', service: 'Root Touch-Up + Gloss', amount: 115, method: 'apple-pay', time: '8:55 AM', stylist: 'Marcus T.' },
  { id: '8', client: 'Emma Thompson', service: 'Haircut + Blowout', amount: 110, method: 'cash', time: '8:32 AM', stylist: 'Jessica R.' },
];

const todayTotal = MOCK_TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0);
const cardTotal = MOCK_TRANSACTIONS.filter((t) => t.method === 'card').reduce((sum, t) => sum + t.amount, 0);
const cashTotal = MOCK_TRANSACTIONS.filter((t) => t.method === 'cash').reduce((sum, t) => sum + t.amount, 0);
const applePayTotal = MOCK_TRANSACTIONS.filter((t) => t.method === 'apple-pay').reduce((sum, t) => sum + t.amount, 0);
const cardCount = MOCK_TRANSACTIONS.filter((t) => t.method === 'card').length;
const cashCount = MOCK_TRANSACTIONS.filter((t) => t.method === 'cash').length;
const applePayCount = MOCK_TRANSACTIONS.filter((t) => t.method === 'apple-pay').length;

const METHOD_CONFIG: Record<PaymentMethod, { bg: string; text: string; label: string }> = {
  card: { bg: colors.infoLight, text: colors.infoDark, label: 'Card' },
  cash: { bg: colors.successLight, text: colors.successDark, label: 'Cash' },
  'apple-pay': { bg: '#f0e6ff', text: '#7c3aed', label: 'Apple Pay' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PointOfSaleScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Point of Sale</Text>
            <Text style={styles.subtitle}>Today's transactions {'\u00B7'} {MOCK_TRANSACTIONS.length} payments</Text>
          </View>
          <TouchableOpacity style={styles.newOrderButton} activeOpacity={0.7} onPress={() => router.push('/(salon)/pos/create')}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M12 5v14M5 12h14" stroke={colors.navy} strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text style={styles.newOrderText}>New Order</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Summary cards */}
        <View style={styles.summaryRow}>
          {/* Total */}
          <View style={[styles.summaryCard, styles.summaryCardMain]}>
            <View style={styles.summaryIconWrap}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Line x1={12} y1={1} x2={12} y2={23} stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" />
                <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <Text style={styles.summaryValueMain}>${todayTotal.toLocaleString()}</Text>
            <Text style={styles.summaryLabelMain}>Total today</Text>
          </View>
        </View>

        <View style={styles.breakdownRow}>
          {/* Card */}
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownTop}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Rect x={1} y={4} width={22} height={16} rx={2} stroke={colors.infoDark} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Line x1={1} y1={10} x2={23} y2={10} stroke={colors.infoDark} strokeWidth={1.6} strokeLinecap="round" />
              </Svg>
              <Text style={styles.breakdownCount}>{cardCount} txns</Text>
            </View>
            <Text style={styles.breakdownValue}>${cardTotal.toLocaleString()}</Text>
            <Text style={styles.breakdownLabel}>Card</Text>
          </View>

          {/* Cash */}
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownTop}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Rect x={2} y={6} width={20} height={12} rx={2} stroke={colors.successDark} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx={12} cy={12} r={3} stroke={colors.successDark} strokeWidth={1.6} />
              </Svg>
              <Text style={styles.breakdownCount}>{cashCount} txns</Text>
            </View>
            <Text style={styles.breakdownValue}>${cashTotal.toLocaleString()}</Text>
            <Text style={styles.breakdownLabel}>Cash</Text>
          </View>

          {/* Apple Pay */}
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownTop}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#7c3aed" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M2 17l10 5 10-5" stroke="#7c3aed" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M2 12l10 5 10-5" stroke="#7c3aed" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.breakdownCount}>{applePayCount} txns</Text>
            </View>
            <Text style={styles.breakdownValue}>${applePayTotal.toLocaleString()}</Text>
            <Text style={styles.breakdownLabel}>Apple Pay</Text>
          </View>
        </View>

        {/* Recent transactions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M12 6v6l4 2" stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx={12} cy={12} r={10} stroke={colors.navy} strokeWidth={1.6} />
              </Svg>
              <Text style={styles.cardTitle}>Recent Transactions</Text>
            </View>
          </View>

          {MOCK_TRANSACTIONS.map((txn) => {
            const methodCfg = METHOD_CONFIG[txn.method];
            return (
              <View key={txn.id} style={styles.txnRow}>
                {/* Avatar */}
                <View style={styles.txnAvatar}>
                  <Text style={styles.txnAvatarText}>{txn.client[0]}</Text>
                </View>

                {/* Details */}
                <View style={styles.txnDetails}>
                  <Text style={styles.txnClient}>{txn.client}</Text>
                  <Text style={styles.txnService}>{txn.service}</Text>
                  <View style={styles.txnMeta}>
                    <Text style={styles.txnTime}>{txn.time}</Text>
                    <View style={styles.txnMetaDot} />
                    <Text style={styles.txnStylist}>{txn.stylist}</Text>
                  </View>
                </View>

                {/* Amount & method */}
                <View style={styles.txnRight}>
                  <Text style={styles.txnAmount}>${txn.amount}</Text>
                  <View style={[styles.methodBadge, { backgroundColor: methodCfg.bg }]}>
                    <Text style={[styles.methodText, { color: methodCfg.text }]}>{methodCfg.label}</Text>
                  </View>
                </View>
              </View>
            );
          })}
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
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
    marginBottom: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
  },
  newOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.gold,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 2,
  },
  newOrderText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.navy,
  },
  // Body
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 16 },
  // Summary
  summaryRow: {
    flexDirection: 'row',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    alignItems: 'center',
  },
  summaryCardMain: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  summaryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  summaryValueMain: {
    fontFamily: fontFamilies.heading,
    fontSize: 32,
    color: colors.textWhite,
  },
  summaryLabelMain: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
    marginTop: 2,
  },
  // Breakdown
  breakdownRow: {
    flexDirection: 'row',
    gap: 10,
  },
  breakdownCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  breakdownTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  breakdownCount: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
  },
  breakdownValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.textPrimary,
  },
  breakdownLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  // Transaction row
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  txnAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txnAvatarText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textWhite,
  },
  txnDetails: {
    flex: 1,
    paddingLeft: 12,
  },
  txnClient: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  txnService: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  txnMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  txnTime: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
  },
  txnMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
    marginHorizontal: 6,
  },
  txnStylist: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
  },
  txnRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txnAmount: {
    fontFamily: fontFamilies.heading,
    fontSize: 15,
    color: colors.textPrimary,
  },
  methodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  methodText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bottomSpacer: { height: 20 },
});
