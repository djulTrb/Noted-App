import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { BsQuestionLg } from "react-icons/bs";
import { FaRegStickyNote } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { PiGearSixBold } from "react-icons/pi";
import { GrHomeOption } from "react-icons/gr";
import { FaChevronLeft, FaSun, FaMoon } from "react-icons/fa6";

import classNames from "classnames";

import { toggleDarkMode } from "../services/store/darkMode";
import useOutsideClick from "../hooks/useOutsideClick";

const Drawer = ({ setIsDrawerOpen }) => {
  const { themeColor } = useSelector((state) => state.parameters);
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.darkMode);
  const { token } = useSelector((state) => state.auth);

  const drawerRef = useRef(null);
  const cln = classNames({
    "bg-orange-200 text-orange-600": themeColor === "orange",
    "bg-violet-200  text-violet-600": themeColor === "violet",
    "bg-lime-200  text-lime-600": themeColor === "lime",
    "bg-sky-200  text-sky-600": themeColor === "sky",
    "bg-rose-200  text-rose-600": themeColor === "rose",
  });

  const toggleDark = () => {
    dispatch(toggleDarkMode());
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  useOutsideClick(handleCloseDrawer, drawerRef);
  return (
    <aside
      ref={drawerRef}
      className={`w-52 absolute z-[2000] dark:bg-stone-900 transition-all duration-300  dark:border-stone-950  md:col-start-1 md:row-start-1 md:col-span-1 md:row-span-2 md_to_lg:hidden  bg-stone-100 border-r border-stone-300  flex flex-col gap-10 h-full`}
    >
      <figure
        className={`p-2 ${cln} rounded-full absolute top-7 left-4`}
        onClick={() => {
          setIsDrawerOpen(false);
        }}
      >
        <FaChevronLeft className="text-lg" />
      </figure>
      <figure className="absolute top-9 right-4">
        <button
          aria-label="Toggle dark mode"
          className={`${
            isDarkMode
              ? "drop-shadow-[0px_0px_5px_rgb(255,255,255,0.5)]"
              : "drop-shadow-[0px_2px_5px_rgb(0,0,0,0.2)]"
          } focus:outline-none`}
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
      </figure>
      <ul className="mt-20">
        {!token && (
          <li className="overflow-hidden flex items-center justify-center w-full">
            <NavLink
              to="/"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
              className={({ isActive }) =>
                isActive
                  ? `${cln} py-3 font-sourceSans_bold w-full px-0 pl-7  flex items-center gap-3`
                  : `bg-stone-100 dark:bg-stone-900 font-sourceSans_bold dark:hover:bg-stone-800 hover:bg-stone-200 dark:text-stone-100 py-3 px-5 w-full text-stone-900  flex items-center gap-3 `
              }
            >
              {" "}
              <GrHomeOption
                className="transition-colors duration-0"
                aria-hidden="true"
              />
              Home
            </NavLink>
          </li>
        )}

        <li className="overflow-hidden flex items-center justify-center w-full">
          <NavLink
            to={`${!token ? "notes" : ""}`}
            onClick={() => {
              setIsDrawerOpen(false);
            }}
            className={({ isActive }) =>
              isActive
                ? `${cln} py-3  font-sourceSans_bold w-full px-0 pl-7  flex items-center gap-3 `
                : `bg-stone-100 dark:bg-stone-900 font-sourceSans_bold dark:hover:bg-stone-800 hover:bg-stone-200 dark:text-stone-100 py-3   w-full px-5 text-stone-900  flex items-center gap-3 `
            }
          >
            <FaRegStickyNote
              className="transition-colors duration-0"
              aria-hidden="true"
            />
            Notes
          </NavLink>
        </li>

        <li className="overflow-hidden flex items-center justify-center w-full">
          <NavLink
            to={"statistics"}
            onClick={() => {
              setIsDrawerOpen(false);
            }}
            className={({ isActive }) =>
              isActive
                ? `${cln} py-3 font-sourceSans_bold w-full px-0 pl-7  flex items-center gap-3 text-nowrap`
                : `bg-stone-100 dark:bg-stone-900 font-sourceSans_bold dark:hover:bg-stone-800 hover:bg-stone-200 dark:text-stone-100 py-3  w-full px-5 text-stone-900  flex items-center gap-3 text-nowrap`
            }
          >
            <IoIosStats
              className="transition-colors duration-0"
              aria-hidden="true"
            />
            Statistics
          </NavLink>
        </li>

        <li className="overflow-hidden flex items-center justify-center w-full">
          <NavLink
            to={"settings"}
            onClick={() => {
              setIsDrawerOpen(false);
            }}
            className={({ isActive }) =>
              isActive
                ? `${cln} py-3 font-sourceSans_bold w-full px-0 pl-7  flex items-center gap-3 `
                : `bg-stone-100 dark:bg-stone-900 font-sourceSans_bold dark:hover:bg-stone-800 hover:bg-stone-200 dark:text-stone-100 py-3  w-full px-5 text-stone-900  flex items-center gap-3 `
            }
          >
            <PiGearSixBold
              className="transition-colors duration-0"
              aria-hidden="true"
            />
            Settings
          </NavLink>
        </li>

        <li className="overflow-hidden flex items-center justify-center w-full">
          <NavLink
            to={"faq"}
            onClick={() => {
              setIsDrawerOpen(false);
            }}
            className={({ isActive }) =>
              isActive
                ? `${cln} py-3 font-sourceSans_bold w-full px-0 pl-7   flex items-center gap-3`
                : `bg-stone-100 dark:bg-stone-900  font-sourceSans_bold dark:hover:bg-stone-800 hover:bg-stone-200 dark:text-stone-100 py-3  w-full px-5 text-stone-900  flex items-center gap-3`
            }
          >
            <BsQuestionLg
              className="transition-colors duration-0"
              aria-hidden="true"
            />
            FAQ
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Drawer;
