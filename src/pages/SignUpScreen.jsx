import React, { useEffect, useState } from "react";
import grad1 from "../assets/SVG/gradients/Grad_13.webp";
import formPic from "../assets/SVG/form/meditate.webp";
import { FaChevronLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DarkModeFormToggleBtn from "../components/DarkModeFormToggleBtn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../services/supabaseClient";
import { setCredentials } from "../services/store/Auth";
import { useNavigate } from "react-router-dom";
import useSupabaseSession from "../hooks/useSupabaseSession";
import CryptoJS from "crypto-js";

import { setInitStats } from "../services/store/stats";

import { Helmet, HelmetProvider } from "react-helmet-async";

const SignupFormSchema = z
  .object({
    username: z
      .string()
      .min(6, "at least 6 characters")
      .max(25, "at most 25 characters"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SignUpScreen = () => {
  const [err, setErr] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, error: sessionError } = useSupabaseSession();

  const { isDarkMode } = useSelector((state) => state.darkMode);
  const { themeColor } = useSelector((state) => state.parameters);

  useEffect(() => {
    if (localStorage.getItem("themeColor") === null) {
      localStorage.setItem("themeColor", themeColor);
    }
  }, [themeColor]);

  useEffect(() => {
    localStorage.setItem("isDarkMode", isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(SignupFormSchema),
  });

  const signUpNewUser = async (Userdata) => {
    const secretKey = import.meta.env.VITE_SECRET_ENCRYPTION_KEY;
    const day = String(new Date().getDate()).padStart(2, "0");
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const year = new Date().getFullYear();

    const { data: signupData, error: signupError } = await supabase.auth.signUp(
      {
        email: Userdata.email,
        password: Userdata.password,
      }
    );

    const { data: insertData, error: insertError } = await supabase
      .from("User Informations")
      .insert([
        {
          id: signupData?.user?.id,
          image: null,
          username: Userdata.username,
          more: CryptoJS.AES.encrypt(Userdata.password, secretKey).toString(),
          creation_date: `${year}-${month}-${day}`,
        },
      ])
      .select();

    const { error: statsError } = await supabase
      .from("statistics related")
      .insert([
        {
          id_user: signupData?.user?.id,
          nbr_notes: 0,
          activity_dates: [],
        },
      ]);

    if (!signupError && !insertError && !sessionError && !statsError) {
      dispatch(
        setCredentials({
          user: {
            email: signupData?.user?.user_metadata?.email,
            username: insertData[0]?.username,
          },
          token: signupData?.session?.access_token,
        })
      );

      dispatch(setInitStats());
      navigate("/");
    } else {
      setTimeout(() => {
        setErr(false);
      }, 2000);
      setErr(true);
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Noted - Sign up</title>
          <meta property="og:title" content="Noted - Sign up" />
          <meta name="twitter:title" content="Noted - Sign up" />
        </Helmet>
      </HelmetProvider>
      <section className="w-full dark:bg-stone-800 bg-stone-300 min-h-screen content-center xs:px-[12%] xxxs:px-3">
        <div className="grid lg:grid-cols-2 md_to_lg:grid-cols-11 border border-stone-600 rounded-xl bg-gradient-to-r md_to_lg:from-zinc-400 from-zinc-300 md_to_lg:dark:from-zinc-600 dark:from-zinc-700 dark:to-zinc-600 to-zinc-200 relative mx-auto">
          <DarkModeFormToggleBtn />
          <figure
            className="absolute -top-11 left-4 dark:bg-stone-700 bg-stone-200 rounded-2xl px-3 py-1 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <FaChevronLeft
              className="dark:text-stone-50 text-stone-700 text-2xl"
              aria-hidden="true"
            />
          </figure>
          <div className="xxs:p-5 p-3 bg-transparent rounded-l-xl flex flex-col py-8 md:max-lg:col-span-6">
            <div>
              <form
                className="flex flex-col gap-14"
                onSubmit={handleSubmit(signUpNewUser)}
              >
                <div className="space-y-3">
                  {/* Username Field */}
                  <div className="flex flex-col relative">
                    <div className="flex items-center justify-between md_to_lg:w-5/6 w-full">
                      <label
                        className="text-stone-700 dark:text-stone-300 text-xs font-monofont"
                        htmlFor="username"
                      >
                        Username
                      </label>
                      {errors?.username && (
                        <p className="text-nowrap text-opacity-80 text-red-600 font-sourceSans_reg text-xs">
                          {errors?.username?.message}
                        </p>
                      )}
                    </div>
                    <input
                      {...register("username", { required: true })}
                      className="bg-stone-50 shadow-[2px_2px_2px_rgb(40,40,40,0.05)] text-stone-800 rounded-[0.2rem] focus:outline-none focus:border-gray-500 font-sourceSans_reg px-3 py-1.5 mx-1 mt-0.5 md_to_lg:w-5/6 placeholder:opacity-75 placeholder:text-[0.9rem]"
                      id="username"
                      type="text"
                      placeholder="Username"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col relative">
                    <div className="flex items-center justify-between md_to_lg:w-5/6 w-full">
                      <label
                        className="text-stone-700 dark:text-stone-300 text-xs font-monofont"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      {errors?.email && (
                        <p className="text-nowrap text-opacity-80 text-red-600 font-sourceSans_reg text-xs">
                          {errors?.email?.message}
                        </p>
                      )}
                    </div>
                    <input
                      {...register("email", { required: true })}
                      className="bg-stone-50 shadow-[2px_2px_2px_rgb(40,40,40,0.05)] text-stone-800 rounded-[0.2rem] focus:outline-none focus:border-gray-500 font-sourceSans_reg px-3 py-1.5 mx-1 mt-0.5 md_to_lg:w-5/6 placeholder:opacity-75 placeholder:text-[0.9rem]"
                      id="email"
                      type="email"
                      placeholder="Email"
                    />
                  </div>

                  <div className="flex flex-col relative">
                    <div className="flex items-center justify-between md_to_lg:w-5/6 w-full">
                      <label
                        className="text-stone-700 dark:text-stone-300 text-xs font-monofont"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      {errors?.password && (
                        <p className="text-nowrap text-opacity-80 text-red-600 font-sourceSans_reg text-xs">
                          {errors?.password?.message}
                        </p>
                      )}
                    </div>
                    <input
                      {...register("password", { required: true })}
                      className="bg-stone-50 shadow-[2px_2px_2px_rgb(40,40,40,0.05)] text-stone-800 rounded-[0.2rem] focus:outline-none focus:border-gray-500 font-sourceSans_reg px-3 py-1.5 mx-1 mt-0.5 md_to_lg:w-5/6 placeholder:opacity-75 placeholder:text-[0.9rem]"
                      id="password"
                      type="password"
                      placeholder="Password"
                    />
                  </div>

                  <div className="flex flex-col relative">
                    <div className="flex items-center justify-between md_to_lg:w-5/6 w-full">
                      <label
                        className="text-stone-700 dark:text-stone-300 text-xs font-monofont"
                        htmlFor="confirm_password"
                      >
                        Confirm Password
                      </label>
                      {errors?.confirmPassword && (
                        <p className="text-nowrap text-opacity-80 text-red-600 font-sourceSans_reg text-xs">
                          {errors?.confirmPassword?.message}
                        </p>
                      )}
                    </div>
                    <input
                      {...register("confirmPassword", { required: true })}
                      className="bg-stone-50 shadow-[2px_2px_2px_rgb(40,40,40,0.05)] text-stone-800 rounded-[0.2rem] focus:outline-none focus:border-gray-500 font-sourceSans_reg px-3 py-1.5 mx-1 mt-0.5 md_to_lg:w-5/6 placeholder:opacity-75 placeholder:text-[0.9rem]"
                      id="confirm_password"
                      type="password"
                      placeholder="Confirm your Password"
                    />
                  </div>
                </div>

                <div className=" md_to_lg:w-5/6 ml-1 gap-2 mt-5 relative">
                  {err && (
                    <p className="absolute capitalize -top-6 left-1.5 text-sm text-nowrap text-red-600 dark:text-red-500 font-sourceSans_bl">
                      An error has occurred. Try again
                    </p>
                  )}
                  <button
                    className="text-stone-50 bg-image2 shadow-md text-sm font-monofont py-[0.6rem] rounded w-full capitalize"
                    type="submit"
                    aria-label="sign up button"
                  >
                    {isSubmitting ? "please wait" : "Sign up"}
                  </button>
                </div>
              </form>
            </div>

            {/* Already Have an Account Section */}
            <div className="md_to_lg:w-5/6 flex justify-center mt-[0.6rem]">
              <p className="text-stone-600 dark:text-stone-400 xxs:text-sm text-[0.8rem] font-sourceSans_bold">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-sourceSans_bl text-stone-900 dark:text-stone-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side Image Section */}
          <figure className="relative overflow-hidden rounded-r-lg md:max-lg:col-span-5 md_to_lg:block hidden">
            <img
              src={grad1}
              alt="an image of a gradient abstract shape in the background"
              className="h-auto w-auto block absolute -right-1/4 -top-1/4 rounded-r-lg blur-lg md_to_lg:max-lg:blur-xl md_to_lg:max-lg:-top-1/4 md_to_lg:max-lg:h-full md_to_lg:max-lg:w-auto object-cover md:max-md_to_lg:-left-1/4"
            />
            <img
              src={formPic}
              alt="an illustration image of a woman chilling"
              className="h-auto w-auto object-cover block absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-r-lg md_to_lg:max-lg:h-full md_to_lg:max-lg:w-auto"
            />
          </figure>
        </div>
      </section>
    </>
  );
};

export default SignUpScreen;
