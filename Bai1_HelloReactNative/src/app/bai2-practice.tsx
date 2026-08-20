import { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ====================================================================
// 📝 BÀI TẬP BÀI 2: Profile Card + Form nhập thông tin
// ====================================================================

// ---------------------
// BT1: Profile Card Component
// ---------------------
function ProfileCard({
  name,
  title,
  bio,
  avatarUrl,
}: {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
}) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <View style={styles.profileCard}>
      {/* Avatar */}
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />

      {/* Thông tin */}
      <Text style={styles.profileName}>{name}</Text>
      <Text style={styles.profileTitle}>{title}</Text>
      <Text style={styles.profileBio} numberOfLines={3}>
        {bio}
      </Text>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>128</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>1.2K</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>256</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Follow Button */}
      <Pressable
        style={({ pressed }) => [
          styles.followButton,
          isFollowing && styles.followingButton,
          pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
        ]}
        onPress={() => setIsFollowing(!isFollowing)}
      >
        <Text
          style={[
            styles.followButtonText,
            isFollowing && styles.followingButtonText,
          ]}
        >
          {isFollowing ? "✓ Đang theo dõi" : "＋ Theo dõi"}
        </Text>
      </Pressable>
    </View>
  );
}

// ---------------------
// BT2: Form nhập thông tin + hiển thị kết quả
// ---------------------
function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email) {
      Alert.alert("⚠️ Lỗi", "Vui lòng nhập đầy đủ Họ tên và Email!");
      return;
    }
    setSubmitted(true);
    Alert.alert("✅ Thành công", "Thông tin đã được gửi!");
  };

  const handleReset = () => {
    setFormData({ fullName: "", email: "", phone: "", message: "" });
    setSubmitted(false);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>📋 Form liên hệ</Text>

      <Text style={styles.label}>Họ và tên *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nguyễn Văn A"
        placeholderTextColor="#aaa"
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      />

      <Text style={styles.label}>Email *</Text>
      <TextInput
        style={styles.input}
        placeholder="email@example.com"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        style={styles.input}
        placeholder="0912 345 678"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        maxLength={10}
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
      />

      <Text style={styles.label}>Lời nhắn</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Nhập nội dung lời nhắn..."
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        value={formData.message}
        onChangeText={(text) => setFormData({ ...formData, message: text })}
      />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>📨 Gửi</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.resetButton,
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>🔄 Xóa</Text>
        </Pressable>
      </View>

      {/* Kết quả */}
      {submitted && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>📄 Thông tin đã gửi:</Text>
          <Text style={styles.resultText}>👤 {formData.fullName}</Text>
          <Text style={styles.resultText}>📧 {formData.email}</Text>
          {formData.phone ? (
            <Text style={styles.resultText}>📱 {formData.phone}</Text>
          ) : null}
          {formData.message ? (
            <Text style={styles.resultText}>💬 {formData.message}</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

// ====================================================================
// MAIN SCREEN
// ====================================================================
export default function Bai2PracticeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📝 Bài Tập Bài 2</Text>
          <Text style={styles.headerSubtitle}>
            Profile Card + Form nhập liệu
          </Text>
        </View>

        {/* BT1: Profile Card */}
        <ProfileCard
          name="Vũ Anh Tú"
          title="Sinh viên IT năm 4 🎓"
          bio="Đang học React Native để xây dựng ứng dụng mobile. Yêu thích JavaScript, TypeScript và React. Mục tiêu: tự làm project A đến Z!"
          avatarUrl="https://i.pravatar.cc/200?img=33"
        />

        {/* BT2: Contact Form */}
        <ContactForm />
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
    backgroundColor: "#8e44ad",
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
    color: "#d2b4de",
    marginTop: 6,
  },

  // --- Profile Card ---
  profileCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#8e44ad",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  profileTitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 4,
  },
  profileBio: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  statLabel: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 2,
  },
  followButton: {
    backgroundColor: "#8e44ad",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  followingButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#8e44ad",
  },
  followButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  followingButtonText: {
    color: "#8e44ad",
  },

  // --- Form ---
  formContainer: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#27ae60",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultCard: {
    backgroundColor: "#e8f8f5",
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#27ae60",
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e8449",
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
});
