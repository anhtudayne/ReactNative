// ====================================================================
// 📘 BÀI 8: Zustand Store — Bộ đếm + Cài đặt Theme
// Ví dụ đơn giản nhất để so sánh Context vs Zustand
// ====================================================================
import { create } from "zustand";

// ─── COUNTER STORE ──────────────────────────────────────────────────
// So sánh: Bài 7 cần ~30 dòng (createContext, Provider, useReducer, types)
// Zustand: Chỉ cần ~10 dòng!

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  incrementBy: (amount: number) => void;
}

export const useCounterStore = create<CounterStore>((set) => ({
  // 🆕 CÚ PHÁP ĐƠN GIẢN NHẤT: create<Type>((set) => ({ ... }))
  // → Không cần persist → không cần cú pháp create<Type>()() (2 dấu ())
  // → Chỉ cần (set) vì không đọc state hiện tại bằng get()

  count: 0,

  increment: () => set((state) => ({ count: state.count + 1 })),
  // 🆕 CÚ PHÁP: set((state) => ({ partialState }))
  // → state = state hiện tại
  // → Trả về object chứa PHẦN state muốn thay đổi
  // → Zustand TỰ ĐỘNG merge với state cũ

  decrement: () => set((state) => ({ count: state.count - 1 })),

  reset: () => set({ count: 0 }),
  // 🆕 CÚ PHÁP: set({ key: value }) — Không cần callback nếu không đọc state cũ

  incrementBy: (amount) => set((state) => ({ count: state.count + amount })),
  // → Hàm có tham số: nhận amount từ bên ngoài
}));

// ─── THEME STORE ────────────────────────────────────────────────────

type ThemeMode = "light" | "dark";

interface ThemeColors {
  background: string;
  text: string;
  card: string;
  primary: string;
  border: string;
}

const THEMES: Record<ThemeMode, ThemeColors> = {
  light: {
    background: "#f5f5f5",
    text: "#2c3e50",
    card: "#ffffff",
    primary: "#8e44ad",
    border: "#e0e0e0",
  },
  dark: {
    background: "#1a1a2e",
    text: "#eaeaea",
    card: "#16213e",
    primary: "#e94560",
    border: "#2a2a4a",
  },
};

interface ThemeStore {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: "light",
  colors: THEMES.light,

  toggleTheme: () =>
    set((state) => {
      const newMode = state.mode === "light" ? "dark" : "light";
      return { mode: newMode, colors: THEMES[newMode] };
    }),
}));
