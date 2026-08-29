import { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  SectionList,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ====================================================================
// 📘 BÀI 4: FlatList, SectionList & ScrollView
// ====================================================================

// ---------------------
// 1. DEMO: ScrollView vs FlatList — So sánh trực quan
// ---------------------

// Data giả lập 100 users
const USERS = Array.from({ length: 100 }, (_, i) => ({
  id: String(i + 1),
  name: `Người dùng ${i + 1}`,
  email: `user${i + 1}@gmail.com`,
  avatar: `https://i.pravatar.cc/100?img=${(i % 70) + 1}`,
  role: i % 5 === 0 ? "Admin" : i % 3 === 0 ? "Moderator" : "Member",
}));
type User = (typeof USERS)[number];

// ====================================================================
// DEMO 1: FlatList cơ bản — Danh sách hiệu suất cao
// ====================================================================

// 🆕 PATTERN: React.memo — Tối ưu render cho từng item
// ───────────────────────────────────────────────────────
// Bình thường khi bạn cuộn list, React sẽ RE-RENDER tất cả item
// đang hiển thị trên màn hình. React.memo giúp:
// → Nếu props (data) của item KHÔNG thay đổi → BỎ QUA render → Mượt hơn!
//
// Tưởng tượng bạn có 100 tin nhắn, cuộn lên cuộn xuống:
// ❌ Không memo: mỗi lần cuộn, 100 item đều phải render lại
// ✅ Có memo: chỉ item MỚI XUẤT HIỆN trên màn hình mới render

import React from "react";

const UserCard = React.memo(function UserCard({ user }: { user: User }) {
  return (
    <View style={styles.userCard}>
      <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>
      <View
        style={[
          styles.roleBadge,
          user.role === "Admin" && { backgroundColor: "#e74c3c" },
          user.role === "Moderator" && { backgroundColor: "#f39c12" },
        ]}
      >
        <Text style={styles.roleText}>{user.role}</Text>
      </View>
    </View>
  );
});

function FlatListBasicDemo() {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(USERS.slice(0, 20)); // Bắt đầu 20 user
  const [loading, setLoading] = useState(false);

  // 🆕 PATTERN: useCallback — Cache hàm, tránh tạo function mới mỗi render
  // ─────────────────────────────────────────────────────────────────────────
  // Khi component re-render (ví dụ pull-to-refresh), JavaScript sẽ
  // TẠO MỚI tất cả function bên trong component.
  // useCallback giúp: "Giữ nguyên function cũ nếu dependencies [] không đổi"
  // → FlatList thấy renderItem KHÔNG đổi → không re-render tất cả items
  const renderItem = useCallback(
    ({ item }: { item: User }) => <UserCard user={item} />,
    []
  );

  const keyExtractor = useCallback((item: User) => item.id, []);

  // Pull to refresh — kéo xuống để tải lại danh sách
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Giả lập gọi API mất 1.5 giây
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setData(USERS.slice(0, 20)); // Reset lại 20 user đầu
    setRefreshing(false);
  }, []);

  // 🆕 PATTERN: Infinite Scroll (Cuộn vô tận)
  // ───────────────────────────────────────────
  // Khi user cuộn gần đến cuối danh sách → tự động load thêm data
  // Giống như Facebook/Instagram: cuộn xuống → tự động hiện thêm bài viết
  const loadMore = useCallback(() => {
    if (loading || data.length >= USERS.length) return; // Không load nếu đang load hoặc hết data
    setLoading(true);
    // Giả lập gọi API
    setTimeout(() => {
      const nextBatch = USERS.slice(data.length, data.length + 10); // Lấy thêm 10 user
      setData((prev) => [...prev, ...nextBatch]); // Gộp vào danh sách cũ
      setLoading(false);
    }, 1000);
  }, [data.length, loading]);

  // ListHeader — Hiển thị phía trên cùng danh sách
  const ListHeader = useCallback(
    () => (
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderTitle}>
          👥 Danh sách thành viên ({data.length}/{USERS.length})
        </Text>
        <Text style={styles.listHeaderDesc}>
          Kéo xuống để refresh • Cuộn tới cuối để load thêm
        </Text>
      </View>
    ),
    [data.length]
  );

  // ListFooter — Loading indicator khi đang load thêm
  const ListFooter = useCallback(
    () =>
      loading ? (
        <View style={styles.listFooter}>
          <ActivityIndicator size="small" color="#16a085" />
          <Text style={styles.loadingText}>Đang tải thêm...</Text>
        </View>
      ) : data.length >= USERS.length ? (
        <Text style={styles.endText}>— Đã hiển thị tất cả —</Text>
      ) : null,
    [loading, data.length]
  );

  // ItemSeparator — Đường kẻ giữa các item
  const ItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  // ListEmpty — Hiển thị khi danh sách rỗng
  const ListEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={styles.emptyText}>Không có dữ liệu</Text>
      </View>
    ),
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        // ── Header & Footer ──
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        ItemSeparatorComponent={ItemSeparator}
        // ── Pull to Refresh ──
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#16a085"]} // Màu spinner (Android)
            tintColor="#16a085" // Màu spinner (iOS)
          />
        }
        // ── Infinite Scroll ──
        onEndReached={loadMore}
        onEndReachedThreshold={0.3} // Trigger khi còn 30% cuối
        // ── Tối ưu hiệu suất ──
        initialNumToRender={10} // Render 10 items đầu tiên
        maxToRenderPerBatch={5} // Mỗi batch render tối đa 5 items
        windowSize={5} // Giữ 5 "cửa sổ" items trong memory
        removeClippedSubviews={true} // Gỡ bỏ items ngoài viewport (Android)
      />
    </View>
  );
}

