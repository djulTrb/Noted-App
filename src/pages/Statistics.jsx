import React from "react";
import SignupWarning from "../components/SignupWarning";
import CircularBtn from "../components/CircularBtn";
import classNames from "classnames";
import { useSelector } from "react-redux";
import fire_col from "../assets/SVG/stats/fire_col.webp";
import fire from "../assets/SVG/stats/fire.webp";

import AreaChart from "../components/AreaChart";
import HeatChart from "../components/HeatChart";

import NotLoggedInStats from "../components/NotLoggedInStats";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Statistics = () => {
  const { themeColor } = useSelector((state) => state.parameters);
  const { nbrNotes } = useSelector((state) => state.stats);
  const { token } = useSelector((state) => state.auth);

  const clnText = classNames({
    "text-orange-600": themeColor === "orange",
    "text-violet-600": themeColor === "violet",
    "text-lime-600": themeColor === "lime",
    "text-sky-600": themeColor === "sky",
    "text-rose-600": themeColor === "rose",
  });

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Noted - Statistics</title>
          <meta property="og:title" content="Noted - Statistics" />
          <meta name="twitter:title" content="Noted - Statistics" />
        </Helmet>
      </HelmetProvider>

      <SignupWarning />
      <CircularBtn />

      <section className="xs:px-10 lg:py-3 md_to_lg:py-5 py-5 overflow-x-clip">
        <h1 className="w-fit lg:text-7xl md_to_lg:text-6xl text-6xl dark:text-stone-200 text-stone-800 font-sourceSans_bl tracking-[-0.2rem] xxxs:max-xxs:px-2 xxs:max-xs:px-3">
          Statistics
        </h1>

        <hr className="w-full opacity-50 bg-stone-400 border-none  h-[1.5px] mt-2 xxxs:max-xxs:px-2 xxs:max-xs:px-3" />
        {!token ? (
          <NotLoggedInStats />
        ) : (
          <div className="grid lg:grid-rows-[18rem_18rem] md_to_lg:grid-rows-[18rem_18rem_18rem] lg:grid-cols-10 gap-5 my-5">
            <div className="lg:col-span-3 row-span-1 md_to_lg:col-start-1 xs:rounded-2xl relative bg-stone-100 dark:bg-stone-700 dark:border-stone-600 shadow border border-stone-300 grid grid-rows-[0rem_auto] p-2 overflow-hidden cursor-default">
              <img
                src={nbrNotes > 0 ? fire_col : fire}
                alt="fire 3d icon"
                className="w-auto lg:h-64 absolute -bottom-20 xl:-right-28 lg:-right-[45%] xxxs:-right-40 xxs:h-80 h-72 rotate-[20deg] block z-20 object-cover"
              />
              <div>
                <h2 className="font-sourceSans_bold text-[1.2rem] text-stone-700 dark:text-stone-300">
                  Ever Created
                </h2>
                <p className="text-stone-500 dark:text-stone-400 font-purity leading-6 text-[0.97rem] pl-3">
                  Number of notes you've created
                </p>
              </div>
              <div className="flex items-center justify-center">
                <p
                  className={`${clnText} text-[8rem] text-center font-purity z-20 `}
                >
                  {nbrNotes}
                </p>
              </div>
            </div>
            <HeatChart />

            <AreaChart />
          </div>
        )}
      </section>
    </>
  );
};

export default Statistics;
