import { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ====================================================================
// 📝 BÀI TẬP BÀI 3: Thực hành Flexbox & Layout
// ====================================================================

// ---------------------
// BT1: Card Sản Phẩm (Product Card)
// → Dùng: flexDirection row, alignItems center, gap
// ---------------------
type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  sold: number;
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Tai nghe Bluetooth Sony WH-1000XM5",
    price: "7.990.000₫",
    image: "https://picsum.photos/seed/headphone/200/200",
    rating: 4.8,
    sold: 1234,
  },
  {
    id: 2,
    name: "Bàn phím cơ Keychron K2 Pro",
    price: "2.490.000₫",
    image: "https://picsum.photos/seed/keyboard/200/200",
    rating: 4.6,
    sold: 856,
  },
  {
    id: 3,
    name: "Chuột Logitech MX Master 3S",
    price: "2.190.000₫",
    image: "https://picsum.photos/seed/mouse/200/200",
    rating: 4.9,
    sold: 2341,
  },
  {
    id: 4,
    name: "Màn hình Dell 27inch 4K UltraSharp",
    price: "12.990.000₫",
    image: "https://picsum.photos/seed/monitor/200/200",
    rating: 4.7,
    sold: 567,
  },
  {
    id: 5,
    name: "Laptop MacBook Pro M4 14inch",
    price: "42.990.000₫",
    image: "https://picsum.photos/seed/macbook/200/200",
    rating: 4.9,
    sold: 3201,
  },
  {
    id: 6,
    name: "Ổ cứng SSD Samsung 990 Pro 1TB",
    price: "2.890.000₫",
    image: "https://picsum.photos/seed/ssd/200/200",
    rating: 4.5,
    sold: 1890,
  },
];

