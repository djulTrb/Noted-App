import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  themeColor: localStorage.getItem("themeColor") || "orange",
};

const paramSlice = createSlice({
  name: "param",
  initialState: initialState,
  reducers: {
    setMainColor: (state, action) => {
      state.themeColor = action.payload;
    },
  },
});

export const { setMainColor } = paramSlice.actions;

export default paramSlice.reducer;
