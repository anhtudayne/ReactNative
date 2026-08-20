# 📘 BÀI 1: Giới Thiệu React Native — Cài Đặt & Khởi Chạy Dự Án Đầu Tiên

> **Thời lượng:** ~3-4 giờ | **Độ khó:** ⭐ Cơ bản | **Dự án thực hành:** `Bai1_HelloReactNative`

---

## 🎯 Mục tiêu bài học

Sau bài này, bạn sẽ:
- [ ] Hiểu React Native là gì, hoạt động ra sao, khác gì với React web
- [ ] Hiểu kiến trúc mới (New Architecture) của React Native
- [ ] Biết Expo là gì và tại sao dùng Expo
- [ ] Hiểu rõ cấu trúc từng file/thư mục trong dự án thực tế
- [ ] Hiểu luồng khởi động app từ khi chạy lệnh đến khi hiển thị UI
- [ ] Chạy app thành công trên Android Emulator
- [ ] Biết cách sửa code và xem kết quả qua Hot Reload

---

## Phần 1: React Native Là Gì?

### 1.1 Định nghĩa

**React Native** là một framework mã nguồn mở do **Meta (Facebook)** phát triển (2015), cho phép xây dựng ứng dụng mobile **native** cho cả **iOS** và **Android** bằng **JavaScript/TypeScript** và **React**.

> [!IMPORTANT]
> **"Native" nghĩa là gì?**  
> Khác với WebView apps (Cordova, Ionic) chạy web bên trong wrapper, React Native **tạo ra các UI component native thật sự** — `UIView` trên iOS, `android.view.View` trên Android. Người dùng sẽ cảm nhận app giống hệt app native.

### 1.2 So sánh React Web vs React Native

Bạn đã biết React web, nên hãy xem **cái gì giống và khác**:

| Tiêu chí | React (Web) | React Native (Mobile) |
|:---|:---|:---|
| **Chạy trên** | Browser (Chrome, Firefox, ...) | iOS & Android native |
| **Render engine** | ReactDOM → DOM elements | React Native → Native Views |
| **Ngôn ngữ** | JavaScript/TypeScript | JavaScript/TypeScript ✅ *Giống nhau* |
| **Component syntax** | JSX ✅ *Giống nhau* | JSX ✅ *Giống nhau* |
| **Hooks** | `useState`, `useEffect`, ... | `useState`, `useEffect`, ... ✅ *Giống nhau* |
| **HTML elements** | `<div>`, `<p>`, `<img>`, `<input>` | ❌ **Không có HTML!** → `<View>`, `<Text>`, `<Image>`, `<TextInput>` |
| **CSS styling** | CSS file, className | ❌ **Không có CSS file!** → `StyleSheet.create()`, inline JS objects |
| **Layout** | Flexbox + Grid + Block + Inline | Chỉ có **Flexbox** (mặc định `column`) |
| **Routing** | React Router, Next.js | React Navigation, Expo Router |
| **Bundler** | Webpack, Vite | **Metro Bundler** |

> [!TIP]
> **Tin tốt:** ~80% kiến thức React web của bạn **dùng được ngay** trong React Native (component, props, state, hooks, context, ...). Chỉ cần học thêm các native components và cách styling mới.

### 1.3 So sánh với các công nghệ mobile khác

| Tiêu chí | Native (Swift/Kotlin) | React Native | Flutter |
|:---|:---:|:---:|:---:|
| Ngôn ngữ | Swift / Kotlin | **JavaScript / TypeScript** | Dart |
| Code sharing iOS + Android | ❌ 0% | ✅ ~90% | ✅ ~95% |
| Hiệu năng | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| UI | 100% Native | ✅ Native components | Custom widgets (Skia) |
| Hệ sinh thái / Community | Lớn | **Rất lớn** (npm) | Đang phát triển |
| Hot Reload | ❌ Không | ✅ Có | ✅ Có |
| Dễ học (đã biết JS/React) | ❌ Học ngôn ngữ mới | ✅ **Dễ nhất** | ⚠️ Phải học Dart |
| Ai dùng? | Apple, Google | Meta, Shopify, Discord, Microsoft | Google, BMW, Alibaba |

---

## Phần 2: Kiến Trúc React Native

