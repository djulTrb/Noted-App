import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { FaSun, FaMoon } from "react-icons/fa6";

import { toggleDarkMode } from "../services/store/darkMode";

const DarkModeToggleBtn = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.darkMode);

  const toggleDark = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <button
      aria-label="toggle dark mode"
      className={`${
        isDarkMode
          ? "drop-shadow-[0px_0px_5px_rgb(255,255,255,0.5)]"
          : "drop-shadow-[0px_2px_5px_rgb(0,0,0,0.2)]"
      } focus:outline-none hidden md_to_lg:block`}
      onClick={toggleDark}
    >
      <span className="sr-only">
        {isDarkMode
          ? "sun icon to toggle light mode"
          : "moon icon to toggle dark mode"}
      </span>
      {isDarkMode ? (
        <FaSun
          aria-hidden="true"
          className="text-xl text-amber-500 drop-shadow-cus"
        />
      ) : (
        <FaMoon
          aria-hidden="true"
          className="text-xl text-slate-800 drop-shadow-cus"
        />
      )}
    </button>
  );
};

export default DarkModeToggleBtn;
