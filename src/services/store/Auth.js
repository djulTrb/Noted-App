import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  image: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.image = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    removeImage: (state) => {
      state.image = null;
    },
  },
});

export const { logout, setCredentials, setImage, removeImage } =
  authSlice.actions;
export default authSlice.reducer;