// ---------------------
// Pattern: Render Props — Component nhận dữ liệu qua props
// ---------------------
function ProductCard({ product }: { product: Product }) {
  const [isFav, setIsFav] = useState(false);

  return (
    <View style={styles.productCard}>
      {/* Ảnh sản phẩm */}
      <Image
        source={{ uri: product.image }}
        style={styles.productImage}
        resizeMode="cover"
      />

      {/* Thông tin — dùng flex: 1 để chiếm hết không gian còn lại */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Row: giá + rating */}
        <View style={styles.productMeta}>
          <Text style={styles.productPrice}>{product.price}</Text>
          <Text style={styles.productRating}>⭐ {product.rating}</Text>
        </View>

        {/* Row: đã bán + nút yêu thích */}
        <View style={styles.productActions}>
          <Text style={styles.productSold}>Đã bán {product.sold}</Text>
          <Pressable
            onPress={() => setIsFav(!isFav)}
            style={({ pressed }) => pressed && { opacity: 0.6 }}
          >
            <Text style={{ fontSize: 20 }}>{isFav ? "❤️" : "🤍"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ---------------------
// BT2: Grid Sản Phẩm 2 Cột (flexWrap)
// → Dùng: flexWrap: wrap, tính toán width theo useWindowDimensions
// ---------------------
function ProductGridCard({ product, cardWidth }: { product: Product; cardWidth: number }) {
  return (
    <View style={[styles.gridCard, { width: cardWidth }]}>
      <Image
        source={{ uri: product.image }}
        style={styles.gridImage}
        resizeMode="cover"
      />
      <View style={styles.gridInfo}>
        <Text style={styles.gridName} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.gridPrice}>{product.price}</Text>
        <View style={styles.gridMeta}>
          <Text style={styles.gridRating}>⭐ {product.rating}</Text>
          <Text style={styles.gridSold}>{product.sold} sold</Text>
        </View>
      </View>
    </View>
  );
}

// ---------------------
// BT3: Chat Message Layout
// → Pattern thực tế: tin nhắn trái/phải giống Messenger
// → Dùng: alignSelf, flexDirection, borderRadius bất đối xứng
// ---------------------
type Message = {
  id: number;
  text: string;
  isMe: boolean;
  time: string;
};

const MESSAGES: Message[] = [
  { id: 1, text: "Chào bạn! Hôm nay học Flexbox nhé 📘", isMe: false, time: "10:30" },
  { id: 2, text: "Ok bạn! Mình sẵn sàng rồi 💪", isMe: true, time: "10:31" },
  { id: 3, text: "Flexbox trong React Native mặc định column, khác với web là row đó", isMe: false, time: "10:32" },
  { id: 4, text: "À ra vậy! Hèn gì mình cứ thắc mắc 🤔", isMe: true, time: "10:33" },
  { id: 5, text: "Ngoài ra còn có justifyContent để căn trục chính và alignItems để căn trục phụ nữa", isMe: false, time: "10:34" },
  { id: 6, text: "Cảm ơn bạn! Bây giờ mình hiểu rồi ✅", isMe: true, time: "10:35" },
];

function ChatBubble({ message }: { message: Message }) {
  return (
    <View
      style={[
        styles.bubbleContainer,
        { alignSelf: message.isMe ? "flex-end" : "flex-start" },
      ]}
    >
      <View
        style={[
          styles.bubble,
          message.isMe ? styles.bubbleMe : styles.bubbleOther,
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            { color: message.isMe ? "#fff" : "#333" },
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.bubbleTime,
            { color: message.isMe ? "rgba(255,255,255,0.7)" : "#999" },
          ]}
        >
          {message.time}
        </Text>
      </View>
    </View>
  );
}

// ====================================================================
// MAIN SCREEN
// ====================================================================
export default function Bai3PracticeScreen() {
  const { width } = useWindowDimensions();
  const columns = width >= 500 ? 3 : 2;
  const gridGap = 10;
  const gridPadding = 16;
  const cardWidth = (width - gridPadding * 2 - gridGap * (columns - 1)) / columns;

  const [searchText, setSearchText] = useState("");

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📝 Bài Tập Bài 3</Text>
          <Text style={styles.headerSubtitle}>
            Flexbox Layout thực tế: List, Grid, Chat
          </Text>
        </View>

        {/* ===== BT1: Product List ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            📦 BT1: Product List (flexDirection: row)
          </Text>
          <Text style={styles.sectionDesc}>
            Mỗi card sản phẩm dùng row layout: Ảnh bên trái, thông tin bên phải
          </Text>
          {PRODUCTS.slice(0, 3).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </View>

        {/* ===== BT2: Product Grid ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🛒 BT2: Product Grid {columns} cột (flexWrap)
          </Text>

          {/* Search bar — Pattern thực tế */}
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm sản phẩm..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: gridGap,
              paddingHorizontal: gridPadding,
            }}
          >
            {filteredProducts.map((p) => (
              <ProductGridCard key={p.id} product={p} cardWidth={cardWidth} />
            ))}
            {filteredProducts.length === 0 && (
              <Text style={styles.emptyText}>
                Không tìm thấy sản phẩm "{searchText}"
              </Text>
            )}
          </View>
        </View>

        {/* ===== BT3: Chat Layout ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            💬 BT3: Chat Layout (alignSelf)
          </Text>
          <Text style={styles.sectionDesc}>
            Tin nhắn của mình căn phải (alignSelf: flex-end), người khác căn trái
          </Text>

          <View style={styles.chatContainer}>
            {MESSAGES.map((m) => (
              <ChatBubble key={m.id} message={m} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ====================================================================
// STYLES
// ====================================================================
const styles = StyleSheet.create({
  // --- Header ---
  header: {
    backgroundColor: "#16a085",
    padding: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#a3d9cc",
    marginTop: 6,
  },

  // --- Section ---
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: "#7f8c8d",
    marginBottom: 12,
  },

  // --- Product Card (List) ---
  productCard: {
    flexDirection: "row",       // ← Row layout: ảnh trái, text phải
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    backgroundColor: "#eee",
  },
  productInfo: {
    flex: 1,                    // ← Chiếm hết không gian còn lại
    padding: 12,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    lineHeight: 20,
  },
  productMeta: {
    flexDirection: "row",       // ← Row cho giá + rating
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  productRating: {
    fontSize: 13,
    color: "#f39c12",
  },
  productActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productSold: {
    fontSize: 12,
    color: "#999",
  },

  // --- Product Grid ---
  gridCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  gridImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#eee",
  },
  gridInfo: {
    padding: 10,
  },
  gridName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2c3e50",
  },
  gridPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e74c3c",
    marginTop: 4,
  },
  gridMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  gridRating: {
    fontSize: 11,
    color: "#f39c12",
  },
  gridSold: {
    fontSize: 11,
    color: "#999",
  },

  // --- Search Bar ---
  searchBar: {
    flexDirection: "row",        // ← Row: icon + input
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,                     // ← Input chiếm hết không gian
    paddingVertical: 12,
    fontSize: 15,
  },

  // --- Chat ---
  chatContainer: {
    backgroundColor: "#e5ddd5",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  bubbleContainer: {
    maxWidth: "80%",             // ← Bubble không quá 80% chiều rộng
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: "#0084ff",
    borderBottomRightRadius: 4,  // ← Bo góc bất đối xứng (giống Messenger)
  },
  bubbleOther: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
  },
  bubbleTime: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "right",
  },

  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingVertical: 40,
    width: "100%",
  },
});
