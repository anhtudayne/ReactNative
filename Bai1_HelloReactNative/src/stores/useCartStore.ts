// ====================================================================
// 📘 BÀI 8: Zustand Store — Giỏ Hàng (Thay thế Context API)
// ====================================================================
//
// 🆕 SO SÁNH VỚI BÀI 7 (Context + useReducer):
//
// | Bài 7 (Context API)              | Bài 8 (Zustand)                 |
// |----------------------------------|----------------------------------|
// | 1. Tạo Types                     | 1. Tạo Types                     |
// | 2. Viết reducer function         | ❌ KHÔNG CẦN reducer            |
// | 3. createContext()               | ❌ KHÔNG CẦN context            |
// | 4. Viết Custom Hook              | ❌ Zustand TỰ tạo hook          |
// | 5. Viết Provider component       | ❌ KHÔNG CẦN Provider           |
// | 6. Bọc <Provider> trong layout   | ❌ KHÔNG CẦN bọc gì cả         |
// | → ~100 dòng code                 | → ~40 dòng code                 |
//
// ====================================================================

import { create } from "zustand";
// 🆕 CÚ PHÁP: import { create } from 'zustand'
// → `create` là hàm DUY NHẤT cần import từ Zustand
// → Nó tạo ra 1 "store" (kho dữ liệu) + 1 hook để truy cập store đó

import { persist, createJSONStorage } from "zustand/middleware";
// 🆕 CÚ PHÁP: Middleware — plugin mở rộng tính năng cho store
// → `persist` = tự động lưu state vào bộ nhớ (AsyncStorage)
//   để khi tắt app và mở lại, state vẫn còn!
// → `createJSONStorage` = adapter chuyển đổi storage thành dạng Zustand hiểu

import AsyncStorage from "@react-native-async-storage/async-storage";
// → Thư viện lưu trữ key-value của React Native (tương tự localStorage trên web)

// ─── 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU ──────────────────────────────────

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// 🆕 KHÁC BIỆT LỚN NHẤT VỚI CONTEXT:
// Trong Zustand, STATE và ACTIONS nằm CHUNG trong 1 interface!
// (Context tách ra: CartState chứa data, CartAction chứa action types)
interface CartStore {
  // === STATE (Dữ liệu) ===
  items: CartItem[];
  totalItems: number;
  totalPrice: number;

  // === ACTIONS (Hàm thay đổi state) ===
  // 🆕 CÚ PHÁP: Khai báo hàm ngay trong interface
  // → Zustand KHÔNG cần dispatch, KHÔNG cần reducer
  // → Gọi thẳng: addItem(product), removeItem(id)
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;

  // 🆕 ZUSTAND BONUS: "Computed values" — Hàm tính toán từ state
  // (Context không có sẵn, phải tự viết trong component)
  getItemQuantity: (id: string) => number;
}

// ─── 2. HELPER: Tính tổng ───────────────────────────────────────────

function calculateTotals(items: CartItem[]) {
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
  };
}

