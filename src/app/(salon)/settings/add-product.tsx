import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { productsApi } from '@/api/products';
import { useQueryClient } from '@tanstack/react-query';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES = ['Shampoo', 'Conditioner', 'Styling', 'Treatment', 'Tools'] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AddProductScreen() {
  const router = useRouter();
  const isDemo = useAuthStore((s) => s.isDemo);
  const salonId = useAuthStore((s) => s.salonId);
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<string>('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (isDemo) {
      Alert.alert('Success', 'Product added', [
        { text: 'OK', onPress: () => router.back() },
      ]);
      return;
    }

    if (!productName.trim()) {
      Alert.alert('Validation', 'Please enter a product name');
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('productName', productName.trim());
      formData.append('productPrice', price || '0');
      formData.append('stock', stockQuantity || '0');
      formData.append('description', description.trim());
      if (salonId) formData.append('salon', salonId);
      if (category) formData.append('category', category);
      if (brand) formData.append('brand', brand.trim());
      await productsApi.addProduct(formData);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      Alert.alert('Success', 'Product added', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to add product');
    } finally {
      setIsSaving(false);
    }
  };

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
            <Text style={styles.title}>Add Product</Text>
            <Text style={styles.subtitle}>Add a new product to inventory</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Product Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Olaplex No.3"
            placeholderTextColor={colors.textTertiary}
            value={productName}
            onChangeText={setProductName}
          />
        </View>

        {/* Brand */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Brand</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Olaplex"
            placeholderTextColor={colors.textTertiary}
            value={brand}
            onChangeText={setBrand}
          />
        </View>

        {/* Category */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                onPress={() => setCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 28"
            placeholderTextColor={colors.textTertiary}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Stock Quantity */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Stock Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 50"
            placeholderTextColor={colors.textTertiary}
            value={stockQuantity}
            onChangeText={setStockQuantity}
            keyboardType="number-pad"
          />
        </View>

        {/* Description */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Product description..."
            placeholderTextColor={colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Bottom spacer for save button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>SAVE PRODUCT</Text>
          )}
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
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
    marginTop: 4,
  },

  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 18 },

  // Form fields
  fieldGroup: {},
  label: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },

  // Category selector
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  categoryChipText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.textWhite,
  },

  // Save button
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: colors.warmGrey,
  },
  saveButton: {
    backgroundColor: colors.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.white,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