### 2.1 Kiến trúc tổng quan

Để hiểu React Native hoạt động ra sao, hãy xem nó gồm những thành phần nào:

```mermaid
graph TB
    subgraph "💻 MÁY TÍNH CỦA BẠN (Host Machine)"
        A["📝 Code của bạn<br/>(Hàng trăm file .tsx, .ts, assets)"]
        B["📦 Metro Bundler<br/>(Transpile TS/JSX → 1 file bundle.js)"]
        A --> B
    end

    B ==>|"Gửi bundle.js qua Port 8081 / ADB"| C

    subgraph "📱 THIẾT BỊ / EMULATOR (Mobile Runtime)"
        subgraph "JavaScript Thread"
            C["⚡ Hermes JS Engine<br/>(Chạy file bundle.js duy nhất,<br/>tạo Virtual DOM Tree)"]
        end
        
        subgraph "C++ Layer (New Architecture)"
            D["🔗 JSI (JavaScript Interface)<br/>(Cầu nối C++ gọi hàm trực tiếp)"]
            E["📐 Yoga Engine (C++)<br/>(Tính toán Layout Flexbox x, y, w, h)"]
            F["🎨 Fabric Renderer (C++)<br/>(Quản lý Shadow Tree & gọi OS API)"]
        end
        
        subgraph "Native Thread (Android / iOS OS)"
            G["🤖 Android Views<br/>(ViewGroup, TextView, Button...)"]
            H["🍎 iOS UIKit Views<br/>(UIView, UILabel, UIButton...)"]
            I["⚙️ TurboModules<br/>(Camera, GPS, SQLite...)"]
        end

        subgraph "🖥️ Màn hình hiển thị"
            J["📱 Pixel trên màn hình điện thoại"]
        end

        C <-->|"Đồng bộ trực tiếp"| D
        D --> F
        F <--> E
        D <--> I
        F --> G
        F --> H
        G --> J
        H --> J
    end
    
    style A fill:#61dafb,color:#000
    style B fill:#e67e22,color:#fff
    style C fill:#f7df1e,color:#000
    style D fill:#ff6b6b,color:#fff
    style E fill:#9b59b6,color:#fff
    style F fill:#4ecdc4,color:#000
    style G fill:#3DDC84,color:#000
    style H fill:#007AFF,color:#fff
    style I fill:#34495e,color:#fff
    style J fill:#2ecc71,color:#fff
```

### 2.2 Giải thích từng thành phần

| Thành phần | Vai trò | Ví dụ dễ hiểu |
|:---|:---|:---|
| **Hermes** | JS engine chạy code của bạn, tối ưu cho mobile (khởi động nhanh, ít RAM) | Giống V8 trong Chrome, nhưng nhẹ hơn |
| **JSI** (JavaScript Interface) | Cầu nối giữa JS và Native, cho phép gọi **đồng bộ** (synchronous) | Giống "thông dịch viên" giữa 2 ngôn ngữ |
| **Fabric** | Renderer mới, tạo native views từ React components | Giống ReactDOM trên web, nhưng tạo native views |
| **TurboModules** | Truy cập tính năng native (camera, GPS, ...) theo kiểu lazy-load | Chỉ load module khi cần, không load hết từ đầu |

> [!NOTE]
> **New Architecture (từ RN 0.73+):** Trước đây RN dùng "Bridge" — giao tiếp **bất đồng bộ** (asynchronous) qua JSON, gây chậm. Kiến trúc mới dùng **JSI** — giao tiếp **đồng bộ** (synchronous) trực tiếp, nhanh hơn đáng kể. Dự án của bạn dùng RN **0.86.2** — đã sử dụng New Architecture!

### 2.3 So sánh cách render: Web vs React Native

```mermaid
graph LR
    subgraph "🌐 React Web"
        W1["React Component"] --> W2["ReactDOM"] --> W3["DOM Element<br/>div, p, img"]  --> W4["🖥️ Browser"]
    end
    
    subgraph "📱 React Native"
        R1["React Component"] --> R2["Fabric Renderer"] --> R3["Native View<br/>UIView, android.View"] --> R4["📱 Device"]
    end
```

