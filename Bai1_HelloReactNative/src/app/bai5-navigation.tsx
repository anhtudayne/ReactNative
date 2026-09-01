import { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// ====================================================================
// 📘 BÀI 5: Navigation — Điều Hướng Cơ Bản
// Demo 1: Danh sách sản phẩm → Nhấn vào → Chuyển sang trang chi tiết
// ====================================================================

// Dữ liệu sản phẩm giả lập
type Product = {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  category: string;
  rating: number;
  description: string;
};

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Tai nghe Sony WH-1000XM5",
    price: "7.990.000₫",
    priceNum: 7990000,
    image: "https://picsum.photos/seed/headphone/400/400",
    category: "Âm thanh",
    rating: 4.8,
    description:
      "Tai nghe chống ồn hàng đầu thế giới với chất âm Hi-Res, pin 30 giờ, thiết kế nhẹ và thoải mái.",
  },
  {
    id: "2",
    name: "Bàn phím cơ Keychron K2",
    price: "2.490.000₫",
    priceNum: 2490000,
    image: "https://picsum.photos/seed/keyboard/400/400",
    category: "Phụ kiện",
    rating: 4.6,
    description:
      "Bàn phím cơ không dây Bluetooth 5.1, switch Gateron, đèn RGB, tương thích Mac/Win.",
  },
  {
    id: "3",
    name: "Chuột Logitech MX Master 3S",
    price: "2.190.000₫",
    priceNum: 2190000,
    image: "https://picsum.photos/seed/mouse/400/400",
    category: "Phụ kiện",
    rating: 4.7,
    description:
      "Chuột cao cấp cho dân sáng tạo, cuộn MagSpeed, kết nối 3 thiết bị, pin 70 ngày.",
  },
  {
    id: "4",
    name: "Màn hình Dell U2723QE 4K",
    price: "12.990.000₫",
    priceNum: 12990000,
    image: "https://picsum.photos/seed/monitor/400/400",
    category: "Màn hình",
    rating: 4.9,
    description:
      "Màn hình 27 inch 4K IPS Black, USB-C 90W, sRGB 98%, thiết kế viền siêu mỏng.",
  },
  {
    id: "5",
    name: "iPad Air M2 11 inch",
    price: "16.490.000₫",
    priceNum: 16490000,
    image: "https://picsum.photos/seed/ipad/400/400",
    category: "Máy tính bảng",
    rating: 4.8,
    description:
      "Chip Apple M2, màn hình Liquid Retina 11 inch, hỗ trợ Apple Pencil Pro và Magic Keyboard.",
  },
  {
    id: "6",
    name: "Loa Marshall Stanmore III",
    price: "9.990.000₫",
    priceNum: 9990000,
    image: "https://picsum.photos/seed/speaker/400/400",
    category: "Âm thanh",
    rating: 4.5,
    description:
      "Loa Bluetooth phong cách retro, âm thanh Dynamic Loudness, Bluetooth 5.2, thiết kế biểu tượng.",
  },
  {
    id: "7",
    name: "Ổ cứng SSD Samsung T7 1TB",
    price: "2.690.000₫",
    priceNum: 2690000,
    image: "https://picsum.photos/seed/ssd/400/400",
    category: "Lưu trữ",
    rating: 4.7,
    description:
      "SSD di động tốc độ 1050MB/s, gọn nhẹ, bảo mật vân tay, kháng sốc.",
  },
  {
    id: "8",
    name: "Apple Watch Series 9",
    price: "10.990.000₫",
    priceNum: 10990000,
    image: "https://picsum.photos/seed/watch/400/400",
    category: "Đồng hồ",
    rating: 4.6,
    description:
      "Chip S9 SiP, Double Tap gesture, màn hình Always-On sáng gấp đôi, đo SpO2 và ECG.",
  },
];

// ====================================================================
// Component: ProductCard — Thẻ sản phẩm trong danh sách
// ====================================================================
function ProductCard({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  return (
    // 🆕 PATTERN: Khi nhấn vào Card → Gọi hàm onPress do cha truyền xuống
    // Trong Bài 5 này, onPress sẽ điều hướng sang trang chi tiết!
    <Pressable
      style={({ pressed }) => [
        styles.productCard,
        pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.productMeta}>
          <Text style={styles.productPrice}>{product.price}</Text>
          <Text style={styles.productRating}>⭐ {product.rating}</Text>
        </View>
      </View>
    </Pressable>
  );
}

// ====================================================================
// MAIN SCREEN
// ====================================================================
export default function Bai5NavigationScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📘 Bài 5: Navigation</Text>
        <Text style={styles.headerSubtitle}>
          Nhấn vào sản phẩm để xem chi tiết (chuyển trang)
        </Text>
      </View>

      {/* Phần giải thích */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🧭 3 cách điều hướng trong Expo Router:</Text>
        <Text style={styles.infoText}>
          • <Text style={styles.code}>router.push("/path")</Text> — Đẩy thêm 1 trang mới vào stack{"\n"}
          • <Text style={styles.code}>router.replace("/path")</Text> — Thay thế trang hiện tại{"\n"}
          • <Text style={styles.code}>router.back()</Text> — Quay lại trang trước
        </Text>
      </View>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            // ⭐ ĐIỀU HƯỚNG: Khi nhấn vào sản phẩm → chuyển sang trang chi tiết
            // Truyền data qua URL params
            onPress={() =>
              router.push({
                pathname: "/bai5-product-detail",
                params: {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  category: item.category,
                  rating: String(item.rating),
                  description: item.description,
                },
              })
            }
          />
        )}
        contentContainerStyle={{ padding: 12, paddingBottom: 30 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
}

// ====================================================================
// STYLES
// ====================================================================
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#8e44ad",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#d2b4de",
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: "#f0e6f6",
    marginHorizontal: 12,
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#8e44ad",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6c3483",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#5b2c6f",
    lineHeight: 20,
  },
  code: {
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#8e44ad",
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 110,
    height: 110,
    backgroundColor: "#eee",
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  productCategory: {
    fontSize: 11,
    color: "#8e44ad",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
    lineHeight: 20,
  },
  productMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  productRating: {
    fontSize: 13,
    color: "#f39c12",
  },
});
