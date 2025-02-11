import React from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

import { PiArrowUpRightBold } from "react-icons/pi";

import classNames from "classnames";

const CircularBtn = () => {
  const navigate = useNavigate();
  const { themeColor } = useSelector((state) => state.parameters);
  const { token } = useSelector((state) => state.auth);

  const clnStroke = classNames({
    "stroke-orange-600": themeColor === "orange",
    "stroke-violet-600": themeColor === "violet",
    "stroke-lime-600": themeColor === "lime",
    "stroke-sky-600": themeColor === "sky",
    "stroke-rose-600": themeColor === "rose",
  });

  const clnFill = classNames({
    "fill-orange-700": themeColor === "orange",
    "fill-violet-700": themeColor === "violet",
    "fill-lime-700": themeColor === "lime",
    "fill-sky-700": themeColor === "sky",
    "fill-rose-700": themeColor === "rose",
  });

  const clnText = classNames({
    "text-orange-700": themeColor === "orange",
    "text-violet-700": themeColor === "violet",
    "text-lime-700": themeColor === "lime",
    "text-sky-700": themeColor === "sky",
    "text-rose-700": themeColor === "rose",
  });

  const clnBg = classNames({
    "bg-orange-300": themeColor === "orange",
    "bg-violet-300": themeColor === "violet",
    "bg-lime-300": themeColor === "lime",
    "bg-sky-300": themeColor === "sky",
    "bg-rose-300": themeColor === "rose",
  });

  return (
    !token && (
      <button
        className={`${clnBg} absolute -bottom-14 -right-14 rounded-full overflow-hidden w-fit scale-[0.35] xl:scale-50 p-0.5 bg-opacity-50 dark:bg-opacity-100`}
        onClick={() => {
          navigate("/login");
        }}
        aria-label="Log In"
      >
        <svg width="250" height="250" aria-hidden="true">
          <path
            id="curve"
            className="fill-transparent"
            d="M 25 125 A 100 100 0 1 1 25 127"
          ></path>
          <text
            className={`origin-center text-[1.4rem] tracking-[0.32rem] relative animate-spining2 font-monofont`}
          >
            <textPath
              href="#curve"
              className={`${clnStroke} ${clnFill} uppercase`}
            >
              get started now ! -- Noted -- Log In --
            </textPath>
          </text>
        </svg>
        <PiArrowUpRightBold
          className={` absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl ${clnText}`}
        />
      </button>
    )
  );
};

export default CircularBtn;
