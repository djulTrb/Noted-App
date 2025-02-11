import React, { useRef } from "react";
import classNames from "classnames";
import { useSelector } from "react-redux";

import { motion } from "motion/react";

import { PiArrowUpRightBold } from "react-icons/pi";

import grad1 from "../assets/SVG/gradients/Grad_13.webp";

import arrow1 from "../assets/SVG/arrows/HandDrawnarrow5.svg";
import arrow2 from "../assets/SVG/arrows/HandDrawnarrow6.svg";

import { useNavigate } from "react-router";

import { Helmet, HelmetProvider } from "react-helmet-async";

import HomePics from "../components/HomePics";

const HomeScreen = () => {
  const inRef = useRef(null);
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
    <>
      <HelmetProvider>
        <Helmet>
          <title>Noted - Home</title>
          <meta property="og:title" content="Noted - Home" />
          <meta name="twitter:title" content="Noted - Home" />
        </Helmet>
      </HelmetProvider>
      <section className="overflow-hidden hiddenScroll md:max-md_to_lg:px-3 xs:max-md:px-10 xxs:px-4 xxxs:px-1 min-h-screen">
        <div className="w-full lg:px-10 md:px-7 relative md:h-64 h-80 z-30">
          <figure className="h-7 object-fit absolute top-16 left-[21rem]  md:max-lg:left-[20rem]  md:block hidden">
            <img
              src={arrow1}
              alt="an illustration of an arrow in 2d"
              className="h-full w-auto block opacity-40 dark_filter rotate-[212deg]"
            />
            <p className="text-stone-700 leading-5 dark:text-stone-300 font-purity opacity-40 absolute top-8 left-20 w-56 rotate-[12deg]">
              note-taking app to capture your thoughts anytime, anywhere.
            </p>
          </figure>

          <h1 className="text-[6.5rem] tracking-tight text-stone-800 dark:text-stone-200 font-sourceSans_bl ">
            Noted
          </h1>
          <p className="md:hidden block text-stone-600 dark:text-stone-400 pl-4  leading-5 font-purity w-56">
            note-taking app to capture your thoughts anytime, anywhere.
          </p>
        </div>

        <div className="md:grid md:grid-cols-2 lg:px-10 md:px-7 relative">
          <figure className="w-32 h-auto absolute -top-24 sm:right-0 xxxs:max-xxs:-right-[40%] xxs:-right-[30%] xs:-right-[20%] opacity-40 dark:blur-[100px] dark:brightness-110 blur-md">
            <motion.img
              src={grad1}
              alt="gradient image as a background"
              className="block h-full w-full scale-[6]"
            />
          </figure>
          <div className="grid relative z-30 col-start-1">
            <div className="space-y-1.5 xl:space-y-2 xl:w-5/6 sm:max-md:w-9/12 sm:ml-4 xs:ml-4 ml-2 relative z-30">
              <h2
                className={`text-3xl xl:text-[2rem] font-sourceSans_bl  text-stone-700 dark:text-stone-300 z-20`}
              >
                Note Taking:
              </h2>
              <p
                className={`pl-3 font-sourceSans_reg xl:text-[1.05rem] xl:leading-[1.5rem] text-sm text-stone-600 dark:text-stone-400 lg:w-11/12 w-full md:max-lg:pr-24`}
              >
                A sleek web app designed for taking notes in Markdown format.
                Capture your thoughts effortlessly, no matter where you are.
                Perfect for organizing your thoughts.
              </p>
            </div>
            {!token && (
              <div className="w-full md:flex hidden md:max-md_to_lg:justify-start md:max-md_to_lg:px-8 justify-end xl:px-[2%] md:px-[0%] xl:mt-10 mt-3 items-center">
                <div className="text-stone-600 dark:text-stone-400 opacity-80 font-purity mt-10 w-32 relative">
                  Ready to start using
                  <span className="text-lg "> 'Noted'</span> ??
                  <figure className="absolute -top-4 left-32 w-12 h-auto">
                    <img
                      src={arrow2}
                      alt="an illustration of an arrow in 2d"
                      className="h-full w-auto block opacity-40 dark_filter"
                    />
                  </figure>
                </div>
                <button
                  className={`${clnBg} relative rounded-full  w-fit scale-[0.4] xl:scale-50 p-0.5 bg-opacity-50 dark:bg-opacity-100`}
                  onClick={() => {
                    navigate("logIn");
                  }}
                  aria-label="log in"
                  ref={inRef}
                >
                  <svg width="250" height="250" aria-hidden="true">
                    <path
                      id="curve"
                      className="fill-transparent"
                      d="M 25 125 A 100 100 0 1 1 25 127"
                    ></path>
                    <text
                      className={`origin-center text-[1.4rem] tracking-[0.32rem] relative animate-spining font-monofont`}
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
              </div>
            )}
          </div>

          <figure className=" md:grid relative items-center justify-center hidden col-start-2 ">
            <HomePics />
          </figure>

          {!token && (
            <div className="w-full flex md:hidden md:max-md_to_lg:justify-start justify-end items-center absolute xxxs:-bottom-[270%] xs:-bottom-[330%] xxxs:max-xxs:-right-14 -right-20">
              <div className="text-stone-600 dark:text-stone-400 opacity-80 font-purity mt-10 w-32 xxxs:max-xxs:hidden relative">
                Ready to start using
                <span className="text-lg "> 'Noted'</span> ??
                <figure className="absolute -top-4 left-32 w-12 h-auto">
                  <img
                    src={arrow2}
                    alt="an illustration of an arrow in 2d"
                    className="h-full w-auto block opacity-40 dark_filter"
                  />
                </figure>
              </div>
              <button
                className={`${clnBg} relative rounded-full  w-fit scale-[0.4] xl:scale-50 p-0.5 bg-opacity-50 dark:bg-opacity-100`}
                onClick={() => {
                  navigate("login");
                }}
                aria-label="log in"
              >
                <svg width="250" height="250" aria-hidden="true">
                  <path
                    id="curve"
                    className="fill-transparent"
                    d="M 25 125 A 100 100 0 1 1 25 127"
                  ></path>
                  <text
                    className={`origin-center text-[1.4rem] tracking-[0.32rem] relative animate-spining font-monofont`}
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
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default HomeScreen;