// ─── 3. TẠO STORE ───────────────────────────────────────────────────
//
// 🆕 CÚ PHÁP: create<StoreType>()((set, get) => ({ ...initialState, ...actions }))
//
// Giải thích từng phần:
//   create<CartStore>()   → Tạo store với kiểu CartStore
//   (set, get) => ({})    → Callback nhận 2 tham số:
//     • set: Hàm CẬP NHẬT state (tương tự setState, nhưng mạnh hơn)
//     • get: Hàm ĐỌC state hiện tại (tương tự useRef, không gây re-render)
//
// 🆕 KHÁC BIỆT VỚI CONTEXT + useReducer:
//   Context: dispatch({ type: 'ADD_ITEM', payload }) → reducer xử lý
//   Zustand: set({ items: newItems }) → CẬP NHẬT TRỰC TIẾP, không cần switch/case!
//
// ─────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>()(
  persist(
    // 🆕 CÚ PHÁP: persist(storeConfig, persistConfig)
    // → Bọc store bằng middleware persist để tự động lưu/khôi phục state

    (set, get) => ({
      // ═══ INITIAL STATE ═══
      items: [],
      totalItems: 0,
      totalPrice: 0,

      // ═══ ACTIONS ═══

      // ─── Thêm sản phẩm ───
      addItem: (product) => {
        // 🆕 CÚ PHÁP: set((state) => ({ ...newState }))
        // → set nhận callback với state hiện tại
        // → Trả về PHẦN state muốn thay đổi (partial update)
        // → Zustand TỰ ĐỘNG merge với state cũ (không cần ...state)!
        set((state) => {
          const existing = state.items.find(
            (item) => item.id === product.id
          );

          const newItems = existing
            ? state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [...state.items, { ...product, quantity: 1 }];

          return {
            items: newItems,
            ...calculateTotals(newItems),
          };
          // 🆕 KHÁC BIỆT: Zustand tự merge!
          // Chỉ cần return { items, totalItems, totalPrice }
          // Zustand tự giữ nguyên các field khác (addItem, removeItem, v.v.)
          // Context phải viết: return { ...state, items: newItems }
        });
      },

      // ─── Xoá sản phẩm ───
      removeItem: (id) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          return { items: newItems, ...calculateTotals(newItems) };
        });
      },

      // ─── Tăng số lượng ───
      incrementItem: (id) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          return { items: newItems, ...calculateTotals(newItems) };
        });
      },

      // ─── Giảm số lượng (xoá nếu = 0) ───
      decrementItem: (id) => {
        set((state) => {
          const newItems = state.items
            .map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0);
          return { items: newItems, ...calculateTotals(newItems) };
        });
      },

      // ─── Xoá toàn bộ giỏ ───
      clearCart: () => {
        // 🆕 CÚ PHÁP: set({}) — Không cần callback nếu không đọc state cũ
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },

      // ─── Computed value: Lấy số lượng 1 sản phẩm ───
      getItemQuantity: (id) => {
        // 🆕 CÚ PHÁP: get() — Đọc state hiện tại KHÔNG gây re-render
        // Khác với set(): set cập nhật state, get() chỉ đọc
        const item = get().items.find((i) => i.id === id);
        return item?.quantity ?? 0;
        // 🆕 CÚ PHÁP: ?? (Nullish Coalescing)
        // → Nếu item?.quantity là null hoặc undefined → trả về 0
        // → Khác với ||: 0 || 5 = 5 (sai!), 0 ?? 5 = 0 (đúng!)
      },
    }),

    // ═══ PERSIST CONFIG ═══
    {
      name: "cart-storage",
      // 🆕 CÚ PHÁP: name = key lưu trong AsyncStorage
      // → Khi tắt app, state được lưu vào AsyncStorage với key này
      // → Khi mở lại app, Zustand tự đọc và khôi phục state

      storage: createJSONStorage(() => AsyncStorage),
      // 🆕 CÚ PHÁP: Adapter cho React Native
      // → Web dùng localStorage, React Native dùng AsyncStorage

      partialize: (state) => ({
        // 🆕 CÚ PHÁP: Chỉ lưu NHỮNG FIELD CẦN THIẾT
        // → Không lưu hàm (addItem, removeItem...) vì không serialize được
        // → Không lưu totalItems/totalPrice vì tính lại được từ items
        items: state.items,
      }),
      // 💡 Khi app mở lại:
      // 1. Zustand đọc items từ AsyncStorage
      // 2. Merge vào store → items được khôi phục
      // 3. Nhưng totalItems/totalPrice = 0 (vì không được persist)
      // → Cần tính lại! (xem onRehydrateStorage bên dưới)

      onRehydrateStorage: () => {
        // 🆕 CÚ PHÁP: Callback chạy SAU KHI đọc xong data từ storage
        return (state) => {
          if (state && state.items.length > 0) {
            // Tính lại totalItems và totalPrice từ items đã khôi phục
            const totals = calculateTotals(state.items);
            // 🆕 CÚ PHÁP: Gọi set trực tiếp qua useCartStore.setState()
            // (vì ở đây nằm ngoài component, không có set từ closure)
            useCartStore.setState(totals);
          }
        };
      },
    }
  )
);
