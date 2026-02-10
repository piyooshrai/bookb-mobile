import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const CATEGORIES = ['All', 'Shampoo', 'Conditioner', 'Styling', 'Treatment', 'Tools'];

const CATEGORY_COLORS: Record<string, string> = {
  Treatment: '#8b5cf6',
  Styling: '#f59e0b',
  Conditioner: '#3b82f6',
  Tools: '#6b7280',
  Shampoo: '#22c55e',
};

const MOCK_PRODUCTS = [
  { id: '1', name: 'Olaplex No.3', brand: 'Olaplex', price: 28, category: 'Treatment', initial: 'O' },
  { id: '2', name: 'Moroccan Oil', brand: 'Moroccanoil', price: 34, category: 'Styling', initial: 'M' },
  { id: '3', name: 'Redken Leave-in', brand: 'Redken', price: 22, category: 'Conditioner', initial: 'R' },
  { id: '4', name: 'Dyson Airwrap', brand: 'Dyson', price: 599, category: 'Tools', initial: 'D' },
  { id: '5', name: 'Color Wow Dream Coat', brand: 'Color Wow', price: 28, category: 'Styling', initial: 'C' },
  { id: '6', name: 'K18 Mask', brand: 'K18', price: 75, category: 'Treatment', initial: 'K' },
  { id: '7', name: 'Purple Shampoo', brand: 'Redken', price: 18, category: 'Shampoo', initial: 'P' },
  { id: '8', name: 'Heat Protectant', brand: 'Chi', price: 24, category: 'Styling', initial: 'H' },
];

const CART_ITEMS = 3;
const CART_TOTAL = 84.0;

export default function ShopScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts =
    activeCategory === 'All'
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Shop</Text>
            <Text style={styles.subtitle}>Products from Luxe Hair Studio</Text>
          </View>
          {/* Cart icon with badge */}
          <TouchableOpacity style={styles.cartButton} activeOpacity={0.7}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Rect x={4} y={8} width={16} height={14} rx={2} stroke={colors.textWhite} strokeWidth={1.6} />
              <Path d="M8 8V6a4 4 0 0 1 8 0v2" stroke={colors.textWhite} strokeWidth={1.6} strokeLinecap="round" />
            </Svg>
            {CART_ITEMS > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{CART_ITEMS}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Category pills */}
      <View style={styles.categoryWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                activeCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product Grid + Orders */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {filteredProducts.map((product) => {
            const catColor = CATEGORY_COLORS[product.category] || colors.navy;
            return (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                activeOpacity={0.7}
                onPress={() => router.push(`/(customer)/shop/${product.id}`)}
              >
                {/* Category color stripe at top */}
                <View style={[styles.categoryStripe, { backgroundColor: catColor }]} />

                {/* Product image placeholder */}
                <View style={[styles.productImageWrap, { backgroundColor: catColor + '10' }]}>
                  <View style={[styles.productImage, { backgroundColor: catColor + '20' }]}>
                    <Text style={[styles.productInitial, { color: catColor }]}>{product.initial}</Text>
                  </View>
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productBrand}>{product.brand}</Text>
                  <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>${product.price}</Text>
                    <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
                      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M12 5v14M5 12h14"
                          stroke={colors.textWhite}
                          strokeWidth={2.2}
                          strokeLinecap="round"
                        />
                      </Svg>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* My Orders row */}
        <TouchableOpacity style={styles.ordersRow} activeOpacity={0.7}>
          <View style={styles.ordersIconWrap}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={3} width={18} height={18} rx={2} stroke={colors.navy} strokeWidth={1.6} />
              <Line x1={7} y1={8} x2={17} y2={8} stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" />
              <Line x1={7} y1={12} x2={17} y2={12} stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" />
              <Line x1={7} y1={16} x2={12} y2={16} stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" />
            </Svg>
          </View>
          <Text style={styles.ordersText}>View Order History</Text>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9 18l6-6-6-6"
              stroke={colors.textTertiary}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        {/* Spacing for floating cart bar */}
        {CART_ITEMS > 0 && <View style={{ height: 80 }} />}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Floating cart bar */}
      {CART_ITEMS > 0 && (
        <View style={styles.floatingCartBar}>
          <View style={styles.floatingCartInfo}>
            <View style={styles.floatingCartBadge}>
              <Text style={styles.floatingCartBadgeText}>{CART_ITEMS}</Text>
            </View>
            <Text style={styles.floatingCartLabel}>
              {CART_ITEMS} {(CART_ITEMS as number) === 1 ? 'item' : 'items'} - ${CART_TOTAL.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.8}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 12h14M12 5l7 7-7 7"
                stroke={colors.textWhite}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    color: 'rgba(255,255,255,0.5)',
  },
  cartButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    color: colors.textWhite,
  },

  // Categories
  categoryWrap: {
    paddingTop: 16,
    paddingBottom: 4,
  },
  categoryRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  categoryText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.textWhite,
  },

  // Grid
  body: { flex: 1 },
  bodyContent: { padding: 20 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    flexGrow: 1,
  },
  categoryStripe: {
    height: 3,
  },
  productImageWrap: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInitial: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
  },
  productInfo: {
    padding: 12,
  },
  productBrand: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    color: colors.gold,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
  },
  productName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textPrimary,
    marginTop: 3,
    minHeight: 36,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  productPrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 16,
    color: colors.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.navy,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    color: colors.textWhite,
    letterSpacing: 0.5,
  },

  // Orders row
  ordersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginTop: 20,
    gap: 12,
  },
  ordersIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ordersText: {
    flex: 1,
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },

  // Floating cart bar
  floatingCartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.navy,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  floatingCartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  floatingCartBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingCartBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    color: colors.textWhite,
  },
  floatingCartLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textWhite,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  checkoutButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textWhite,
    letterSpacing: 0.5,
  },
});
