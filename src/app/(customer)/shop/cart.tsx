import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
}

const INITIAL_CART: CartItem[] = [
  { id: '1', name: 'Olaplex No.3', brand: 'Olaplex', price: 28, quantity: 1 },
  { id: '2', name: 'Moroccan Oil', brand: 'Moroccanoil', price: 34, quantity: 1 },
  { id: '3', name: 'Purple Shampoo', brand: 'Redken', price: 18, quantity: 2 },
];

export default function CartScreen() {
  const router = useRouter();
  const [cart, setCart] = useState(INITIAL_CART);

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)).filter((item) => item.quantity > 0),
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
            <Text style={styles.title}>My Cart</Text>
            <Text style={styles.subtitle}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {cart.length === 0 ? (
          <View style={styles.emptyState}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Rect x={4} y={8} width={16} height={14} rx={2} stroke={colors.textTertiary} strokeWidth={1.5} />
              <Path d="M8 8V6a4 4 0 0 1 8 0v2" stroke={colors.textTertiary} strokeWidth={1.5} strokeLinecap="round" />
            </Svg>
            <Text style={styles.emptyTitle}>Cart is empty</Text>
            <Text style={styles.emptySubtitle}>Browse products and add items</Text>
            <TouchableOpacity style={styles.shopBtn} onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={styles.shopBtnText}>BROWSE SHOP</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemAvatar}>
                  <Text style={styles.itemInitial}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemBrand}>{item.brand}</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>
                <View style={styles.qtyControls}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1)} activeOpacity={0.7}>
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Path d="M5 12h14" stroke={colors.textPrimary} strokeWidth={2} strokeLinecap="round" />
                    </Svg>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1)} activeOpacity={0.7}>
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Path d="M12 5v14M5 12h14" stroke={colors.textPrimary} strokeWidth={2} strokeLinecap="round" />
                    </Svg>
                  </TouchableOpacity>
                </View>
                <Text style={styles.lineTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal ({itemCount} items)</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
              </View>
            </View>
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {cart.length > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.7} onPress={() => router.push({ pathname: '/(customer)/shop/checkout', params: { total: subtotal.toFixed(2), items: String(itemCount) } })}>
            <Text style={styles.checkoutText}>CHECKOUT</Text>
            <Text style={styles.checkoutPrice}>${subtotal.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      )}
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
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 12 },
  itemAvatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.offWhite, alignItems: 'center', justifyContent: 'center' },
  itemInitial: { fontFamily: fontFamilies.heading, fontSize: 16, color: colors.navy },
  itemInfo: { flex: 1 },
  itemBrand: { fontFamily: fontFamilies.bodySemiBold, fontSize: 9, color: colors.gold, letterSpacing: 1, textTransform: 'uppercase' as const },
  itemName: { fontFamily: fontFamilies.bodyMedium, fontSize: 14, color: colors.textPrimary, marginTop: 1 },
  itemPrice: { fontFamily: fontFamilies.body, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 15, color: colors.textPrimary, minWidth: 18, textAlign: 'center' },
  lineTotal: { fontFamily: fontFamilies.heading, fontSize: 15, color: colors.textPrimary, minWidth: 50, textAlign: 'right' },
  summaryCard: { backgroundColor: colors.navy, borderRadius: 14, padding: 18, marginTop: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontFamily: fontFamilies.body, fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  summaryValue: { fontFamily: fontFamilies.bodyMedium, fontSize: 14, color: colors.textWhite },
  summaryDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 12 },
  totalLabel: { fontFamily: fontFamilies.bodySemiBold, fontSize: 16, color: colors.textWhite },
  totalValue: { fontFamily: fontFamilies.heading, fontSize: 22, color: colors.gold },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontFamily: fontFamilies.heading, fontSize: 20, color: colors.textPrimary },
  emptySubtitle: { fontFamily: fontFamilies.body, fontSize: 14, color: colors.textSecondary },
  shopBtn: { backgroundColor: colors.navy, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28, marginTop: 12 },
  shopBtnText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 13, color: colors.white, letterSpacing: 2 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 34 },
  checkoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.gold, borderRadius: 12, paddingVertical: 16 },
  checkoutText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 14, color: colors.white, letterSpacing: 2 },
  checkoutPrice: { fontFamily: fontFamilies.heading, fontSize: 16, color: colors.white },
});
