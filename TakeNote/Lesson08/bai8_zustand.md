# 📘 BÀI 8: State Management Nâng Cao — Zustand

> **Thời lượng:** ~4-5 giờ | **Độ khó:** ⭐⭐⭐⭐ Khó | **Dự án:** Tái sử dụng `Bai1_HelloReactNative`
> **Yêu cầu:** Đã hoàn thành Bài 7 (Context API + useReducer)

---

## 🎯 Mục tiêu bài học

Sau bài này, bạn sẽ:
- [ ] Hiểu **tại sao cần Zustand** (hạn chế của Context API)
- [ ] Nắm vững cú pháp `create()`, `set()`, `get()` của Zustand
- [ ] Hiểu **Selector** — vũ khí tối ưu re-render
- [ ] Sử dụng **Persist middleware** — lưu state khi tắt app
- [ ] Biết cách **tổ chức stores** trong dự án lớn
- [ ] So sánh được Context API vs Zustand vs Redux

---

## Phần 1: Tại Sao Cần Zustand?

### 1.1 Hạn chế của Context API (đã học ở Bài 7)

```tsx
// ❌ Context API — 3 VẤN ĐỀ LỚN:

// Vấn đề 1: RE-RENDER TOÀN BỘ
// Khi BẤT KỲ field nào trong context thay đổi
// → TẤT CẢ component dùng context đều re-render
// → Kể cả component chỉ đọc 1 field không liên quan!

// Vấn đề 2: BOILERPLATE NHIỀU
// Cần viết: Types → Reducer → createContext → Custom Hook → Provider → Bọc layout
// → ~100 dòng code chỉ để tạo 1 context!

// Vấn đề 3: KHÔNG DÙNG NGOÀI COMPONENT
// useContext() chỉ gọi được trong React component
// → Không dùng được trong file utils, API helpers, middleware...
```

### 1.2 Zustand giải quyết tất cả:

| Vấn đề | Context API | Zustand |
|:---|:---|:---|
| Re-render | ⚠️ TẤT CẢ consumer re-render | ✅ **Chỉ** component subscribe field thay đổi |
| Boilerplate | ~100 dòng (Types, Reducer, Context, Hook, Provider) | ~30 dòng (chỉ `create()`) |
| Provider | Phải bọc `<Provider>` trong layout | ❌ **KHÔNG CẦN Provider** |
| Ngoài component | ❌ Không được | ✅ Dùng ở đâu cũng được |
| Persist | Tự viết | ✅ Built-in middleware |
| DevTools | ❌ | ✅ Có sẵn |

---

## Phần 2: Zustand — Cài Đặt & Cú Pháp Cơ Bản

### 2.1 Cài đặt

```bash
npm install zustand
npm install @react-native-async-storage/async-storage  # Cho persist
```

### 2.2 Store đơn giản nhất — So sánh với Context

#### ❌ Context API (Bài 7) — ~50 dòng:
```tsx
// 1. Tạo Types
interface CounterContextType {
  count: number;
  increment: () => void;
  decrement: () => void;
}

// 2. Tạo Context
const CounterContext = createContext<CounterContextType | undefined>(undefined);

// 3. Custom Hook
export function useCounter() {
  const ctx = useContext(CounterContext);
  if (!ctx) throw new Error('Thiếu Provider!');
  return ctx;
}

// 4. Provider Component
export function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  return (
    <CounterContext.Provider value={{ count, increment, decrement }}>
      {children}
    </CounterContext.Provider>
  );
}

// 5. Phải bọc Provider trong _layout.tsx:
// <CounterProvider><Stack>...</Stack></CounterProvider>
```

#### ✅ Zustand (Bài 8) — ~10 dòng:
```tsx
import { create } from 'zustand';
// 🆕 CÚ PHÁP: import { create } from 'zustand'
// → `create` là hàm DUY NHẤT cần import

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounterStore = create<CounterStore>((set) => ({
  // 🆕 CÚ PHÁP: create<Type>((set) => ({ initialState + actions }))
  //
  // set = Hàm cập nhật state (Zustand cung cấp)
  // Trả về 1 object chứa CẢ state lẫn actions (khác Context tách riêng)

  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// XONG! Không cần Provider, không cần bọc gì cả!
```

#### Sử dụng trong component:
```tsx
function MyComponent() {
  // 🆕 SELECTOR: Chỉ subscribe field cần dùng
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);

  return (
    <Pressable onPress={increment}>
      <Text>Count: {count}</Text>
    </Pressable>
  );
}
```

> [!IMPORTANT]
> **Zustand KHÔNG CẦN Provider!**
> Không cần bọc `<Provider>` trong `_layout.tsx`. Import hook → dùng ngay.
> Đây là khác biệt lớn nhất với Context API.

---

## Phần 3: `set()` và `get()` — 2 Hàm Cốt Lõi

