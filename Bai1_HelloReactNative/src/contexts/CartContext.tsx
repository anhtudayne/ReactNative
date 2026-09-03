// ====================================================================
// 📘 contexts/CartContext.tsx
// 🆕 PATTERN: Context API + useReducer
// Giỏ hàng toàn cục — Bất kỳ component nào cũng truy cập được,
// KHÔNG CẦN truyền props qua nhiều tầng (Prop Drilling).
// ====================================================================
import { createContext, useContext, useReducer, ReactNode } from "react";

// ─── 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (Types) ─────────────────────────

/** Một sản phẩm trong giỏ hàng */
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number; // Số lượng sản phẩm này trong giỏ
}

/** Trạng thái toàn bộ giỏ hàng */
interface CartState {
  items: CartItem[]; // Danh sách sản phẩm
  totalItems: number; // Tổng số lượng (dùng cho badge)
  totalPrice: number; // Tổng tiền
}

// ─── 2. ĐỊNH NGHĨA CÁC ACTION (Hành động) ─────────────────────────
// 🆕 CÚ PHÁP: Discriminated Union — TypeScript tự biết payload
// của từng action dựa vào giá trị `type`.
//
// Ví dụ: Nếu type === 'ADD_ITEM', TS tự hiểu payload sẽ có dạng
// { id, name, price, image } (không có quantity, vì ta tự thêm = 1).
//
// Omit<CartItem, 'quantity'> nghĩa là: "Lấy CartItem nhưng BỎ field quantity"
// → Khi thêm mới, quantity luôn = 1, không cần truyền vào.
// ────────────────────────────────────────────────────────────────────

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string } // payload = id sản phẩm
  | { type: "INCREMENT"; payload: string } // payload = id sản phẩm
  | { type: "DECREMENT"; payload: string } // payload = id sản phẩm
  | { type: "CLEAR_CART" }; // Không cần payload

// ─── 3. HÀM TÍNH TỔNG (Helper) ────────────────────────────────────
// Tách ra hàm riêng để không lặp code trong reducer.

function calculateTotals(items: CartItem[]) {
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
}

// ─── 4. REDUCER — "Bộ xử lý trung tâm" ────────────────────────────
// 🆕 CÚ PHÁP: Reducer là một hàm THUẦN (Pure Function).
//   Input:  (state hiện tại, action muốn thực hiện)
//   Output: state MỚI (không thay đổi state cũ — Immutable!)
//
// Tại sao dùng Reducer thay vì useState?
// → Khi state có NHIỀU trường liên quan nhau (items, totalItems, totalPrice),
//   và có NHIỀU cách thay đổi (thêm, xoá, tăng, giảm, xoá hết),
//   Reducer giúp gom TẤT CẢ logic cập nhật vào MỘT NƠI DUY NHẤT.
// ────────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    // ─── Thêm sản phẩm vào giỏ ───
    case "ADD_ITEM": {
      // Kiểm tra sản phẩm đã có trong giỏ chưa
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      let newItems: CartItem[];

      if (existingItem) {
        // Đã có → Tăng quantity lên 1
        newItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            // 🆕 CÚ PHÁP: Spread operator { ...item } tạo bản sao,
            // rồi ghi đè field quantity. Đảm bảo IMMUTABLE.
            : item
        );
      } else {
        // Chưa có → Thêm mới với quantity = 1
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      return { items: newItems, ...calculateTotals(newItems) };
    }

    // ─── Xoá sản phẩm khỏi giỏ (xoá hoàn toàn) ───
    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      return { items: newItems, ...calculateTotals(newItems) };
    }

    // ─── Tăng số lượng lên 1 ───
    case "INCREMENT": {
      const newItems = state.items.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return { items: newItems, ...calculateTotals(newItems) };
    }

    // ─── Giảm số lượng đi 1 (nếu = 0 thì xoá luôn) ───
    case "DECREMENT": {
      const newItems = state.items
        .map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0); // Lọc bỏ item có quantity <= 0

      return { items: newItems, ...calculateTotals(newItems) };
    }

    // ─── Xoá toàn bộ giỏ hàng ───
    case "CLEAR_CART":
      return { items: [], totalItems: 0, totalPrice: 0 };

    // ─── Mặc định: Trả về state cũ nếu action không khớp ───
    default:
      return state;
  }
}

// ─── 5. TẠO CONTEXT ─────────────────────────────────────────────────
// 🆕 CÚ PHÁP: createContext<Type | undefined>(undefined)
// → Giá trị mặc định là undefined, nhưng khi dùng sẽ luôn có giá trị
//   nhờ Provider bọc bên ngoài.
// ────────────────────────────────────────────────────────────────────

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  // 🆕 PATTERN: "Action Creators" — Hàm tiện ích bọc dispatch
  // Thay vì component gọi dispatch({ type: 'ADD_ITEM', payload: ... })
  // → Component chỉ cần gọi addItem(product) — gọn hơn, dễ hiểu hơn.
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── 6. CUSTOM HOOK — "Lối tắt" truy cập Context ───────────────────
// 🆕 PATTERN: Luôn tạo Custom Hook thay vì dùng useContext trực tiếp.
// Lý do:
// 1. Tự động kiểm tra lỗi nếu quên bọc Provider.
// 2. Import gọn hơn: useCart() thay vì useContext(CartContext).
// ────────────────────────────────────────────────────────────────────

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCart() phải được dùng bên trong <CartProvider>! " +
        "Hãy kiểm tra xem _layout.tsx đã bọc <CartProvider> chưa."
    );
  }
  return context;
}

// ─── 7. PROVIDER — Component bọc toàn bộ app ───────────────────────
// 🆕 CÚ PHÁP: { children }: { children: ReactNode }
// → Destructure prop `children` với kiểu ReactNode.
// → children chính là toàn bộ cây component con bên trong <CartProvider>.
// ────────────────────────────────────────────────────────────────────

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

export function CartProvider({ children }: { children: ReactNode }) {
  // 🆕 CÚ PHÁP: useReducer(reducerFunction, initialState)
  // → Trả về [state, dispatch]
  // → state: Trạng thái hiện tại
  // → dispatch: Hàm gửi action đến reducer
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Action Creators — bọc dispatch cho dễ gọi
  const addItem = (product: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };
  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };
  const incrementItem = (id: string) => {
    dispatch({ type: "INCREMENT", payload: id });
  };
  const decrementItem = (id: string) => {
    dispatch({ type: "DECREMENT", payload: id });
  };
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        incrementItem,
        decrementItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
