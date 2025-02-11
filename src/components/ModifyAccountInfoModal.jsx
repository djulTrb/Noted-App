import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";

import { motion } from "motion/react";

import { FaPen, FaXmark } from "react-icons/fa6";

import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import useSupabaseSession from "../hooks/useSupabaseSession";
import { setCredentials } from "../services/store/Auth";
import { supabase } from "../services/supabaseClient";

import useOutsideClick from "../hooks/useOutsideClick";

const NameSchema = z.object({
  username: z
    .string()
    .min(6, "at least 6 characters")
    .max(25, "at most 25 characters"),
});

const ModifyAccountInfoModal = ({
  openModificationWindow,
  handleToggleModifyAccountInfoModal,
  handleCloseModifyModal,
}) => {
  const [Err, setErr] = useState(false);

  const { data } = useSupabaseSession();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [readOnlyInput, setReadOnlyInput] = useState(true);
  const { user, token } = useSelector((state) => state.auth);

  const inputRefName = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(NameSchema) });

  const handleModifyAccountInfo = async (Udata) => {
    const ID = data?.user?.id;

    const { error } = await supabase
      .from("User Informations")
      .update({ username: Udata?.username || user?.username })
      .eq("id", ID);

    if (error) {
      setTimeout(() => {
        setErr(false);
      }, 2000);
      setErr(true);
    } else {
      dispatch(
        setCredentials({
          user: {
            email: user.email,
            username: Udata?.username,
          },
          token: token,
        })
      );
      handleToggleModifyAccountInfoModal();
    }
  };

  const modalRef = useRef(null);
  useOutsideClick(modalRef, handleCloseModifyModal);

  return (
    <>
      {openModificationWindow && (
        <>
          <motion.div
            className="absolute top-0 left-0 brightness-50 backdrop-blur-sm h-full w-full z-20 overflow-hidden"
            initial={{
              opacity: 0,
            }}
            transition={{
              duration: 1,
              ease: "anticipate",
            }}
            animate={{
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
          ></motion.div>

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-30 bg-stone-200 dark:bg-stone-800 md:px-5 xxxs:px-3 pt-8 pb-5 rounded-lg dark:border-stone-900 border border-stone-500 flex flex-col w-[21.5rem] xxxs:max-xxs:w-80 px-1"
            initial={{
              opacity: 0,
            }}
            transition={{
              duration: 0.6,
              ease: "anticipate",
            }}
            animate={{
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            ref={modalRef}
          >
            <motion.button
              className="absolute top-3 right-3 text-xl dark:text-stone-200 text-stone-500 z-30 "
              initial={{
                opacity: 0,
              }}
              transition={{
                duration: 0.6,
                ease: "anticipate",
              }}
              animate={{
                opacity: 0.8,
              }}
              exit={{ opacity: 0 }}
              onClick={() => {
                handleToggleModifyAccountInfoModal();
                setReadOnlyInput(true);
              }}
              aria-label="toggle modal modify account informations"
            >
              <FaXmark aria-hidden="true" />
            </motion.button>
            <h2 className="text-2xl font-sourceSans_bl text-stone-900 dark:text-stone-200">
              Modify Account Informations
            </h2>
            <div className="pb-1">
              <form
                className="flex flex-col"
                onSubmit={handleSubmit(handleModifyAccountInfo)}
              >
                <div className="space-y-0.5 mt-5 flex flex-col">
                  <div className="flex flex-col">
                    <label
                      className="text-stone-700 dark:text-stone-300 text-xs font-sourceSans_bl"
                      htmlFor="username"
                    >
                      username
                    </label>
                    <div className="grid grid-cols-12 gap-2 place-content-center items-center">
                      <input
                        className="bg-stone-50 shadow-[2px_2px_2px_rgb(40,40,40,0.05)] text-stone-800 rounded-[0.2rem] focus:outline-none focus:border-gray-500 font-sourceSans_reg px-3 py-1.5 mx-1 mt-1  placeholder:text-[0.9rem] col-span-11 md:w-[17rem] xxs:w-[17.4rem] xxxs:max-xxs:w-64"
                        id="username"
                        ref={inputRefName}
                        {...register("username")}
                        type="text"
                        placeholder={user.username}
                      />
                      <FaPen
                        className="col-start-12 mx-auto cursor-pointer dark:text-stone-400 text-stone-700"
                        aria-hidden="true"
                        onClick={() => {
                          inputRefName.current.focus();
                        }}
                      />
                    </div>
                    {errors?.username && (
                      <p className=" text-nowrap mt-0.5 text-opacity-80 text-red-600 font-sourceSans_reg text-xs">
                        {errors?.username?.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col pb-10">
                    <label
                      className="text-stone-700 dark:text-stone-300 text-xs font-sourceSans_bl"
                      htmlFor="password"
                    >
                      {readOnlyInput ? "Password" : "Enter Old Password"}
                    </label>
                    <div className="grid grid-cols-12 gap-2 place-content-center items-center">
                      <input
                        className="bg-stone-50 shadow-[2px_2px_2px_rgb(40,40,40,0.05)] text-stone-800 rounded-[0.2rem] focus:outline-none focus:border-gray-500 font-sourceSans_reg px-3 py-1.5 mx-1 mt-0.5 placeholder:text-[0.9rem] col-span-11 md:w-[17rem] xxs:w-[17.4rem] xxxs:max-xxs:w-64"
                        id="password"
                        {...register("password", {
                          required: true,
                        })}
                        readOnly={readOnlyInput}
                        type="password"
                        ref={inputRefName}
                        placeholder={"*".repeat(6)}
                      />

                      {readOnlyInput ? (
                        <FaPen
                          className="col-start-12 mx-auto cursor-pointer dark:text-stone-400 text-stone-700"
                          aria-hidden="true"
                          onClick={() => {
                            navigate("/changePassword");
                          }}
                        />
                      ) : null}
                    </div>{" "}
                    {errors?.password && (
                      <p className=" text-nowrap mt-0.5 text-opacity-80 text-red-600 font-sourceSans_reg text-xs">
                        {errors?.password?.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    aria-label="submit changes"
                    className="bg-emerald-600 text-stone-100 px-3 py-1.5 self-end rounded-[3px] font-sourceSans_bold"
                  >
                    {isSubmitting ? "Wait" : "Save Changes"}
                  </button>
                </div>
                {Err && (
                  <p className="text-xs text-red-600">
                    an error has occured, please try again
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default ModifyAccountInfoModal;
