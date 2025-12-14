import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Store/authStore";
import cartReducer from "./Store/cartStore";
import menuReducer from "./Store/menuStore";
import { loadFromLocalStorage, cartMiddleware } from "./middleware";
const preloadedState = loadFromLocalStorage();
const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    menu: menuReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartMiddleware), 
  preloadedState,
});

export default store;
