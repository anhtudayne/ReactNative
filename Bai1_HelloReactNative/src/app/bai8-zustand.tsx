import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useCartStore } from "@/stores/useCartStore";
import { useCounterStore } from "@/stores/useAppStores";
import { useThemeStore } from "@/stores/useAppStores";

// ====================================================================
// 📘 BÀI 8: State Management Nâng Cao — Zustand
// Demo: So sánh Context API (Bài 7) vs Zustand
// ====================================================================

// ─── Dữ liệu giả lập ───────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "z1",
    name: "Galaxy S25 Ultra",
    price: 33990000,
    image: "https://picsum.photos/seed/galaxy/200",
    desc: "Snapdragon 8 Elite, Camera 200MP, Titanium",
  },
  {
    id: "z2",
    name: "Galaxy Tab S10+",
    price: 25990000,
    image: "https://picsum.photos/seed/galaxytab/200",
    desc: "Chip MediaTek Dimensity, 12.4\" Dynamic AMOLED",
  },
  {
    id: "z3",
    name: "Galaxy Buds3 Pro",
    price: 5490000,
    image: "https://picsum.photos/seed/buds/200",
    desc: "ANC thích ứng, Blade Light Design, 360 Audio",
  },
  {
    id: "z4",
    name: "Galaxy Watch Ultra",
    price: 18990000,
    image: "https://picsum.photos/seed/galaxywatch/200",
    desc: "Titanium Grade 4, GPS Dual Frequency, 10ATM",
  },
];

function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "₫";
}

// ====================================================================
// 🔢 SECTION 1: Counter Demo (So sánh cú pháp)
// ====================================================================
function CounterSection() {
  // 🆕 ZUSTAND SELECTOR: Chỉ subscribe field cần dùng!
  // → Khi increment() thay đổi count, CHỈ component này re-render
  // → Các component khác KHÔNG dùng count → KHÔNG re-render!
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);
  const incrementBy = useCounterStore((state) => state.incrementBy);

  // 🆕 SO SÁNH VỚI CONTEXT:
  // Context: const { count, increment, ... } = useCounter();
  //          → Lấy TẤT CẢ field → Bất kỳ field nào đổi đều re-render!
  //
  // Zustand: const count = useCounterStore(state => state.count);
  //          → Chỉ lấy count → Chỉ re-render khi count đổi!

  const { colors } = useThemeStore();

  return (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        🔢 Demo 1: Counter (Zustand vs Context)
      </Text>

      {/* So sánh cú pháp */}
      <View style={[styles.compareBox, { borderColor: colors.border }]}>
        <Text style={[styles.compareTitle, { color: colors.primary }]}>
          📝 So sánh cú pháp
        </Text>
        <Text style={[styles.compareCode, { color: colors.text }]}>
          {`Context (Bài 7):
const { count, increment } = useCounter();
→ Cần: createContext + Provider + Reducer + Hook
→ ~50 dòng setup

Zustand (Bài 8):
const count = useCounterStore(s => s.count);
→ Cần: create() — CHỈ 1 HÀM DUY NHẤT!
→ ~10 dòng setup`}
        </Text>
      </View>

      {/* Counter UI */}
      <View style={styles.counterRow}>
        <Pressable
          style={({ pressed }) => [
            styles.counterBtn,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.7 },
          ]}
          onPress={decrement}
        >
          <Text style={styles.counterBtnText}>−</Text>
        </Pressable>

        <Text style={[styles.counterValue, { color: colors.text }]}>
          {count}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.counterBtn,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.7 },
          ]}
          onPress={increment}
        >
          <Text style={styles.counterBtnText}>+</Text>
        </Pressable>
      </View>

      <View style={styles.counterActions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            { borderColor: colors.primary },
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => incrementBy(5)}
        >
          <Text style={[styles.actionBtnText, { color: colors.primary }]}>
            +5
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            { borderColor: "#e74c3c" },
            pressed && { opacity: 0.7 },
          ]}
          onPress={reset}
        >
          <Text style={[styles.actionBtnText, { color: "#e74c3c" }]}>
            Reset
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ====================================================================
// 🎨 SECTION 2: Theme Toggle (Zustand không cần Provider!)
// ====================================================================
function ThemeSection() {
  const { mode, toggleTheme, colors } = useThemeStore();
  // 🆕 CÚ PHÁP: Lấy toàn bộ store (dùng khi cần nhiều field)
  // Tương đương: const mode = useThemeStore(s => s.mode);
  //              const toggleTheme = useThemeStore(s => s.toggleTheme);
  //              const colors = useThemeStore(s => s.colors);

  return (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        🎨 Demo 2: Theme (Không cần Provider!)
      </Text>

      <View style={[styles.compareBox, { borderColor: colors.border }]}>
        <Text style={[styles.compareTitle, { color: colors.primary }]}>
          💡 Điểm khác biệt cốt lõi
        </Text>
        <Text style={[styles.compareCode, { color: colors.text }]}>
          {`Context (Bài 7):
Phải bọc <ThemeProvider> trong _layout.tsx
→ Quên bọc → app crash!

Zustand (Bài 8):
KHÔNG CẦN Provider!
→ Import hook → Dùng ngay → Không thể quên!
→ Dùng được NGOÀI component (trong utils, API...)`}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.themeToggle,
          { backgroundColor: colors.primary },
          pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] },
        ]}
        onPress={toggleTheme}
      >
        <Ionicons
          name={mode === "light" ? "moon" : "sunny"}
          size={20}
          color="#fff"
        />
        <Text style={styles.themeToggleText}>
          {mode === "light" ? "Chuyển sang Dark Mode" : "Chuyển sang Light Mode"}
        </Text>
      </Pressable>

      <Text style={[styles.themeHint, { color: colors.text }]}>
        Theme: {mode.toUpperCase()} — Toàn bộ màn hình thay đổi theo!
      </Text>
    </View>
  );
}

