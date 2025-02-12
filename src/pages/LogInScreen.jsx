import React, { useEffect, useState } from "react";
import grad1 from "../assets/SVG/gradients/Grad_11.webp";
import formPic from "../assets/SVG/form/jump.webp";
import { FaChevronLeft } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import DarkModeFormToggleBtn from "../components/DarkModeFormToggleBtn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../services/supabaseClient";
import useSupabaseSession from "../hooks/useSupabaseSession";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

import { Helmet, HelmetProvider } from "react-helmet-async";

const SignupFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
});

const LogInScreen = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const [Show, setShow] = useState(false);

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

  const login = async (Userdata) => {
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: Userdata.email,
      password: Userdata.password,
    });

    if (loginError) {
      setTimeout(() => {
        setErr(false);
      }, 2000);
      setErr(true);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Noted - Log in</title>
          <meta property="og:title" content="Noted - Log in" />
          <meta name="twitter:title" content="Noted - Log in" />
        </Helmet>
      </HelmetProvider>
      <section className="w-full dark:bg-stone-800 bg-stone-300 min-h-screen content-center xs:px-[12%] xxxs:px-3">
        <div className="grid md_to_lg:grid-cols-2 md:max-md_to_lg:grid-cols-11 border border-stone-600 rounded-xl bg-gradient-to-r md_to_lg:from-zinc-400 from-zinc-300 md_to_lg:dark:from-zinc-600 dark:from-zinc-700 dark:to-zinc-600 to-zinc-200 relative mx-auto">
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
          <div className="p-5 xxxs:max-xs:px-2 bg-transparent rounded-l-xl flex flex-col py-8 md:max-md_to_lg:col-span-6">
            <div>
              <form
                className="flex flex-col gap-14"
                onSubmit={handleSubmit(login)}
              >
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <label
                      className="text-stone-700 dark:text-stone-300 text-xs font-monofont"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      {...register("email", { required: true })}
                      className="bg-[#e8f0fe] shadow-[2px_2px_2px_rgb(40,40,40,0.05)] text-stone-800 rounded-[0.2rem] focus:outline-none focus:border-gray-500 font-sourceSans_reg px-2 py-1.5 mx-1 mt-1 md:w-5/6 placeholder:opacity-75 placeholder:text-[0.9rem]"
                      id="email"
                      type="text"
                      placeholder="Email"
                    />
                    {errors?.email && (
                      <p className="text-nowrap mt-0.5 text-opacity-80 text-red-600 font-sourceSans_reg text-xs">
                        {errors?.email?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label
                      className="text-stone-700 dark:text-stone-300 text-xs font-monofont"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="bg-[#e8f0fe] shadow-[2px_2px_2px_rgb(40,40,40,0.05)] rounded-[0.2rem] mx-1 mt-0.5 md:w-5/6 flex items-center justify-between">
                      <input
                        {...register("password", { required: true })}
                        className=" text-stone-800 bg-[#e8f0fe] focus:outline-none focus:border-gray-500 font-sourceSans_reg w-11/12 placeholder:opacity-75 px-2 py-1.5 rounded-[0.2rem] placeholder:text-[0.9rem]"
                        id="password"
                        type={Show ? "text" : "password"}
                        placeholder="Password"
                      />

                      <button
                        type="button"
                        onClick={() => setShow(!Show)}
                        className="w-1/12 pr-2 flex items-center justify-center"
                      >
                        {" "}
                        {Show ? (
                          <VscEyeClosed
                            className=" text-stone-600 cursor-pointer text-[1.4rem]"
                            aria-hidden="true"
                          />
                        ) : (
                          <VscEye
                            className=" text-stone-600 cursor-pointer text-[1.4rem]"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </div>
                    {errors?.password && (
                      <p className="text-nowrap mt-0.5 text-opacity-80 text-red-600 font-sourceSans_reg text-xs">
                        {errors?.password?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className=" md:w-5/6 ml-1 mt-5 relative">
                  {err && (
                    <p className="text-sm text-nowrap text-red-600 dark:text-red-500 font-sourceSans_bl absolute capitalize -top-6 left-1.5">
                      An error has occurred. Try again
                    </p>
                  )}
                  <button
                    className="bg-image1 text-stone-50 shadow-md text-sm font-monofont py-[0.6rem] rounded w-full capitalize"
                    type="submit"
                    aria-label="submit button"
                  >
                    {isSubmitting ? "please wait" : "Log in"}
                  </button>
                </div>
              </form>
            </div>

            <div className="md:w-5/6 flex justify-center mt-[0.6rem]">
              <p className="text-stone-600 dark:text-stone-400 text-sm font-sourceSans_bold">
                Still not signed up?{" "}
                <Link
                  to="/signup"
                  className="font-sourceSans_bl text-stone-800 dark:text-stone-300"
                >
                  Sign up now!
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side Image Section */}
          <figure className="relative overflow-hidden rounded-r-lg md:max-md_to_lg:col-span-5">
            <img
              src={grad1}
              alt="an image of a gradient abstract shape in the background"
              className="h-auto w-auto block absolute -right-1/4 -top-1/2 rounded-r-lg blur-md md:max-md_to_lg:top-0"
            />
            <img
              src={formPic}
              alt="an illustration image of a woman meditating"
              className="h-auto w-auto object-cover block absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 "
            />
          </figure>
        </div>
      </section>
    </>
  );
};

export default LogInScreen;
