import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useCart } from "@/contexts/CartContext";

// ====================================================================
// 📘 BÀI 7: State Management — Context API & useReducer
// Demo: App Mua Sắm với Giỏ Hàng Toàn Cục
// ====================================================================

// ─── Dữ liệu giả lập sản phẩm ─────────────────────────────────────
const PRODUCTS = [
  {
    id: "p1",
    name: "iPhone 16 Pro Max",
    price: 34990000,
    image: "https://picsum.photos/seed/iphone16/200",
    desc: "Chip A18 Pro, Camera 48MP, Titanium",
  },
  {
    id: "p2",
    name: "MacBook Air M3",
    price: 27990000,
    image: "https://picsum.photos/seed/macbook/200",
    desc: 'Chip M3, RAM 16GB, 13.6" Liquid Retina',
  },
  {
    id: "p3",
    name: "AirPods Pro 2",
    price: 6490000,
    image: "https://picsum.photos/seed/airpods/200",
    desc: "Chống ồn chủ động, USB-C, Adaptive Audio",
  },
  {
    id: "p4",
    name: "Apple Watch Ultra 2",
    price: 21990000,
    image: "https://picsum.photos/seed/watch/200",
    desc: "Chip S9 SiP, Titanium, GPS + Cellular",
  },
  {
    id: "p5",
    name: "iPad Air M2",
    price: 16990000,
    image: "https://picsum.photos/seed/ipad/200",
    desc: 'Chip M2, 11" Liquid Retina, Apple Pencil Pro',
  },
  {
    id: "p6",
    name: "Bàn phím Magic Keyboard",
    price: 3490000,
    image: "https://picsum.photos/seed/keyboard/200",
    desc: "Touch ID, Bàn phím số, USB-C",
  },
];

// ─── Format tiền Việt ───────────────────────────────────────────────
function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "₫";
}