// ====================================================================
// 🛒 SECTION 3: Giỏ Hàng Zustand (So sánh với Bài 7)
// ====================================================================
function ZustandShopSection() {
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  // 🆕 ZUSTAND SELECTOR: Mỗi dòng chỉ subscribe 1 field
  // → addItem thay đổi → component có addItem KHÔNG re-render (vì hàm không đổi)
  // → items thay đổi → CHỈ component có items re-render!

  const { colors } = useThemeStore();

  return (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        🛍️ Demo 3: Giỏ hàng Zustand (có Persist!)
      </Text>
      <Text style={[styles.sectionSubtitle, { color: colors.text }]}>
        💾 Tắt app, mở lại → Giỏ hàng vẫn còn!
      </Text>

      {PRODUCTS.map((product) => {
        const inCart = items.find((item) => item.id === product.id);
        return (
          <View
            key={product.id}
            style={[
              styles.productCard,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text
                style={[styles.productName, { color: colors.text }]}
                numberOfLines={1}
              >
                {product.name}
              </Text>
              <Text style={styles.productDesc} numberOfLines={1}>
                {product.desc}
              </Text>
              <Text style={[styles.productPrice, { color: colors.primary }]}>
                {formatPrice(product.price)}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.addBtn,
                { backgroundColor: inCart ? "#27ae60" : colors.primary },
                pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
              ]}
              onPress={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              }
            >
              <Ionicons name="add" size={18} color="#fff" />
              {inCart && (
                <Text style={styles.addBtnBadge}>{inCart.quantity}</Text>
              )}
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

// ====================================================================
// 🛒 SECTION 4: Chi tiết giỏ hàng
// ====================================================================
function ZustandCartSection() {
  const { items, totalItems, totalPrice, incrementItem, decrementItem, removeItem, clearCart } =
    useCartStore();
  const { colors } = useThemeStore();

  if (items.length === 0) {
    return (
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🛒 Giỏ hàng Zustand
        </Text>
        <View
          style={[styles.emptyCart, { backgroundColor: colors.background }]}
        >
          <Ionicons name="cart-outline" size={48} color="#ccc" />
          <Text style={styles.emptyCartText}>Giỏ hàng trống</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <View style={styles.cartHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🛒 Giỏ hàng ({totalItems})
        </Text>
        <Pressable
          onPress={() =>
            Alert.alert("Xoá giỏ hàng", "Xoá toàn bộ?", [
              { text: "Huỷ", style: "cancel" },
              { text: "Xoá", style: "destructive", onPress: clearCart },
            ])
          }
          style={({ pressed }) => [
            styles.clearBtn,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="trash-outline" size={16} color="#e74c3c" />
          <Text style={styles.clearBtnText}>Xoá hết</Text>
        </Pressable>
      </View>

      {items.map((item) => (
        <View
          key={item.id}
          style={[
            styles.cartItem,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Image source={{ uri: item.image }} style={styles.cartItemImage} />
          <View style={styles.cartItemInfo}>
            <Text
              style={[styles.cartItemName, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text style={[styles.cartItemPrice, { color: colors.primary }]}>
              {formatPrice(item.price)}
            </Text>
            <View style={styles.quantityRow}>
              <Pressable
                style={[styles.qtyBtn, { borderColor: colors.border }]}
                onPress={() => decrementItem(item.id)}
              >
                <Ionicons name="remove" size={16} color={colors.text} />
              </Pressable>
              <Text style={[styles.qtyText, { color: colors.text }]}>
                {item.quantity}
              </Text>
              <Pressable
                style={[styles.qtyBtn, { borderColor: colors.border }]}
                onPress={() => incrementItem(item.id)}
              >
                <Ionicons name="add" size={16} color={colors.text} />
              </Pressable>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.removeBtn,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => removeItem(item.id)}
          >
            <Ionicons name="close-circle" size={24} color="#e74c3c" />
          </Pressable>
        </View>
      ))}

      <View
        style={[styles.totalRow, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.totalLabel}>Tổng cộng:</Text>
        <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
      </View>
    </View>
  );
}

// ====================================================================
// 📖 SECTION 5: Kiến thức
// ====================================================================
function KnowledgeSection() {
  const { colors } = useThemeStore();

  return (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        📖 Kiến thức Bài 8
      </Text>

      <View
        style={[
          styles.infoBox,
          { backgroundColor: colors.primary + "15", borderLeftColor: colors.primary },
        ]}
      >
        <Text style={[styles.infoTitle, { color: colors.primary }]}>
          🆚 Context API vs Zustand — Tổng kết
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          <Text style={styles.bold}>Context API:</Text> Tốt cho app nhỏ, built-in,
          nhưng re-render nhiều, cần Provider, cần reducer.{"\n\n"}
          <Text style={styles.bold}>Zustand:</Text> Tốt cho mọi app, code ít hơn 3-5x,
          selector tối ưu re-render, persist built-in, dùng NGOÀI component được!
        </Text>
      </View>

      <View
        style={[
          styles.infoBox,
          { backgroundColor: colors.primary + "15", borderLeftColor: colors.primary },
        ]}
      >
        <Text style={[styles.infoTitle, { color: colors.primary }]}>
          💾 Persist — Tắt app vẫn giữ data
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          Zustand + middleware <Text style={styles.code}>persist</Text> tự động:{"\n"}
          • Lưu state vào AsyncStorage khi thay đổi{"\n"}
          • Khôi phục state khi mở lại app{"\n"}
          • <Text style={styles.code}>partialize</Text> chọn field cần lưu{"\n"}
          • <Text style={styles.code}>onRehydrateStorage</Text> chạy sau khi khôi phục
        </Text>
      </View>

      <View
        style={[
          styles.infoBox,
          { backgroundColor: colors.primary + "15", borderLeftColor: colors.primary },
        ]}
      >
        <Text style={[styles.infoTitle, { color: colors.primary }]}>
          🎯 Selector — Tối ưu Re-render
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          <Text style={styles.code}>
            {"const count = useStore(s => s.count)"}
          </Text>
          {"\n"}→ Chỉ re-render khi <Text style={styles.bold}>count</Text> thay đổi
          {"\n"}→ Các field khác thay đổi → KHÔNG re-render!{"\n\n"}
          Đây là lý do Zustand <Text style={styles.bold}>hiệu năng tốt hơn</Text>{" "}
          Context API rất nhiều!
        </Text>
      </View>
    </View>
  );
}

// ====================================================================
// 🏠 MAIN SCREEN
// ====================================================================
export default function Bai8ZustandScreen() {
  const totalItems = useCartStore((state) => state.totalItems);
  // 🆕 SELECTOR: Chỉ subscribe totalItems cho badge
  // → Khi items chi tiết thay đổi mà totalItems không đổi → KHÔNG re-render screen!

  const { colors, mode } = useThemeStore();

  return (
    <>
      <Stack.Screen
        options={{
          title: "📘 Bài 8: Zustand",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "#fff",
          headerRight: () => (
            <View style={styles.headerCart}>
              <Ionicons name="cart" size={24} color="#fff" />
              {totalItems > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>
                    {totalItems > 99 ? "99+" : totalItems}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Banner */}
        <View style={[styles.banner, { backgroundColor: colors.primary }]}>
          <Text style={styles.bannerTitle}>⚡ Zustand — State Management</Text>
          <Text style={styles.bannerSubtitle}>
            Nhanh hơn, gọn hơn, mạnh hơn Context API
          </Text>
        </View>

        {/* Counter */}
        <CounterSection />

        {/* Theme */}
        <ThemeSection />

        {/* Shop */}
        <ZustandShopSection />

        {/* Cart */}
        <ZustandCartSection />

        {/* Knowledge */}
        <KnowledgeSection />
      </ScrollView>
    </>
  );
}

// ====================================================================
// STYLES
// ====================================================================
const styles = StyleSheet.create({
  // Header
  headerCart: { marginRight: 16, position: "relative" },
  headerBadge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "#e74c3c",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  headerBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },

  // Banner
  banner: { padding: 24, alignItems: "center" },
  bannerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  bannerSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4, textAlign: "center" },

  // Section
  section: { margin: 12, marginBottom: 0, padding: 16, borderRadius: 14 },
  sectionTitle: { fontSize: 17, fontWeight: "bold", marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, opacity: 0.6, marginBottom: 12 },

  // Compare Box
  compareBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderStyle: "dashed",
  },
  compareTitle: { fontSize: 13, fontWeight: "bold", marginBottom: 6 },
  compareCode: { fontSize: 11, fontFamily: "monospace", lineHeight: 18 },

  // Counter
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    marginBottom: 12,
  },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  counterBtnText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  counterValue: { fontSize: 36, fontWeight: "bold", minWidth: 60, textAlign: "center" },
  counterActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  actionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  actionBtnText: { fontSize: 14, fontWeight: "bold" },

  // Theme
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  themeToggleText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  themeHint: { fontSize: 12, textAlign: "center", opacity: 0.6 },

  // Products
  productCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
  },
  productImage: { width: 56, height: 56, borderRadius: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: "bold" },
  productDesc: { fontSize: 11, color: "#999", marginTop: 2 },
  productPrice: { fontSize: 14, fontWeight: "bold", marginTop: 4 },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
  },
  addBtnBadge: { color: "#fff", fontSize: 12, fontWeight: "bold" },

  // Cart
  cartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  clearBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  clearBtnText: { color: "#e74c3c", fontSize: 13, fontWeight: "600" },
  emptyCart: {
    alignItems: "center",
    padding: 30,
    borderRadius: 12,
  },
  emptyCartText: { fontSize: 16, fontWeight: "bold", color: "#999", marginTop: 8 },
  cartItem: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
  },
  cartItemImage: { width: 50, height: 50, borderRadius: 8 },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: "600" },
  cartItemPrice: { fontSize: 13, marginTop: 2 },
  quantityRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 6 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { fontSize: 15, fontWeight: "bold", minWidth: 20, textAlign: "center" },
  removeBtn: { padding: 4 },

  // Total
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
  },
  totalLabel: { fontSize: 16, color: "#fff", fontWeight: "600" },
  totalPrice: { fontSize: 20, color: "#fff", fontWeight: "bold" },

  // Info Box
  infoBox: {
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  infoTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 6 },
  infoText: { fontSize: 13, lineHeight: 20 },
  code: { fontFamily: "monospace", fontWeight: "bold" },
  bold: { fontWeight: "bold" },
});
