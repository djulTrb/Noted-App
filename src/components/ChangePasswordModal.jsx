import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import useSupabaseSession from "../hooks/useSupabaseSession";

import CryptoJS from "crypto-js";

const ChangePasswordModal = () => {
  const { data: sessionData } = useSupabaseSession();
  const { isDarkMode } = useSelector((state) => state.darkMode);
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [pass, setPass] = useState("");

  const ID = sessionData?.user?.id;
  const secretKey = import.meta.env.VITE_SECRET_ENCRYPTION_KEY;

  useEffect(() => {
    (async () => {
      const { data: updateData, error: err } = await supabase
        .from("User Informations")
        .select("more")
        .eq("id", ID);

      if (err) {
        setTimeout(() => {
          setErr(false);
        }, 2000);
        setErr(true);
      } else {
        const decryptedPassword = CryptoJS.AES.decrypt(
          updateData?.[0]?.more,
          secretKey
        ).toString(CryptoJS.enc.Utf8);

        setPass(decryptedPassword);
      }
    })();
  }, [ID]);

  const schema = z
    .object({
      password: z.string().min(6, "Password must be at least 6 characters"),
      newPassword: z.string().min(6, "Password must be at least 6 characters"),
      confirmNewPassword: z
        .string()
        .min(1, "Password Confirmation is required"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Passwords don't match",
      path: ["confirmNewPassword"],
    })
    .refine((data) => data.newPassword !== pass, {
      message: "New password should not be same as the old one",
      path: ["newPassword"],
    })
    .refine((data) => data.password === pass, {
      message: "Incorrect password, please try again",
      path: ["password"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const handleModifyAccountInfo = async (userData) => {
    const { data: updatedData, error: errorUpdataPassword } = await supabase
      .from("User Informations")
      .update({
        more: CryptoJS.AES.encrypt(userData?.newPassword, secretKey).toString(),
      })
      .eq("id", ID)
      .select();

    if (errorUpdataPassword) {
      setTimeout(() => {
        setErr(false);
      }, 2000);
      setErr(true);
    } else {
      navigate("/settings");
    }
  };

  useEffect(() => {
    localStorage.setItem("isDarkMode", isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <>
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-30 bg-stone-200 dark:bg-stone-800 md:px-5 xxxs:px-3 pt-8 pb-5 rounded-lg dark:border-stone-900 border border-stone-500 flex flex-col w-[21.5rem] xxxs:max-xxs:w-80 px-1">
        <h2 className="text-2xl font-sourceSans_bl text-stone-900 dark:text-stone-200">
          Change Password
        </h2>
        <div className="pb-1">
          <form
            className="flex flex-col gap-8"
            onSubmit={handleSubmit(handleModifyAccountInfo)}
          >
            <div className="space-y-3 mt-5 flex flex-col">
              <div className="flex flex-col ">
                <label
                  className="text-stone-700 dark:text-stone-300 text-xs font-sourceSans_bl"
                  htmlFor="password"
                >
                  Enter Old Password
                </label>
                <div>
                  <input
                    className="bg-stone-50 shadow-[2px_2px_2px_rgb(40,40,40,0.05)] text-stone-800 rounded-[0.2rem] focus:outline-none focus:border-gray-500 font-sourceSans_reg px-3 py-1.5 mx-1 mt-0.5 placeholder:text-[0.9rem] w-full"
                    id="password"
                    {...register("password", {
                      required: true,
                    })}
                    type="password"
                    placeholder="old password"
                  />
                </div>{" "}
                {errors?.password && (
                  <p className=" text-nowrap mt-0.5 text-opacity-80 text-red-600 font-sourceSans_reg text-xs">
                    {errors?.password?.message}
                  </p>
                )}
              </div>

              <>
                <div className="mt-3 flex flex-col">
                  <label
                    className="text-stone-700 dark:text-stone-300 text-xs font-sourceSans_bl"
                    htmlFor="newPassword"
                  >
                    Enter New Password
                  </label>
                  <input
                    className="bg-stone-50 shadow-[2px_2px_2px_rgb(40,40,40,0.05)] text-stone-800 rounded-[0.2rem] focus:outline-none focus:border-gray-500 font-sourceSans_reg px-3 py-1.5 mx-1 mt-0.5 placeholder:text-[0.9rem] w-full"
                    id="newPassword"
                    {...register("newPassword", {
                      required: true,
                    })}
                    type="password"
                    placeholder="Password"
                  />
                  {errors?.newPassword && (
                    <p className=" text-nowrap mt-0.5 text-opacity-80 text-red-600 font-sourceSans_reg text-xs">
                      {errors?.newPassword?.message}
                    </p>
                  )}
                </div>
                <div className="mt-3 flex flex-col pb-10">
                  <label
                    className="text-stone-700 dark:text-stone-300 text-xs font-sourceSans_bl"
                    htmlFor="confirmNewPassword"
                  >
                    Confirm New Password
                  </label>
                  <input
                    className="bg-stone-50 shadow-[2px_2px_2px_rgb(40,40,40,0.05)] text-stone-800 rounded-[0.2rem] focus:outline-none focus:border-gray-500 font-sourceSans_reg px-3 py-1.5 mx-1 mt-0.5 placeholder:text-[0.9rem] w-full"
                    id="confirmNewPassword"
                    {...register("confirmNewPassword", {
                      required: true,
                    })}
                    type="password"
                    placeholder="Confirm password"
                  />
                  {errors?.confirmNewPassword && (
                    <p className=" text-nowrap mt-0.5 text-opacity-80 text-red-600 font-sourceSans_reg text-xs">
                      {errors?.confirmNewPassword?.message}
                    </p>
                  )}
                  <p className="pt-3 text-stone-600 dark:text-stone-300 text-sm font-sourceSans_reg">
                    Stop modifying your Password? just click{" "}
                    <button
                      className="inline dark:text-red-500 text-red-600 font-sourceSans_bl underline"
                      onClick={() => {
                        navigate("/settings");
                      }}
                      aria-label="stop modifying password"
                    >
                      here
                    </button>
                    {"  "} to exit this process.
                  </p>
                </div>{" "}
              </>

              <button
                type="submit"
                aria-label="submit changed password"
                className="bg-emerald-600 text-stone-100 px-3 py-1.5 self-end rounded-[3px] font-sourceSans_bold"
              >
                {isSubmitting ? "Wait" : "Save Changes"}
              </button>
            </div>
          </form>
          {err ? (
            <p className=" text-xs text-nowrap text-red-600 dark:text-red-500 opacity-85 font-sourceSans_bl pl-1.5 pt-1 ">
              An error has occured. try again
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ChangePasswordModal;