### 3.1 `set()` — Cập nhật state

```tsx
const useStore = create<MyStore>((set) => ({
  count: 0,
  name: 'Tú',

  // Cách 1: Truyền object trực tiếp (không cần đọc state cũ)
  reset: () => set({ count: 0 }),
  // → Zustand TỰ ĐỘNG merge: { count: 0, name: 'Tú' }
  //   Chỉ ghi đè count, giữ nguyên name!

  // Cách 2: Truyền callback (cần đọc state cũ)
  increment: () => set((state) => ({ count: state.count + 1 })),
  //                    ^^^^^
  //                    state hiện tại (Zustand truyền vào)

  // Cách 3: Thay thế toàn bộ state (ít dùng)
  resetAll: () => set({ count: 0, name: '' }, true),
  //                                          ^^^^
  //                          true = REPLACE (không merge, thay thế hoàn toàn)
}));
```

> 💡 **Khác biệt với Context/Reducer:**
> - Context: `dispatch({ type: 'INCREMENT' })` → Reducer xử lý bằng switch/case
> - Zustand: `set((state) => ({ count: state.count + 1 }))` → **Cập nhật trực tiếp**, không cần switch/case!

### 3.2 `get()` — Đọc state hiện tại (không gây re-render)

```tsx
const useStore = create<MyStore>((set, get) => ({
  //                                    ^^^
  //                            Tham số thứ 2 = get
  items: [],

  getTotal: () => {
    // get() trả về toàn bộ state hiện tại
    // KHÔNG gây re-render (khác với selector trong component)
    const items = get().items;
    return items.reduce((sum, item) => sum + item.price, 0);
  },

  addItem: (item) => {
    const currentItems = get().items;  // Đọc state hiện tại
    if (currentItems.length >= 50) {
      Alert.alert('Giỏ hàng đầy!');
      return;  // Không cập nhật state → Không re-render
    }
    set({ items: [...currentItems, item] });  // Cập nhật state
  },
}));
```

> 💡 **Khi nào dùng `set` vs `get`?**
> - `set`: Khi muốn **THAY ĐỔI** state → gây re-render
> - `get`: Khi chỉ muốn **ĐỌC** state hiện tại → KHÔNG gây re-render

---

## Phần 4: Selector — Vũ Khí Tối Ưu Re-render

### 4.1 Vấn đề: Lấy toàn bộ store

```tsx
// ⚠️ Lấy toàn bộ store → BẤT KỲ field nào đổi đều re-render
const { count, name, items } = useStore();
// → Khi chỉ count đổi → Component vẫn re-render dù không dùng count!
// → Giống hệt Context API!
```

### 4.2 Giải pháp: Selector — Chỉ subscribe field cần dùng

```tsx
// ✅ Selector: Chỉ subscribe field count
const count = useStore((state) => state.count);
// 🆕 CÚ PHÁP: useStore((state) => state.fieldName)
//   → Truyền 1 hàm "chọn" field muốn lấy
//   → Zustand so sánh: count cũ === count mới ?
//     → KHÁC → re-render
//     → GIỐNG → KHÔNG re-render!

// ✅ Lấy nhiều field cùng lúc (vẫn tối ưu)
const { count, name } = useStore((state) => ({
  count: state.count,
  name: state.name,
}));
// ⚠️ CHÚ Ý: Cách này tạo object MỚI mỗi lần → Zustand dùng shallow compare
// → Cần import { useShallow } từ 'zustand/react/shallow':
import { useShallow } from 'zustand/react/shallow';
const { count, name } = useStore(
  useShallow((state) => ({ count: state.count, name: state.name }))
);
```

### 4.3 So sánh trực quan:

```
Store thay đổi: { count: 5 → 6, name: 'Tú', items: [...] }

Context API:
  ✅ ComponentA (dùng count) → RE-RENDER
  ⚠️ ComponentB (dùng name)  → RE-RENDER (dù name KHÔNG đổi!)
  ⚠️ ComponentC (dùng items) → RE-RENDER (dù items KHÔNG đổi!)

Zustand Selector:
  ✅ ComponentA: useStore(s => s.count) → RE-RENDER (count đổi)
  ❌ ComponentB: useStore(s => s.name)  → KHÔNG re-render (name không đổi)
  ❌ ComponentC: useStore(s => s.items) → KHÔNG re-render (items không đổi)
```

---

## Phần 5: Persist Middleware — Lưu State Khi Tắt App

### 5.1 Cú pháp

```tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCartStore = create<CartStore>()(
  // 🆕 CÚ PHÁP: create<Type>()()  — 2 DẤU NGOẶC ()()
  // → Khi dùng middleware (persist), cần thêm 1 cặp () nữa
  // → Lý do kỹ thuật: TypeScript inference cần currying
  // → KHÔNG có middleware: create<Type>((set) => (...))      — 1 cặp ()
  // → CÓ middleware:      create<Type>()((set) => (...))     — 2 cặp ()

  persist(
    // Phần 1: Store config (giống bình thường)
    (set, get) => ({
      items: [],
      addItem: (product) => { ... },
    }),

    // Phần 2: Persist config
    {
      name: 'cart-storage',
      // → Key lưu trong AsyncStorage
      // → Tắt app → mở lại → Zustand đọc key này → khôi phục state

      storage: createJSONStorage(() => AsyncStorage),
      // → Adapter: Chuyển AsyncStorage thành format Zustand hiểu
      // → Web dùng localStorage, React Native dùng AsyncStorage

      partialize: (state) => ({
        items: state.items,
      }),
      // 🆕 CÚ PHÁP: Chỉ lưu NHỮNG FIELD CẦN THIẾT
      // → KHÔNG lưu hàm (addItem, removeItem) vì không serialize được
      // → KHÔNG lưu totalItems/totalPrice vì tính lại được từ items
      // → Tiết kiệm dung lượng storage!

      onRehydrateStorage: () => {
        // 🆕 CÚ PHÁP: Callback chạy SAU KHI đọc xong data từ storage
        return (state) => {
          if (state && state.items.length > 0) {
            // Tính lại các field KHÔNG được persist
            const totals = calculateTotals(state.items);
            useCartStore.setState(totals);
            // 🆕 CÚ PHÁP: useStore.setState() — Gọi NGOÀI component
          }
        };
      },
    }
  )
);
```

### 5.2 Luồng hoạt động Persist:

```
MỞ APP:
  1. Zustand tạo store với initialState
  2. AsyncStorage.getItem('cart-storage') → Đọc data đã lưu
  3. Merge data cũ vào store (rehydrate)
  4. onRehydrateStorage() chạy → Tính lại totalItems, totalPrice
  5. Component render với data đã khôi phục!

ĐANG DÙNG APP:
  User thêm sản phẩm → set({...}) → State thay đổi
  → Persist middleware TỰ ĐỘNG gọi AsyncStorage.setItem('cart-storage', data)
  → Data được lưu ngay lập tức!

TẮT APP VÀ MỞ LẠI:
  → Quay lại bước "MỞ APP" → Giỏ hàng vẫn còn!
```

---

## Phần 6: 🆕 Cú Pháp Quan Trọng

### 6.1 `create<Type>()()` — Tại sao 2 dấu ngoặc?

```tsx
// Không middleware: 1 cặp ()
const useStore = create<MyStore>((set) => ({ ... }));

// Có middleware: 2 cặp ()
const useStore = create<MyStore>()(
  persist((set) => ({ ... }), { name: 'key' })
);
// Giải thích: create<MyStore>() trả về 1 hàm
//             Hàm đó nhận persist(...) làm tham số
//             → Cần thêm () để gọi hàm đó
```

### 6.2 `??` — Nullish Coalescing Operator

```tsx
const quantity = item?.quantity ?? 0;
// → Nếu item?.quantity là null hoặc undefined → trả về 0
// → Nếu item?.quantity = 0 → vẫn trả về 0 (ĐÚNG!)

// So sánh với ||:
const quantity = item?.quantity || 0;
// → Nếu item?.quantity = 0 → trả về 0... nhưng 0 là falsy → trả về 0 (ĐÚNG)
// → Nếu item?.quantity = '' → trả về '' nhưng '' là falsy → trả về 0 (SAI nếu '' hợp lệ)

// Quy tắc: Dùng ?? khi chỉ muốn check null/undefined
//           Dùng || khi muốn check tất cả falsy values (0, '', false, null, undefined)
```

### 6.3 `Partial<Type>` — Làm tất cả field trở thành optional

```tsx
interface User {
  id: string;    // required
  name: string;  // required
  email: string; // required
}

type PartialUser = Partial<User>;
// Kết quả: { id?: string; name?: string; email?: string }
// → Tất cả field trở thành optional!

// Dùng cho updateProfile — chỉ cập nhật 1 vài field:
updateProfile: (data: Partial<User>) => {
  const current = get().user;
  set({ user: { ...current, ...data } });
}
// Gọi: updateProfile({ name: 'Tú mới' }) → Chỉ đổi name, giữ nguyên email!
```

---

## Phần 7: 🆕 Pattern Chuyên Sâu — Dùng Zustand Ngoài Component

Đây là một trong những ưu điểm vượt trội và "đắt giá" nhất của Zustand so với Context API trong dự án thực tế.

### 7.1 Bản chất: Quy tắc React Hook ("Rules of Hooks")

