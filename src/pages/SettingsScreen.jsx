import React, { useState, useEffect } from "react";
import classNames from "classnames";

import { AnimatePresence } from "motion/react";
import { FaChevronDown, FaChevronUp, FaXmark, FaPen } from "react-icons/fa6";
import { useOutletContext } from "react-router-dom";
import { setMainColor } from "../services/store/parameters";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "boring-avatars";

import { setImage, removeImage } from "../services/store/Auth";
import useSupabaseSession from "../hooks/useSupabaseSession";
import { supabase } from "../services/supabaseClient";

import ErrorToast from "../components/ErrorToast";

import { Helmet, HelmetProvider } from "react-helmet-async";

const SettingsScreen = () => {
  const { data } = useSupabaseSession();
  const dispatch = useDispatch();
  const { handleToggleModifyAccountInfoModal } = useOutletContext();

  const [DropdownColorTheme, setDropdownColorTheme] = useState(false);
  const [isThirdPartyUsed, setIsThirdPartyUsed] = useState(false);
  const [ErrorUpdateImage, setErrorUpdateImage] = useState(false);

  const { themeColor } = useSelector((state) => state.parameters);
  const { user, image, token } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsThirdPartyUsed(
      data?.user?.app_metadata?.provider !== "email" ? true : false
    );
  }, [data]);

  const handleToggleDropdownColorTheme = () => {
    setDropdownColorTheme((prevState) => !prevState);
  };

  const handleSetMainColor = (color) => {
    dispatch(setMainColor(color));
    handleToggleDropdownColorTheme();
    localStorage.setItem("themeColor", color);
  };

  const cln = classNames({
    "text-orange-600": themeColor === "orange",
    "text-violet-600": themeColor === "violet",
    "text-lime-600": themeColor === "lime",
    "text-sky-600": themeColor === "sky",
    "text-rose-600": themeColor === "rose",
  });

  const handleImageChange = (event) => {
    const ID = data?.user?.id;

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const { error: errorUpdateIMG } = await supabase
          .from("User Informations")
          .update({ image: reader.result })
          .eq("id", ID);

        if (errorUpdateIMG) {
          setErrorUpdateImage(true);
          setTimeout(() => {
            setErrorUpdateImage(false);
          }, 4000);
          return;
        } else {
          dispatch(setImage(reader.result));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    const ID = data?.user?.id;
    const { error } = await supabase
      .from("User Informations")
      .update({ image: null })
      .eq("id", ID);

    if (!error && ID) {
      dispatch(removeImage());
    } else {
      setErrorUpdateImage(true);
      setTimeout(() => {
        setErrorUpdateImage(false);
      }, 4000);
      return;
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Noted - Settings</title>
          <meta property="og:title" content="Noted - Settings" />
          <meta name="twitter:title" content="Noted - Settings" />
        </Helmet>
      </HelmetProvider>
      <section className="pl-10 xxxs:max-xxs:pl-2 xxs:max-xs:pl-3 lg:pt-3 md_to_lg:pt-5 pt-5 h-[850px]">
        <h1 className="w-fit lg:text-6xl md_to_lg:text-5xl text-5xl dark:text-stone-200 text-stone-800 font-sourceSans_bl capitalize tracking-tight px-2">
          settings
        </h1>

        <ul className="md_to_lg:ml-10 md:ml-6 md:pt-4 pt-1">
          <li className="flex items-end">
            <h2 className="w-fit  xxxs:max-xxs:text-lg xxs:text-xl md:text-2xl dark:text-stone-400 text-stone-800 font-sourceSans_bl uppercase px-2 xxxs:max-xs:pr-1 pl-3">
              1. Account Management{" "}
            </h2>
            {token && !isThirdPartyUsed ? (
              <button
                aria-label="modify account information"
                onClick={handleToggleModifyAccountInfoModal}
                className={`${cln} text-xs font-monofont self-center pt-2 ml-1 flex items-center gap-1`}
              >
                Modify <FaPen className="text-[.55rem]" />
              </button>
            ) : null}
          </li>
          <li className="lg:ml-28 md_to_lg:max-lg:ml-20 sm:ml-0 md:ml-9 mt-5 xxxs:max-xxs:mt-1 xxs:max-xs:mt-3 mb-10 w-4/6 xl:w-3/6 xxxs:max-md:w-full">
            <div className="grid lg:grid-cols-2 lg:grid-rows-[1fr_auto_auto] grid-rows-[1fr_auto_auto_auto] gap-x-8  gap-y-5  lg:gap-x-20 min-[1150px]:max-xl:gap-x-5 xl:gap-x-32 min-[1400px]:gap-x-10 xs:max-md:ml-16 xxs:ml-10 xxxs:ml-8 xxxs:max-xxs:gap-y-2 xxs:max-xs:gap-y-2 xxxs:max-md:mt-5">
              <figure
                className={`rounded-full border-4 dark:border-stone-100 border-indigo-200  bg-stone-400 w-28 aspect-square col-span-2 relative`}
              >
                {token ? (
                  <div className="absolute -bottom-1 -right-8 flex gap-1 items-center text-sm ">
                    <label htmlFor="uploadImage">
                      <FaPen
                        className={` dark:text-stone-100 text-stone-700 cursor-pointer`}
                        aria-hidden="true"
                      />
                    </label>

                    <input
                      type="file"
                      id="uploadImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      placeholder="border"
                    />
                    <button
                      aria-label="remove profile picture"
                      onClick={handleRemoveImage}
                    >
                      <FaXmark
                        className={` dark:text-stone-100 text-stone-700 cursor-pointer text-lg`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                ) : null}

                {image ? (
                  <img
                    src={image}
                    alt="profile picture"
                    className="h-full aspect-square object-cover rounded-full"
                  />
                ) : (
                  <Avatar
                    name={user?.username || "username"}
                    variant="beam"
                    aria-hidden="true"
                  />
                )}
              </figure>
              <input
                type="text"
                placeholder={user?.username || "Username"}
                readOnly={true}
                className="px-2 py-2 placeholder:font-sourceSans_reg placeholder:text-stone-500 dark:placeholder:text-stone-400 dark:bg-stone-800 bg-stone-200 focus:outline-none border-b-2 dark:border-stone-300 border-stone-700 lg:w-60 md_to_lg:w-80 xs:w-80 sm:max-md:w-96 xxs:w-11/12 xxxs:w-11/12 xxxs:max-lg:row-start-2 xxxs:max-xs:mt-3 hover:cursor-default"
              />

              <input
                type="text"
                placeholder={"*".repeat(6)}
                readOnly={true}
                className="px-2 py-2 placeholder:font-sourceSans_reg placeholder:text-stone-500 dark:placeholder:text-stone-400 dark:bg-stone-800 bg-stone-200 focus:outline-none border-b-2 dark:border-stone-300 border-stone-700 lg:w-60 md_to_lg:w-80 xs:w-80 sm:max-md:w-96 xxs:w-11/12 xxxs:w-11/12 xxxs:max-lg:row-start-3 hover:cursor-default"
              />

              <input
                type="text"
                placeholder={user?.email || "Email"}
                readOnly={true}
                className="px-2 py-2 placeholder:font-sourceSans_reg placeholder:text-stone-500 dark:placeholder:text-stone-400 dark:bg-stone-800 bg-stone-200 focus:outline-none border-b-2 dark:border-stone-300 border-stone-700 lg:w-60 md_to_lg:w-80 xs:w-80 sm:max-md:w-96 xxs:w-11/12 xxxs:w-11/12 xxxs:max-lg:row-start-4 xxxs:max-xs:mb-3 hover:cursor-default"
              />
            </div>
          </li>
          <li className="flex items-end">
            <h2 className="w-fit xxxs:max-xxs:text-lg xxs:text-xl md:text-2xl  dark:text-stone-400 text-stone-800 font-sourceSans_bl uppercase px-2">
              2. Preferences
            </h2>
          </li>
        </ul>
        <ul className="lg:ml-40 md_to_lg:ml-[8.5rem] md:ml-[4.5rem] sm:pt-4 xxxs:max-xs:pt-2 xs:max-sm:pt-3 xxs:ml-6 xs:ml-10 xxxs:ml-4">
          <li className="flex flex-col">
            <h1 className="w-fit xxxs:max-xs:text-sm dark:text-stone-400 text-stone-800 font-sourceSans_bl uppercase px-2">
              2.1 Color Theme
            </h1>
            <div className="dark:bg-stone-300 bg-stone-300  rounded-md lg:w-64 md:w-80 sm:w-80 md_to_lg:w-[21rem] xs:w-80 sm:max-md:w-96 xxs:w-80 xxxs:w-5/6 mt-4 xxxs:max-xxs:mt-3 ml-6 divide-y divide-stone-400 border border-stone-400">
              <button
                className="flex justify-between items-center px-4 py-2 w-full "
                aria-label="change theme color"
                onClick={() => {
                  handleToggleDropdownColorTheme();
                }}
              >
                <span className="text-opacity-80 text-stone-500 font-sourceSans_reg">
                  Select a color
                </span>{" "}
                {DropdownColorTheme ? (
                  <FaChevronUp
                    className="text-sm text-stone-700"
                    aria-hidden="true"
                  />
                ) : (
                  <FaChevronDown
                    className="text-sm text-stone-700"
                    aria-hidden="true"
                  />
                )}
              </button>
              <ul
                className={`${
                  DropdownColorTheme
                    ? "h-[12.8rem] opacity-100"
                    : "h-0 opacity-0"
                } grid transition-all duration-500 overflow-hidden rounded-b-md w-full dark:bg-stone-200 bg-stone-200 divide-y divide-stone-400`}
              >
                <li
                  className="dark:hover:bg-stone-200 rounded-t-md py-2 px-3 font-sourceSans_reg text-stone-600 text-opacity-85 cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    handleSetMainColor("orange");
                  }}
                >
                  orange{" "}
                  <div className="h-4 w-20 border-4 border-orange-300  bg-orange-600"></div>
                </li>
                <li
                  className="dark:hover:bg-stone-200 py-2 px-3 font-sourceSans_reg text-stone-600 text-opacity-85 cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    handleSetMainColor("sky");
                  }}
                >
                  sky{" "}
                  <div className="h-4 w-20 border-4 border-sky-300  bg-sky-600"></div>
                </li>
                <li
                  className="dark:hover:bg-stone-200 py-2 px-3 font-sourceSans_reg text-stone-600 text-opacity-85 cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    handleSetMainColor("violet");
                  }}
                >
                  violet{" "}
                  <div className="h-4 w-20 border-4 border-violet-300  bg-violet-600"></div>
                </li>
                <li
                  className="dark:hover:bg-stone-200 py-2 px-3 font-sourceSans_reg text-stone-600 text-opacity-85 cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    handleSetMainColor("lime");
                  }}
                >
                  lime{" "}
                  <div className="h-4 w-20 border-4 border-lime-300  bg-lime-600"></div>
                </li>
                <li
                  className="dark:hover:bg-stone-200 rounded-b-md py-2 px-3 font-sourceSans_reg text-stone-600 text-opacity-85 cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    handleSetMainColor("rose");
                  }}
                >
                  rose{" "}
                  <div className="h-4 w-20 border-4 border-rose-300 bg-rose-500"></div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <AnimatePresence>
          {ErrorUpdateImage && (
            <div className="absolute -top-7 left-1/4">
              <ErrorToast
                errorText={
                  "An Error Occured While Updating User's Profile Picture, Please Retry"
                }
              />
            </div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

export default SettingsScreen;