**Điểm mấu chốt:** Code React của bạn **giống nhau**, chỉ khác ở bước cuối — web render ra HTML DOM, React Native render ra **Native Views thật**.

---

## Phần 3: Expo Là Gì?

### 3.1 Expo — Bộ công cụ cho React Native

**Expo** là một nền tảng (platform) và bộ công cụ giúp phát triển React Native **dễ dàng hơn rất nhiều**. Nó cung cấp:

```mermaid
graph TD
    Expo["🚀 Expo Platform"] --> A["📦 Expo SDK<br/>Camera, Location, Notifications, ..."]
    Expo --> B["🔧 Expo CLI<br/>Tạo project, chạy dev server"]
    Expo --> C["☁️ EAS (Expo Application Services)<br/>Build, Submit, Update"]
    Expo --> D["📱 Expo Go<br/>App chạy thử trên điện thoại"]
    Expo --> E["🗺️ Expo Router<br/>File-based routing"]
```

### 3.2 Tại sao dùng Expo?

| Không có Expo | Có Expo |
|:---|:---|
| Cài Xcode + Android Studio + cấu hình phức tạp | `npx create-expo-app` → chạy ngay |
| Build trên máy (chậm, tốn tài nguyên) | Build trên cloud (EAS Build) |
| Tự viết native code cho camera, GPS, ... | Expo SDK có sẵn, chỉ cần `import` |
| Deep linking cấu hình thủ công | Expo Router tự động |
| Tự setup OTA updates | EAS Update có sẵn |

> [!TIP]
> **Ví dụ thực tế:** Để sử dụng Camera trên React Native thuần, bạn cần viết native code (Swift/Kotlin), link thư viện, cấu hình Gradle/Xcode. Với Expo, chỉ cần:
> ```tsx
> import { Camera } from 'expo-camera';
> // Dùng luôn!
> ```

### 3.3 Bản chất App "Expo Go" trên máy ảo & Phân biệt Dev vs Production

#### ❓ Có phải dự án React Native luôn luôn phải chạy thông qua app Expo Go?
👉 **KHÔNG PHẢI!** Dự án của bạn khi xuất bản cho người dùng sẽ là một **App độc lập hoàn toàn (.apk / .aab)** có Icon riêng và Tên riêng. Expo Go chỉ là "chiếc vỏ tiện lợi" trong lúc lập trình (Development).

#### 🔍 Bên trong app Expo Go trên Emulator thực chất chứa những gì?
File cài đặt của **Expo Go** trên Android đã được biên dịch sẵn toàn bộ các thành phần Native:
1. **`libhermes.so`**: Bộ máy Hermes JS Engine.
2. **`libjsi.so` & `libfabric.so`**: Cầu nối JSI & Fabric Renderer (C++).
3. **`libyoga.so`**: Thư viện tính toán Flexbox layout.
4. **Android Native Modules**: Code Kotlin/Java điều khiển Camera, GPS, Lưu trữ, View...

```mermaid
graph TD
    subgraph "1. Lúc lập trình (Development Mode - Dùng Expo Go)"
        A1["Code của bạn<br/>(File bundle.js)"] -->|"Nạp nhanh qua Port 8081"| B1["App Expo Go trên máy ảo<br/>(Đã chứa sẵn: Hermes + JSI + Fabric + Native SDK)"]
        B1 -->|"Hiển thị ngay trong 1s"| C1["📱 Màn hình máy ảo"]
    end

    subgraph "2. Lúc xuất xưởng (Production Mode - Standalone APK)"
        A2["Code của bạn<br/>(File bundle.js)"] + B2["Hermes + JSI + Fabric + Native SDK"] -->|"Build đóng gói (EAS Build / Gradle)"| C2["📦 File AppCuaBan.apk độc lập<br/>(Icon riêng, Tên riêng)"]
        C2 -->|"Cài đặt trực tiếp từ CH Play"| D2["📱 Máy người dùng (Không cần Expo Go)"]
    end

    style B1 fill:#f39c12,color:#fff
    style C2 fill:#27ae60,color:#fff
```

#### ⚖️ Bảng so sánh Development (Expo Go) vs Production (Standalone App):

