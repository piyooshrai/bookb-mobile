import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { useProductDetail, useSimilarProducts } from '@/hooks/useProducts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORY_COLORS: Record<string, string> = {
  Treatment: '#8b5cf6',
  Styling: '#f59e0b',
  Conditioner: '#3b82f6',
  Tools: '#6b7280',
  Shampoo: '#22c55e',
};

const PRODUCT = {
  id: '1',
  name: 'Olaplex No.3 Hair Perfector',
  brand: 'Olaplex',
  price: 28.0,
  category: 'Treatment',
  rating: 4.8,
  reviewCount: 156,
  description:
    'The original at-home bond builder. Reduces breakage and strengthens hair by repairing broken bonds. Works on all hair types.',
  howToUse: [
    'Apply to damp hair',
    'Leave for 10 minutes',
    'Rinse and shampoo',
  ],
  ingredients:
    'Water, Bis-Aminopropyl Diglycol Dimaleate, Propylene Glycol, Cetearyl Alcohol, Behentrimonium Methosulfate, Cetyl Alcohol, Phenoxyethanol, Glycerin, Hydroxyethyl Ethylcellulose, Stearamidopropyl Dimethylamine, Quaternium-91, Sodium Benzoate, Fragrance, Panthenol, Polyquaternium-37, Tetrasodium EDTA, Butyloctanol, Ethylhexylglycerin, Tocopheryl Acetate, Citric Acid',
};

