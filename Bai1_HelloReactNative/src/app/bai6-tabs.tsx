import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";

// ====================================================================
// 📘 BÀI 6: Tab Navigation & Nested Navigation
// Demo: Xây dựng Mini-App giống Shopee với 4 Tabs + Nested Stack
// ====================================================================

// ─── Dữ liệu giả lập ─────────────────────────────────────────────
const CATEGORIES = [
  { id: "1", name: "Điện thoại", icon: "📱", color: "#e74c3c" },
  { id: "2", name: "Laptop", icon: "💻", color: "#3498db" },
  { id: "3", name: "Tai nghe", icon: "🎧", color: "#9b59b6" },
  { id: "4", name: "Đồng hồ", icon: "⌚", color: "#e67e22" },
  { id: "5", name: "Máy ảnh", icon: "📷", color: "#1abc9c" },
  { id: "6", name: "Tivi", icon: "📺", color: "#2c3e50" },
];

const NOTIFICATIONS = [
  {
    id: "1",
    type: "order" as const,
    title: "Đơn hàng #12345 đang giao",
    desc: "Shipper đang trên đường đến, dự kiến 30 phút nữa.",
    time: "5 phút trước",
    read: false,
  },
  {
    id: "2",
    type: "promo" as const,
    title: "🔥 Flash Sale 12:00 hôm nay!",
    desc: "Giảm đến 50% cho hàng trăm sản phẩm. Đừng bỏ lỡ!",
    time: "1 giờ trước",
    read: false,
  },
  {
    id: "3",
    type: "system" as const,
    title: "Cập nhật bảo mật",
    desc: "Vui lòng cập nhật mật khẩu để bảo vệ tài khoản.",
    time: "2 giờ trước",
    read: true,
  },
  {
    id: "4",
    type: "order" as const,
    title: "Đơn hàng #12300 đã giao thành công",
    desc: "Hãy đánh giá sản phẩm để nhận 50 xu.",
    time: "Hôm qua",
    read: true,
  },
  {
    id: "5",
    type: "promo" as const,
    title: "Voucher giảm 100K cho đơn từ 500K",
    desc: 'Mã: GIAM100K — Áp dụng cho mục "Điện thoại".',
    time: "2 ngày trước",
    read: true,
  },
];

const PROFILE_MENU = [
  { icon: "receipt-outline" as const, label: "Đơn mua", badge: 2 },
  { icon: "heart-outline" as const, label: "Yêu thích", badge: 0 },
  { icon: "card-outline" as const, label: "Ví ShopeePay", badge: 0 },
  { icon: "star-outline" as const, label: "Đánh giá", badge: 0 },
  { icon: "settings-outline" as const, label: "Cài đặt", badge: 0 },
  { icon: "help-circle-outline" as const, label: "Trung tâm hỗ trợ", badge: 0 },
];

// ─── Tab "Trang chủ" ─────────────────────────────────────────────
function HomeTab() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>🔥 Flash Sale</Text>
        <Text style={styles.bannerSubtext}>Giảm đến 50% — Chỉ hôm nay!</Text>
      </View>

      {/* Danh mục */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📂 Danh mục</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [
                styles.categoryItem,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: cat.color + "20" },
                ]}
              >
                <Text style={{ fontSize: 28 }}>{cat.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Giải thích */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🏠 Tab "Trang chủ"</Text>
        <Text style={styles.infoText}>
          Đây là tab đầu tiên người dùng thấy khi mở app.{"\n"}
          Thường chứa banner quảng cáo, danh mục, sản phẩm gợi ý.
        </Text>
      </View>
    </ScrollView>
  );
}

// ─── Tab "Tìm kiếm" ─────────────────────────────────────────────
function SearchTab() {
  const [query, setQuery] = useState("");
  const HOT_KEYWORDS = [
    "iPhone 16",
    "Laptop gaming",
    "Tai nghe không dây",
    "Sạc dự phòng",
    "Chuột Logitech",
    "Bàn phím cơ",
    "Màn hình 4K",
    "Apple Watch",
  ];
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Thanh tìm kiếm giả lập */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" />
        <Text style={styles.searchPlaceholder}>
          Tìm kiếm sản phẩm, thương hiệu...
        </Text>
      </View>

      {/* Từ khoá hot */}
      <Text style={styles.sectionTitle}>🔥 Tìm kiếm phổ biến</Text>
      <View style={styles.tagContainer}>
        {HOT_KEYWORDS.map((keyword, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.tag,
              pressed && { backgroundColor: "#ddd" },
            ]}
          >
            <Text style={styles.tagText}>{keyword}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🔍 Tab "Tìm kiếm"</Text>
        <Text style={styles.infoText}>
          Tab dành cho tìm kiếm sản phẩm.{"\n"}
          Thường chứa ô search, lịch sử tìm kiếm, từ khoá trending.
        </Text>
      </View>
    </ScrollView>
  );
}

