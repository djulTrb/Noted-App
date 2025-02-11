import React from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import { deleteNote } from "../services/store/note";

import { IoClose } from "react-icons/io5";
import { PiNotePencilBold } from "react-icons/pi";

import classNames from "classnames";
import { motion } from "motion/react";

import NoteContentDisplayArea from "./NoteContentDisplayArea";

import { supabase } from "../services/supabaseClient";

const NoteContent = ({ setNoteContentOff, Ncontent }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const returnRandomClass = (gradient_id) => {
    const gradientBackground = classNames({
      brown_noteContent: gradient_id === 1,
      red_noteContent: gradient_id === 2,
      RoseFog_noteContent: gradient_id === 3,
      greenPearl_noteContent: gradient_id === 4,
      teal_noteContent: gradient_id === 5,
      bluePowder_noteContent: gradient_id === 6,
      orange_noteContent: gradient_id === 7,
      amber_noteContent: gradient_id === 8,
      grayViolet_noteContent: gradient_id === 9,
      grayRed_noteContent: gradient_id === 10,
      grayRose_noteContent: gradient_id === 11,
      PearlGreen_noteContent: gradient_id === 12,
      midnightBlue_noteContent: gradient_id === 13,
      silverMist_noteContent: gradient_id === 14,
      Orangeish_noteContent: gradient_id === 15,
    });
    return gradientBackground;
  };

  const handleDeleteNote = async () => {
    const { data, error } = await supabase
      .from("notes")
      .delete()
      .eq("id_note", Ncontent.id)
      .select();

    if (!error) {
      dispatch(deleteNote(data?.[0]?.id_note));
    }
  };

  return (
    <>
      <div className="absolute inset-0 z-[9000] bg-[#1c1917a6] size-full backdrop-blur-sm"></div>

      <motion.div
        className={`absolute md_to_lg:inset-10 opacity-85 backdrop-blur-sm md_to_lg:rounded-t-3xl md_to_lg:rounded-b-md inset-0 rounded-none md_to_lg:max-h-[90vh] z-[10000] overflow-clip grid grid-rows-4 bg-stone-300 ${returnRandomClass(
          Ncontent.color
        )}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="row-start-1 bg-stone-300 px-6 py-2 pt-4  flex flex-col justify-between">
          <button
            className="absolute top-4 right-7"
            onClick={() => {
              setNoteContentOff({});
            }}
          >
            <IoClose className="text-3xl text-red-600" />
          </button>
          <h1 className="xl:text-4xl sm:text-3xl text-2xl font-sourceSans_bl text-stone-700 lg:line-clamp-1 md_to_lg:line-clamp-2  line-clamp-3 xl:pr-28 pr-16">
            {Ncontent.title}
          </h1>
          <ul className="flex justify-end items-center md_to_lg:gap-3 gap-2">
            <li
              className="flex gap-1 items-center
              text-stone-200 font-sourceSans_bold md_to_lg:px-4 px-2 py-1 duration-300 bg-stone-200 border-opacity-65 w-fit rounded-2xl cursor-pointer xxxs:max-md_to_lg:text-sm"
              onClick={() => {
                navigate(`edit/${Ncontent.id}`);
              }}
            >
              <button>Update</button>
              <PiNotePencilBold />
            </li>
            <li
              className="flex gap-1.5 items-center text-stone-800 font-sourceSans_bold md_to_lg:px-4 px-2  py-1 border border-stone-700 border-opacity-40 bg-stone-200 cursor-pointer w-fit rounded-2xl xxxs:max-md_to_lg:text-sm"
              onClick={async () => {
                await handleDeleteNote();
                window.location.reload();
              }}
            >
              <button className="text-stone-700">Delete</button>
            </li>
          </ul>
        </div>
        <div className="bg-stone-200 row-start-2 row-span-full w-full p-3 md_to_lg:px-6  overflow-auto hiddenScroll border-t border-stone-400">
          {Ncontent.tags.length > 0 && (
            <ul className="flex justify-start py-1.5 pb-3.5 gap-3.5 overflow-x-auto scroll_none border-b border-stone-400">
              {Ncontent.tags.length > 0 &&
                Ncontent.tags.map((tag, idx) => {
                  return (
                    <li
                      key={idx}
                      className={`text-stone-900 relative px-3 py-1 dark:bg-opacity-70 backdrop-blur font-sourceSans_reg tracking-wide rounded-full text-sm text-nowrap border border-stone-400 cursor-default bg-[#ffcbad]`}
                    >
                      {tag?.val}
                    </li>
                  );
                })}
            </ul>
          )}
          <NoteContentDisplayArea content={Ncontent.content} />
        </div>
      </motion.div>
    </>
  );
};

export default NoteContent;
