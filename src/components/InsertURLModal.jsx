import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { FaXmark } from "react-icons/fa6";

const schema = z.object({
  URL: z.string().url(),
});

const InsertURLModal = ({ handleCloseModal, modalType, editor }) => {
  const { isDarkMode } = useSelector((state) => state.darkMode);

  useEffect(() => {
    if (localStorage.getItem("themeColor") === null) {
      localStorage.setItem("themeColor", themeColor);
    }
  }, []);

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
    resolver: zodResolver(schema),
  });

  const submit = async (data) => {
    const url = await data.URL;
    if (data.URL && modalType === "image") {
      editor.chain().focus().setImage({ src: url }).run();
    } else if (data.URL && modalType === "video") {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 480,
        height: 280,
      });
    } else {
      if (url === null) {
        handleCloseModal();
        return;
      }

      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        handleCloseModal();
        return;
      }

      editor.commands.setLink({ href: url, target: "_blank" });
    }
    handleCloseModal();
  };

  return (
    <>
      <div className="absolute inset-0 bg-[rgb(0,0,0,0.4)] backdrop-blur-[3px] z-[2999]"></div>
      <div className="z-[3000] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-20 bg-stone-200 w-96 rounded-md border border-stone-600 h-52 flex flex-col justify-start items-start p-4 gap-3">
        <FaXmark
          className="absolute top-3 cursor-pointer right-4 text-xl text-red-700"
          onClick={handleCloseModal}
        />
        <h2 className="text-xl font-sourceSans_bl text-stone-700 text-center ">
          {modalType === "image"
            ? "Insert picture's URL"
            : modalType === "link"
            ? "Insert Link"
            : "Insert Youtube Video's URL"}
        </h2>
        <form className="w-full px-1" onSubmit={handleSubmit(submit)}>
          <input
            type="text"
            {...register("URL")}
            className="w-full p-1.5 border border-stone-400 rounded placeholder:text-sm font-sourceSans_bold text-stone-700 focus:outline-none shadow-inner"
            placeholder={
              modalType === "image"
                ? "eg. https://yourIMG_URL.com"
                : modalType === "link"
                ? "eg. https://linkURL.com"
                : "eg. https://Youtube_VidURL.com"
            }
          />
          <button
            type="submit"
            disabled={isSubmitting}
            aria-label="submit"
            className="bg-red-600 text-white rounded shadow-inner px-4 py-1.5 absolute bottom-6  right-5 text-sm font-sourceSans_bold capitalize"
          >
            {isSubmitting ? "Wait" : "Insert"}
          </button>
        </form>
        {errors.URL && (
          <p className="text-xs text-red-600 absolute left-6 bottom-[5.5rem] font-sourceSans_bl">
            {errors.URL.message}
          </p>
        )}
      </div>
    </>
  );
};

export default InsertURLModal;
