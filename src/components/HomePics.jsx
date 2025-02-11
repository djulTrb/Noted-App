import React from "react";
import notes_dark from "../assets/Pictures/homescreen/notes_dark.webp";
import notes_light from "../assets/Pictures/homescreen/notes_light.webp";
import stats_dark from "../assets/Pictures/homescreen/stats_dark.webp";
import stats_light from "../assets/Pictures/homescreen/stats_light.webp";

import { useSelector } from "react-redux";

const HomePics = () => {
  const { isDarkMode } = useSelector((state) => state.darkMode);

  return (
    <>
      <figure className="xl:h-[38rem] lg:h-[32rem] md_to_lg:h-[25rem] md:h-[29rem] w-auto absolute -top-14 lg:-right-24 xl:-right-14 md_to_lg:-right-14 md:-right-16">
        <img
          src={isDarkMode ? notes_dark : notes_light}
          alt="Screenshot of the notes section in the app, showcasing it on the homescreen"
          className="rounded-lg shadow-2xl border border-stone-400 dark:border-stone-600 object-cover h-full w-auto block"
        />
        <figcaption className="sr-only">Notes section preview</figcaption>
      </figure>
      <figure className="xl:h-[18rem] lg:h-[15rem] md_to_lg:h-[12rem] md:h-[14rem] w-auto absolute top-14 xl:right-0 lg:-right-12 md_to_lg:-right-14 md:-right-12">
        <img
          src={isDarkMode ? stats_dark : stats_light}
          alt="Screenshot of the statistics section in the app, showcasing it on the homescreen"
          className="rounded-lg shadow-2xl border border-stone-400 dark:border-stone-600 object-cover h-full w-auto block"
        />
        <figcaption className="sr-only">Statistics section preview</figcaption>
      </figure>
    </>
  );
};

export default HomePics;