Trong React, bất kỳ hàm nào bắt đầu bằng chữ `use...` (`useState`, `useEffect`, `useContext`, `useCart`...) đều là **React Hook**. React đặt ra một quy tắc bất di bất dịch:
> ⚠️ **Hook CHỈ ĐƯỢC PHÉP gọi bên trong React Function Component (hoặc Custom Hook khác).**
> Tuyệt đối **KHÔNG ĐƯỢC** gọi Hook bên trong các hàm JavaScript/TypeScript bình thường, trong file `.ts` tiện ích, hay trong các thư viện bên ngoài.

Nếu bạn cố tình gọi Hook trong một file hàm thông thường, React sẽ văng lỗi ngay lập tức:
`Error: Invalid hook call. Hooks can only be called inside of the body of a function component.`

---

### 7.2 Tình huống thực tế: File gọi API (`apiClient.ts`)

Tưởng tượng app của bạn có một file riêng chuyên dùng để gọi API (ví dụ dùng `axios` hoặc `fetch` wrapper):

#### ❌ Nếu bạn dùng Context API:

```typescript
// File: src/services/apiClient.ts (File tiện ích thông thường, KHÔNG PHẢI Component)
import { useAuth } from '@/contexts/AuthContext'; // Hook của Context

export async function fetchUserOrders() {
  // 💥 LỖI NGAY LẬP TỨC! 
  // File này là hàm JS bình thường, không phải Component, không render JSX.
  // React sẽ crash app vì vi phạm Rules of Hooks!
  const { token } = useAuth(); 

  const response = await fetch('https://api.example.com/orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}
```

👉 **Hậu quả với Context:** Để file `apiClient.ts` có token, bạn buộc phải sửa hàm thành: `fetchUserOrders(token: string)`. Sau đó, ở mọi component gọi hàm này, bạn phải dùng Hook lấy token ra rồi **truyền vào từng hàm một cách thủ công**. Rất cồng kềnh và dễ sót!

---

#### ✅ Với Zustand — Giải quyết triệt để:

Zustand được thiết kế là một **JavaScript Store độc lập**, không bị trói buộc vào vòng đời render của React. Bản thân store của Zustand có đính kèm sẵn các hàm thao tác trực tiếp:
- `useStore.getState()`: Đọc dữ liệu state bất kỳ lúc nào, ở bất kỳ đâu mà không cần Component.
- `useStore.setState()`: Cập nhật state từ bất kỳ đâu.

```typescript
// File: src/services/apiClient.ts (File thông thường)
import { useAuthStore } from '@/stores/useAuthStore'; // Store của Zustand

export async function fetchUserOrders() {
  // ✅ HOÀN TOÀN HỢP LỆ! 
  // getState() là hàm JavaScript thuần, không phải Hook!
  // Đọc trực tiếp token từ Store mà không cần Component hay Hook!
  const token = useAuthStore.getState().token; 

  const response = await fetch('https://api.example.com/orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Nếu token hết hạn (mã 401 Unauthorized)
  if (response.status === 401) {
    // ✅ Gọi action logout trực tiếp ngay tại đây để đăng xuất user và dọn dẹp state!
    useAuthStore.getState().logout();
  }

  return response.json();
}
```

---

### 7.3 Những nơi khác ngoài Component cần dùng Store:

Ngoài các file gọi API, còn rất nhiều tình huống trong app mobile thực tế cần can thiệp State mà không nằm trong Component:

1. **Push Notification (Thông báo đẩy ngầm):**
   - Khi app đang chạy ngầm hoặc nhận thông báo từ Firebase/OneSignal qua file `notificationService.ts`.
   - Cần cập nhật số thông báo chưa đọc vào store:
     ```ts
     useNotificationStore.getState().incrementBadge();
     ```
2. **WebSocket / Socket.IO (Tin nhắn thời gian thực):**
   - File kết nối Socket riêng (`socketClient.ts`) lắng nghe sự kiện `"new_message"`.
   - Nhận tin nhắn mới là đẩy thẳng vào Store tin nhắn luôn:
     ```ts
     socket.on("new_message", (msg) => {
       useChatStore.getState().addMessage(msg);
     });
     ```
3. **Cấu hình Interceptor Axios (Gắn Token tự động):**
   - File cấu hình axios tự động chèn Token vào header của **tất cả** request mà không cần truyền thủ công ở từng màn hình.

---

### 📌 Bảng so sánh bản chất:

| Tiêu chí | Context API | Zustand |
| :--- | :--- | :--- |
| **Bản chất** | Phụ thuộc vào React Tree & JSX (`<Provider>`) | Là JavaScript Object độc lập, có cầu nối với React |
| **Đọc/Ghi ngoài Component** | ❌ **Không thể** (Bị chặn bởi Rules of Hooks) | ✅ **Cực kỳ dễ** thông qua `.getState()` và `.setState()` |

---

## Phần 8: Tổ Chức Stores Trong Dự Án Lớn

