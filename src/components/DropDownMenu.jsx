import React, { useRef } from "react";
import { useNavigate } from "react-router";

import { motion } from "motion/react";

import { PiGearSixBold, PiTrashBold } from "react-icons/pi";
import { FaChevronRight } from "react-icons/fa6";

import { supabase } from "../services/supabaseClient";

const DropDownMenu = ({ setMenuOpen }) => {
  const navigate = useNavigate();

  const handleCloseDropDown = () => {
    setMenuOpen(false);
  };

  const signout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      navigate("random404");
    }
    handleCloseDropDown();
    window.location.reload();
    navigate("/");
  };

  const dropDownRef = useRef(null);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -7 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 7 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      ref={dropDownRef}
      className="absolute -bottom-[5.25rem] z-50 right-[1.5rem]"
    >
      <ul className=" bg-stone-300 rounded-b-sm  dark:bg-stone-700 divide-y divide-stone-400 dark:divide-stone-400 divide-opacity-50 shadow-lg">
        <li
          className="flex items-center justify-between text-stone-700 dark:text-stone-300 cursor-pointer px-2.5 w-32 py-[0.45rem] dark:hover:bg-stone-600 hover:bg-stone-400 hover:bg-opacity-35"
          onClick={() => {
            navigate("/settings");
            setMenuOpen(false);
          }}
        >
          <div className="flex items-center gap-1">
            <PiGearSixBold className="text-xs" />
            <p className=" font-sourceSans_reg text-sm">Settings</p>
          </div>
          <FaChevronRight className="text-[0.68rem]" />
        </li>
        <li
          className="flex items-center justify-between text-red-600 cursor-pointer px-2.5 w-32 py-2 dark:hover:bg-stone-600 hover:bg-stone-400 hover:bg-opacity-35"
          onClick={signout}
        >
          <div className="flex items-center gap-1">
            <PiTrashBold className="text-xs" />
            <p className="font-sourceSans_reg text-sm">Log out</p>
          </div>
          <FaChevronRight className="text-[0.68rem]" />
        </li>
      </ul>
    </motion.nav>
  );
};

export default DropDownMenu;