// ─── Tab "Thông báo" ─────────────────────────────────────────────
function NotificationsTab() {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;
  const getIcon = (type: "order" | "promo" | "system") => {
    switch (type) {
      case "order":
        return "cube-outline";
      case "promo":
        return "pricetag-outline";
      case "system":
        return "shield-checkmark-outline";
    }
  };
  const getColor = (type: "order" | "promo" | "system") => {
    switch (type) {
      case "order":
        return "#3498db";
      case "promo":
        return "#e74c3c";
      case "system":
        return "#2ecc71";
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header thống kê */}
      <View style={styles.notifHeader}>
        <Text style={styles.notifHeaderTitle}>🔔 Thông báo</Text>
        <View style={styles.notifBadge}>
          <Text style={styles.notifBadgeText}>{unreadCount} chưa đọc</Text>
        </View>
      </View>

      {/* Danh sách thông báo */}
      {NOTIFICATIONS.map((notif) => (
        <Pressable
          key={notif.id}
          style={({ pressed }) => [
            styles.notifCard,
            !notif.read && { backgroundColor: "#ebf5fb", borderLeftColor: "#3498db", borderLeftWidth: 3 },
            pressed && { opacity: 0.7 },
          ]}
        >
          <View
            style={[
              styles.notifIcon,
              { backgroundColor: getColor(notif.type) + "20" },
            ]}
          >
            <Ionicons
              name={getIcon(notif.type)}
              size={22}
              color={getColor(notif.type)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.notifTitle,
                !notif.read && { fontWeight: "bold" },
              ]}
            >
              {notif.title}
            </Text>
            <Text style={styles.notifDesc} numberOfLines={2}>
              {notif.desc}
            </Text>
            <Text style={styles.notifTime}>{notif.time}</Text>
          </View>
          {!notif.read && <View style={styles.unreadDot} />}
        </Pressable>
      ))}

      <View style={[styles.infoBox, { marginTop: 16 }]}>
        <Text style={styles.infoTitle}>🔔 Tab "Thông báo"</Text>
        <Text style={styles.infoText}>
          Tab hiển thị các thông báo đơn hàng, khuyến mãi, hệ thống.{"\n"}
          Trong thực tế, sẽ có <Text style={styles.code}>tabBarBadge</Text> hiển thị số thông báo chưa đọc trên icon tab!
        </Text>
      </View>
    </ScrollView>
  );
}

// ─── Tab "Cá nhân" ───────────────────────────────────────────────
function ProfileTab() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {/* Header profile */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: "https://i.pravatar.cc/200?img=12" }}
          style={styles.profileAvatar}
        />
        <View style={{ marginLeft: 14 }}>
          <Text style={styles.profileName}>Nguyễn Văn Tu</Text>
          <Text style={styles.profileEmail}>tu.nguyen@email.com</Text>
          <View style={styles.profileBadgeRow}>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>👑 Thành viên Vàng</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Thống kê */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Đơn hàng</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Đánh giá</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1.200</Text>
          <Text style={styles.statLabel}>Xu tích lũy</Text>
        </View>
      </View>

      {/* Menu items */}
      <View style={styles.menuSection}>
        {PROFILE_MENU.map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: "#f0f0f0" },
            ]}
          >
            <Ionicons name={item.icon} size={22} color="#555" />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <View style={{ flex: 1 }} />
            {item.badge > 0 && (
              <View style={styles.menuBadge}>
                <Text style={styles.menuBadgeText}>{item.badge}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </Pressable>
        ))}
      </View>

      <View style={[styles.infoBox, { marginHorizontal: 16 }]}>
        <Text style={styles.infoTitle}>👤 Tab "Cá nhân"</Text>
        <Text style={styles.infoText}>
          Tab hiển thị thông tin người dùng, thống kê, menu cài đặt.{"\n"}
          Trong thực tế, avatar và tên được lấy từ API sau khi đăng nhập.
        </Text>
      </View>
    </ScrollView>
  );
}

// ====================================================================
// 🆕 PATTERN: Custom Tab Bar — Tự tạo thanh Tab riêng
// ====================================================================
// Thay vì dùng <Tabs> từ expo-router (cần cấu trúc thư mục riêng),
// ta tạo 1 Tab Bar custom bằng useState để demo trực tiếp trong 1 file.
// ────────────────────────────────────────────────────────────────────
// Trong thực tế, bạn sẽ dùng <Tabs> component từ expo-router (Phần 2).
// Cách custom này giúp bạn hiểu BẢN CHẤT Tab hoạt động như thế nào.
// ====================================================================

type TabName = "home" | "search" | "notifications" | "profile";

