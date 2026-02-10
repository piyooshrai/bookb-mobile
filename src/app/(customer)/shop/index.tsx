import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const CATEGORIES = ['All', 'Shampoo', 'Conditioner', 'Styling', 'Tools'];

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'No.3 Hair Perfector',
    brand: 'Olaplex',
    price: 30,
    category: 'Conditioner',
    initial: 'O',
  },
  {
    id: '2',
    name: 'Hydrating Shampoo',
    brand: 'Moroccanoil',
    price: 26,
    category: 'Shampoo',
    initial: 'M',
  },
  {
    id: '3',
    name: 'Dry Texturizing Spray',
    brand: 'Oribe',
    price: 49,
    category: 'Styling',
    initial: 'Or',
  },
  {
    id: '4',
    name: 'Supersonic Hair Dryer',
    brand: 'Dyson',
    price: 429,
    category: 'Tools',
    initial: 'D',
  },
  {
    id: '5',
    name: 'Purple Shampoo',
    brand: 'Redken',
    price: 22,
    category: 'Shampoo',
    initial: 'R',
  },
  {
    id: '6',
    name: 'Leave-In Conditioner',
    brand: 'It\'s a 10',
    price: 24,
    category: 'Conditioner',
    initial: 'I',
  },
  {
    id: '7',
    name: 'Curl Defining Cream',
    brand: 'DevaCurl',
    price: 28,
    category: 'Styling',
    initial: 'Dc',
  },
  {
    id: '8',
    name: 'Ceramic Flat Iron',
    brand: 'ghd',
    price: 189,
    category: 'Tools',
    initial: 'G',
  },
];

const CART_COUNT = 2;

export default function Shop() {
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
            <Text style={styles.subtitle}>Premium hair care products</Text>
          </View>
          {/* Cart icon with badge */}
          <View style={styles.cartButton}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Rect x={4} y={8} width={16} height={14} rx={2} stroke={colors.textWhite} strokeWidth={1.6} />
              <Path d="M8 8V6a4 4 0 0 1 8 0v2" stroke={colors.textWhite} strokeWidth={1.6} strokeLinecap="round" />
            </Svg>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{CART_COUNT}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Category filter */}
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

      {/* Product Grid */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              {/* Product image placeholder */}
              <View style={styles.productImageWrap}>
                <View style={styles.productImage}>
                  <Text style={styles.productInitial}>{product.initial}</Text>
                </View>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productBrand}>{product.brand}</Text>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>${product.price}</Text>
                  <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
                    {/* Plus icon */}
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
            </View>
          ))}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
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
    color: '#a39e96',
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
  productImageWrap: {
    backgroundColor: colors.offWhite,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInitial: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.textWhite,
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
});
