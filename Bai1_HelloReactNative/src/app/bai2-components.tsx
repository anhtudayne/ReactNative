import { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ====================================================================
// 📘 BÀI 2: CORE COMPONENTS - Thực hành tất cả components cơ bản
// ====================================================================

// ---------------------
// 1. COMPONENT: SectionTitle - Tiêu đề cho mỗi phần
// ---------------------
function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

// ---------------------
// 2. DEMO: View Component
// ---------------------
function ViewDemo() {
  return (
    <View style={styles.demoContainer}>
      <SectionTitle title="1. View — Container cơ bản" />
      <Text style={styles.description}>
        View giống như {"<div>"} trên web. Nó là container không cuộn, dùng để
        nhóm và bố cục các component con.
      </Text>

      {/* View lồng nhau */}
      <View style={styles.row}>
        <View style={[styles.box, { backgroundColor: "#3498db" }]}>
          <Text style={styles.boxText}>Box 1</Text>
        </View>
        <View style={[styles.box, { backgroundColor: "#e74c3c" }]}>
          <Text style={styles.boxText}>Box 2</Text>
        </View>
        <View style={[styles.box, { backgroundColor: "#2ecc71" }]}>
          <Text style={styles.boxText}>Box 3</Text>
        </View>
      </View>

      {/* View với border và shadow */}
      <View style={styles.cardView}>
        <Text style={styles.cardText}>
          Đây là một View được style giống thẻ Card
        </Text>
        <Text style={styles.cardSubText}>
          Có border radius, shadow, và padding
        </Text>
      </View>
    </View>
  );
}

// ---------------------
// 3. DEMO: Text Component
// ---------------------
function TextDemo() {
  return (
    <View style={styles.demoContainer}>
      <SectionTitle title="2. Text — Hiển thị văn bản" />
      <Text style={styles.description}>
        Mọi chữ trong React Native PHẢI nằm trong {"<Text>"}. Không có thẻ{" "}
        {"<p>"}, {"<h1>"}, {"<span>"}.
      </Text>

      {/* Các kiểu text */}
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8 }}>
        Tiêu đề lớn (fontSize: 28)
      </Text>
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>
        Tiêu đề phụ (fontSize: 20)
      </Text>
      <Text style={{ fontSize: 16, color: "#555", marginBottom: 8 }}>
        Đoạn văn bản bình thường (fontSize: 16)
      </Text>

      {/* Text lồng nhau — Kế thừa style */}
      <Text style={{ fontSize: 16, color: "#333", marginBottom: 8 }}>
        Đây là text bình thường.{" "}
        <Text style={{ fontWeight: "bold", color: "#e74c3c" }}>
          Phần này in đậm màu đỏ.
        </Text>{" "}
        <Text style={{ fontStyle: "italic", color: "#3498db" }}>
          Phần này in nghiêng màu xanh.
        </Text>
      </Text>

      {/* numberOfLines — cắt bớt text dài */}
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={{ fontSize: 14, color: "#777", marginBottom: 8 }}
      >
        Đoạn văn bản rất dài sẽ bị cắt bớt sau 2 dòng. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris.
      </Text>

      {/* Selectable text */}
      <Text selectable style={{ fontSize: 14, color: "#2980b9" }}>
        ✋ Bạn có thể nhấn giữ để chọn và copy đoạn text này (selectable=true)
      </Text>
    </View>
  );
}

// ---------------------
// 4. DEMO: Image Component
// ---------------------
function ImageDemo() {
  return (
    <View style={styles.demoContainer}>
      <SectionTitle title="3. Image — Hiển thị hình ảnh" />
      <Text style={styles.description}>
        Ảnh từ URL phải chỉ định width & height. Dùng resizeMode để điều chỉnh
        cách hiển thị.
      </Text>

      <View style={styles.row}>
        {/* Ảnh từ URL — hình tròn (avatar) */}
        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=12" }}
            style={styles.avatar}
          />
          <Text style={styles.imageLabel}>Avatar (cover)</Text>
        </View>

        {/* Ảnh từ URL — hình vuông bo góc */}
        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: "https://picsum.photos/100/100" }}
            style={styles.squareImage}
          />
          <Text style={styles.imageLabel}>Square (cover)</Text>
        </View>

        {/* Ảnh từ URL — contain */}
        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: "https://picsum.photos/200/100" }}
            style={styles.containImage}
            resizeMode="contain"
          />
          <Text style={styles.imageLabel}>Contain</Text>
        </View>
      </View>

      {/* Ảnh rộng full width */}
      <Image
        source={{ uri: "https://picsum.photos/400/150" }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
      <Text style={styles.imageCaption}>Banner image (resizeMode: cover)</Text>
    </View>
  );
}