| Tiêu chí | Chế độ Phát triển (Expo Go) | Chế độ Xuất bản (Standalone App) |
|:---|:---|:---|
| **Mục đích** | Viết code, học tập, kiểm tra nhanh | Đưa lên Google Play / App Store |
| **Cách mở app** | Mở qua app Expo Go $\rightarrow$ load code qua ADB/Wifi | Bấm trực tiếp vào Icon app trên màn hình chính |
| **Tốc độ thấy kết quả** | ⚡ Tức thì (< 1 giây nhờ Hot Reload) | Phải build lại APK nếu sửa code Native |
| **Phụ thuộc Expo Go** | ✅ Cần Expo Go để chạy thử | ❌ **100% độc lập, không cần Expo Go** |
| **Hermes & Fabric nằm ở đâu?** | Được đóng gói sẵn trong **App Expo Go** | Được đóng gói thẳng vào **File `.apk` của bạn** |

---

## Phần 4: Phân Tích Cấu Trúc Dự Án Thực Tế

Dưới đây là cấu trúc dự án [Bai1_HelloReactNative](file:///Users/vovantu/HTML_CSS/ReactNative/Bai1_HelloReactNative) mà chúng ta vừa tạo:

### 4.1 Sơ đồ cấu trúc thư mục

```
Bai1_HelloReactNative/
│
├── 📁 src/                          ← 🔥 THƯ MỤC CHÍNH - Code của bạn nằm ở đây
│   ├── 📁 app/                      ← Các màn hình (screens/routes)
│   │   ├── _layout.tsx              ← Root layout (bọc toàn bộ app)
│   │   ├── index.tsx                ← Tab "Home" (trang chủ)
│   │   └── explore.tsx              ← Tab "Explore"
│   │
│   ├── 📁 components/               ← Components tái sử dụng
│   │   ├── animated-icon.tsx        ← Icon Expo có animation
│   │   ├── app-tabs.tsx             ← Cấu hình bottom tabs
│   │   ├── themed-text.tsx          ← Component Text theo theme
│   │   ├── themed-view.tsx          ← Component View theo theme
│   │   └── hint-row.tsx             ← Component hiển thị gợi ý
│   │
│   ├── 📁 constants/                ← Hằng số
│   │   └── theme.ts                 ← Colors, Fonts, Spacing
│   │
│   ├── 📁 hooks/                    ← Custom hooks
│   │   ├── use-theme.ts             ← Hook lấy màu theo theme
│   │   └── use-color-scheme.ts      ← Hook detect light/dark mode
│   │
│   └── global.css                   ← CSS cho web (chỉ dùng trên web)
│
├── 📁 assets/                       ← Tài nguyên tĩnh (ảnh, fonts, icons)
│   └── 📁 images/
│
├── 📁 scripts/                      ← Scripts tiện ích
│   └── reset-project.js             ← Script reset project về trắng
│
├── ⚙️ app.json                      ← CẤU HÌNH CHÍNH của app
├── 📦 package.json                  ← Dependencies & scripts
├── ⚙️ tsconfig.json                 ← Cấu hình TypeScript
└── 📁 node_modules/                 ← Thư viện (KHÔNG sửa)
```

### 4.2 Giải thích chi tiết từng file quan trọng

---

#### 📄 `package.json` — Trái tim của dự án

File: [package.json](file:///Users/vovantu/HTML_CSS/ReactNative/Bai1_HelloReactNative/package.json)

```json
{
  "name": "bai1_helloreactnative",
  "main": "expo-router/entry",     // ← Entry point: Expo Router xử lý khởi tạo
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",          // ← Khởi chạy Metro dev server
    "android": "expo start --android", // ← Chạy trên Android
    "ios": "expo start --ios",       // ← Chạy trên iOS
    "web": "expo start --web"        // ← Chạy trên web browser
  }
}
```

| Field | Ý nghĩa |
|:---|:---|
| `"main": "expo-router/entry"` | Điểm khởi đầu của app — Expo Router sẽ tự tìm thư mục `app/` bên trong `src/` |
| `"expo": "~57.0.14"` | Expo SDK version 57 (mới nhất) |
| `"react-native": "0.86.2"` | React Native version (New Architecture) |
| `"react": "19.2.3"` | React 19 — phiên bản mới nhất |

---

#### 📄 `app.json` — Cấu hình ứng dụng

File: [app.json](file:///Users/vovantu/HTML_CSS/ReactNative/Bai1_HelloReactNative/app.json)

```json
{
  "expo": {
    "name": "Bai1_HelloReactNative",  // ← Tên hiển thị trên màn hình điện thoại
    "slug": "Bai1_HelloReactNative",  // ← URL-friendly name (dùng cho Expo)
    "version": "1.0.0",               // ← Phiên bản app
    "orientation": "portrait",         // ← Chỉ dọc (không cho xoay ngang)
    "icon": "./assets/images/icon.png", // ← Icon app
    "scheme": "bai1helloreactnative",  // ← Deep link scheme (vd: bai1helloreactnative://)
    "userInterfaceStyle": "automatic", // ← Tự động theo light/dark của hệ thống

    "android": {
      "adaptiveIcon": { ... }          // ← Icon adaptive cho Android
    },

    "plugins": [
      "expo-router",                   // ← Plugin Expo Router
      ["expo-splash-screen", {         // ← Plugin Splash Screen
        "backgroundColor": "#208AEF",
        "image": "./assets/images/splash-icon.png"
      }]
    ],

    "experiments": {
      "typedRoutes": true,             // ← Type-safe routes (TypeScript)
      "reactCompiler": true            // ← React Compiler (tối ưu tự động)
    }
  }
}
```

> [!NOTE]
> **`app.json` là nơi bạn cấu hình mọi thứ** liên quan đến app: tên, icon, splash screen, permissions, plugins, ... Tương tự như `AndroidManifest.xml` (Android) hoặc `Info.plist` (iOS), nhưng gọn hơn nhiều.

---

#### 📄 `src/app/_layout.tsx` — Root Layout (bọc toàn bộ app)

File: [_layout.tsx](file:///Users/vovantu/HTML_CSS/ReactNative/Bai1_HelloReactNative/src/app/_layout.tsx)

```tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

// Giữ Splash Screen hiển thị cho đến khi app sẵn sàng
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  // Detect light/dark mode từ hệ thống
  const colorScheme = useColorScheme();

  return (
    // ThemeProvider cung cấp theme cho toàn bộ app
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />  {/* Splash animation */}
      <AppTabs />                 {/* Bottom Tab Navigation */}
    </ThemeProvider>
  );
}
```

**Vai trò của `_layout.tsx`:**
- Là component **bọc tất cả** các screen khác (giống `App.tsx` trong React web)
- Prefix `_` nghĩa là file **layout**, không phải screen
- Cấu hình theme (light/dark), splash screen, và navigation structure

---

#### 📄 `src/app/index.tsx` — Màn hình Home

File: [index.tsx](file:///Users/vovantu/HTML_CSS/ReactNative/Bai1_HelloReactNative/src/app/index.tsx)

```tsx
export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Hero section với logo Expo */}
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Welcome to Expo
          </ThemedText>
        </ThemedView>

        {/* Hướng dẫn bắt đầu */}
        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow title="Try editing" hint={...} />
          <HintRow title="Dev tools" hint={...} />
          <HintRow title="Fresh start" hint={...} />
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}
```

**Những điều quan trọng cần lưu ý:**

| Điểm | Giải thích |
|:---|:---|
| `export default function HomeScreen()` | Expo Router dùng **default export** để render screen |
| `<ThemedView>` thay vì `<div>` | Trong RN không có HTML — dùng `View` (hoặc custom `ThemedView`) |
| `<ThemedText>` thay vì `<p>` hay `<h1>` | Mọi text PHẢI nằm trong `<Text>` component |
| `<SafeAreaView>` | Đảm bảo nội dung không bị che bởi notch, status bar |
| `StyleSheet.create({...})` | Cách tạo styles trong RN (giống CSS objects) |
| `@/components/...` | Alias `@/` trỏ tới thư mục `src/` (cấu hình trong tsconfig.json) |

---

#### 📄 `src/constants/theme.ts` — Hệ thống Theme

File: [theme.ts](file:///Users/vovantu/HTML_CSS/ReactNative/Bai1_HelloReactNative/src/constants/theme.ts)

```tsx
export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
  },
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
};
```

> [!TIP]
> **Design pattern tốt:** Thay vì hardcode màu sắc khắp nơi (`'#333'`, `'#fff'`), tập trung vào file constants. Khi cần đổi theme, chỉ sửa 1 chỗ.

---

### 4.3 Expo Router — File-based Routing

Expo Router sử dụng **file-based routing** — tên file trong thư mục `app/` tự động trở thành route:

| File | Route URL | Mô tả |
|:---|:---|:---|
| `src/app/index.tsx` | `/` | Trang chủ (Home tab) |
| `src/app/explore.tsx` | `/explore` | Trang Explore tab |
| `src/app/_layout.tsx` | — | Layout (không phải route) |
| `src/app/about.tsx` *(tạo mới)* | `/about` | Sẽ tự thành route `/about` |
| `src/app/user/[id].tsx` *(tạo mới)* | `/user/123` | Dynamic route |

```mermaid
graph TD
    A["_layout.tsx<br/>(Root Layout)"] --> B["AppTabs<br/>(Bottom Navigation)"]
    B --> C["index.tsx<br/>Route: / <br/>Tab: Home"]
    B --> D["explore.tsx<br/>Route: /explore<br/>Tab: Explore"]
    
    style A fill:#e74c3c,color:#fff
    style B fill:#3498db,color:#fff
    style C fill:#2ecc71,color:#fff
    style D fill:#2ecc71,color:#fff
```

---

## Phần 5: Luồng Khởi Động App

Khi bạn gõ `npx expo start` → chọn Android, đây là **toàn bộ quá trình** xảy ra:

```mermaid
sequenceDiagram
    autonumber
    actor Dev as 👨‍💻 Bạn (Developer)
    participant Metro as 📦 Metro Bundler<br/>(Trên máy tính Mac)
    participant Emu as 📱 Android Emulator<br/>(Host App / Expo Go)
    participant Hermes as ⚡ Hermes JS Engine<br/>(Bên trong Máy ảo)
    participant Fabric as 🎨 JSI & Fabric (C++)<br/>(Bên trong Máy ảo)
    participant Android as 🤖 Android OS (Native Views)<br/>(Bên trong Máy ảo)

    Dev->>Metro: Gõ `npx expo start` (Chạy Dev Server port 8081)
    Dev->>Metro: Bấm phím 'a' (Yêu cầu chạy Android)
    
    rect rgb(240, 248, 255)
    Note over Metro,Emu: 1. ĐÓNG GÓI & NẠP CODE (Bundling)
    Metro->>Metro: Quét hàng trăm file .tsx, .ts, npm packages
    Metro->>Metro: Transpile TS/JSX → JS thuần và gom thành 1 file bundle.js duy nhất
    Emu->>Metro: Request bundle.js (http://localhost:8081)
    Metro->>Emu: Gửi file bundle.js duy nhất sang máy ảo
    end

    rect rgb(255, 250, 240)
    Note over Emu,Hermes: 2. THỰC THI JAVASCRIPT TRÊN MÁY ẢO
    Emu->>Hermes: Nạp file bundle.js vào Hermes Engine
    Hermes->>Hermes: Chạy entry point (expo-router)
    Hermes->>Hermes: Đọc cấu trúc _layout.tsx & index.tsx
    Hermes->>Hermes: Tính toán State & tạo cây React Virtual DOM
    end

    rect rgb(240, 255, 240)
    Note over Hermes,Android: 3. CẦU NỐI & TẠO NATIVE VIEWS
    Hermes->>Fabric: Gửi Virtual DOM qua JSI (giao tiếp đồng bộ C++)
    Fabric->>Fabric: Yoga Engine (C++) tính toán layout Flexbox (x, y, w, h)
    Fabric->>Android: Gọi Android SDK: new FrameLayout(), new TextView()
    Android->>Emu: GPU vẽ pixel thật của TextView lên màn hình
    end

    Note over Dev,Android: ✨ App đã chạy hoàn tất trên màn hình!

    rect rgb(255, 240, 245)
    Note over Dev,Android: 4. CƠ CHẾ HOT RELOAD KHI SỬA CODE
    Dev->>Metro: Sửa code trong index.tsx & bấm Lưu (Cmd + S)
    Metro->>Metro: Watchman phát hiện file đổi → Metro tạo một "bản vá" (HMR update)
    Metro->>Hermes: Bắn bản vá JS sang Hermes trên máy ảo
    Hermes->>Fabric: Cập nhật lại Virtual DOM
    Fabric->>Android: Sửa trực tiếp thuộc tính của TextView (ví dụ: đổi text)
    Android->>Emu: Màn hình cập nhật ngay lập tức (< 1s) mà không cần reload cả app!
    end
```

### Giải thích chi tiết từng giai đoạn:

| Giai đoạn | Diễn ra ở đâu? | Chi tiết hành động |
|:---|:---:|:---|
| **1. Bundling** | 💻 Máy tính (Host) | **Metro Bundler** đọc toàn bộ thư mục `src/`, thư viện `node_modules`, chuyển TypeScript/JSX thành **1 file JavaScript duy nhất** (`bundle.js`) và phục vụ qua cổng `8081`. |
| **2. Thực thi JS** | 📱 Máy ảo (Emulator) | File `bundle.js` được tải vào máy ảo, nạp vào **Hermes Engine**. Hermes chạy code React, khởi động Expo Router, đọc `_layout.tsx` và `index.tsx`, tạo ra cây **React Virtual DOM**. |
| **3. Dịch sang Native** | 📱 Máy ảo (Emulator) | **JSI & Fabric (C++)** nhận cây Virtual DOM, dùng **Yoga** tính tọa độ pixel, rồi ra lệnh cho **Android OS** tạo ra các View gốc thật sự (`FrameLayout`, `TextView`). GPU vẽ lên màn hình. |
| **4. Hot Reload (HMR)** | 💻 $\rightarrow$ 📱 Cả hai | Khi bạn sửa code, **Watchman** báo cho Metro -> Metro chỉ đóng gói đúng phần thay đổi -> Bắn sang Hermes -> Cập nhật trực tiếp UI trong tích tắc! |

---

## Phần 6: Chạy Dự Án Trên Android Emulator

### 6.1 Bước chạy

```bash
# Bước 1: Mở Android Emulator trước
# (Mở Android Studio → Virtual Device Manager → Start emulator)
# Hoặc chạy lệnh:
emulator -list-avds          # Xem danh sách emulators
emulator -avd <tên_emulator>  # Chạy emulator

# Bước 2: Di chuyển vào thư mục dự án và chạy
cd /Users/vovantu/HTML_CSS/ReactNative/Bai1_HelloReactNative
npx expo start

# Bước 3: Trong menu Expo, nhấn 'a' để chạy trên Android
# Hoặc chạy trực tiếp:
npm run android
```

### 6.2 Các phím tắt trong Expo Dev Server

Khi `npx expo start` đang chạy, bạn có thể dùng các phím:

| Phím | Chức năng |
|:---|:---|
| `a` | Mở app trên Android Emulator |
| `i` | Mở app trên iOS Simulator (cần Xcode) |
| `w` | Mở app trên Web browser |
| `r` | Reload app (restart hoàn toàn) |
| `m` | Mở Dev Menu trên emulator |
| `j` | Mở Debugger (React DevTools) |
| `shift+m` | Chọn dev tools |
| `?` | Xem tất cả phím tắt |

---

## Phần 7: Thực Hành — Sửa Code Đầu Tiên (Hot Reload)

### 7.1 Sửa trang Home

Mở file [src/app/index.tsx](file:///Users/vovantu/HTML_CSS/ReactNative/Bai1_HelloReactNative/src/app/index.tsx) và thay đổi nội dung:

```tsx
// Tìm dòng này:
<ThemedText type="title" style={styles.title}>
  Welcome to&nbsp;Expo
</ThemedText>

// Đổi thành:
<ThemedText type="title" style={styles.title}>
  Xin chào React Native! 🚀
</ThemedText>
```

**Kết quả:** Sau khi lưu file (`Cmd+S`), app trên emulator sẽ **tự động cập nhật** trong chưa đầy 1 giây — đó là **Hot Reload**!

### 7.2 Thay đổi `app.json`

Mở file [app.json](file:///Users/vovantu/HTML_CSS/ReactNative/Bai1_HelloReactNative/app.json) và thử thay đổi:

```json
{
  "expo": {
    "name": "Bài 1 - Hello RN",  // ← Đổi tên app
    "version": "1.0.1",           // ← Đổi version
    ...
  }
}
```

> [!WARNING]
> Khi thay đổi `app.json`, bạn cần **restart** Expo (`Ctrl+C` rồi `npx expo start` lại) vì đây là file cấu hình, không phải code — Hot Reload không áp dụng.

---

## Phần 8: Khái Niệm Quan Trọng Tổng Kết

| Khái niệm | Mô tả | File liên quan |
|:---|:---|:---|
| **Component** | Khối xây dựng UI cơ bản, viết bằng JSX, nhận props và quản lý state | Mọi file `.tsx` |
| **Screen** | Component đại diện cho 1 màn hình, export default trong `app/` | `app/index.tsx`, `app/explore.tsx` |
| **Layout** | Component bọc nhiều screens, tên file bắt đầu `_` | `app/_layout.tsx` |
| **Metro Bundler** | Dev server, bundle JS code, phục vụ Hot Reload | Chạy tự động khi `npx expo start` |
| **Hermes** | JS engine tối ưu cho mobile (nhẹ, khởi động nhanh) | Tự động trong RN 0.86 |
| **Expo Router** | File-based routing — tên file = route URL | Thư mục `app/` |
| **StyleSheet** | Cách viết styles trong RN (JS objects, camelCase) | `StyleSheet.create({...})` |
| **SafeAreaView** | Đảm bảo content không bị notch/status bar che | Import từ `react-native-safe-area-context` |
| **Hot Reload (HMR)** | Cập nhật UI ngay khi lưu file, giữ nguyên state | Tự động hoạt động |
| **`@/` alias** | Shortcut trỏ tới `src/`, tránh relative path dài | Cấu hình trong `tsconfig.json` |

---

## 📝 Bài Tập Thực Hành

### BT1: Chạy app thành công ✅
- Mở Android Emulator
- Chạy `npx expo start` → nhấn `a`
- Xác nhận thấy màn hình "Welcome to Expo"

### BT2: Sửa nội dung Home Screen
- Mở `src/app/index.tsx`
- Đổi text "Welcome to Expo" → "Xin chào, [Tên bạn]! 🇻🇳"
- Quan sát Hot Reload cập nhật tức thì

### BT3: Tìm hiểu `app.json`
- Đổi `"name"` thành tên khác
- Đổi `"orientation"` từ `"portrait"` sang `"default"` (cho phép xoay ngang)
- Đổi màu splash screen (`backgroundColor`)
- Restart Expo và xem kết quả

### BT4: Khám phá cấu trúc dự án
- Mở từng file trong `src/components/` — đọc hiểu từng component
- Mở `src/constants/theme.ts` — thử đổi màu `Colors.light.background` thành `'#f0e68c'` (vàng nhạt) → xem app thay đổi
- Mở `src/hooks/use-theme.ts` — đọc hiểu cách hook lấy màu theo theme

---

## 🎓 Tổng Kết Bài 1

```mermaid
mindmap
  root((Bài 1))
    React Native
      Framework by Meta
      JS/TS → Native UI
      Cross-platform iOS + Android
    Kiến trúc
      Hermes Engine
      JSI (đồng bộ)
      Fabric + TurboModules
    Expo
      Bộ công cụ cho RN
      Expo SDK (Camera, GPS...)
      Expo Router (file-based)
      EAS (Build, Update)
    Cấu trúc dự án
      src/app/ → Screens
      src/components/ → UI
      src/constants/ → Config
      src/hooks/ → Logic
      app.json → App config
    Cách chạy
      npx expo start
      Metro Bundler
      Hot Reload
```

> **Bài tiếp theo:** [Bài 2 — Core Components & JSX trong React Native](file:///Users/vovantu/HTML_CSS/ReactNative) — Bạn sẽ học cách sử dụng `View`, `Text`, `Image`, `TextInput`, `Pressable` và sự khác biệt so với HTML.

---

*Khi bạn hoàn thành các bài tập, hãy báo cho tôi để bắt đầu Bài 2!* 🚀
