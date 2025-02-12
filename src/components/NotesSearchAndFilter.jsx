import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { IoSearchSharp } from "react-icons/io5";
import { PiMouseScroll } from "react-icons/pi";

import { IoClose } from "react-icons/io5";

import classNames from "classnames";

import {
  selectTag,
  unselectTag,
  setSearchTitleValue,
  unselectAllTags,
} from "../services/store/NotesSectionActions";

const NotesSearchAndFilter = () => {
  const dispatch = useDispatch();
  const { tags } = useSelector((state) => state.notesSectionActions);
  const [SearchVal, setSearchVal] = useState("");
  const { themeColor } = useSelector((state) => state.parameters);
  const notes = useSelector((state) => state.note);

  const cln = classNames({
    "bg-orange-600 text-stone-100 dark:bg-orange-300 dark:text-orange-800":
      themeColor === "orange",
    "bg-violet-600 text-stone-100 dark:bg-violet-300 dark:text-violet-800":
      themeColor === "violet",
    "bg-lime-600 text-stone-100 dark:bg-lime-300 dark:text-lime-800":
      themeColor === "lime",
    "bg-sky-600 text-stone-100 dark:bg-sky-300 dark:text-sky-800":
      themeColor === "sky",
    "bg-rose-600 text-stone-100 dark:bg-rose-300 dark:text-rose-800":
      themeColor === "rose",
  });

  return (
    <>
      {notes.length > 0 && (
        <div className="mt-5 mb-6 flex justify-end">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex items-center  justify-between rounded-lg border-stone-400 border md:w-1/3 xs:w-2/4 xxs:w-2/3 xxxs:w-full xxxs:max-xxs:mx-4 bg-[#f4f2f1] px-1 h-[2.4rem]"
          >
            <input
              type="text"
              placeholder="Search by title..."
              value={SearchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-stone-600 h-full w-11/12 px-1 font-sourceSans_reg placeholder:text-sm"
            />
            {SearchVal && (
              <button
                aria-label="remove search"
                className="p-0.5"
                onClick={() => {
                  dispatch(unselectAllTags());
                  dispatch(setSearchTitleValue(""));
                  setSearchVal("");
                }}
              >
                <IoClose
                  className="text-stone-400 text-xl "
                  aria-hidden="true"
                />
              </button>
            )}

            <button
              type="submit"
              aria-label="submit search"
              className="p-1.5"
              onClick={() => {
                dispatch(unselectAllTags());
                dispatch(setSearchTitleValue(SearchVal));
              }}
            >
              <IoSearchSharp
                className="text-stone-400 text-xl"
                aria-hidden="true"
              />
            </button>
          </form>
        </div>
      )}
      {tags.length > 0 && (
        <div className="relative">
          <PiMouseScroll
            className="absolute left-9 -top-7 text-2xl text-stone-400 dark:text-stone-300 rotate-90 xxxs:max-sm:hidden"
            aria-hidden="true"
          />
          <div className="md_to_lg:w-[calc(87vw-10rem)] md:w-[calc(87vw-0rem)] mx-auto overflow-hidden relative after:right-0 after:bg-gradient-to-l after:from-stone-200 dark:after:from-stone-800 after:to-transparent before:left-0 before:bg-gradient-to-r before:from-stone-200 dark:before:from-stone-800 before:to-transparent blurred-list-container">
            <ul className="flex gap-4 overflow-x-auto horizontal-list px-8">
              {tags.map((tag, index) => {
                return (
                  <li
                    onClick={() => {
                      dispatch(setSearchTitleValue(""));
                      if (tag.selected) {
                        dispatch(unselectTag(tag.id));
                      } else {
                        dispatch(selectTag(tag.id));
                      }
                    }}
                    key={index}
                    className={`px-4 py-1 text-sm font-sourceSans_reg rounded-md border cursor-pointer shadow-inner ${
                      tag.selected
                        ? `border-none ${cln}`
                        : "border-stone-400 dark:border-stone-200 text-stone-500 dark:text-stone-100 bg-[#e6e5e4] dark:bg-stone-600"
                    } text-nowrap`}
                  >
                    {tag.val}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default NotesSearchAndFilter;
