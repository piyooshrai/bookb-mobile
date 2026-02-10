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

interface CartItem {
  id: string;
  type: 'service' | 'product';
  name: string;
  price: number;
}

const CART_ITEMS: CartItem[] = [
  { id: '1', type: 'service', name: 'Balayage + Trim', price: 185.0 },
  { id: '2', type: 'product', name: 'Olaplex No.3', price: 28.0 },
  { id: '3', type: 'product', name: 'Leave-in Conditioner', price: 22.0 },
];

const SUBTOTAL = 235.0;
const DISCOUNT_AMOUNT = 23.5;
const TAX_RATE = 0.08;
const DISCOUNTED_SUBTOTAL = SUBTOTAL - DISCOUNT_AMOUNT;
const TAX = parseFloat((DISCOUNTED_SUBTOTAL * TAX_RATE).toFixed(2));
const TOTAL_BEFORE_TIP = parseFloat((DISCOUNTED_SUBTOTAL + TAX).toFixed(2));

const TIP_OPTIONS = [
  { label: '15%', rate: 0.15 },
  { label: '18%', rate: 0.18 },
  { label: '20%', rate: 0.20 },
  { label: 'Custom', rate: 0 },
];

type PaymentMethod = 'cash' | 'card' | 'apple_pay';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CheckoutScreen() {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(true);
  const [selectedTip, setSelectedTip] = useState(1); // 18% index
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('card');

  const tipRate = TIP_OPTIONS[selectedTip].rate;
  const tipAmount = parseFloat((TOTAL_BEFORE_TIP * tipRate).toFixed(2));
  const grandTotal = parseFloat((TOTAL_BEFORE_TIP + tipAmount).toFixed(2));

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
            <Text style={styles.title}>Checkout</Text>
            <Text style={styles.subtitle}>Complete the transaction</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Cart Items Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Circle cx={9} cy={21} r={1} stroke={colors.navy} strokeWidth={1.8} />
              <Circle cx={20} cy={21} r={1} stroke={colors.navy} strokeWidth={1.8} />
              <Path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Cart Items</Text>
          </View>
          {CART_ITEMS.map((item) => (
            <View key={item.id} style={styles.cartRow}>
              <View style={styles.cartItemInfo}>
                <View style={[styles.typeBadge, item.type === 'service' ? styles.typeBadgeService : styles.typeBadgeProduct]}>
                  <Text style={[styles.typeBadgeText, item.type === 'service' ? styles.typeBadgeTextService : styles.typeBadgeTextProduct]}>
                    {item.type === 'service' ? 'Service' : 'Product'}
                  </Text>
                </View>
                <Text style={styles.cartItemName}>{item.name}</Text>
              </View>
              <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Discount Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Line x1={7} y1={7} x2={7.01} y2={7} stroke={colors.navy} strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text style={styles.cardTitle}>Discount</Text>
          </View>
          <View style={styles.couponRow}>
            <TextInput
              style={styles.couponInput}
              placeholder="Coupon code"
              placeholderTextColor={colors.textTertiary}
              value={couponCode}
              onChangeText={setCouponCode}
            />
            <TouchableOpacity style={styles.applyButton} activeOpacity={0.7}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          {couponApplied && (
            <View style={styles.appliedRow}>
              <View style={styles.appliedBadge}>
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Path d="M20 6L9 17l-5-5" stroke={colors.successDark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.appliedText}>WELCOME10 - 10% off</Text>
              </View>
              <TouchableOpacity onPress={() => setCouponApplied(false)} activeOpacity={0.7} style={styles.removeButton}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Line x1={18} y1={6} x2={6} y2={18} stroke={colors.textTertiary} strokeWidth={2} strokeLinecap="round" />
                  <Line x1={6} y1={6} x2={18} y2={18} stroke={colors.textTertiary} strokeWidth={2} strokeLinecap="round" />
                </Svg>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Price Breakdown Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Line x1={12} y1={1} x2={12} y2={23} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Price Breakdown</Text>
          </View>
          <View style={styles.breakdownBody}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Subtotal</Text>
              <Text style={styles.breakdownValue}>${SUBTOTAL.toFixed(2)}</Text>
            </View>
            {couponApplied && (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabelDiscount}>Discount</Text>
                <Text style={styles.breakdownValueDiscount}>-${DISCOUNT_AMOUNT.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Tax (8%)</Text>
              <Text style={styles.breakdownValue}>${TAX.toFixed(2)}</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownTotalLabel}>Total</Text>
              <Text style={styles.breakdownTotalValue}>${TOTAL_BEFORE_TIP.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Tip Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" stroke={colors.navy} strokeWidth={1.8} />
              <Line x1={12} y1={6} x2={12} y2={18} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Path d="M15 9.5a2.5 2.5 0 0 0-2.5-2.5H11a2.5 2.5 0 0 0 0 5h2a2.5 2.5 0 0 1 0 5h-1.5A2.5 2.5 0 0 1 9 14.5" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Tip</Text>
          </View>
          <View style={styles.tipRow}>
            {TIP_OPTIONS.map((tip, index) => (
              <TouchableOpacity
                key={tip.label}
                style={[styles.tipButton, selectedTip === index && styles.tipButtonActive]}
                onPress={() => setSelectedTip(index)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tipButtonText, selectedTip === index && styles.tipButtonTextActive]}>
                  {tip.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedTip !== 3 && (
            <View style={styles.tipAmountRow}>
              <Text style={styles.tipAmountLabel}>Tip amount</Text>
              <Text style={styles.tipAmountValue}>${tipAmount.toFixed(2)}</Text>
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect x={1} y={4} width={22} height={16} rx={2} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Line x1={1} y1={10} x2={23} y2={10} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.cardTitle}>Payment Method</Text>
          </View>
          <View style={styles.paymentRow}>
            {/* Cash */}
            <TouchableOpacity
              style={[styles.paymentCard, selectedPayment === 'cash' && styles.paymentCardActive]}
              onPress={() => setSelectedPayment('cash')}
              activeOpacity={0.7}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Rect x={2} y={6} width={20} height={12} rx={2} stroke={selectedPayment === 'cash' ? colors.navy : colors.textSecondary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx={12} cy={12} r={3} stroke={selectedPayment === 'cash' ? colors.navy : colors.textSecondary} strokeWidth={1.6} />
                <Line x1={2} y1={10} x2={5} y2={10} stroke={selectedPayment === 'cash' ? colors.navy : colors.textSecondary} strokeWidth={1.6} strokeLinecap="round" />
                <Line x1={19} y1={10} x2={22} y2={10} stroke={selectedPayment === 'cash' ? colors.navy : colors.textSecondary} strokeWidth={1.6} strokeLinecap="round" />
              </Svg>
              <Text style={[styles.paymentCardText, selectedPayment === 'cash' && styles.paymentCardTextActive]}>Cash</Text>
            </TouchableOpacity>

            {/* Card */}
            <TouchableOpacity
              style={[styles.paymentCard, selectedPayment === 'card' && styles.paymentCardActive]}
              onPress={() => setSelectedPayment('card')}
              activeOpacity={0.7}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Rect x={1} y={4} width={22} height={16} rx={2} stroke={selectedPayment === 'card' ? colors.navy : colors.textSecondary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Line x1={1} y1={10} x2={23} y2={10} stroke={selectedPayment === 'card' ? colors.navy : colors.textSecondary} strokeWidth={1.6} strokeLinecap="round" />
              </Svg>
              <Text style={[styles.paymentCardText, selectedPayment === 'card' && styles.paymentCardTextActive]}>Card</Text>
            </TouchableOpacity>

            {/* Apple Pay */}
            <TouchableOpacity
              style={[styles.paymentCard, selectedPayment === 'apple_pay' && styles.paymentCardActive]}
              onPress={() => setSelectedPayment('apple_pay')}
              activeOpacity={0.7}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83" stroke={selectedPayment === 'apple_pay' ? colors.navy : colors.textSecondary} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M15 1c.2 1.07-.35 2.16-1.04 2.93-.7.78-1.83 1.38-2.96 1.3-.23-1.04.39-2.15 1.06-2.84C12.76 1.61 13.93 1.06 15 1z" stroke={selectedPayment === 'apple_pay' ? colors.navy : colors.textSecondary} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={[styles.paymentCardText, selectedPayment === 'apple_pay' && styles.paymentCardTextActive]}>Apple Pay</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Client */}
        <View style={styles.card}>
          <View style={styles.clientRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SM</Text>
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>Sarah Mitchell</Text>
              <Text style={styles.clientMeta}>Regular client</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.completeButton} activeOpacity={0.8}>
          <Text style={styles.completeButtonText}>Complete Payment - ${grandTotal.toFixed(2)}</Text>
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
  // Cart items
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  cartItemInfo: {
    flex: 1,
    gap: 4,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeService: {
    backgroundColor: colors.infoLight,
  },
  typeBadgeProduct: {
    backgroundColor: colors.warningLight,
  },
  typeBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeBadgeTextService: {
    color: colors.infoDark,
  },
  typeBadgeTextProduct: {
    color: colors.warningDark,
  },
  cartItemName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  cartItemPrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 15,
    color: colors.textPrimary,
  },
  // Coupon
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  couponInput: {
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.offWhite,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 0,
    height: 42,
  },
  applyButton: {
    backgroundColor: colors.navy,
    paddingHorizontal: 20,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textWhite,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appliedText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.successDark,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Breakdown
  breakdownBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  breakdownLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  breakdownLabelDiscount: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.successDark,
  },
  breakdownValueDiscount: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.successDark,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 8,
  },
  breakdownTotalLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  breakdownTotalValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.textPrimary,
  },
  // Tip
  tipRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  tipButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  tipButtonActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  tipButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  tipButtonTextActive: {
    color: colors.textWhite,
  },
  tipAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.offWhite,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tipAmountLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  tipAmountValue: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  // Payment method
  paymentRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  paymentCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    gap: 8,
  },
  paymentCardActive: {
    borderColor: colors.navy,
    backgroundColor: 'rgba(26, 39, 68, 0.03)',
  },
  paymentCardText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  paymentCardTextActive: {
    color: colors.navy,
  },
  // Client
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
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
  },
  clientMeta: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
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
  completeButton: {
    backgroundColor: colors.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textWhite,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
