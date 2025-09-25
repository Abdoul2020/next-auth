import { configureStore, createSlice } from "@reduxjs/toolkit";

type CartItem = {
  id: string | number;
  title: string;
  price: number;
  qty: number;
};

// create a cart slice for the redux store using redux toolkit

const cartSlice = createSlice({
  name: "cart",
  initialState: [] as CartItem[],
  reducers: {
    addItem(state, action) {
      const { id, title, price } = action.payload as {
        id: CartItem["id"]; title: string; price: number;
      };
      const existing = state.find((i) => i.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.push({ id, title, price, qty: 1 });
      }
    },
    updateQty(state, action) {
      const { id, qty } = action.payload as { id: CartItem["id"]; qty: number };
      const item = state.find((i) => i.id === id);
      if (item) {
        item.qty = qty;
      }
    },
    decrementQty(state, action) {
      const id = action.payload as CartItem["id"]; 
      const index = state.findIndex((i) => i.id === id);
      if (index === -1) return state;
      const item = state[index];
      if (item.qty <= 1) {
        return state.filter((i) => i.id !== id);
      }
      item.qty -= 1;
      return state;
    },
    removeItem(state, action) {
      const id = action.payload as CartItem["id"];
      return state.filter((i) => i.id !== id);
    },
    setCart(state, action) {
      return action.payload as CartItem[];
    },
  },
});

// action for the cart slice
export const { addItem, updateQty, decrementQty, removeItem, setCart } = cartSlice.actions;

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
