import React from "react";

import { useSelector } from "react-redux";

import { FaPlus } from "react-icons/fa";

import classNames from "classnames";

const AddBtn = ({ btnText, addNote }) => {
  const { themeColor } = useSelector((state) => state.parameters);

  const handleClick = () => {
    if (addNote) {
      addNote(true);
    }
  };

  const cln = classNames({
    "text-orange-700 dark:text-orange-600 border-orange-800":
      themeColor === "orange",
    "text-violet-700 dark:text-violet-600  border-violet-800 ":
      themeColor === "violet",
    "text-lime-700 dark:text-lime-600  border-lime-800": themeColor === "lime",
    "text-sky-700 dark:text-sky-600  border-sky-800": themeColor === "sky",
    "text-rose-700 dark:text-rose-600  border-rose-800": themeColor === "rose",
  });

  return (
    <button
      className={`px-4 py-1.5 rounded-md font-sourceSans_bl border border-stone-400 bg-stone-300 dark:bg-stone-700 bg-opacity-55 border-opacity-15 dark:border-opacity-70 flex gap-1 items-center justify-center xxxs:max-xs:text-xs self-end mb-1 ${cln}`}
      onClick={handleClick}
      aria-label="add note"
    >
      {btnText} <FaPlus className="text-[0.7rem] " aria-hidden="true" />
    </button>
  );
};

export default AddBtn;
