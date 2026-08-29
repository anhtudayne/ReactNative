# 📚 CHUYÊN ĐỀ BỔ TRỢ: CÁC KHÁI NIỆM CỐT LÕI & GIẢI ĐÁP KỸ THUẬT TRONG REACT NATIVE

> **Mục đích:** Tài liệu tổng hợp và giải thích chuyên sâu các câu hỏi thường gặp, các pattern cốt lõi từ thực tế quá trình học React Native và TypeScript.  
> **Vị trí lưu trữ:** `TakeNote/kien_thuc_bo_tro_react_native_core.md`

---

## 📑 Mục lục
1. [Phần 1: Mảng Style `style={[...]}` — Cơ chế hoạt động & Gộp style](#phần-1-mảng-style-style---cơ-chế-hoạt-động--gộp-style)
2. [Phần 2: Render Danh Sách Card — 1 Component duy nhất hay Nhiều Component?](#phần-2-render-danh-sách-card--1-component-duy-nhất-hay-nhiều-component)
3. [Phần 3: So Sánh Chi Tiết `ScrollView` vs `View` Thông Thường](#phần-3-so-sánh-chi-tiết-scrollview-vs-view-thông-thường)
4. [Phần 4: `ReactNode` Trong TypeScript — Bản chất & Ứng dụng với `children`](#phần-4-reactnode-trong-typescript--bản-chất--ứng-dụng-với-children)

---

## Phần 1: Mảng Style `style={[...]}` — Cơ Chế Hoạt Động & Gộp Style

### 1.1 Câu hỏi: Có cần phải định nghĩa sẵn 1 mảng style từ trước không?

> ❌ **KHÔNG!** Bạn không cần định nghĩa mảng nào trong `StyleSheet.create()` cả. Dấu mảng `[...]` được viết **trực tiếp tại prop `style` của component**.

```tsx
// Bước 1: Trong StyleSheet.create — Định nghĩa các Object style đơn lẻ
const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    color: '#333',
  },
  active: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
});

// Bước 2: Trong JSX — Truyền trực tiếp mảng [...] vào prop style
<Text style={[styles.base, isActive && styles.active, { marginTop: 10 }]}>
  Hello World
</Text>
```

---

### 1.2 Cơ chế xử lý mảng style của React Native

Prop `style` của React Native chấp nhận:
1. **1 Object đơn:** `style={styles.base}`
2. **1 Mảng (Array) chứa nhiều styles:** `style={[ style1, style2, style3 ]}`

Khi bạn truyền mảng `style={[A, B, C]}`:

1. **Gộp style từ trái qua phải:** Thuộc tính ở phần tử sau sẽ **ghi đè** thuộc tính ở phần tử trước nếu trùng tên (tương tự `Object.assign()`).
2. **Tự động bỏ qua giá trị `false`, `null`, `undefined`:**
   * Nếu `isActive === false`, biểu thức `isActive && styles.active` trả về `false`.
   * React Native thấy giá trị `false` trong mảng sẽ tự động **bỏ qua**, không gây lỗi.

#### 🔍 Minh họa chi tiết:
```tsx
// Trường hợp 1: isActive = true
style={[
  { fontSize: 16, color: '#333' },          // styles.base
  { color: '#27ae60', fontWeight: 'bold' }, // styles.active (ghi đè color thành xanh lá)
  { marginTop: 10 }                         // inline bổ sung
]}
// 👉 Kết quả render: { fontSize: 16, color: '#27ae60', fontWeight: 'bold', marginTop: 10 }

// Trường hợp 2: isActive = false
style={[
  { fontSize: 16, color: '#333' }, // styles.base
  false,                           // Bị React Native bỏ qua!
  { marginTop: 10 }                // inline bổ sung
]}
// 👉 Kết quả render: { fontSize: 16, color: '#333', marginTop: 10 }
```

### 💡 So sánh với Web:
* **Web (CSS):** Phải dùng template string hoặc cài thư viện `clsx` / `classnames`:
  ```tsx
  <button className={`btn ${isActive ? 'active' : ''}`} />
  ```
* **React Native:** Cú pháp mảng `style={[styles.btn, isActive && styles.active]}` được **hỗ trợ mặc định**, cực kỳ tiện lợi và không cần cài thêm thư viện.

---

## Phần 2: Render Danh Sách Card — 1 Component Duy Nhất hay Nhiều Component?

### 2.1 Câu hỏi: Danh sách 10 sản phẩm thì tạo 10 component Card hay tạo 1 Component Card rồi duyệt mảng?

> ✅ **Chúng ta CHỈ định nghĩa DUY NHẤT 1 component Card**, sau đó dùng mảng dữ liệu (Data Array) và duyệt qua mảng bằng hàm **`.map()`** để render tự động.

---

### 2.2 Tại sao lại làm như vậy?

1. **Nguyên tắc DRY (Don't Repeat Yourself):** Không bao giờ copy-paste cùng một đoạn code giao diện nhiều lần.
2. **Dữ liệu động (Data-driven UI):** Dữ liệu thực tế đến từ API/Database dạng JSON. Danh sách có thể là 5, 20 hay 100 sản phẩm thì code giao diện vẫn chỉ dài chừng đó dòng.
3. **Dễ bảo trì:** Khi cần đổi layout thẻ (đổi kích thước ảnh, màu giá tiền), bạn chỉ cần sửa **1 nơi duy nhất**.

---

### 2.3 Quy trình 3 bước chuẩn:

```tsx
// 🔹 BƯỚC 1: Chuẩn bị mảng dữ liệu (Thường nhận từ API)
type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
};

const PRODUCTS: Product[] = [
  { id: 1, name: "Tai nghe Sony WH-1000XM5", price: "7.990.000₫", image: "https://picsum.photos/200?1" },
  { id: 2, name: "Bàn phím cơ Keychron K2", price: "2.490.000₫", image: "https://picsum.photos/200?2" },
  { id: 3, name: "Chuột Logitech MX Master 3S", price: "2.190.000₫", image: "https://picsum.photos/200?3" },
];

// 🔹 BƯỚC 2: Định nghĩa DUY NHẤT 1 component ProductCard (Nhận dữ liệu qua Props)
function ProductCard({ item }: { item: Product }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </View>
  );
}

// 🔹 BƯỚC 3: Duyệt mảng để render (Dùng hàm .map())
export default function ProductListScreen() {
  return (
    <ScrollView style={styles.container}>
      {PRODUCTS.map((product) => (
        // ⭐ Bắt buộc có 'key' duy nhất cho mỗi phần tử
        <ProductCard key={product.id} item={product} />
      ))}
    </ScrollView>
  );
}
```

### 2.4 Lưu ý bắt buộc: Thuộc tính `key={product.id}`
* React dùng `key` để định danh từng phần tử trong Virtual DOM.
* Khi có sự thay đổi (xóa, sửa, thêm mới), React chỉ cập nhật đúng phần tử đó mà không phải vẽ lại toàn bộ danh sách.

---

## Phần 3: So Sánh Chi Tiết `ScrollView` vs `View` Thông Thường

### 3.1 Hình ảnh minh họa trực quan

Giả sử có **6 thẻ Card** nhưng màn hình điện thoại chỉ đủ chỗ cho **3 thẻ**:

```
        SỬ DỤNG <View>                         SỬ DỤNG <ScrollView>
   ┌──────────────────────┐                 ┌──────────────────────┐
   │ 📱 Màn hình hiển thị │                 │ 📱 Màn hình hiển thị │
   │ ┌──────────────────┐ │                 │ ┌──────────────────┐ │
   │ │     Card 1       │ │                 │ │     Card 1       │ │
   │ ├──────────────────┤ │                 │ ├──────────────────┤ │
   │ │     Card 2       │ │                 │ │     Card 2       │ │
   │ ├──────────────────┤ │                 │ ├──────────────────┤ │
   │ │     Card 3       │ │                 │ │     Card 3       │ │
───┴──────────────────────┴───           ───┴──────────────────────┴───
   │  Card 4  (BỊ CẮT MẤT)  │               ▲ │     Card 4       │ │ █ (Thanh
   │  Card 5  (KHÔNG THẤY)  │               │ ├──────────────────┤ │ █  cuộn)
   │  Card 6  (KHÔNG CUỘN   │     Vuốt ngón │ │     Card 5       │ │
   │           ĐƯỢC!)       │     tay lên   │ ├──────────────────┤ │
   └────────────────────────┘     để cuộn   │ │     Card 6       │ │
                                            ▼ └──────────────────┘ │
  ❌ Phần tràn ra ngoài màn hình              ✅ Người dùng vuốt lên/xuống
     bị ẩn hoàn toàn vĩnh viễn                   để xem hết toàn bộ nội dung
```

---

### 3.2 Bảng so sánh 6 tiêu chí:

| Tiêu chí | `<View>` | `<ScrollView>` |
|:---|:---|:---|
| **Khả năng cuộn** | ❌ **Không cuộn được** (Cố định). | ✅ **Cuộn mượt mà** bằng cảm ứng vuốt. |
| **Nội dung dài hơn màn hình** | Bị cắt bớt (clip/overflow hidden), không xem được phần tràn. | Tự động tạo thanh cuộn để xem toàn bộ. |
| **Hướng cuộn** | Không có. | Mặc định **cuộn dọc**, có thể bật **cuộn ngang** (`horizontal={true}`). |
| **Props để Style** | Chỉ dùng **`style`**. | Dùng cả **`style`** (khung cửa sổ cuộn) và **`contentContainerStyle`** (nội dung bên trong). |
| **Tính năng Mobile Native** | Cơ bản, không có tương tác cuộn. | • Kéo để làm mới (`refreshControl`).<br>• Chạm status bar để cuộn lên đầu (iOS).<br>• Tự ẩn bàn phím khi vuốt (`keyboardDismissMode`). |
| **Hiệu năng** | Cực nhẹ, render nhanh. | Nặng hơn một chút do phải theo dõi toạ độ và cử chỉ vuốt. |

---

### 3.3 ⚠️ Lưu ý QUAN TRỌNG: `style` vs `contentContainerStyle`

```tsx
// ❌ SAI: Đặt padding/alignItems vào 'style' sẽ làm vỡ kích thước vùng cuộn
<ScrollView style={{ padding: 20, alignItems: 'center' }}>

// ✅ ĐÚNG:
<ScrollView 
  style={{ flex: 1 }} 
  contentContainerStyle={{ padding: 20, alignItems: 'center' }}
>
```

* **`style`**: Định dạng **khung nhìn / cửa sổ cuộn** (ví dụ: `flex: 1`, `backgroundColor`).
* **`contentContainerStyle`**: Định dạng **bố cục cho các phần tử con bên trong** (ví dụ: `padding`, `alignItems`, `gap`, `justifyContent`).

---

## Phần 4: `ReactNode` Trong TypeScript — Bản Chất & Ứng Dụng Với `children`

### 4.1 `ReactNode` là gì?

> **`ReactNode`** là một kiểu dữ liệu (Type) do React cung cấp, đại diện cho:  
> **"Bất kỳ thứ gì mà React có thể hiển thị (render) lên màn hình được."**

---

### 4.2 Tại sao `children` luôn có kiểu `ReactNode`?

Khi tạo một **Layout Wrapper Component** (theo Composition Pattern):

```tsx
<ScreenLayout title="Trang chủ">
  {/* 👇 Mọi thứ bạn nhét vào giữa 2 thẻ mở/đóng này được React gom vào `children` */}
  <Text>Xin chào</Text>
  <FlexDemo />
  <AlignDemo />
  {isLogin && <UserCard />}
</ScreenLayout>
```

Phần nội dung giữa 2 thẻ này có thể rất đa dạng:
* 1 thẻ JSX đơn lẻ
* Nhiều thẻ JSX lồng nhau
* Chuỗi ký tự text (`string`) hoặc con số (`number`)
* Biểu thức điều kiện trả về `null` hoặc `false`

👉 `ReactNode` chính là kiểu dữ liệu bao quát **tất cả các trường hợp trên** mà không bao giờ bị TypeScript báo lỗi.

---

### 4.3 `ReactNode` chấp nhận những loại dữ liệu nào?

| Dữ liệu | Ví dụ khi truyền vào `children` | `ReactNode` chấp nhận không? |
|:---|:---|:---:|
| **1 thẻ JSX** | `<FlexDemo />` | ✅ Hợp lệ |
| **Nhiều thẻ JSX** | `<FlexDemo /><AlignDemo /><View />` | ✅ Hợp lệ |
| **Chuỗi text (string)** | `<ScreenLayout>Hello World</ScreenLayout>` | ✅ Hợp lệ |
| **Con số (number)** | `<ScreenLayout>{2026}</ScreenLayout>` | ✅ Hợp lệ |
| **Mảng JSX** | `[<Card key="1" />, <Card key="2" />]` | ✅ Hợp lệ |
| **Giá trị rỗng** | `null`, `undefined`, `false` (khi ẩn component) | ✅ Hợp lệ |

---

### 4.4 So sánh nhanh: `ReactNode` vs `ReactElement` vs `string`

```tsx
// 1. Nếu để kiểu string:
type Props = { children: string };
// ❌ Chỉ nhận text: <ScreenLayout>Chữ</ScreenLayout>
// ❌ Truyền thẻ JSX <View /> sẽ BÁO LỖI NGAY!

// 2. Nếu để kiểu ReactElement:
type Props = { children: ReactElement };
// ❌ Chỉ nhận đúng 1 thẻ JSX duy nhất.
// ❌ Truyền nhiều thẻ hoặc truyền text sẽ BÁO LỖI!

// 3. Chuẩn nhất: Dùng ReactNode
type Props = { children: ReactNode };
// ✅ Nhận TẤT CẢ mọi trường hợp hợp lệ trong React!
```

---

### 📌 Mẫu Code chuẩn áp dụng Composition Pattern:

```tsx
import { ReactNode } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenLayoutProps = {
  title: string;
  subtitle?: string;
  headerColor?: string;
  children: ReactNode; // ⭐ Luôn dùng ReactNode cho children
};

export function ScreenLayout({
  title,
  subtitle,
  headerColor = '#2c3e50',
  children,
}: ScreenLayoutProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { backgroundColor: headerColor }]}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>

        {/* Nội dung truyền từ ngoài vào */}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
```
