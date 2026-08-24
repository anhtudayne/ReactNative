import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ====================================================================
// 📘 BÀI 3: STYLESHEET & FLEXBOX — Xây dựng giao diện
// ====================================================================

// ---------------------
// SECTION TITLE COMPONENT (Tái sử dụng — Custom Component pattern!)
// ---------------------
function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );
}

// ---------------------
// 1. DEMO: flexDirection (column vs row)
// ---------------------
function FlexDirectionDemo() {
  const [direction, setDirection] = useState<"column" | "row">("column");

  return (
    <View style={styles.demoCard}>
      <SectionTitle
        title="1. flexDirection"
        subtitle="Mặc định: column (khác web mặc định row)"
      />

      {/* Toggle buttons */}
      <View style={styles.toggleRow}>
        <Pressable
          style={[
            styles.toggleBtn,
            direction === "column" && styles.toggleBtnActive,
          ]}
          onPress={() => setDirection("column")}
        >
          <Text
            style={[
              styles.toggleText,
              direction === "column" && styles.toggleTextActive,
            ]}
          >
            column ↓
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.toggleBtn,
            direction === "row" && styles.toggleBtnActive,
          ]}
          onPress={() => setDirection("row")}
        >
          <Text
            style={[
              styles.toggleText,
              direction === "row" && styles.toggleTextActive,
            ]}
          >
            row →
          </Text>
        </Pressable>
      </View>

      {/* Demo area */}
      <View style={[styles.demoArea, { flexDirection: direction }]}>
        <View style={[styles.flexBox, { backgroundColor: "#e74c3c" }]}>
          <Text style={styles.boxLabel}>1</Text>
        </View>
        <View style={[styles.flexBox, { backgroundColor: "#3498db" }]}>
          <Text style={styles.boxLabel}>2</Text>
        </View>
        <View style={[styles.flexBox, { backgroundColor: "#2ecc71" }]}>
          <Text style={styles.boxLabel}>3</Text>
        </View>
      </View>

      <Text style={styles.codeHint}>
        {`flexDirection: "${direction}"`}
      </Text>
    </View>
  );
}

// ---------------------
// 2. DEMO: justifyContent (căn trục chính)
// ---------------------
const JUSTIFY_OPTIONS = [
  "flex-start",
  "center",
  "flex-end",
  "space-between",
  "space-around",
  "space-evenly",
] as const;

