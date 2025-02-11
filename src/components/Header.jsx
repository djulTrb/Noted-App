import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { AnimatePresence } from "motion/react";

import classNames from "classnames";

import { FaBars } from "react-icons/fa6";

import DarkModeToggleBtn from "./DarkModeToggleBtn";
import SmallIconUserPic from "./SmallIconUserPic";
import DropDownMenu from "./DropDownMenu";

const Header = ({ setIsDrawerOpen, isDrawerOpen }) => {
  const { themeColor } = useSelector((state) => state.parameters);
  const { token } = useSelector((state) => state.auth);

  const cln = classNames({
    "text-orange-600": themeColor === "orange",
    "text-violet-600": themeColor === "violet",
    "text-lime-600": themeColor === "lime",
    "text-sky-600": themeColor === "sky",
    "text-rose-600": themeColor === "rose",
  });

  const navigate = useNavigate();
  const [dropDownOn, setDropDownOn] = useState(false);

  return (
    <header className="dark:bg-stone-900  dark:border-stone-950 col-start-1 row-start-1 col-span-2 row-span-1 bg-stone-100 border-b border-stone-300 flex items-center justify-between md_to_lg:justify-end md_to_lg:gap-3 xs:px-5 px-3 xxs:pl-5 xs:pl-11 xxxs:max-xxs:pl-3 py-2.5">
      <FaBars
        className={`text-xl ${cln} md_to_lg:hidden cursor-pointer `}
        onClick={() => {
          setIsDrawerOpen(!isDrawerOpen);
        }}
      />

      <div
        className={`flex items-center relative ${
          !token ? "gap-1.5" : "gap-2.5"
        } `}
      >
        {" "}
        <AnimatePresence>
          {dropDownOn ? <DropDownMenu setMenuOpen={setDropDownOn} /> : null}
        </AnimatePresence>
        <DarkModeToggleBtn />
        {!token ? (
          <button
            className={`${cln} p-0.5 px-3 font-black capitalize`}
            onClick={() => {
              navigate("login");
            }}
            aria-label="log in"
          >
            get Started
          </button>
        ) : (
          <SmallIconUserPic setMenuOpen={setDropDownOn} menuOpen={dropDownOn} />
        )}{" "}
      </div>
    </header>
  );
};

export default Header;
