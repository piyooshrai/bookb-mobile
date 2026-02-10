import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Line } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

type Category = 'All' | 'Hair' | 'Color' | 'Treatment' | 'Styling';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // minutes
  category: Exclude<Category, 'All'>;
  enabled: boolean;
}

const CATEGORIES: Category[] = ['All', 'Hair', 'Color', 'Treatment', 'Styling'];

const INITIAL_SERVICES: Service[] = [
  { id: '1', name: 'Haircut & Style', price: 65, duration: 45, category: 'Hair', enabled: true },
  { id: '2', name: 'Blowout', price: 45, duration: 30, category: 'Hair', enabled: true },
  { id: '3', name: 'Beard Trim', price: 25, duration: 20, category: 'Hair', enabled: true },
  { id: '4', name: 'Balayage', price: 185, duration: 120, category: 'Color', enabled: true },
  { id: '5', name: 'Root Touch-Up', price: 85, duration: 60, category: 'Color', enabled: true },
  { id: '6', name: 'Color Correction', price: 250, duration: 150, category: 'Color', enabled: true },
  { id: '7', name: 'Keratin Treatment', price: 220, duration: 120, category: 'Treatment', enabled: true },
  { id: '8', name: 'Deep Conditioning', price: 55, duration: 45, category: 'Treatment', enabled: true },
  { id: '9', name: 'Updo', price: 95, duration: 60, category: 'Styling', enabled: true },
  { id: '10', name: 'Bridal Style', price: 150, duration: 90, category: 'Styling', enabled: true },
];

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ServicesScreen() {
  const router = useRouter();
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  const filtered = activeCategory === 'All'
    ? services
    : services.filter((s) => s.category === activeCategory);

  // Group by category for display
  const grouped = filtered.reduce<Record<string, Service[]>>((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = [];
    acc[svc.category].push(svc);
    return acc;
  }, {});

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
              <Text style={styles.title}>Services</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{services.length} services</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>Manage your service offerings</Text>
          </View>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={() => router.push('/(salon)/settings/add-service')}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M12 5v14M5 12h14" stroke={colors.navy} strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text style={styles.addButtonText}>Add Service</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, activeCategory === cat && styles.tabActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeCategory === cat && styles.tabTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {Object.entries(grouped).map(([category, items]) => (
          <View key={category}>
            {activeCategory === 'All' && (
              <Text style={styles.sectionTitle}>{category}</Text>
            )}
            <View style={styles.card}>
              {items.map((svc, index) => (
                <View key={svc.id} style={[styles.serviceRow, index < items.length - 1 && styles.serviceRowBorder]}>
                  {/* Drag handle */}
                  <View style={styles.dragHandle}>
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Line x1={4} y1={6} x2={20} y2={6} stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" />
                      <Line x1={4} y1={12} x2={20} y2={12} stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" />
                      <Line x1={4} y1={18} x2={20} y2={18} stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" />
                    </Svg>
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{svc.name}</Text>
                    <View style={styles.serviceMetaRow}>
                      <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                        <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0v10l6 3" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                      <Text style={styles.serviceDuration}>{formatDuration(svc.duration)}</Text>
                    </View>
                  </View>
                  <Text style={styles.servicePrice}>${svc.price}</Text>
                  <Switch
                    value={svc.enabled}
                    onValueChange={() => toggleService(svc.id)}
                    trackColor={{ false: colors.border, true: colors.goldLight }}
                    thumbColor={svc.enabled ? colors.gold : colors.textTertiary}
                    style={styles.serviceSwitch}
                  />
                </View>
              ))}
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

  // Category Tabs
  tabsContainer: {
    paddingTop: 16,
  },
  tabsContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  tabText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.textWhite,
  },

  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 4 },

  sectionTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 8,
    marginLeft: 4,
  },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  serviceRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  dragHandle: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  serviceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  serviceDuration: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  servicePrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: 12,
  },
  serviceSwitch: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
});
