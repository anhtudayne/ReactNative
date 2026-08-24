import * as Device from "expo-device";
import { router } from "expo-router";
import { Platform, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimatedIcon } from "@/components/animated-icon";
import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Welcome to&nbsp; React Native
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          get started
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow
            title="Try editing"
            hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
          />
          <HintRow title="Dev tools" hint={getDevMenuHint()} />
          <HintRow
            title="Fresh start"
            hint={<ThemedText type="code">npm run reset-project</ThemedText>}
          />
        </ThemedView>

        {/* 📘 Điều hướng bài học */}
        <ThemedView type="backgroundElement" style={styles.lessonContainer}>
          <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
            📘 Các bài học:
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.lessonButton,
              pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] },
            ]}
            onPress={() => router.push("/bai2-components" as any)}
          >
            <ThemedText style={styles.lessonButtonText}>
              📖 Bài 2: Core Components (Lý thuyết)
            </ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.lessonButton,
              { backgroundColor: "#8e44ad" },
              pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] },
            ]}
            onPress={() => router.push("/bai2-practice" as any)}
          >
            <ThemedText style={styles.lessonButtonText}>
              📝 Bài 2: Bài tập thực hành
            </ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.lessonButton,
              { backgroundColor: "#16a085" },
              pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] },
            ]}
            onPress={() => router.push("/bai3-flexbox" as any)}
          >
            <ThemedText style={styles.lessonButtonText}>
              📖 Bài 3: Flexbox Playground
            </ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.lessonButton,
              { backgroundColor: "#138d75" },
              pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] },
            ]}
            onPress={() => router.push("/bai3-practice" as any)}
          >
            <ThemedText style={styles.lessonButtonText}>
              📝 Bài 3: Bài tập Layout
            </ThemedText>
          </Pressable>
        </ThemedView>

        {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  lessonContainer: {
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
    gap: Spacing.two,
  },
  lessonButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  lessonButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