// ====================================================================
// DEMO 2: SectionList — Danh sách phân nhóm (như Danh bạ điện thoại)
// ====================================================================

type Contact = {
  id: string;
  name: string;
  phone: string;
  avatar: string;
};

// Dữ liệu danh bạ theo nhóm chữ cái
const CONTACTS_SECTIONS = [
  {
    title: "A",
    data: [
      { id: "a1", name: "An Nguyễn", phone: "0901 234 567", avatar: "https://i.pravatar.cc/80?img=1" },
      { id: "a2", name: "Anh Trần", phone: "0912 345 678", avatar: "https://i.pravatar.cc/80?img=2" },
      { id: "a3", name: "Ánh Lê", phone: "0923 456 789", avatar: "https://i.pravatar.cc/80?img=3" },
    ] as Contact[],
  },
  {
    title: "B",
    data: [
      { id: "b1", name: "Bình Phạm", phone: "0934 567 890", avatar: "https://i.pravatar.cc/80?img=4" },
      { id: "b2", name: "Bảo Hoàng", phone: "0945 678 901", avatar: "https://i.pravatar.cc/80?img=5" },
    ] as Contact[],
  },
  {
    title: "C",
    data: [
      { id: "c1", name: "Cường Võ", phone: "0956 789 012", avatar: "https://i.pravatar.cc/80?img=6" },
      { id: "c2", name: "Chi Mai", phone: "0967 890 123", avatar: "https://i.pravatar.cc/80?img=7" },
      { id: "c3", name: "Châu Đặng", phone: "0978 901 234", avatar: "https://i.pravatar.cc/80?img=8" },
    ] as Contact[],
  },
  {
    title: "D",
    data: [
      { id: "d1", name: "Dũng Ngô", phone: "0989 012 345", avatar: "https://i.pravatar.cc/80?img=9" },
      { id: "d2", name: "Duy Bùi", phone: "0990 123 456", avatar: "https://i.pravatar.cc/80?img=10" },
    ] as Contact[],
  },
  {
    title: "H",
    data: [
      { id: "h1", name: "Hùng Trần", phone: "0901 111 222", avatar: "https://i.pravatar.cc/80?img=11" },
      { id: "h2", name: "Hạnh Nguyễn", phone: "0912 222 333", avatar: "https://i.pravatar.cc/80?img=12" },
      { id: "h3", name: "Hiền Lê", phone: "0923 333 444", avatar: "https://i.pravatar.cc/80?img=13" },
    ] as Contact[],
  },
  {
    title: "T",
    data: [
      { id: "t1", name: "Tú Vũ", phone: "0934 444 555", avatar: "https://i.pravatar.cc/80?img=14" },
      { id: "t2", name: "Thảo Phan", phone: "0945 555 666", avatar: "https://i.pravatar.cc/80?img=15" },
      { id: "t3", name: "Trung Đỗ", phone: "0956 666 777", avatar: "https://i.pravatar.cc/80?img=16" },
    ] as Contact[],
  },
];

// Component cho từng liên hệ trong SectionList
const ContactItem = React.memo(function ContactItem({
  contact,
  onCall,
}: {
  contact: Contact;
  onCall: (name: string) => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.contactItem,
        pressed && { backgroundColor: "#f0f0f0" },
      ]}
      onPress={() => onCall(contact.name)}
    >
      <Image source={{ uri: contact.avatar }} style={styles.contactAvatar} />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactPhone}>{contact.phone}</Text>
      </View>
      <Text style={styles.callIcon}>📞</Text>
    </Pressable>
  );
});

function SectionListDemo() {
  const [searchText, setSearchText] = useState("");

  const handleCall = useCallback((name: string) => {
    Alert.alert("Gọi điện", `Đang gọi cho ${name}...`);
  }, []);

  // Lọc danh bạ theo search text
  const filteredSections = CONTACTS_SECTIONS.map((section) => ({
    ...section,
    data: section.data.filter((c) =>
      c.name.toLowerCase().includes(searchText.toLowerCase())
    ),
  })).filter((section) => section.data.length > 0); // Bỏ section rỗng

  return (
    <View style={{ flex: 1 }}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm liên hệ..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => item.id}
        // Render từng item
        renderItem={({ item }) => (
          <ContactItem contact={item} onCall={handleCall} />
        )}
        // Render header cho từng nhóm (chữ cái A, B, C, ...)
        renderSectionHeader={({ section: { title, data } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionCount}>{data.length} liên hệ</Text>
          </View>
        )}
        // ⭐ Sticky header — Header dính ở đỉnh khi cuộn (giống danh bạ iOS)
        stickySectionHeadersEnabled={true}
        // Hiển thị khi danh sách trống
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>
              Không tìm thấy "{searchText}"
            </Text>
          </View>
        }
      />
    </View>
  );
}

