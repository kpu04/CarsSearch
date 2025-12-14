import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cars: []
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuData(state, action) {
      state.cars = action.payload; // массив машин
    }
  }
});

export const { setMenuData } = menuSlice.actions;
export const selectMenuData = (state) => state.menu.cars;
export default menuSlice.reducer;
