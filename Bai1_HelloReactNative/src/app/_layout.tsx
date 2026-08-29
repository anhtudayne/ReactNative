import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack>
        {/* Tab screens — Ẩn header vì tabs tự có header */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Màn hình bài 2 — Hiện header với nút Back */}
        <Stack.Screen
          name="bai2-components"
          options={{ title: '📖 Bài 2: Core Components' }}
        />
        <Stack.Screen
          name="bai2-practice"
          options={{ title: '📝 Bài 2: Bài tập' }}
        />

        {/* Màn hình bài 3 */}
        <Stack.Screen
          name="bai3-flexbox"
          options={{ title: '📖 Bài 3: Flexbox Playground' }}
        />
        <Stack.Screen
          name="bai3-practice"
          options={{ title: '📝 Bài 3: Bài tập' }}
        />

        {/* Màn hình bài 4 */}
        <Stack.Screen
          name="bai4-lists"
          options={{ title: '📘 Bài 4: Lists' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