function JustifyContentDemo() {
  const [justify, setJustify] = useState<string>("flex-start");

  return (
    <View style={styles.demoCard}>
      <SectionTitle
        title="2. justifyContent"
        subtitle="Căn chỉnh items theo TRỤC CHÍNH (main axis)"
      />

      {/* Options */}
      <View style={styles.optionGrid}>
        {JUSTIFY_OPTIONS.map((opt) => (
          <Pressable
            key={opt}
            style={[
              styles.optionBtn,
              justify === opt && styles.optionBtnActive,
            ]}
            onPress={() => setJustify(opt)}
          >
            <Text
              style={[
                styles.optionText,
                justify === opt && styles.optionTextActive,
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Demo area — column direction */}
      <View
        style={[
          styles.demoArea,
          { height: 200, justifyContent: justify as any },
        ]}
      >
        <View style={[styles.smallBox, { backgroundColor: "#e74c3c" }]}>
          <Text style={styles.boxLabel}>A</Text>
        </View>
        <View style={[styles.smallBox, { backgroundColor: "#3498db" }]}>
          <Text style={styles.boxLabel}>B</Text>
        </View>
        <View style={[styles.smallBox, { backgroundColor: "#2ecc71" }]}>
          <Text style={styles.boxLabel}>C</Text>
        </View>
      </View>

      <Text style={styles.codeHint}>
        {`justifyContent: "${justify}"`}
      </Text>
    </View>
  );
}

// ---------------------
// 3. DEMO: alignItems (căn trục phụ)
// ---------------------
const ALIGN_OPTIONS = [
  "stretch",
  "flex-start",
  "center",
  "flex-end",
] as const;

function AlignItemsDemo() {
  const [align, setAlign] = useState<string>("stretch");

  return (
    <View style={styles.demoCard}>
      <SectionTitle
        title="3. alignItems"
        subtitle="Căn chỉnh items theo TRỤC PHỤ (cross axis)"
      />

      <View style={styles.toggleRow}>
        {ALIGN_OPTIONS.map((opt) => (
          <Pressable
            key={opt}
            style={[
              styles.optionBtn,
              align === opt && styles.optionBtnActive,
            ]}
            onPress={() => setAlign(opt)}
          >
            <Text
              style={[
                styles.optionText,
                align === opt && styles.optionTextActive,
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Demo: Row direction + alignItems */}
      <View
        style={[
          styles.demoArea,
          {
            flexDirection: "row",
            height: 120,
            alignItems: align as any,
          },
        ]}
      >
        <View
          style={[
            styles.flexBox,
            { backgroundColor: "#9b59b6", height: align === "stretch" ? undefined : 40 },
          ]}
        >
          <Text style={styles.boxLabel}>1</Text>
        </View>
        <View
          style={[
            styles.flexBox,
            { backgroundColor: "#e67e22", height: align === "stretch" ? undefined : 60 },
          ]}
        >
          <Text style={styles.boxLabel}>2</Text>
        </View>
        <View
          style={[
            styles.flexBox,
            { backgroundColor: "#1abc9c", height: align === "stretch" ? undefined : 30 },
          ]}
        >
          <Text style={styles.boxLabel}>3</Text>
        </View>
      </View>

      <Text style={styles.codeHint}>
        {`flexDirection: "row", alignItems: "${align}"`}
      </Text>
    </View>
  );
}

// ---------------------
// 4. DEMO: flex ratio (phân chia không gian)
// ---------------------
function FlexRatioDemo() {
  const [ratios, setRatios] = useState([1, 2, 1]);

  const presets = [
    { label: "1:2:1", values: [1, 2, 1] },
    { label: "1:1:1", values: [1, 1, 1] },
    { label: "1:3:1", values: [1, 3, 1] },
    { label: "2:1:2", values: [2, 1, 2] },
  ];

  return (
    <View style={styles.demoCard}>
      <SectionTitle
        title="4. flex (tỷ lệ phân chia)"
        subtitle="Dùng flex để chia không gian theo tỷ lệ"
      />

      <View style={styles.toggleRow}>
        {presets.map((p) => (
          <Pressable
            key={p.label}
            style={[
              styles.optionBtn,
              ratios.join(":") === p.values.join(":") && styles.optionBtnActive,
            ]}
            onPress={() => setRatios(p.values)}
          >
            <Text
              style={[
                styles.optionText,
                ratios.join(":") === p.values.join(":") && styles.optionTextActive,
              ]}
            >
              {p.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.demoArea, { flexDirection: "row", height: 60 }]}>
        <View
          style={{
            flex: ratios[0],
            backgroundColor: "#e74c3c",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            marginRight: 4,
          }}
        >
          <Text style={styles.boxLabel}>flex:{ratios[0]}</Text>
        </View>
        <View
          style={{
            flex: ratios[1],
            backgroundColor: "#3498db",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            marginHorizontal: 4,
          }}
        >
          <Text style={styles.boxLabel}>flex:{ratios[1]}</Text>
        </View>
        <View
          style={{
            flex: ratios[2],
            backgroundColor: "#2ecc71",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            marginLeft: 4,
          }}
        >
          <Text style={styles.boxLabel}>flex:{ratios[2]}</Text>
        </View>
      </View>
    </View>
  );
}

// ---------------------
// 5. DEMO: gap + flexWrap (Grid layout)
// ---------------------
function FlexWrapDemo() {
  const colors = [
    "#e74c3c", "#3498db", "#2ecc71", "#9b59b6",
    "#e67e22", "#1abc9c", "#f39c12", "#34495e",
  ];

  return (
    <View style={styles.demoCard}>
      <SectionTitle
        title="5. flexWrap + gap (Grid layout)"
        subtitle="Dùng flexWrap: wrap để items tự xuống dòng"
      />

      <View style={styles.gridContainer}>
        {colors.map((color, i) => (
          <View key={i} style={[styles.gridItem, { backgroundColor: color }]}>
            <Text style={styles.boxLabel}>{i + 1}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.codeHint}>
        {`flexDirection: "row", flexWrap: "wrap", gap: 10`}
      </Text>
    </View>
  );
}

// ---------------------
// 6. PATTERN: Header - Content - Footer (Rất phổ biến!)
// ---------------------
function LayoutPatternDemo() {
  return (
    <View style={styles.demoCard}>
      <SectionTitle
        title="6. Pattern: Header-Content-Footer"
        subtitle="Layout phổ biến nhất trong mọi app mobile"
      />

      <View style={[styles.demoArea, { height: 250, padding: 0, gap: 0 }]}>
        {/* Header — chiều cao cố định */}
        <View style={styles.layoutHeader}>
          <Text style={styles.boxLabel}>Header (height: 50)</Text>
        </View>

        {/* Content — flex: 1 chiếm tất cả không gian còn lại */}
        <View style={styles.layoutContent}>
          <Text style={styles.layoutText}>Content (flex: 1)</Text>
          <Text style={styles.layoutSubtext}>
            flex: 1 nghĩa là chiếm TẤT CẢ{"\n"}không gian còn lại sau khi{"\n"}Header và Footer
            đã chiếm chỗ
          </Text>
        </View>

        {/* Footer — chiều cao cố định */}
        <View style={styles.layoutFooter}>
          <Text style={styles.boxLabel}>Footer (height: 50)</Text>
        </View>
      </View>
    </View>
  );
}

// ---------------------
// 7. DEMO: useWindowDimensions — Responsive
// ---------------------
function ResponsiveDemo() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const columns = width >= 768 ? 3 : 2;

  return (
    <View style={styles.demoCard}>
      <SectionTitle
        title="7. Responsive (useWindowDimensions)"
        subtitle="Tự động thay đổi layout theo kích thước màn hình"
      />

      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Width</Text>
          <Text style={styles.infoValue}>{Math.round(width)}dp</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Height</Text>
          <Text style={styles.infoValue}>{Math.round(height)}dp</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Hướng</Text>
          <Text style={styles.infoValue}>
            {isLandscape ? "Ngang" : "Dọc"}
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Cột</Text>
          <Text style={styles.infoValue}>{columns}</Text>
        </View>
      </View>

      {/* Responsive grid */}
      <View style={styles.responsiveGrid}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <View
            key={n}
            style={[
              styles.responsiveItem,
              {
                width: (width - 32 - 16 - (columns - 1) * 10) / columns,
              },
            ]}
          >
            <Text style={styles.boxLabel}>{n}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.codeHint}>
        {`useWindowDimensions() → { width: ${Math.round(width)}, height: ${Math.round(height)} }`}
      </Text>
    </View>
  );
}

// ---------------------
// 8. PATTERN: Centering Pattern (Căn giữa mọi thứ)
// ---------------------
function CenteringDemo() {
  return (
    <View style={styles.demoCard}>
      <SectionTitle
        title="8. Centering Pattern"
        subtitle="3 cách căn giữa thường dùng nhất"
      />

      <View style={{ flexDirection: "row", gap: 8 }}>
        {/* Cách 1: justify + align */}
        <View style={styles.centerBox}>
          <Text style={styles.centerLabel}>justify{"\n"}+{"\n"}align</Text>
        </View>

        {/* Cách 2: alignSelf */}
        <View
          style={[
            styles.centerBox,
            {
              backgroundColor: "#e67e22",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: 10,
            },
          ]}
        >
          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              alignSelf: "center",
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>alignSelf</Text>
          </View>
        </View>

        {/* Cách 3: margin auto */}
        <View
          style={[
            styles.centerBox,
            {
              backgroundColor: "#1abc9c",
              alignItems: "stretch",
              justifyContent: "flex-start",
            },
          ]}
        >
          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              margin: "auto",
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>
              margin{"\n"}auto
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ====================================================================
// MAIN SCREEN
// ====================================================================
export default function Bai3StyleScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📘 Bài 3: StyleSheet & Flexbox</Text>
          <Text style={styles.headerSubtitle}>
            Tương tác trực tiếp để hiểu Flexbox — nhấn các nút để thay đổi layout
          </Text>
        </View>

        {/* Các demo */}
        <FlexDirectionDemo />
        <JustifyContentDemo />
        <AlignItemsDemo />
        <FlexRatioDemo />
        <FlexWrapDemo />
        <LayoutPatternDemo />
        <ResponsiveDemo />
        <CenteringDemo />
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#a3d9cc",
    marginTop: 6,
    lineHeight: 18,
  },

  // --- Section Title ---
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#7f8c8d",
    marginTop: 2,
  },

  // --- Demo Card ---
  demoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  // --- Toggle/Option Buttons ---
  toggleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#ecf0f1",
  },
  toggleBtnActive: {
    backgroundColor: "#2c3e50",
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },
  toggleTextActive: {
    color: "#fff",
  },
  optionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
  },
  optionBtnActive: {
    backgroundColor: "#16a085",
  },
  optionText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },
  optionTextActive: {
    color: "#fff",
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },

  // --- Demo Area ---
  demoArea: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
    padding: 10,
    gap: 8,
  },
  flexBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  smallBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  boxLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  codeHint: {
    fontSize: 12,
    color: "#16a085",
    fontFamily: "monospace",
    marginTop: 8,
    backgroundColor: "#e8f8f5",
    padding: 8,
    borderRadius: 6,
    textAlign: "center",
  },

  // --- Grid ---
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  gridItem: {
    width: 70,
    height: 70,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  // --- Layout Pattern ---
  layoutHeader: {
    height: 50,
    backgroundColor: "#2c3e50",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  layoutContent: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  layoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  layoutSubtext: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 8,
  },
  layoutFooter: {
    height: 50,
    backgroundColor: "#16a085",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },

  // --- Responsive ---
  infoRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 11,
    color: "#999",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 2,
  },
  responsiveGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  responsiveItem: {
    height: 60,
    backgroundColor: "#16a085",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  // --- Centering ---
  centerBox: {
    flex: 1,
    height: 80,
    backgroundColor: "#9b59b6",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  centerLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 11,
    textAlign: "center",
  },
});
