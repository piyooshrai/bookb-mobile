import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Rect, Line, Circle } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

type PaymentMethod = 'card' | 'cash' | 'apple-pay';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; sub: string }[] = [
  { id: 'card', label: 'Pay at Salon (Card)', sub: 'Visa, Mastercard, Amex' },
  { id: 'cash', label: 'Pay at Salon (Cash)', sub: 'Pay when you pick up' },
  { id: 'apple-pay', label: 'Apple Pay', sub: 'Contactless payment' },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ total: string; items: string }>();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const total = params.total || '0.00';
  const items = params.items || '0';

  if (orderPlaced) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Path d="M20 6L9 17l-5-5" stroke={colors.textWhite} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          <Text style={styles.successTitle}>Order Placed!</Text>
          <Text style={styles.successSubtitle}>Your order of ${total} has been placed</Text>
          <View style={styles.successCard}>
            <Text style={styles.successOrderId}>Order #BKB-1047</Text>
            <Text style={styles.successNote}>You'll get a notification when your order is ready for pickup.</Text>
          </View>
          <TouchableOpacity style={styles.doneButton} onPress={() => router.replace('/(customer)/')} activeOpacity={0.7}>
            <Text style={styles.doneButtonText}>BACK TO HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shopMoreButton} onPress={() => router.replace('/(customer)/shop/')} activeOpacity={0.7}>
            <Text style={styles.shopMoreText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" />
              <Path d="M12 19l-7-7 7-7" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Checkout</Text>
            <Text style={styles.subtitle}>{items} items · ${total}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity key={method.id} style={[styles.methodCard, selectedMethod === method.id && styles.methodCardActive]} onPress={() => setSelectedMethod(method.id)} activeOpacity={0.7}>
            <View style={styles.methodIcon}>
              {method.id === 'card' && <Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Rect x={1} y={4} width={22} height={16} rx={2} stroke={selectedMethod === method.id ? colors.navy : colors.textSecondary} strokeWidth={1.6} /><Line x1={1} y1={10} x2={23} y2={10} stroke={selectedMethod === method.id ? colors.navy : colors.textSecondary} strokeWidth={1.6} /></Svg>}
              {method.id === 'cash' && <Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Rect x={2} y={6} width={20} height={12} rx={2} stroke={selectedMethod === method.id ? colors.navy : colors.textSecondary} strokeWidth={1.6} /><Circle cx={12} cy={12} r={3} stroke={selectedMethod === method.id ? colors.navy : colors.textSecondary} strokeWidth={1.6} /></Svg>}
              {method.id === 'apple-pay' && <Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Path d="M12 2L2 7l10 5 10-5-10-5z" stroke={selectedMethod === method.id ? colors.navy : colors.textSecondary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" /><Path d="M2 17l10 5 10-5" stroke={selectedMethod === method.id ? colors.navy : colors.textSecondary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" /></Svg>}
            </View>
            <View style={styles.methodInfo}>
              <Text style={[styles.methodLabel, selectedMethod === method.id && styles.methodLabelActive]}>{method.label}</Text>
              <Text style={styles.methodSub}>{method.sub}</Text>
            </View>
            <View style={[styles.radioOuter, selectedMethod === method.id && styles.radioOuterActive]}>
              {selectedMethod === method.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Pickup Location</Text>
        <View style={styles.pickupCard}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={colors.navy} strokeWidth={1.8} />
            <Circle cx={12} cy={10} r={3} stroke={colors.navy} strokeWidth={1.8} />
          </Svg>
          <View style={{ flex: 1 }}>
            <Text style={styles.pickupName}>Luxe Hair Studio</Text>
            <Text style={styles.pickupAddr}>142 West 57th St</Text>
          </View>
        </View>

        <View style={styles.orderSummary}>
          <View style={styles.orderRow}><Text style={styles.orderLabel}>Subtotal</Text><Text style={styles.orderValue}>${total}</Text></View>
          <View style={styles.orderRow}><Text style={styles.orderLabel}>Tax</Text><Text style={styles.orderValue}>$0.00</Text></View>
          <View style={styles.orderDivider} />
          <View style={styles.orderRow}><Text style={styles.orderTotalLabel}>Total</Text><Text style={styles.orderTotalValue}>${total}</Text></View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.placeButton} onPress={() => setOrderPlaced(true)} activeOpacity={0.7}>
          <Text style={styles.placeText}>PLACE ORDER</Text>
          <Text style={styles.placePrice}>${total}</Text>
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
  sectionTitle: { fontFamily: fontFamilies.bodySemiBold, fontSize: 15, color: colors.textPrimary, marginTop: 4 },
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 14 },
  methodCardActive: { borderColor: colors.navy, borderWidth: 1.5, backgroundColor: 'rgba(26,39,68,0.03)' },
  methodIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.offWhite, alignItems: 'center', justifyContent: 'center' },
  methodInfo: { flex: 1 },
  methodLabel: { fontFamily: fontFamilies.bodyMedium, fontSize: 14, color: colors.textPrimary },
  methodLabelActive: { fontFamily: fontFamilies.bodySemiBold },
  methodSub: { fontFamily: fontFamilies.body, fontSize: 12, color: colors.textTertiary, marginTop: 1 },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: colors.navy },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.navy },
  pickupCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 14 },
  pickupName: { fontFamily: fontFamilies.bodyMedium, fontSize: 14, color: colors.textPrimary },
  pickupAddr: { fontFamily: fontFamilies.body, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  orderSummary: { backgroundColor: colors.navy, borderRadius: 14, padding: 18, marginTop: 4 },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderLabel: { fontFamily: fontFamilies.body, fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  orderValue: { fontFamily: fontFamilies.bodyMedium, fontSize: 14, color: colors.textWhite },
  orderDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 8 },
  orderTotalLabel: { fontFamily: fontFamilies.bodySemiBold, fontSize: 16, color: colors.textWhite },
  orderTotalValue: { fontFamily: fontFamilies.heading, fontSize: 22, color: colors.gold },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 34 },
  placeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.gold, borderRadius: 12, paddingVertical: 16 },
  placeText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 14, color: colors.white, letterSpacing: 2 },
  placePrice: { fontFamily: fontFamilies.heading, fontSize: 16, color: colors.white },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { fontFamily: fontFamilies.heading, fontSize: 26, color: colors.textPrimary, marginBottom: 8 },
  successSubtitle: { fontFamily: fontFamilies.body, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  successCard: { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 20, width: '100%', alignItems: 'center', marginBottom: 28 },
  successOrderId: { fontFamily: fontFamilies.heading, fontSize: 18, color: colors.navy, marginBottom: 8 },
  successNote: { fontFamily: fontFamilies.body, fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  doneButton: { backgroundColor: colors.navy, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 32, width: '100%', alignItems: 'center', marginBottom: 12 },
  doneButtonText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 14, color: colors.white, letterSpacing: 2 },
  shopMoreButton: { paddingVertical: 12 },
  shopMoreText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 14, color: colors.gold },
});
