import { createSlice } from "@reduxjs/toolkit";

const cartStore = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addItemToCart: (state, action) => {
      const { id, name, description, price, quantity, photo } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ id, name, description, price, quantity, photo });
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCartFromDB: (state, action) => {
      state.items = action.payload;
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }      
      
    },
    deleteFromCart: (state, action) => {
      const itemId = action.payload; 
      const index = state.items.findIndex((item) => item.id === itemId); 

      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
  },
});

export const {
  addItemToCart,
  clearCart,
  setCartFromDB,
  increaseQuantity,
  deleteFromCart,
  decreaseQuantity,
} = cartStore.actions;
export const selectCartItems = (state) => state.cart.items;

export default cartStore.reducer;