```
src/
├── stores/
│   ├── useAuthStore.ts        ← Đăng nhập, token, user profile
│   ├── useCartStore.ts        ← Giỏ hàng
│   ├── useAppStores.ts        ← Các store nhỏ (counter, theme, settings)
│   └── useNotificationStore.ts ← Thông báo, badge count
```

> 💡 **Quy tắc đặt tên:**
> - Mỗi store 1 file riêng (tách theo chức năng)
> - Tên file: `use<Tên>Store.ts` (bắt đầu bằng "use" theo quy tắc hook)
> - Export: `export const use<Tên>Store = create<Type>()(...)` 

---

## Phần 9: So Sánh Tổng Kết

| Tiêu chí | Context API | Zustand | Redux Toolkit |
|:---|:---|:---|:---|
| **Cài đặt** | Không cần | `npm i zustand` | `npm i @reduxjs/toolkit react-redux` |
| **Boilerplate** | ~100 dòng | **~30 dòng** | ~150 dòng |
| **Provider** | ✅ Bắt buộc | ❌ Không cần | ✅ Bắt buộc |
| **Re-render** | ⚠️ Toàn bộ consumer | ✅ Chỉ subscriber | ✅ Chỉ subscriber |
| **Persist** | Tự viết | ✅ Built-in | redux-persist |
| **Ngoài component** | ❌ | ✅ getState/setState | ✅ store.dispatch |
| **Async actions** | Tự viết | ✅ Viết thẳng trong store | createAsyncThunk |
| **DevTools** | ❌ | ✅ | ✅ |
| **Phù hợp** | App nhỏ | **App nhỏ → lớn** | App rất lớn, team đông |

---

## Phần 10: Thực Hành Trên Dự Án

### Các file đã tạo:

