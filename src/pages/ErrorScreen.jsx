import React from "react";
import { CgArrowTopRight } from "react-icons/cg";
import { NavLink } from "react-router-dom";

import grad from "../assets/SVG/gradients/Grad_11.webp";

import image from "../assets/SVG/404/Something_went_wrong.webp";

import { Helmet, HelmetProvider } from "react-helmet-async";

const ErrorScreen = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Noted</title>
          <meta property="og:title" content="Noted" />
          <meta name="twitter:title" content="Noted" />
        </Helmet>
      </HelmetProvider>

      <div className="h-screen w-screen flex items-center justify-center bg-stone-700 relative overflow-hidden">
        <img
          src={grad}
          alt="gradient image for blurry blob effect"
          className="absolute size-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover opacity-40 blur-[140px]"
        />
        <div className="flex items-center z-20 justify-center">
          <div className="flex items-center relative">
            <h1 className="text-[12rem] font-purity text-stone-300 z-20 ">
              404
            </h1>
            <p className="w-min text-stone-400 font-purity uppercase z-20 text-sm">
              page Not Found
            </p>
            <NavLink
              to={"/"}
              className="flex items-center self-end font-purity absolute -bottom-2 -right-0 text-stone-300 uppercase z-20 text-lg"
            >
              <p>Return Home</p>
              <CgArrowTopRight className="text-xl" />
            </NavLink>
          </div>
          <figure className="w-96 absolute h-auto opacity-15">
            <img
              src={image}
              alt="404 page illustration images"
              className="w-full h-full block object-cover"
            />
          </figure>
        </div>
      </div>
    </>
  );
};

export default ErrorScreen;
