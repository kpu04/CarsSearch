import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: "",
    password: "",
    userId: null,
    role: "",
  },
  reducers: {
    setCredentials: (state, action) => {
      const { email, password, userId, role, token } = action.payload;
      state.email = email;
      state.password = password;
      state.userId = userId;
      state.role = role;
    },

    clearCredentials: (state) => {
      state.email = "";
      state.password = "";
      state.userId = null;
      state.role = "";
    },
  },
});

export const selectEmail = (state) => state.auth.email;
export const selectUserId = (state) => state.auth.userId;
export const selectUserRole = (state) => state.auth.role;

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
