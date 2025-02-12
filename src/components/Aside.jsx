import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import { BsQuestionLg } from "react-icons/bs";
import { FaRegStickyNote } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { PiGearSixBold } from "react-icons/pi";
import { GrHomeOption } from "react-icons/gr";

import classNames from "classnames";
import { useSelector } from "react-redux";

import SVGLogo from "./SVGLogo";

const Aside = () => {
  const [isSideBarClosed, setISSideBarClosed] = useState(false);
  const { themeColor } = useSelector((state) => state.parameters);
  const { token } = useSelector((state) => state.auth);

  const cln = classNames({
    "bg-orange-200  text-orange-600": themeColor === "orange",
    "bg-violet-200 text-violet-600": themeColor === "violet",
    "bg-lime-200  text-lime-600": themeColor === "lime",
    "bg-sky-200  text-sky-600": themeColor === "sky",
    "bg-rose-200  text-rose-600": themeColor === "rose",
  });

  return (
    <aside
      className={`z-10 ${
        isSideBarClosed ? "w-fit items-center" : " w-[12.5rem]"
      } dark:bg-stone-900 dark:border-stone-950  md:col-start-1 md:row-start-2 md:col-span-1 md:row-span-2 xxxs:max-md_to_lg:hidden  bg-stone-100 border-r border-stone-300  flex flex-col  gap-10 pt-6 relative `}
    >
      <figure
        className={`absolute ${
          isSideBarClosed ? "top-6 -right-5 p-1.5" : "right-5 top-7 p-2"
        }  ${cln}  rounded-full cursor-pointer z-20`}
        onClick={() => {
          setISSideBarClosed(!isSideBarClosed);
        }}
      >
        {isSideBarClosed ? (
          <FaChevronRight className="text-lg" aria-hidden="true" />
        ) : (
          <FaChevronLeft className="text-xl" aria-hidden="true" />
        )}
      </figure>

      <figure className={`size-auto ${isSideBarClosed ? "" : "mx-5"}`}>
        <SVGLogo closed={isSideBarClosed} />
      </figure>

      <ul
        className={`sticky top-10 ${
          isSideBarClosed ? "flex flex-col items-center gap-2" : ""
        }`}
      >
        {token ? null : (
          <li className="overflow-hidden flex items-center justify-center w-full">
            {isSideBarClosed ? (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? `${cln} py-[.93rem] font-sourceSans_bold w-full flex justify-center rounded-sm  text-xl`
                      : `bg-stone-100 dark:bg-stone-900 font-sourceSans_bold dark:hover:bg-stone-800 hover:bg-stone-200 dark:text-stone-100 w-full text-stone-900 flex justify-center px-6 py-[.93rem] text-lg`
                  }
                >
                  {" "}
                  <GrHomeOption aria-hidden="true" />
                </NavLink>
              </>
            ) : (
              <NavLink
                to="/"
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
            )}
          </li>
        )}

        <li className="overflow-hidden flex items-center justify-center w-full">
          {isSideBarClosed ? (
            <NavLink
              to={`${!token ? "notes" : ""}`}
              className={({ isActive }) =>
                isActive
                  ? `${cln} py-[.93rem] font-sourceSans_bold w-full flex justify-center rounded-sm  text-xl`
                  : `bg-stone-100 dark:bg-stone-900 font-sourceSans_bold dark:hover:bg-stone-800 hover:bg-stone-200 dark:text-stone-100 w-full text-stone-900  flex justify-center px-6 py-[.93rem] text-lg `
              }
            >
              <FaRegStickyNote aria-hidden="true" />
            </NavLink>
          ) : (
            <NavLink
              to={`${!token ? "notes" : ""}`}
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
          )}
        </li>

        <li className="overflow-hidden flex items-center justify-center w-full">
          {isSideBarClosed ? (
            <NavLink
              to={"statistics"}
              className={({ isActive }) =>
                isActive
                  ? `${cln} py-[.93rem] font-sourceSans_bold w-full flex justify-center rounded-sm  text-xl`
                  : `bg-stone-100 dark:bg-stone-900 font-sourceSans_bold dark:hover:bg-stone-800 hover:bg-stone-200 dark:text-stone-100  w-full  text-stone-900  flex justify-center px-6 py-[.93rem] text-lg `
              }
            >
              <IoIosStats aria-hidden="true" />
            </NavLink>
          ) : (
            <NavLink
              to={"statistics"}
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
          )}
        </li>

        <li className="overflow-hidden flex items-center justify-center w-full">
          {isSideBarClosed ? (
            <NavLink
              to={"settings"}
              className={({ isActive }) =>
                isActive
                  ? `${cln} py-[.93rem] font-sourceSans_bold w-full flex justify-center rounded-sm  text-xl`
                  : `bg-stone-100 dark:bg-stone-900 font-sourceSans_bold dark:hover:bg-stone-800 hover:bg-stone-200 dark:text-stone-100   w-full  text-stone-900  flex justify-center px-6 py-[.93rem] text-lg `
              }
            >
              <PiGearSixBold aria-hidden="true" />
            </NavLink>
          ) : (
            <NavLink
              to={"settings"}
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
          )}
        </li>

        <li className="overflow-hidden flex items-center justify-center w-full">
          {isSideBarClosed ? (
            <NavLink
              to={"faq"}
              className={({ isActive }) =>
                isActive
                  ? `${cln} py-[.93rem] font-sourceSans_bold w-full flex justify-center rounded-sm  text-xl`
                  : `bg-stone-100 dark:bg-stone-900  font-sourceSans_bold dark:hover:bg-stone-800 hover:bg-stone-200 dark:text-stone-100  w-full text-stone-900  flex justify-center px-6 py-[.93rem] text-lg`
              }
            >
              <BsQuestionLg aria-hidden="true" />
            </NavLink>
          ) : (
            <NavLink
              to={"faq"}
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
          )}
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