// ====================================================================
// 🛒 COMPONENT: Danh sách sản phẩm (CỬA HÀNG)
// ====================================================================
function ShopSection() {
  // 🆕 HOOK: useCart() — Lấy dữ liệu giỏ hàng từ Context
  // Bất kỳ component nào (dù lồng sâu bao nhiêu tầng) đều có thể
  // gọi hook này mà KHÔNG cần truyền props!
  const { addItem, state } = useCart();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🛍️ Cửa hàng</Text>
      <Text style={styles.sectionSubtitle}>
        Nhấn "Thêm vào giỏ" để test Context API
      </Text>

      {PRODUCTS.map((product) => {
        // Kiểm tra sản phẩm đã có trong giỏ chưa (để hiện số lượng)
        const inCart = state.items.find((item) => item.id === product.id);
        return (
          <View key={product.id} style={styles.productCard}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={styles.productDesc} numberOfLines={1}>
                {product.desc}
              </Text>
              <Text style={styles.productPrice}>
                {formatPrice(product.price)}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.addBtn,
                inCart && { backgroundColor: "#27ae60" },
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
// 🛒 COMPONENT: Giỏ hàng (hiển thị + tăng/giảm/xoá)
// ====================================================================
function CartSection() {
  const { state, incrementItem, decrementItem, removeItem, clearCart } =
    useCart();

  if (state.items.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛒 Giỏ hàng</Text>
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={48} color="#ccc" />
          <Text style={styles.emptyCartText}>Giỏ hàng trống</Text>
          <Text style={styles.emptyCartHint}>
            Hãy thêm sản phẩm từ cửa hàng phía trên!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.cartHeader}>
        <Text style={styles.sectionTitle}>
          🛒 Giỏ hàng ({state.totalItems} sản phẩm)
        </Text>
        <Pressable
          onPress={() =>
            Alert.alert(
              "Xoá giỏ hàng",
              "Bạn có chắc muốn xoá toàn bộ giỏ hàng?",
              [
                { text: "Huỷ", style: "cancel" },
                {
                  text: "Xoá hết",
                  style: "destructive",
                  onPress: clearCart,
                },
              ]
            )
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

      {state.items.map((item) => (
        <View key={item.id} style={styles.cartItem}>
          <Image source={{ uri: item.image }} style={styles.cartItemImage} />
          <View style={styles.cartItemInfo}>
            <Text style={styles.cartItemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.cartItemPrice}>
              {formatPrice(item.price)}
            </Text>

            {/* Nút Tăng / Giảm số lượng */}
            <View style={styles.quantityRow}>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => decrementItem(item.id)}
              >
                <Ionicons name="remove" size={16} color="#555" />
              </Pressable>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => incrementItem(item.id)}
              >
                <Ionicons name="add" size={16} color="#555" />
              </Pressable>
            </View>
          </View>

          {/* Nút Xoá sản phẩm */}
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

      {/* Tổng tiền */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Tổng cộng:</Text>
        <Text style={styles.totalPrice}>
          {formatPrice(state.totalPrice)}
        </Text>
      </View>
    </View>
  );
}

// ====================================================================
// 📖 COMPONENT: Giải thích kiến thức (InfoBox)
// ====================================================================
function KnowledgeSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📖 Kiến thức Bài 7</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>❓ Prop Drilling là gì?</Text>
        <Text style={styles.infoText}>
          Là việc truyền data qua nhiều tầng component trung gian chỉ để đến
          component ở sâu bên trong cần dùng.{"\n\n"}
          Ví dụ: App → Navigation → HomeScreen → Header → UserAvatar{"\n"}
          Chỉ UserAvatar cần data, nhưng phải truyền qua 4 tầng!
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Context API giải quyết thế nào?</Text>
        <Text style={styles.infoText}>
          Context tạo một "kho dữ liệu toàn cục".{"\n"}
          Bất kỳ component nào cũng có thể truy cập trực tiếp bằng{" "}
          <Text style={styles.code}>useCart()</Text> mà KHÔNG cần props!{"\n\n"}
          Gồm 3 bước:{"\n"}
          1. <Text style={styles.code}>createContext()</Text> — Tạo "kho"{"\n"}
          2. <Text style={styles.code}>{"<Provider>"}</Text> — Bọc app để cung
          cấp dữ liệu{"\n"}
          3. <Text style={styles.code}>useContext()</Text> — Lấy dữ liệu ra dùng
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>
          🔄 useState vs useReducer — Khi nào dùng cái nào?
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>useState:</Text> State đơn giản, ít cách
          thay đổi{"\n"}
          → Ví dụ: isLoading, searchQuery, selectedTab{"\n\n"}
          <Text style={styles.bold}>useReducer:</Text> State phức tạp, NHIỀU
          cách thay đổi{"\n"}
          → Ví dụ: Giỏ hàng (thêm, xoá, tăng, giảm, xoá hết){"\n"}
          → Form nhiều field (validate, reset, submit){"\n"}
          → Logic cập nhật phụ thuộc nhiều điều kiện
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>
          🏗️ Pattern: Action Creators
        </Text>
        <Text style={styles.infoText}>
          Thay vì component phải gọi:{"\n"}
          <Text style={styles.code}>
            {'dispatch({ type: "ADD_ITEM", payload: ... })'}
          </Text>
          {"\n\n"}
          Ta bọc thành hàm tiện ích:{"\n"}
          <Text style={styles.code}>addItem(product)</Text>
          {"\n\n"}
          → Gọn hơn, dễ đọc hơn, dễ refactor hơn!
        </Text>
      </View>
    </View>
  );
}

// ====================================================================
// 🏠 MAIN SCREEN
// ====================================================================
export default function Bai7StateManagementScreen() {
  const { state } = useCart();

  return (
    <>
      <Stack.Screen
        options={{
          title: "📘 Bài 7: State Management",
          headerStyle: { backgroundColor: "#8e44ad" },
          headerTintColor: "#fff",
          // 🆕 PATTERN: Hiển thị icon giỏ hàng + badge trên header
          headerRight: () => (
            <View style={styles.headerCart}>
              <Ionicons name="cart" size={24} color="#fff" />
              {state.totalItems > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>
                    {state.totalItems > 99 ? "99+" : state.totalItems}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: "#f5f5f5" }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>🛒 Context API + useReducer</Text>
          <Text style={styles.bannerSubtitle}>
            Giỏ hàng toàn cục — Thêm/Xoá/Tăng/Giảm sản phẩm
          </Text>
        </View>

        {/* Cửa hàng */}
        <ShopSection />

        {/* Giỏ hàng */}
        <CartSection />

        {/* Kiến thức */}
        <KnowledgeSection />
      </ScrollView>
    </>
  );
}

// ====================================================================
// STYLES
// ====================================================================
const styles = StyleSheet.create({
  // ─── Header ───
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

  // ─── Banner ───
  banner: {
    backgroundColor: "#8e44ad",
    padding: 24,
    alignItems: "center",
  },
  bannerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  bannerSubtitle: {
    fontSize: 13,
    color: "#d7bde2",
    marginTop: 4,
    textAlign: "center",
  },

  // ─── Section ───
  section: { padding: 16, paddingBottom: 0 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  sectionSubtitle: { fontSize: 13, color: "#888", marginBottom: 12 },

  // ─── Product Card ───
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: { width: 60, height: 60, borderRadius: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: "bold", color: "#2c3e50" },
  productDesc: { fontSize: 11, color: "#999", marginTop: 2 },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8e44ad",
    marginTop: 4,
  },
  addBtn: {
    backgroundColor: "#8e44ad",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
  },
  addBtnBadge: { color: "#fff", fontSize: 12, fontWeight: "bold" },

  // ─── Cart ───
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
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyCartText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#999",
    marginTop: 8,
  },
  emptyCartHint: { fontSize: 13, color: "#bbb", marginTop: 4 },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
    gap: 12,
  },
  cartItemImage: { width: 50, height: 50, borderRadius: 8 },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: "600", color: "#2c3e50" },
  cartItemPrice: { fontSize: 13, color: "#8e44ad", marginTop: 2 },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { fontSize: 15, fontWeight: "bold", color: "#333", minWidth: 20, textAlign: "center" },
  removeBtn: { padding: 4 },

  // ─── Total ───
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#8e44ad",
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  totalLabel: { fontSize: 16, color: "#fff", fontWeight: "600" },
  totalPrice: { fontSize: 20, color: "#fff", fontWeight: "bold" },

  // ─── Info Box ───
  infoBox: {
    backgroundColor: "#f3e5f5",
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#8e44ad",
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6a1b9a",
    marginBottom: 6,
  },
  infoText: { fontSize: 13, color: "#5e4570", lineHeight: 20 },
  code: { fontFamily: "monospace", fontWeight: "bold", color: "#8e44ad" },
  bold: { fontWeight: "bold" },
});
