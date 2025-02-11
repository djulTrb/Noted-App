import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { FaSun, FaMoon } from "react-icons/fa6";

import { toggleDarkMode } from "../services/store/darkMode";

const DarkModeFormToggleBtn = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.darkMode);

  const toggleDark = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <button
      onClick={toggleDark}
      type="button"
      aria-label="Toggle Dark Mode"
      title="Toggle Dark Mode"
      role="switch"
      className="absolute -top-11 right-5 z-10 focus:outline-none"
    >
      <span className="sr-only">
        {isDarkMode
          ? "sun icon to toggle light mode"
          : "moon icon to toggle dark mode"}
      </span>
      {isDarkMode ? (
        <FaSun
          aria-hidden="true"
          className="text-3xl text-white drop-shadow-cus"
        />
      ) : (
        <FaMoon
          aria-hidden="true"
          className="text-3xl text-slate-800 drop-shadow-cus"
        />
      )}
    </button>
  );
};

export default DarkModeFormToggleBtn;