// ---------------------
// 5. DEMO: TextInput Component
// ---------------------
function TextInputDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  return (
    <View style={styles.demoContainer}>
      <SectionTitle title="4. TextInput — Trường nhập liệu" />
      <Text style={styles.description}>
        Tương tự {"<input>"} trên web. Dùng onChangeText (không phải onChange)
        để nhận giá trị.
      </Text>

      {/* Input cơ bản */}
      <TextInput
        style={styles.input}
        placeholder="Nhập tên của bạn..."
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      {/* Input email */}
      <TextInput
        style={styles.input}
        placeholder="Email của bạn..."
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Input multiline (textarea) */}
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Giới thiệu bản thân..."
        placeholderTextColor="#999"
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
        value={bio}
        onChangeText={setBio}
      />

      {/* Hiển thị kết quả */}
      {(name || email || bio) && (
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>📋 Kết quả nhập liệu:</Text>
          {name ? (
            <Text style={styles.previewText}>👤 Tên: {name}</Text>
          ) : null}
          {email ? (
            <Text style={styles.previewText}>📧 Email: {email}</Text>
          ) : null}
          {bio ? (
            <Text style={styles.previewText}>📝 Bio: {bio}</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

// ---------------------
// 6. DEMO: Button, Pressable, TouchableOpacity
// ---------------------
function ButtonDemo() {
  const [pressCount, setPressCount] = useState(0);

  return (
    <View style={styles.demoContainer}>
      <SectionTitle title="5. Pressable — Nút bấm tương tác" />
      <Text style={styles.description}>
        Pressable là component nút bấm linh hoạt nhất (khuyên dùng). Nó hỗ trợ
        callback onPress, onLongPress, và style động khi đang nhấn.
      </Text>

      {/* Pressable cơ bản */}
      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => setPressCount((prev) => prev + 1)}
      >
        {({ pressed }) => (
          <Text style={styles.buttonText}>
            {pressed ? "🔽 Đang nhấn..." : `👆 Nhấn tôi (${pressCount} lần)`}
          </Text>
        )}
      </Pressable>

      {/* Pressable với Alert */}
      <Pressable
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && { opacity: 0.7 },
        ]}
        onPress={() =>
          Alert.alert(
            "Thông báo",
            "Bạn vừa nhấn nút Alert!\n\nĐây là component Alert của React Native.",
            [
              { text: "Hủy", style: "cancel" },
              { text: "OK", onPress: () => console.log("OK pressed") },
            ]
          )
        }
      >
        <Text style={styles.secondaryButtonText}>🔔 Hiện Alert Dialog</Text>
      </Pressable>

      {/* Pressable Long Press */}
      <Pressable
        style={({ pressed }) => [
          styles.dangerButton,
          pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] },
        ]}
        onPress={() => Alert.alert("Nhấn thường", "Bạn nhấn bình thường!")}
        onLongPress={() =>
          Alert.alert(
            "🔥 Long Press!",
            "Bạn đã giữ lâu! Đây là onLongPress event."
          )
        }
        delayLongPress={800}
      >
        <Text style={styles.buttonText}>
          🖐️ Giữ lâu (delayLongPress: 800ms)
        </Text>
      </Pressable>

      {/* Hiển thị số lần bấm */}
      <Text style={styles.counterText}>
        Tổng số lần nhấn nút đầu tiên: {pressCount}
      </Text>
    </View>
  );
}

// ---------------------
// 7. DEMO: Switch & ActivityIndicator
// ---------------------
function MiscDemo() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <View style={styles.demoContainer}>
      <SectionTitle title="6. Switch & ActivityIndicator" />

      {/* Switch (Toggle) */}
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>
          🌙 Dark Mode: {isDarkMode ? "BẬT" : "TẮT"}
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: "#ddd", true: "#3498db" }}
          thumbColor={isDarkMode ? "#2980b9" : "#ccc"}
        />
      </View>

      {/* ActivityIndicator (Loading spinner) */}
      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleToggleLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "⏳ Đang tải..." : "🔄 Giả lập Loading (2s)"}
        </Text>
      </Pressable>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={{ marginTop: 8, color: "#666" }}>
            ActivityIndicator đang hiển thị...
          </Text>
        </View>
      )}
    </View>
  );
}

// ====================================================================
// MAIN SCREEN
// ====================================================================
export default function Bai2ComponentsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📘 Bài 2: Core Components</Text>
          <Text style={styles.headerSubtitle}>
            Tìm hiểu và thực hành các component cơ bản của React Native
          </Text>
        </View>

        {/* Các demo components */}
        <ViewDemo />
        <TextDemo />
        <ImageDemo />
        <TextInputDemo />
        <ButtonDemo />
        <MiscDemo />
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
    backgroundColor: "#2c3e50",
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
    color: "#bdc3c7",
    marginTop: 6,
  },

  // --- Section ---
  sectionHeader: {
    backgroundColor: "#3498db",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  // --- Demo Container ---
  demoContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    // Shadow cho iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow cho Android
    elevation: 3,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },

  // --- View Demo ---
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  box: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  boxText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  cardView: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  cardText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  cardSubText: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },

  // --- Image Demo ---
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
  },
  squareImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  containImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  imageLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 6,
  },
  bannerImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: "#eee",
  },
  imageCaption: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 6,
  },

  // --- TextInput Demo ---
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginBottom: 12,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  previewCard: {
    backgroundColor: "#e8f5e9",
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#27ae60",
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },

  // --- Button Demo ---
  primaryButton: {
    backgroundColor: "#3498db",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonPressed: {
    backgroundColor: "#2980b9",
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#3498db",
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "600",
  },
  dangerButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  counterText: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },

  // --- Switch & Loading ---
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
});
