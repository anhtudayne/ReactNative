import { View, Text, Image, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router, Stack } from "expo-router";

// ====================================================================
// 📘 BÀI 5: Navigation — Trang Chi Tiết Sản Phẩm
// Demo: Nhận params từ trang danh sách → Hiển thị chi tiết
// ====================================================================

// 🆕 HOOK MỚI: useLocalSearchParams
// ───────────────────────────────────
// Hook này do Expo Router cung cấp, dùng để LẤY các tham số (params)
// mà trang trước đã truyền qua khi gọi router.push({ params: {...} }).
//
// Tương tự như:
// - Web: Lấy query string từ URL (?name=iPhone&price=999)
// - React Navigation: route.params.name, route.params.price

export default function ProductDetailScreen() {
  // Lấy toàn bộ params đã truyền từ trang trước
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    price: string;
    image: string;
    category: string;
    rating: string;
    description: string;
  }>();

  return (
    <>
      {/* 🆕 PATTERN: Dynamic Header — Đổi tiêu đề header theo nội dung trang */}
      {/* Thay vì để tiêu đề mặc định "Chi tiết sản phẩm" cho mọi sản phẩm, */}
      {/* ta dùng <Stack.Screen options={{...}} /> để ghi đè tiêu đề ngay trong component */}
      <Stack.Screen
        options={{
          title: params.name || "Chi tiết sản phẩm",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#8e44ad" },
        }}
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: "#f5f5f5" }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Ảnh sản phẩm */}
        <Image
          source={{ uri: params.image }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Badge danh mục */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{params.category}</Text>
        </View>

        {/* Thông tin chính */}
        <View style={styles.mainInfo}>
          <Text style={styles.productName}>{params.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{params.price}</Text>
            <Text style={styles.rating}>⭐ {params.rating}/5.0</Text>
          </View>
        </View>

        {/* Mô tả */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Mô tả sản phẩm</Text>
          <Text style={styles.description}>{params.description}</Text>
        </View>

        {/* Info box: Giải thích navigation */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>🧭 Cách trang này nhận dữ liệu:</Text>
          <Text style={styles.infoText}>
            1. Trang trước gọi:{"\n"}
            <Text style={styles.code}>
              {"   "}router.push({"{"}pathname: "/bai5-product-detail", params: {"{"} name, price, ... {"}"}{"}"}{")"}{"\n"}
            </Text>
            2. Trang này nhận bằng hook:{"\n"}
            <Text style={styles.code}>
              {"   "}const {"{"} name, price {"}"} = useLocalSearchParams(){"\n"}
            </Text>
            3. Nút Back ở header: Expo Router tự tạo sẵn!
          </Text>
        </View>

        {/* Nhóm nút điều hướng — Demo 3 cách */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧪 Thử các cách điều hướng:</Text>

          {/* router.back() — Quay lại trang trước (giống nút Back) */}
          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              { backgroundColor: "#3498db" },
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.navButtonText}>← router.back() — Quay lại</Text>
            <Text style={styles.navButtonDesc}>
              Giống nút Back: Lấy trang hiện tại ra khỏi stack
            </Text>
          </Pressable>

          {/* router.replace() — Thay thế trang hiện tại */}
          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              { backgroundColor: "#e67e22" },
              pressed && { opacity: 0.7 },
            ]}
            onPress={() =>
              router.replace({
                pathname: "/bai5-product-detail",
                params: {
                  id: "99",
                  name: "🔄 Sản phẩm thay thế (replaced!)",
                  price: "999.000₫",
                  image: "https://picsum.photos/seed/replaced/400/400",
                  category: "Demo replace",
                  rating: "5.0",
                  description:
                    "Đây là trang được mở bằng router.replace(). Nếu bạn bấm nút Back ở header, bạn sẽ quay về trang TRƯỚC trang cũ (trang danh sách), chứ KHÔNG quay về trang chi tiết cũ — vì trang cũ đã bị THAY THẾ!",
                },
              })
            }
          >
            <Text style={styles.navButtonText}>
              🔄 router.replace() — Thay thế trang này
            </Text>
            <Text style={styles.navButtonDesc}>
              Thay trang hiện tại bằng trang mới (không thể Back về trang cũ)
            </Text>
          </Pressable>

          {/* router.push() — Đẩy thêm trang mới */}
          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              { backgroundColor: "#27ae60" },
              pressed && { opacity: 0.7 },
            ]}
            onPress={() =>
              router.push({
                pathname: "/bai5-product-detail",
                params: {
                  id: "100",
                  name: "📄 Trang chi tiết LỒNG thêm (push!)",
                  price: "0₫",
                  image: "https://picsum.photos/seed/nested/400/400",
                  category: "Demo push",
                  rating: "4.5",
                  description:
                    "Đây là trang được mở bằng router.push() từ bên trong một trang chi tiết khác. Bạn phải bấm Back NHIỀU LẦN để quay về trang danh sách, vì mỗi lần push() tạo thêm 1 tầng trong stack!",
                },
              })
            }
          >
            <Text style={styles.navButtonText}>
              📄 router.push() — Mở thêm trang mới
            </Text>
            <Text style={styles.navButtonDesc}>
              Đẩy thêm 1 trang vào stack (phải Back nhiều lần)
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

// ====================================================================
// STYLES
// ====================================================================
const styles = StyleSheet.create({
  heroImage: {
    width: "100%",
    height: 280,
    backgroundColor: "#eee",
  },
  categoryBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(142, 68, 173, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  mainInfo: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    lineHeight: 28,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  rating: {
    fontSize: 16,
    color: "#f39c12",
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
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
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#5b2c6f",
    lineHeight: 22,
  },
  code: {
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#8e44ad",
    fontSize: 12,
  },
  navButton: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  navButtonDesc: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 4,
  },
});