const SIMILAR_PRODUCTS = [
  { id: '6', name: 'K18 Mask', brand: 'K18', price: 75, category: 'Treatment', initial: 'K' },
  { id: '3', name: 'Redken Leave-in', brand: 'Redken', price: 22, category: 'Conditioner', initial: 'R' },
  { id: '5', name: 'Color Wow Dream Coat', brand: 'Color Wow', price: 28, category: 'Styling', initial: 'C' },
];

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [ingredientsExpanded, setIngredientsExpanded] = useState(false);
  const isDemo = useAuthStore((s) => s.isDemo);
  const addToCart = useAppStore((s) => s.addToCart);

  const productId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
  const { data: apiProduct, isLoading: productLoading } = useProductDetail(productId, !isDemo);
  const { data: apiSimilar, isLoading: similarLoading } = useSimilarProducts(productId, !isDemo);

  const product = !isDemo && apiProduct
    ? {
        id: apiProduct._id,
        name: apiProduct.productName,
        brand: (apiProduct.category as any)?.categoryName || 'Brand',
        price: apiProduct.productPrice,
        category: (apiProduct.category as any)?.categoryName || 'Treatment',
        rating: apiProduct.rating || 4.5,
        reviewCount: 0,
        description: apiProduct.productDescription || '',
        howToUse: PRODUCT.howToUse,
        ingredients: PRODUCT.ingredients,
      }
    : PRODUCT;

  const similarList = Array.isArray(apiSimilar) ? apiSimilar : (apiSimilar as any)?.result ?? [];
  const similarProducts = !isDemo && similarList.length > 0
    ? similarList.map((p: any) => ({
        id: p._id,
        name: p.productName,
        brand: p.category?.categoryName || 'Brand',
        price: p.productPrice,
        category: p.category?.categoryName || 'Other',
        initial: p.productName?.charAt(0) || '?',
      }))
    : SIMILAR_PRODUCTS;

  const categoryColor = CATEGORY_COLORS[product.category] || colors.navy;
  const total = (product.price * quantity).toFixed(2);

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalf = product.rating % 1 >= 0.3;
    for (let i = 0; i < 5; i++) {
      const filled = i < fullStars;
      const half = i === fullStars && hasHalf;
      stars.push(
        <Svg key={i} width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={filled || half ? colors.gold : 'none'}
            stroke={filled || half ? colors.gold : colors.textTertiary}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </Svg>,
      );
    }
    return stars;
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
          <View style={styles.breadcrumb}>
            <Text style={styles.breadcrumbText}>Shop</Text>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 18l6-6-6-6"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={[styles.breadcrumbText, styles.breadcrumbActive]}>
              {product.category}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product image placeholder */}
        <View style={[styles.imagePlaceholder, { backgroundColor: categoryColor + '12' }]}>
          <View style={[styles.imageCircle, { backgroundColor: categoryColor + '20' }]}>
            <Text style={[styles.imageInitial, { color: categoryColor }]}>
              {product.name.charAt(0)}
            </Text>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '18' }]}>
            <Text style={[styles.categoryBadgeText, { color: categoryColor }]}>
              {product.category}
            </Text>
          </View>
        </View>

        {/* Product info */}
        <View style={styles.productInfo}>
          <Text style={styles.brandName}>{product.brand}</Text>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>{renderStars()}</View>
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewCount}>({product.reviewCount} reviews)</Text>
          </View>
        </View>

        {/* Description card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Description</Text>
          <Text style={styles.cardBody}>{product.description}</Text>
        </View>

        {/* How to Use card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How to Use</Text>
          {product.howToUse.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Ingredients card (expandable) */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.ingredientsHeader}
            onPress={() => setIngredientsExpanded(!ingredientsExpanded)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitle}>Ingredients</Text>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d={ingredientsExpanded ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}
                stroke={colors.textSecondary}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          {ingredientsExpanded ? (
            <Text style={styles.cardBody}>{product.ingredients}</Text>
          ) : (
            <View>
              <Text style={styles.cardBody} numberOfLines={1}>
                {product.ingredients}
              </Text>
              <Text style={styles.seeMore}>See more</Text>
            </View>
          )}
        </View>

        {/* Quantity selector */}
        <View style={styles.card}>
          <View style={styles.quantityRow}>
            <Text style={styles.cardTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  quantity <= 1 && styles.quantityButtonDisabled,
                ]}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                activeOpacity={0.7}
                disabled={quantity <= 1}
              >
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M5 12h14"
                    stroke={quantity <= 1 ? colors.textTertiary : colors.textPrimary}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </Svg>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity((q) => q + 1)}
                activeOpacity={0.7}
              >
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 5v14M5 12h14"
                    stroke={colors.textPrimary}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Similar Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Similar Products</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.similarRow}
        >
          {!isDemo && similarLoading && (
            <View style={{ paddingVertical: 20, paddingHorizontal: 40 }}>
              <ActivityIndicator size="small" color={colors.navy} />
            </View>
          )}
          {similarProducts.map((product: any) => {
            const simColor = CATEGORY_COLORS[product.category] || colors.navy;
            return (
              <TouchableOpacity
                key={product.id}
                style={styles.similarCard}
                activeOpacity={0.7}
                onPress={() => router.push(`/(customer)/shop/${product.id}`)}
              >
                <View style={[styles.similarStripe, { backgroundColor: simColor }]} />
                <View style={[styles.similarImageWrap, { backgroundColor: simColor + '12' }]}>
                  <View style={[styles.similarImage, { backgroundColor: simColor + '25' }]}>
                    <Text style={[styles.similarInitial, { color: simColor }]}>
                      {product.initial}
                    </Text>
                  </View>
                </View>
                <View style={styles.similarInfo}>
                  <Text style={styles.similarBrand}>{product.brand}</Text>
                  <Text style={styles.similarName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={styles.similarPrice}>${product.price}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bottom spacing for sticky button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {!isDemo && productLoading && (
        <View style={{ position: 'absolute', top: '50%', left: 0, right: 0, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.navy} />
        </View>
      )}

      {/* Sticky bottom: Add to Cart */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity style={styles.addToCartButton} activeOpacity={0.8} onPress={() => {
          if (!isDemo) {
            for (let i = 0; i < quantity; i++) {
              addToCart({ productId: product.id, name: product.name, price: product.price });
            }
          }
          Alert.alert('Added to Cart', `${quantity}x ${product.name} added to your cart`, [{ text: 'Continue Shopping', onPress: () => router.back() }, { text: 'View Cart', onPress: () => router.push('/(customer)/shop/cart') }]);
        }}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Rect
              x={4}
              y={8}
              width={16}
              height={14}
              rx={2}
              stroke={colors.textWhite}
              strokeWidth={1.6}
            />
            <Path
              d="M8 8V6a4 4 0 0 1 8 0v2"
              stroke={colors.textWhite}
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          </Svg>
          <Text style={styles.addToCartText}>Add to Cart - ${total}</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  breadcrumbText: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  breadcrumbActive: {
    color: colors.textWhite,
    fontFamily: fontFamilies.bodyMedium,
  },

  // Body
  body: { flex: 1 },
  bodyContent: { paddingBottom: 0 },

  // Image placeholder
  imagePlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageInitial: {
    fontFamily: fontFamilies.heading,
    fontSize: 36,
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    letterSpacing: 0.5,
  },

  // Product info
  productInfo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  brandName: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.gold,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 4,
  },
  productName: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  productPrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 26,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.gold,
  },
  reviewCount: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },

  // Cards
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  cardBody: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  // Steps
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.textWhite,
  },
  stepText: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },

  // Ingredients expandable
  ingredientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeMore: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.gold,
    marginTop: 6,
  },

  // Quantity
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  quantityButtonDisabled: {
    borderColor: colors.borderLight,
    backgroundColor: colors.offWhite,
  },
  quantityValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },

  // Similar products
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  similarRow: {
    paddingHorizontal: 20,
    gap: 12,
  },
  similarCard: {
    width: 150,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  similarStripe: {
    height: 3,
  },
  similarImageWrap: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  similarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  similarInitial: {
    fontFamily: fontFamilies.heading,
    fontSize: 16,
  },
  similarInfo: {
    padding: 10,
  },
  similarBrand: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 9,
    color: colors.gold,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
  },
  similarName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 2,
  },
  similarPrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: 4,
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
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.gold,
    borderRadius: 14,
    paddingVertical: 16,
  },
  addToCartText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textWhite,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
});
