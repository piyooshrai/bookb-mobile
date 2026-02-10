import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Line, Polyline } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

type ProductCategory = 'All' | 'Shampoo' | 'Conditioner' | 'Styling' | 'Tools' | 'Treatment';

interface Product {
  id: string;
  name: string;
  price: number;
  category: Exclude<ProductCategory, 'All'>;
  stock: number;
  enabled: boolean;
}

const FILTER_CATEGORIES: ProductCategory[] = ['All', 'Shampoo', 'Conditioner', 'Styling', 'Tools'];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Olaplex No.3', price: 28, category: 'Shampoo', stock: 45, enabled: true },
  { id: '2', name: 'Moroccan Oil', price: 34, category: 'Styling', stock: 30, enabled: true },
  { id: '3', name: 'Redken Leave-in', price: 22, category: 'Conditioner', stock: 62, enabled: true },
  { id: '4', name: 'Dyson Airwrap', price: 599, category: 'Tools', stock: 3, enabled: true },
  { id: '5', name: 'Color Wow Dream Coat', price: 28, category: 'Styling', stock: 18, enabled: true },
  { id: '6', name: 'K18 Mask', price: 75, category: 'Treatment', stock: 24, enabled: true },
];

function stockStatusColor(stock: number): string {
  if (stock <= 5) return colors.error;
  if (stock <= 20) return colors.warning;
  return colors.success;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProductsScreen() {
  const router = useRouter();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [activeFilter, setActiveFilter] = useState<ProductCategory>('All');

  const toggleProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  const filtered = activeFilter === 'All'
    ? products
    : products.filter((p) => p.category === activeFilter);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backButton}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M15 18l-6-6 6-6" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <View style={styles.headerTitleArea}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.title}>Products</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{products.length} items</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>Manage your product inventory</Text>
          </View>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={() => router.push('/(salon)/settings/add-product')}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M12 5v14M5 12h14" stroke={colors.navy} strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Pills */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {FILTER_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterPill, activeFilter === cat && styles.filterPillActive]}
              onPress={() => setActiveFilter(cat)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, activeFilter === cat && styles.filterTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {filtered.map((product) => (
          <View key={product.id} style={[styles.card, !product.enabled && styles.cardDisabled]}>
            <View style={styles.cardContent}>
              <View style={styles.productIcon}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke={colors.navy} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
                  <Polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke={colors.navy} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
                  <Line x1={12} y1={22.08} x2={12} y2={12} stroke={colors.navy} strokeWidth={1.4} strokeLinecap="round" />
                </Svg>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.productMeta}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{product.category}</Text>
                  </View>
                  <View style={styles.stockRow}>
                    <View style={[styles.stockDot, { backgroundColor: stockStatusColor(product.stock) }]} />
                    <Text style={styles.stockText}>{product.stock} in stock</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.productPrice}>${product.price}</Text>
              <Switch
                value={product.enabled}
                onValueChange={() => toggleProduct(product.id)}
                trackColor={{ false: colors.border, true: colors.goldLight }}
                thumbColor={product.enabled ? colors.gold : colors.textTertiary}
                style={styles.productSwitch}
              />
            </View>
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  headerTitleArea: { flex: 1 },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countBadgeText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 11,
    color: colors.goldLight,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.gold,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 2,
  },
  addButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.navy,
  },

  // Filters
  filtersContainer: {
    paddingTop: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  filterText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.textWhite,
  },

  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 12 },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardDisabled: {
    opacity: 0.55,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  productIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  productName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  categoryBadge: {
    backgroundColor: colors.offWhite,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockText: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
  },
  productPrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: 10,
  },
  productSwitch: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
});