const TABS: { name: TabName; label: string; icon: string; activeIcon: string }[] = [
  { name: "home", label: "Trang chủ", icon: "home-outline", activeIcon: "home" },
  { name: "search", label: "Tìm kiếm", icon: "search-outline", activeIcon: "search" },
  { name: "notifications", label: "Thông báo", icon: "notifications-outline", activeIcon: "notifications" },
  { name: "profile", label: "Cá nhân", icon: "person-outline", activeIcon: "person" },
];

export default function Bai6TabNavigationScreen() {
  // 🆕 PATTERN: State quản lý tab đang active
  const [activeTab, setActiveTab] = useState<TabName>("home");

  // Đếm thông báo chưa đọc cho badge
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  // Render nội dung tab tương ứng
  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab />;
      case "search":
        return <SearchTab />;
      case "notifications":
        return <NotificationsTab />;
      case "profile":
        return <ProfileTab />;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "📘 Bài 6: Tab & Nested Navigation",
          headerStyle: { backgroundColor: "#d35400" },
          headerTintColor: "#fff",
        }}
      />
      <View style={{ flex: 1 }}>
        {/* Phần giải thích */}
        <View style={styles.topInfo}>
          <Text style={styles.topInfoText}>
            👇 Nhấn các tab bên dưới để chuyển giữa 4 màn hình. Đây là cách Tab
            Navigation hoạt động!
          </Text>
        </View>

        {/* Nội dung Tab */}
        <View style={{ flex: 1 }}>{renderTabContent()}</View>

        {/* ⭐ CUSTOM TAB BAR ⭐ */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <Pressable
                key={tab.name}
                style={styles.tabItem}
                onPress={() => setActiveTab(tab.name)}
              >
                <View style={{ position: "relative" }}>
                  <Ionicons
                    name={isActive ? (tab.activeIcon as any) : (tab.icon as any)}
                    size={24}
                    color={isActive ? "#d35400" : "#999"}
                  />
                  {/* Badge thông báo */}
                  {tab.name === "notifications" && unreadCount > 0 && (
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>{unreadCount}</Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    isActive && { color: "#d35400", fontWeight: "bold" },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );
}

// ====================================================================
// STYLES
// ====================================================================
const styles = StyleSheet.create({
  // ─── Top Info ───
  topInfo: {
    backgroundColor: "#fef3e7",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0d0a0",
  },
  topInfoText: { fontSize: 13, color: "#a0522d", textAlign: "center" },

  // ─── Tab Bar ───
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingBottom: 20,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  tabLabel: { fontSize: 11, color: "#999", marginTop: 2 },
  tabBadge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },

  // ─── Banner ───
  banner: {
    backgroundColor: "#d35400",
    padding: 24,
    alignItems: "center",
  },
  bannerText: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  bannerSubtext: { fontSize: 14, color: "#fde8d0", marginTop: 4 },

  // ─── Section ───
  section: { padding: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 12,
  },

  // ─── Category Grid ───
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryItem: {
    width: (Dimensions.get("window").width - 32 - 24) / 3,
    alignItems: "center",
    gap: 6,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: { fontSize: 12, color: "#555", textAlign: "center" },

  // ─── Search ───
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  searchPlaceholder: { fontSize: 14, color: "#999" },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  tagText: { fontSize: 13, color: "#555" },

  // ─── Notifications ───
  notifHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  notifHeaderTitle: { fontSize: 20, fontWeight: "bold", color: "#2c3e50" },
  notifBadge: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notifBadgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  notifCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: "flex-start",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notifTitle: { fontSize: 14, color: "#2c3e50", marginBottom: 2 },
  notifDesc: { fontSize: 12, color: "#888", lineHeight: 17 },
  notifTime: { fontSize: 11, color: "#bbb", marginTop: 4 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3498db",
    marginTop: 4,
  },

  // ─── Profile ───
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d35400",
    padding: 20,
    paddingTop: 12,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileName: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  profileEmail: { fontSize: 13, color: "#fde8d0", marginTop: 2 },
  profileBadgeRow: { flexDirection: "row", marginTop: 4 },
  profileBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  profileBadgeText: { fontSize: 11, color: "#fff" },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: -10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 20, fontWeight: "bold", color: "#d35400" },
  statLabel: { fontSize: 12, color: "#888", marginTop: 2 },
  statDivider: { width: 1, backgroundColor: "#eee" },
  menuSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  menuLabel: { fontSize: 14, color: "#333" },
  menuBadge: {
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    marginRight: 4,
  },
  menuBadgeText: { color: "#fff", fontSize: 11, fontWeight: "bold" },

  // ─── Info Box ───
  infoBox: {
    backgroundColor: "#fef3e7",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#d35400",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#a0522d",
    marginBottom: 6,
  },
  infoText: { fontSize: 13, color: "#8b5e3c", lineHeight: 20 },
  code: { fontFamily: "monospace", fontWeight: "bold", color: "#d35400" },
});