| File | Vai trò |
|:---|:---|
| [useCartStore.ts](file:///Users/vovantu/HTML_CSS/ReactNative/Bai1_HelloReactNative/src/stores/useCartStore.ts) | **Zustand Cart Store** — Giỏ hàng với Persist (comment chi tiết) |
| [useAppStores.ts](file:///Users/vovantu/HTML_CSS/ReactNative/Bai1_HelloReactNative/src/stores/useAppStores.ts) | **Counter + Theme Store** — Ví dụ đơn giản nhất |
| [bai8-zustand.tsx](file:///Users/vovantu/HTML_CSS/ReactNative/Bai1_HelloReactNative/src/app/bai8-zustand.tsx) | **Demo screen** — 5 section: Counter, Theme, Shop, Cart, Knowledge |

### Giao diện demo:

| Section | Nội dung | Điểm đáng chú ý |
|:---|:---|:---|
| 🔢 **Counter** | Bộ đếm +/−/+5/Reset | Hộp so sánh cú pháp Context vs Zustand |
| 🎨 **Theme** | Toggle Light/Dark mode | **Toàn bộ màn hình đổi màu** — không cần Provider! |
| 🛍️ **Shop** | 4 sản phẩm Samsung | Thêm vào giỏ Zustand (khác giỏ Context ở Bài 7) |
| 🛒 **Cart** | Giỏ hàng tương tác | **💾 Persist**: Tắt app mở lại vẫn còn! |
| 📖 **Kiến thức** | 3 InfoBox | So sánh, Persist, Selector |

---

## 🔥 Chuyên Mục Hỏi-Đáp: Hiểu Sâu Zustand

### ❓ Câu 1: Zustand chạy trên RAM, vậy nó ép các component re-render bằng cách nào?

Nếu Zustand chỉ là một JavaScript Object nằm trên RAM bình thường (bên ngoài cây React), thì làm sao nó "báo" cho React biết để vẽ lại UI khi state thay đổi?

Bí mật nằm ở **2 cơ chế kết hợp**:
1. Mô hình **Observer (Publisher - Subscriber / Người phát - Người đăng ký)**
2. Hook ngầm bên trong của React: **`useSyncExternalStore`** (ở React 18+) hoặc `useState`/`forceUpdate` ngầm.

#### 1.1 Code mô phỏng cách Zustand hoạt động (chỉ 15 dòng):

```typescript
// 1. Bên trong Zustand: Thực chất chỉ là 1 Object và 1 danh sách Set
let state = { count: 0 };
const listeners = new Set<() => void>(); // Danh sách các component đang lắng nghe

// Hàm thay đổi state
export const set = (newState) => {
  state = { ...state, ...newState };
  // 🔔 QUAN TRỌNG: Duyệt qua tất cả component đang nghe và gọi chúng!
  listeners.forEach((listener) => listener());
};

// 2. Bên trong Component khi bạn gọi useStore():
export function useStore(selector) {
  // 🪄 BÍ MẬT Ở ĐÂY: Tạo một useState ngầm để ép Component re-render!
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Component đăng ký "Khi nào state đổi thì gọi tôi!"
    const listener = () => {
      // Khi state đổi -> setState ngầm này chạy -> Component BỊ ÉP RE-RENDER!
      forceUpdate({});
    };

    listeners.add(listener);
    // Hủy đăng ký khi Component unmount (bị hủy)
    return () => listeners.delete(listener);
  }, []);

  return selector(state);
}
```

#### 1.2 Hiện đại hơn: Hook chính chủ `useSyncExternalStore` (React 18+)

Ở các phiên bản React mới (React 18+), Facebook tạo ra Hook chính thức dành riêng cho các thư viện State bên ngoài mang tên: **`useSyncExternalStore`**.

```
[ Zustand Store (JS Object ngoài RAM) ]
          │ 
          │ (1. Bạn gọi set() thay đổi dữ liệu)
          ▼
[ Zustand thông báo qua Listener ]
          │
          │ (2. Báo hiệu cho useSyncExternalStore)
          ▼
[ useSyncExternalStore (Hook của React 18) ]
          │
          │ (3. So sánh: selector(stateCũ) !== selector(stateMới) ?)
          ▼
       ĐÚNG: Ép đúng Component này Re-render!
       SAI : Bỏ qua, không làm gì cả!
```

#### 1.3 So sánh hình tượng: Context API vs Zustand

| Tiêu chí | Context API (`useReducer` / `useState`) | Zustand (`useSyncExternalStore`) |
| :--- | :--- | :--- |
| **Hình tượng** | 📢 **Phát loa phát thanh toàn trường** | 📞 **Gọi điện thoại trực tiếp đến từng người** |
| **Cách kích hoạt** | Cập nhật state component cha `<Provider>` $\rightarrow$ React duyệt từ trên xuống dưới cây JSX. | Kích hoạt trực tiếp hook của component đó $\rightarrow$ Bỏ qua toàn bộ cây JSX. |
| **Cơ chế so sánh** | So sánh toàn bộ object `value={{ ... }}` của Provider. | So sánh thông qua **Selector** (`s => s.count`). |
| **Hiệu ứng phụ** | Nếu Provider đổi $\rightarrow$ Mọi component con dùng context đều re-render. | Chỉ component nào có giá trị selector bị thay đổi mới re-render. |

---

### ❓ Câu 2: Lúc trước dùng ContextAPI + reducer, bây giờ dùng Zustand + reducer hay chỉ cần Zustand?

👉 **99% trường hợp CHỈ CẦN MỘT MÌNH ZUSTAND LÀ ĐỦ!**

Bạn hoàn toàn có thể **vứt bỏ** `reducer`, `dispatch`, `action types` và các câu lệnh `switch/case` dài dòng phức tạp!

#### 2.1 Tại sao ngày trước phải dùng "Context API + useReducer"?
* Bản thân Context API chỉ là một "cái ống dẫn" (chỉ làm nhiệm vụ truyền data để tránh Prop Drilling), nó **không có sẵn** cơ chế xử lý logic tính toán.
* Vì vậy phải mượn thêm `useReducer` để xử lý thêm/bớt/sửa... rồi mới nhét kết quả vào Context.

#### 2.2 Còn Zustand thì sao?
Zustand là giải pháp **"All-in-one"**. Nó vừa là kho dữ liệu (State), vừa chứa luôn các hàm xử lý dữ liệu (Actions) ngay bên trong:

```
┌────────────────────────────────────────────────────────┐
│ 📦 ZUSTAND STORE                                       │
│                                                        │
│  [ DỮ LIỆU (State) ]                                   │
│  • items: []                                           │
│  • total: 0                                            │
│                                                        │
│  [ HÀM XỬ LÝ (Actions) - Viết thẳng vào đây ]          │
│  • addItem: () => set(...)   <-- Thay thế Reducer      │
│  • removeItem: () => set(...)<-- Thay thế Reducer      │
│  • clearCart: () => set(...) <-- Thay thế Reducer      │
└────────────────────────────────────────────────────────┘
```

#### 2.3 So sánh khi muốn "Thêm sản phẩm":
* ❌ **Context + useReducer (3 bước):** Tạo action type $\rightarrow$ Viết reducer với `switch/case` $\rightarrow$ Component gọi `dispatch({ type: 'ADD_ITEM', payload })`.
* ✅ **Zustand (1 bước duy nhất):** Store viết hàm `addItem: (item) => set(...)` $\rightarrow$ Component gọi thẳng `addItem(item)`.

| | Mô hình cũ | Mô hình hiện đại |
| :--- | :--- | :--- |
| **Công cụ** | Context API + `useReducer` | **Chỉ cần Zustand** |
| **Cách thay đổi state** | Gửi qua `dispatch({ type: ... })` $\rightarrow$ `switch(action.type)` | Gọi thẳng action function: `addItem(item)` |
| **Số lượng code** | Nhiều file, dài dòng | Gọn gàng trong 1 file duy nhất |

---

### ❓ Câu 3: Cú pháp `(state) => state.count` là Arrow Function hay `state` do Zustand cung cấp?

👉 **CẢ HAI ĐỀU ĐÚNG VÀ KẾT HỢP VỚI NHAU!**

1. `(state) => state.count` **CHÍNH LÀ một hàm Arrow Function** do bạn viết ra.
2. Tham số `state` bên trong hàm đó **LẠI DO ZUSTAND TỰ ĐỘNG CUNG CẤP (truyền vào)** khi nó thực thi hàm của bạn!

Tương tự như hàm `map()` trong JavaScript:
```javascript
const numbers = [1, 2, 3];
const doubles = numbers.map((item) => item * 2);
```
- `(item) => item * 2` là Arrow Function do bạn viết.
- Nhưng biến `item` là do JavaScript tự động lấy từng phần tử trong mảng truyền vào cho bạn!

#### Viết kiểu function truyền thống để thấy rõ bản chất:

```typescript
// 1. Bạn tự viết một hàm "Chọn dữ liệu" (Selector Function):
function chonCount(state) {
  return state.count; // Tôi chỉ muốn lấy biến count!
}

// 2. Bạn đưa hàm này cho Zustand chạy:
const count = useCounterStore(chonCount);
```

Bên trong Zustand:
```javascript
// Mã giả bên trong Zustand:
function useCounterStore(hamBanTruyenVao) {
  const toanBoStateTrongKho = { count: 5, increment: () => {} };
  return hamBanTruyenVao(toanBoStateTrongKho); // Zustand gọi hàm của BẠN!
}
```

> 💡 **Tên tham số không bắt buộc là `state`:** Bạn có thể đặt tên là `s`, `store`, hay bất kỳ chữ nào (`useCounterStore((s) => s.count)`).

---

### ❓ Câu 4: Persist dùng để giữ data khi tắt app? Không có persist thì state bị reset?

👉 **CHÍNH XÁC 100%!**

* **Khi KHÔNG có persist (State thông thường):**
  * Dữ liệu state nằm hoàn toàn trên **bộ nhớ RAM** của điện thoại.
  * Khi người dùng vuốt tắt ứng dụng (Kill App / Close Process), hệ điều hành (Android / iOS) sẽ **thu hồi toàn bộ RAM** của ứng dụng đó.
  * Lần tới mở lại app, toàn bộ code JavaScript được thực thi lại từ đầu $\rightarrow$ State được khởi tạo lại về `initialState` ban đầu (giỏ hàng về rỗng, biến đếm về 0).
* **Khi CÓ persist:**
  * Dữ liệu state được tự động ghi thêm một bản xuống **ổ cứng / bộ nhớ flash của điện thoại** (thông qua `AsyncStorage` hoặc `MMKV`).
  * Dù bạn tắt app hay khởi động lại điện thoại, data vẫn nằm an toàn trên ổ cứng.
  * Mở app lại $\rightarrow$ Zustand tự động lấy data từ ổ cứng nạp ngược lại vào RAM.

---

### ❓ Câu 5: Cơ chế hoạt động của Persist như thế nào?

Cơ chế của Persist thực chất là **đồng bộ 2 chiều giữa RAM (Zustand Store) và Ổ cứng (AsyncStorage/MMKV)**:

```
┌─────────────────────────────────────────────────────────────┐
│ 📱 ĐIỆN THOẠI                                                │
│                                                             │
│  [ BỘ NHỚ RAM - Tốc độ cực nhanh ]                          │
│   useCartStore: { items: ['iPhone'], total: 34tr }          │
│        │                               ▲                    │
│        │ 1. Khi gọi set()              │ 3. Khi mở app lại  │
│        │    Tự động ghi ngầm           │    Tự đọc khôi phục│
│        ▼                               │    (Rehydrate)     │
│  [ BỘ NHỚ Ổ CỨNG (Disk Storage) - Không mất khi tắt app ]    │
│   AsyncStorage: "cart-storage" -> '{"items":[{"id":"1"...}]}'│
└─────────────────────────────────────────────────────────────┘
```

#### Chi tiết 3 bước của Persist:
1. **Lưu trữ ở đâu trên máy?**
   * Trong React Native, bạn dùng `AsyncStorage` (hoặc thư viện hiệu năng cao `react-native-mmkv`).
   * Dưới tầng Native:
     * Trên **Android**: Nó lưu vào một file cơ sở dữ liệu **SQLite** hoặc file XML (`SharedPreferences`) trong sandbox riêng của app.
     * Trên **iOS**: Nó lưu vào file hoặc hệ thống **UserDefaults**.
2. **Khi đang dùng app (Ghi state):**
   * Bạn gọi `addItem(...)` $\rightarrow$ State trên **RAM** cập nhật ngay tức khắc (UI mượt mà, không giật lag).
   * Cùng lúc đó, Persist middleware chạy ngầm: chuyển object state thành chuỗi text (`JSON.stringify`) và lưu vào AsyncStorage ở ổ cứng (`AsyncStorage.setItem`).
3. **Khi mở lại app (Khôi phục state - Rehydrate):**
   * Zustand đọc chuỗi text từ ổ cứng lên $\rightarrow$ giải mã lại thành object (`JSON.parse`) $\rightarrow$ nạp ngược lại vào Store trên RAM. Quá trình này gọi là **Rehydration**.

---

### ❓ Câu 6: Zustand là JavaScript Object độc lập thì có CHẬM HƠN Context API không?

👉 **KHÔNG HỀ CHẬM HƠN! Ngược lại: Zustand NHANH HƠN Context API rất nhiều!**

Nhiều người lầm tưởng "Context API là hàng tích hợp sẵn của React nên sẽ nhanh hơn", nhưng thực tế hoàn toàn ngược lại:

#### 1. Cả 2 đều nằm trên RAM (Tốc độ đọc Object là như nhau)
Dù là Context hay Zustand, khi app đang chạy, tất cả biến JavaScript đều nằm trên RAM của JavaScript Engine (Hermes Engine trong React Native). Tốc độ truy xuất thuộc tính của một object là **nano-giây (nhanh ngang nhau)**.

#### 2. Điểm khác biệt chí mạng: "Chi phí Re-render"
* **Context API (Chậm vì Re-render dư thừa):**
  * Context API gắn chặt vào cây giao diện (Virtual DOM Tree) của React thông qua `<Provider>`.
  * Khi State trong Context đổi $\rightarrow$ React phải **duyệt qua cây Component** để tìm các component đang tiêu thụ Context.
  * **Hậu quả:** Kéo theo hàng loạt component con bị re-render dù chúng không cần data đó (như ta đã phân tích ở Bài 7).
* **Zustand (Nhanh vượt trội nhờ mô hình Pub/Sub):**
  * Zustand áp dụng mô hình **Publisher - Subscriber (Người phát - Người đăng ký)**.
  * Zustand Store là một object JavaScript độc lập, nó giữ một danh sách các "hàm lắng nghe" (listeners).
  * Khi bạn dùng Selector: `const count = useStore(s => s.count)` $\rightarrow$ Chỉ có Component này đăng ký lắng nghe thuộc tính `count`.
  * Khi `count` đổi $\rightarrow$ Zustand chỉ gọi đúng hàm cập nhật của Component đó. Các component khác **hoàn toàn không tốn 1 chu kỳ CPU nào** của React!

#### 📌 Bảng so sánh tổng kết:

| Tiêu chí | Context API | Zustand |
| :--- | :--- | :--- |
| **Lưu trữ khi tắt app** | Tự code thủ công với `useEffect` + `AsyncStorage` | ✅ Tích hợp sẵn qua middleware `persist` |
| **Nơi lưu mặc định** | RAM | RAM (và ổ cứng nếu bật `persist`) |
| **Tốc độ đọc dữ liệu** | Rất nhanh (trên RAM) | Rất nhanh (trên RAM) |
| **Hiệu năng Render UI** | ⚠️ Dễ giật lag ở app lớn do re-render dây chuyền | 🚀 **Rất cao** nhờ Selector chỉ re-render đúng nơi cần |

---

## 📝 Bài Tập Tự Làm

### BT1: Chạy và so sánh
- Mở Bài 8, test Counter, Theme toggle, và Giỏ hàng
- Thêm sản phẩm → tắt app → mở lại → Giỏ hàng vẫn còn!
- So sánh với Bài 7: cùng tính năng, Zustand code ít hơn bao nhiêu?

### BT2: Đọc hiểu Store
- Mở [useCartStore.ts](file:///Users/vovantu/HTML_CSS/ReactNative/Bai1_HelloReactNative/src/stores/useCartStore.ts): Đọc comment so sánh với Context
- Theo dõi luồng: `addItem()` → `set()` → state mới → UI cập nhật
- Trả lời: *Zustand có cần switch/case (reducer) không? Tại sao?*

### BT3: Thử selector
- Trong `bai8-zustand.tsx`, thử đổi từ selector:
  ```tsx
  const count = useCounterStore((s) => s.count);
  ```
  thành lấy toàn bộ store:
  ```tsx
  const { count } = useCounterStore();
  ```
- Quan sát: Có sự khác biệt nào khi theme đổi? (console.log để kiểm tra re-render)

---

> **Bài tiếp theo:** Bài 9 — Networking: Gọi API & Xử Lý Dữ Liệu
>
> *Khi hoàn thành, hãy báo cho tôi để tiếp tục!* 🚀
