import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: JSON.parse(localStorage.getItem("isDarkMode")),
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState: initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { toggleDarkMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;
