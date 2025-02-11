import React, { useEffect, useState } from "react";
import AddBtn from "../components/AddBtn";
import SignupWarning from "../components/SignupWarning";
import CircularBtn from "../components/CircularBtn";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import classNames from "classnames";
import NotesSearchAndFilter from "../components/NotesSearchAndFilter";
import { useOutletContext } from "react-router";

import { Helmet, HelmetProvider } from "react-helmet-async";

const Notes = () => {
  const { setNoteModalIsOpen: setNoteContentOn } = useOutletContext();
  const navigate = useNavigate();
  const { themeColor } = useSelector((state) => state.parameters);
  const notes = useSelector((state) => state.note);
  const { selectedTags, searchTitle } = useSelector(
    (state) => state.notesSectionActions
  );
  const [gridArr, setGridArr] = useState([]);

  const rand = () => Math.floor(Math.random() * 4) + 1;

  const randomPositioningGrid = () => {
    let previousRnd = 0;
    const newGridArr = [];

    for (let note in notes) {
      let rnd = rand();

      while (rnd === 2 && previousRnd === 2) {
        rnd = rand();
      }

      previousRnd = rnd;
      newGridArr.push(rnd);
    }

    setGridArr(newGridArr);
  };

  useEffect(() => {
    if (notes.length > 0 && gridArr.length === 0) {
      randomPositioningGrid();
    }
  }, [notes]);

  const cln = classNames({
    " text-orange-700 dark:text-orange-500": themeColor === "orange",
    "text-violet-700 dark:text-violet-500": themeColor === "violet",
    "text-lime-700 dark:text-lime-500": themeColor === "lime",
    "text-sky-700 dark:text-sky-500": themeColor === "sky",
    "text-rose-700 dark:text-rose-500": themeColor === "rose",
  });

  const returnRandomClass = (gradient_id) => {
    const gradientBackground = classNames({
      brown_note: gradient_id === 1,
      red_note: gradient_id === 2,
      RoseFog_note: gradient_id === 3,
      greenPearl_note: gradient_id === 4,
      teal_note: gradient_id === 5,
      bluePowder_note: gradient_id === 6,
      orange_note: gradient_id === 7,
      amber_note: gradient_id === 8,
      grayViolet_note: gradient_id === 9,
      grayRed_note: gradient_id === 10,
      grayRose_note: gradient_id === 11,
      PearlGreen_note: gradient_id === 12,
      midnightBlue_note: gradient_id === 13,
      silverMist_note: gradient_id === 14,
      Orangeish_note: gradient_id === 15,
    });

    return gradientBackground;
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Noted - Notes</title>
          <meta property="og:title" content="Noted - Notes" />
          <meta name="twitter:title" content="Noted - Notes" />
        </Helmet>
      </HelmetProvider>
      <SignupWarning />
      <CircularBtn />
      <section className="px-10 xxxs:max-xxs:px-2 xxs:max-xs:px-3 lg:pt-3 md_to_lg:pt-5 pt-5 ">
        <div className="flex items-center justify-between text-violet-600">
          <h1 className="w-fit lg:text-7xl md_to_lg:text-6xl text-6xl xxxs:max-xxs:text-5xl dark:text-stone-200 text-stone-800 font-sourceSans_bl tracking-[-0.2rem]">
            Notes
          </h1>
          <AddBtn
            btnText="Note"
            addNote={() => {
              navigate("/addNewNote");
            }}
          />
        </div>

        <hr className="w-full opacity-50 bg-stone-400 border-none h-[1.5px] mt-2 text-lime-100" />

        <NotesSearchAndFilter />

        <ul className="grid xxxs:grid-cols-1 sm:grid-cols-2 md_to_lg:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-[13rem] grid-flow-row-dense pt-7 pb-32 gap-5">
          {notes.length > 0 ? (
            notes
              .filter((note) => {
                if (selectedTags.length === 0) {
                  return true;
                }
                return selectedTags.every((selectedTag) =>
                  note.tags.some((noteTag) => noteTag.val === selectedTag.val)
                );
              })
              .filter((note) => {
                return note.title.includes(searchTitle);
              })
              .map((note, ind) => {
                const clnGrid = classNames({
                  "col-span-1 row-span-1":
                    gridArr[ind] >= 3 || ind === notes.length - 1,
                  "col-span-2 row-span-1":
                    gridArr[ind] === 2 && ind !== notes.length - 1,
                  "col-span-1 row-span-2":
                    gridArr[ind] === 1 && ind !== notes.length - 1,
                });

                return (
                  <li
                    key={ind}
                    className={`py-4 ${clnGrid} relative rounded-3xl flex flex-col justify-between dark:bg-opacity-100 bg-opacity-30 cursor-pointer xxxs:max-sm:row-span-1 xxxs:max-sm:col-span-1 shadow-sm ${returnRandomClass(
                      note?.gradient_id
                    )}`}
                    onClick={() => {
                      setNoteContentOn({
                        id: note?.id,
                        title: note?.title,
                        created: note?.created_on?.date,
                        tags: note?.tags,
                        color: note?.gradient_id,
                        content: note?.text_value,
                      });
                    }}
                  >
                    <div className="z-20">
                      <h1
                        className={`font-sourceSans_bl tracking-[-0.05rem] text-[2.1rem] text-wrap line-clamp-2 leading-8 h-fit px-2 p-1`}
                      >
                        {note?.title || ""}
                      </h1>

                      <div className="flex flex-col px-2 ml-1 mix-blend-normal py-1.5">
                        <span
                          className={`text-[0.65rem] font-monofont z-50 w-fit ${cln}`}
                        >
                          Cre. {note?.created_on?.date}
                          {" - "}
                          {note?.created_on?.time.match(/\d{2}:\d{2}/)}
                        </span>

                        <span
                          className={`text-[0.65rem] font-monofont z-50 w-fit ${cln}`}
                        >
                          {Object.keys(note?.updated_last_on || {}).length >
                            0 &&
                            `Upd. ${note?.updated_last_on?.date} -
                          ${note?.updated_last_on?.time.match(/\d{2}:\d{2}/)}`}
                        </span>
                      </div>
                    </div>

                    <div className="w-full px-2 z-20">
                      <ul className="flex justify-start gap-2 overflow-x-auto scroll_none rounded-xl">
                        {note?.tags &&
                          note.tags.map((tag, idx) => {
                            return (
                              <li
                                key={tag?.gradient_id || idx}
                                className={`text-stone-950 relative px-3 py-1 dark:bg-opacity-70 backdrop-blur font-sourceSans_reg tracking-wide rounded-full text-sm text-nowrap`}
                              >
                                {tag?.val}
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </li>
                );
              })
          ) : (
            <p className="text-stone-400 xxs:text-3xl xxxs:text-xl text-opacity-60 text-center col-span-full font-purity">
              Notes list is empty, click on{" "}
              <span className="text-nowrap">'note +'</span> to add a new note
            </p>
          )}
        </ul>
      </section>
    </>
  );
};

export default Notes;