// ====================================================================
// DEMO 3: FlatList Grid — Hiển thị dạng lưới (numColumns)
// ====================================================================

type Photo = {
  id: string;
  url: string;
  title: string;
  likes: number;
};

const PHOTOS: Photo[] = Array.from({ length: 30 }, (_, i) => ({
  id: String(i + 1),
  url: `https://picsum.photos/seed/${i + 1}/300/300`,
  title: `Ảnh ${i + 1}`,
  likes: Math.floor(Math.random() * 500) + 10,
}));

const PhotoCard = React.memo(function PhotoCard({ photo }: { photo: Photo }) {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.photoCard}>
      <Image source={{ uri: photo.url }} style={styles.photoImage} />
      <View style={styles.photoOverlay}>
        <Text style={styles.photoTitle} numberOfLines={1}>
          {photo.title}
        </Text>
        <Pressable
          onPress={() => setLiked(!liked)}
          style={({ pressed }) => pressed && { opacity: 0.6 }}
        >
          <Text style={styles.photoLikes}>
            {liked ? "❤️" : "🤍"} {photo.likes + (liked ? 1 : 0)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

function FlatListGridDemo() {
  const renderItem = useCallback(
    ({ item }: { item: Photo }) => <PhotoCard photo={item} />,
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={PHOTOS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        // ⭐ numColumns = 3: FlatList tự động chia thành 3 cột
        numColumns={3}
        // Style cho phần chứa tất cả items (tương tự contentContainerStyle)
        contentContainerStyle={{ padding: 2 }}
        // Header
        ListHeaderComponent={
          <View style={styles.gridHeader}>
            <Text style={styles.gridHeaderTitle}>📸 Thư viện ảnh</Text>
            <Text style={styles.gridHeaderDesc}>
              {PHOTOS.length} ảnh • FlatList numColumns=3
            </Text>
          </View>
        }
      />
    </View>
  );
}

// ====================================================================
// MAIN SCREEN — Tab chuyển giữa 3 demo
// ====================================================================
export default function Bai4ListScreen() {
  const [activeTab, setActiveTab] = useState<
    "flatlist" | "sectionlist" | "grid"
  >("flatlist");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📘 Bài 4: Lists</Text>
        <Text style={styles.headerSubtitle}>
          FlatList • SectionList • Grid Layout
        </Text>
      </View>

      {/* Tab bar — 🆕 PATTERN: Tab Switching */}
      <View style={styles.tabBar}>
        {(
          [
            { key: "flatlist", label: "📋 FlatList", icon: "📋" },
            { key: "sectionlist", label: "📑 SectionList", icon: "📑" },
            { key: "grid", label: "🖼️ Grid", icon: "🖼️" },
          ] as const
        ).map((tab) => (
          <Pressable
            key={tab.key}
            style={[
              styles.tabItem,
              activeTab === tab.key && styles.tabItemActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Content — Render tab đang active */}
      {activeTab === "flatlist" && <FlatListBasicDemo />}
      {activeTab === "sectionlist" && <SectionListDemo />}
      {activeTab === "grid" && <FlatListGridDemo />}
    </SafeAreaView>
  );
}

// ====================================================================
// STYLES
// ====================================================================
const styles = StyleSheet.create({
  // --- Header ---
  header: {
    backgroundColor: "#2980b9",
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
    color: "#a9d4f5",
    marginTop: 4,
  },

  // --- Tab Bar ---
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#2980b9",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
  },
  tabTextActive: {
    color: "#2980b9",
  },

  // --- User Card (FlatList) ---
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eee",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
  },
  userEmail: {
    fontSize: 13,
    color: "#7f8c8d",
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: "#3498db",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  // --- List Header/Footer ---
  listHeader: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  listHeaderTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  listHeaderDesc: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 4,
  },
  listFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: "#7f8c8d",
  },
  endText: {
    textAlign: "center",
    paddingVertical: 20,
    fontSize: 13,
    color: "#bdc3c7",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 76, // Căn theo avatar offset (16 + 48 + 12)
  },

  // --- Empty State ---
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
    color: "#bdc3c7",
    marginTop: 12,
  },

  // --- Search Bar ---
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
  },

  // --- SectionList ---
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  sectionCount: {
    fontSize: 12,
    color: "#95a5a6",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eee",
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2c3e50",
  },
  contactPhone: {
    fontSize: 13,
    color: "#95a5a6",
    marginTop: 2,
  },
  callIcon: {
    fontSize: 20,
  },

  // --- Grid ---
  gridHeader: {
    padding: 16,
    backgroundColor: "#fff",
  },
  gridHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  gridHeaderDesc: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 4,
  },
  photoCard: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 1,
    backgroundColor: "#eee",
    overflow: "hidden",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  photoTitle: {
    color: "#fff",
    fontSize: 10,
    flex: 1,
  },
  photoLikes: {
    color: "#fff",
    fontSize: 10,
  },
});
