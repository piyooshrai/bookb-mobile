import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Rect, Line, Circle } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const MOCK_ORDERS = [
  { id: 'BKB-1047', date: 'Feb 8, 2026', items: 3, total: 98, status: 'Completed' as const },
  { id: 'BKB-1032', date: 'Jan 28, 2026', items: 1, total: 28, status: 'Completed' as const },
  { id: 'BKB-1019', date: 'Jan 15, 2026', items: 2, total: 62, status: 'Completed' as const },
  { id: 'BKB-1008', date: 'Dec 22, 2025', items: 4, total: 156, status: 'Completed' as const },
  { id: 'BKB-0994', date: 'Dec 5, 2025', items: 1, total: 34, status: 'Completed' as const },
];

const STATUS_CONFIG = {
  Completed: { bg: colors.successLight, text: colors.successDark },
  Pending: { bg: colors.warningLight, text: colors.warningDark },
  Cancel: { bg: colors.errorLight, text: colors.errorDark },
};

export default function OrderHistoryScreen() {
  const router = useRouter();

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
            <Text style={styles.title}>Order History</Text>
            <Text style={styles.subtitle}>{MOCK_ORDERS.length} past orders</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {MOCK_ORDERS.map((order) => {
          const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Completed;
          return (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderTop}>
                <View style={styles.orderIdRow}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Rect x={3} y={3} width={18} height={18} rx={2} stroke={colors.navy} strokeWidth={1.6} />
                    <Line x1={7} y1={8} x2={17} y2={8} stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" />
                    <Line x1={7} y1={12} x2={17} y2={12} stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" />
                    <Line x1={7} y1={16} x2={12} y2={16} stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" />
                  </Svg>
                  <Text style={styles.orderId}>#{order.id}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                  <Text style={[styles.statusText, { color: statusCfg.text }]}>{order.status}</Text>
                </View>
              </View>
              <View style={styles.orderBottom}>
                <Text style={styles.orderDate}>{order.date}</Text>
                <View style={styles.dot} />
                <Text style={styles.orderItems}>{order.items} items</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
              </View>
            </View>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
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
  orderCard: { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16 },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  orderIdRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orderId: { fontFamily: fontFamilies.bodySemiBold, fontSize: 14, color: colors.textPrimary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase' as const },
  orderBottom: { flexDirection: 'row', alignItems: 'center' },
  orderDate: { fontFamily: fontFamilies.body, fontSize: 12, color: colors.textTertiary },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textTertiary, marginHorizontal: 8 },
  orderItems: { fontFamily: fontFamilies.body, fontSize: 12, color: colors.textTertiary },
  orderTotal: { fontFamily: fontFamilies.heading, fontSize: 16, color: colors.textPrimary },
});
