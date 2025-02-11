import React from "react";

import { motion } from "motion/react";

import { FaCircleInfo } from "react-icons/fa6";

const ErrorToast = ({ errorText }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-stone-300 dark:bg-stone-800 rounded-lg w-fit  absolute top-12 z-[1000] backdrop-blur lg:left-1/3 md_to_lg:left-1/4 sm:left-[15%] md:left-[20%] xxxs:left-0 xxxs:max-sm:left-0 xxxs:max-sm:w-full flex items-center gap-4 px-3 py-[0.8rem] border border-stone-400 border-opacity-40"
    >
      <FaCircleInfo className="text-red-600" aria-hidden="true" />
      <p className="text-sm dark:text-stone-200 text-stone-700 font-sourceSans_bold w-max">
        {errorText}
      </p>
    </motion.div>
  );
};

export default ErrorToast;
