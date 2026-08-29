# 📚 SO SÁNH CHI TIẾT: View vs ScrollView vs FlatList vs SectionList

> **Mục đích:** Hiểu rõ bản chất, cơ chế render, và khi nào dùng từng loại container trong React Native.  
> **Bổ trợ cho:** Bài 3 (ScrollView) & Bài 4 (FlatList, SectionList)

---

## 📑 Mục lục
1. [Hình ảnh minh họa tổng quan](#phần-1-hình-ảnh-minh-họa-tổng-quan)
2. [Bảng so sánh 7 tiêu chí](#phần-2-bảng-so-sánh-7-tiêu-chí)
3. [View — Container cơ bản](#phần-3-view--container-cơ-bản)
4. [ScrollView — Container cuộn được](#phần-4-scrollview--container-cuộn-được)
5. [FlatList — Danh sách ảo hóa (Virtualized)](#phần-5-flatlist--danh-sách-ảo-hóa-virtualized)
6. [SectionList — Danh sách phân nhóm](#phần-6-sectionlist--danh-sách-phân-nhóm)
7. [Sơ đồ quyết định: Chọn component nào?](#phần-7-sơ-đồ-quyết-định-chọn-component-nào)

---

## Phần 1: Hình Ảnh Minh Họa Tổng Quan

Giả sử bạn cần hiển thị **100 thẻ Card**, nhưng màn hình chỉ đủ chỗ cho **5 thẻ**:

```
      <View>                  <ScrollView + .map()>            <FlatList>
┌─────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│ 📱 Màn hình     │       │ 📱 Màn hình         │       │ 📱 Màn hình         │
│ ┌─────────────┐ │       │ ┌─────────────────┐ │       │ ┌─────────────────┐ │
│ │   Card 1    │ │       │ │   Card 1  ✅    │ │       │ │   Card 1  ✅    │ │
│ │   Card 2    │ │       │ │   Card 2  ✅    │ │       │ │   Card 2  ✅    │ │
│ │   Card 3    │ │       │ │   Card 3  ✅    │ │       │ │   Card 3  ✅    │ │
│ │   Card 4    │ │       │ │   Card 4  ✅    │ │       │ │   Card 4  ✅    │ │
│ │   Card 5    │ │       │ │   Card 5  ✅    │ │       │ │   Card 5  ✅    │ │
│ └─────────────┘ │       │ └─────────────────┘ │       │ └─────────────────┘ │
├─────────────────┤       │ ↕ Cuộn được         │       │ ↕ Cuộn được         │
│  Card 6 (CẮT!) │       │ ┌─────────────────┐ │       │                     │
│  Card 7 (ẨN!)  │       │ │   Card 6  ✅    │ │       │ Card 6  ⏸️ Chờ     │
│  ...            │       │ │   ...           │ │       │ ...                 │
│  Card 100 (ẨN!)│       │ │   Card 100 ✅   │ │       │ Card 100 ⏸️ Chờ    │
└─────────────────┘       │ └─────────────────┘ │       └─────────────────────┘
                          └─────────────────────┘
 ❌ Không cuộn được        ✅ Cuộn được           ✅ Cuộn được
 ❌ Card 6-100 mất         ❌ Render 100 items    ✅ Chỉ render 5-10 items
                              vào RAM cùng lúc       đang nhìn thấy
                           ❌ Tốn bộ nhớ, lag     ✅ Nhẹ, mượt, tiết kiệm
```

---

## Phần 2: Bảng So Sánh 7 Tiêu Chí

| Tiêu chí | `View` | `ScrollView` | `FlatList` | `SectionList` |
|:---|:---:|:---:|:---:|:---:|
| **Cuộn được?** | ❌ Không | ✅ Có | ✅ Có | ✅ Có |
| **Cơ chế render** | Render con trực tiếp | Render **TẤT CẢ** items cùng lúc | **Virtualized** — chỉ render items trên màn hình | **Virtualized** — chỉ render items trên màn hình |
| **Hiệu suất với 1000 items** | ❌ Không áp dụng | ❌ Cực lag, có thể crash | ✅ Mượt mà | ✅ Mượt mà |
| **Pull-to-Refresh** | ❌ | ❌ Phải tự code | ✅ Có sẵn (`refreshControl`) | ✅ Có sẵn |
| **Infinite Scroll** | ❌ | ❌ Phải tự code | ✅ `onEndReached` | ✅ `onEndReached` |
| **Phân nhóm (Section)** | ❌ | ❌ | ❌ | ✅ Nhóm A, B, C,... |
| **Grid layout** | ❌ Phải tự dùng flexWrap | ❌ Phải tự dùng flexWrap | ✅ `numColumns={2}` | ❌ |

---

## Phần 3: `View` — Container Cơ Bản (Không Cuộn)

### Bản chất:
`View` là thẻ `<div>` trong React Native. Nó chỉ là **một khung hộp** để nhóm và bố trí các phần tử con bằng Flexbox. **Không cuộn được.**

### Khi nào dùng:
* Header bar, Footer bar, Tab bar
* Từng thẻ Card con (bên trong danh sách)
* Popup / Modal nhỏ
* Bất kỳ phần giao diện nào **chắc chắn không bao giờ dài quá màn hình**

### Ví dụ:
```tsx
// Header bar — chiều cao cố định, không cần cuộn
<View style={{ height: 60, backgroundColor: '#2c3e50', justifyContent: 'center', paddingHorizontal: 16 }}>
  <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Trang chủ</Text>
</View>
```

---

## Phần 4: `ScrollView` — Container Cuộn Được

### Bản chất:
`ScrollView` là `View` có thêm khả năng cuộn. Nó render **TẤT CẢ phần tử con vào bộ nhớ cùng lúc**, rồi cho phép người dùng vuốt để xem.

### Khi nào dùng:
* Trang chứa nội dung đọc (bài viết, mô tả sản phẩm)
* Form nhập liệu dài
* Danh sách ngắn (dưới 20-30 items)
* Trang có **nội dung hỗn hợp** (ảnh + text + input + button lẫn lộn)

### ⚠️ Lưu ý QUAN TRỌNG: `style` vs `contentContainerStyle`

| Props | Tác dụng | Ví dụ |
|:---|:---|:---|
| `style` | Định dạng **khung cửa sổ cuộn** (kích thước, nền) | `flex: 1`, `backgroundColor` |
| `contentContainerStyle` | Định dạng **nội dung bên trong** (bố cục, padding) | `padding`, `alignItems`, `gap` |

```tsx
// ❌ SAI: Đặt padding/alignItems vào 'style' sẽ làm vỡ vùng cuộn
<ScrollView style={{ padding: 20, alignItems: 'center' }}>

// ✅ ĐÚNG:
<ScrollView 
  style={{ flex: 1 }} 
  contentContainerStyle={{ padding: 20, alignItems: 'center' }}
>
```

---

## Phần 5: `FlatList` — Danh Sách Ảo Hóa (Virtualized)

### Bản chất — Virtualized List là gì?

FlatList **KHÔNG render tất cả items**. Nó chỉ render **những items đang hiển thị trên màn hình** (và một vài items lân cận để cuộn mượt). Khi user cuộn, items cũ bị gỡ khỏi bộ nhớ, items mới được tạo ra.

```
ScrollView (render tất cả):
  Bộ nhớ: [Item1] [Item2] [Item3] ... [Item98] [Item99] [Item100]
           ← ─────────────── 100 items trong RAM ──────────────── →
  → RAM bị đầy, app lag!

FlatList (virtualized):
  Bộ nhớ: ... [Item3] [Item4] [Item5] [Item6] [Item7] ...
                       ← chỉ ~5-15 items trong RAM →
  → RAM nhẹ, app mượt!
```

### Khi nào dùng:
* Danh sách **dài** (hơn 30 items)
* Danh sách **đồng nhất** (mỗi item cùng cấu trúc: user card, product card, message...)
* Cần **Pull-to-Refresh** hoặc **Infinite Scroll**
* Cần hiển thị dạng **Grid** (`numColumns`)

### Props quan trọng:
```tsx
<FlatList
  // BẮT BUỘC
  data={DATA_ARRAY}                    // Mảng dữ liệu đầu vào
  renderItem={({ item }) => <Card />}  // Hàm render từng item
  keyExtractor={(item) => item.id}     // Key duy nhất

  // PHỤ TRỢ UI
  ListHeaderComponent={<Header />}     // Đầu danh sách
  ListFooterComponent={<Footer />}     // Cuối danh sách
  ListEmptyComponent={<Empty />}       // Khi data = []
  ItemSeparatorComponent={<Line />}    // Đường kẻ giữa items

  // TƯƠNG TÁC
  refreshControl={<RefreshControl />}  // Pull-to-Refresh
  onEndReached={loadMore}              // Infinite Scroll
  onEndReachedThreshold={0.3}          // Trigger khi còn 30% cuối

  // GRID
  numColumns={2}                       // Chia 2 cột

  // TỐI ƯU HIỆU SUẤT
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={5}
/>
```

---

## Phần 6: `SectionList` — Danh Sách Phân Nhóm

### Bản chất:
Giống FlatList (virtualized, hiệu suất cao), nhưng **bắt buộc dữ liệu phải có cấu trúc phân nhóm** (sections). Mỗi nhóm có một **header riêng** có thể **dính ở đỉnh màn hình (sticky)** khi cuộn.

### Khi nào dùng:
* **Danh bạ điện thoại:** Nhóm A, B, C,...
* **Cài đặt (Settings):** "Tài khoản", "Thông báo", "Bảo mật"
* **Lịch sử đơn hàng:** Nhóm theo tháng/năm
* **Menu nhà hàng:** "Khai vị", "Món chính", "Tráng miệng"

### Cấu trúc dữ liệu bắt buộc:
```tsx
// ⚠️ SectionList YÊU CẦU format CHÍNH XÁC như này:
const sections = [
  {
    title: "A",          // Tên section (hiển thị header)
    data: [              // Mảng items trong section (BẮT BUỘC tên "data")
      { id: "1", name: "An" },
      { id: "2", name: "Anh" },
    ],
  },
  {
    title: "B",
    data: [
      { id: "3", name: "Bình" },
    ],
  },
];
```

### Props quan trọng:
```tsx
<SectionList
  sections={sections}                  // Mảng sections (thay vì "data")
  keyExtractor={(item) => item.id}

  // Render từng item
  renderItem={({ item }) => <ContactCard contact={item} />}

  // Render header cho mỗi section ("A", "B", "C",...)
  renderSectionHeader={({ section }) => (
    <Text>{section.title}</Text>
  )}

  // ⭐ Header dính ở đỉnh khi cuộn (giống danh bạ iOS)
  stickySectionHeadersEnabled={true}
/>
```

---

## Phần 7: Sơ Đồ Quyết Định — Chọn Component Nào?

Khi bạn cần hiển thị nội dung, hãy tự hỏi theo thứ tự:

```
Bắt đầu: Cần hiển thị nội dung gì?
│
├── Nội dung CỐ ĐỊNH, ngắn, không bao giờ tràn màn hình?
│   └── ✅ Dùng <View>
│       Ví dụ: Header, Footer, Card con, Popup nhỏ
│
├── Nội dung DÀI / có thể tràn, nhưng KHÔNG PHẢI danh sách đồng nhất?
│   └── ✅ Dùng <ScrollView>
│       Ví dụ: Form dài, bài viết, trang chi tiết sản phẩm (ảnh + mô tả + review)
│
├── DANH SÁCH ĐỒNG NHẤT (mỗi item cùng cấu trúc)?
│   │
│   ├── Dưới 30 items?
│   │   └── ✅ Dùng <ScrollView> + .map()  (đơn giản, đủ dùng)
│   │
│   ├── Trên 30 items, KHÔNG phân nhóm?
│   │   └── ✅ Dùng <FlatList>
│   │       (pull-to-refresh, infinite scroll, grid)
│   │
│   └── Trên 30 items, CÓ phân nhóm (A, B, C,...)?
│       └── ✅ Dùng <SectionList>
│           (sticky headers, nhóm theo danh mục)
```

---

## 📌 Bảng Tổng Kết Nhanh

| Câu hỏi | Đáp án |
|:---|:---|
| Header bar, footer bar, card con | → `<View>` |
| Form dài, bài viết, trang chi tiết | → `<ScrollView>` |
| Danh sách 10-20 items | → `<ScrollView>` + `.map()` |
| Danh sách 100+ items (user list, product list) | → `<FlatList>` |
| Danh sách phân nhóm (danh bạ, settings) | → `<SectionList>` |
| Danh sách dạng lưới (photo gallery) | → `<FlatList numColumns={3}>` |
| Cần pull-to-refresh? | → `<FlatList>` hoặc `<SectionList>` |
| Cần infinite scroll? | → `<FlatList>` hoặc `<SectionList>` |
