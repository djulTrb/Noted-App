import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { ResponsiveCalendar } from "@nivo/calendar";
import "@fontsource/source-sans-pro";
import moment from "moment";

const HeatChart = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { creation_date, heatData } = useSelector((state) => state.stats);
  const { themeColor } = useSelector((state) => state.parameters);
  const { isDarkMode } = useSelector((state) => state.darkMode);

  const colorSchemes = {
    orange: ["#ffedd5", "#fdba74", "#fb923c", "#f97316", "#ea580c"],
    violet: ["#ede9fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed"],
    lime: ["#ecfccb", "#d9f99d", "#bef264", "#a3e635", "#65a30d"],
    sky: ["#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0284c7"],
    rose: ["#ffe4e6", "#fda4af", "#fb7185", "#f43f5e", "#e11d48"],
  };

  const heatmapColors = colorSchemes[themeColor] || colorSchemes.orange;

  const dayNow = moment().format("YYYY-MM-DD");

  const [startDate, setStartDate] = useState(dayNow);

  useEffect(() => {
    if (creation_date) {
      setStartDate(creation_date);
    }
  }, [creation_date]);

  return (
    <div className="lg:col-span-full lg:row-start-2 row-span-1  md_to_lg:col-start-1 xs:rounded-2xl relative bg-stone-100 dark:bg-stone-700 dark:border-stone-600 shadow border border-stone-300 p-2 overflow-x-auto hiddenScroll cursor-default">
      <h2 className="font-sourceSans_bold text-[1.2rem] text-stone-700 dark:text-stone-300 xxxs:max-sm:sticky xxxs:max-sm:left-2 ">
        Heat Map:{" "}
        <span className="text-stone-500 dark:text-stone-400 font-purity leading-6 text-lg pl-3">
          Your Note-Taking Activity Over Time :
        </span>
      </h2>
      <div style={{ height: "240px", minWidth: "600px" }}>
        <ResponsiveCalendar
          data={
            heatData.length > 0 ? heatData : [{ value: 0, day: "1970-01-01" }]
          }
          from={startDate}
          to={`${new Date().getFullYear()}-${String(
            new Date().getMonth() + 1
          ).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`}
          emptyColor={isDarkMode ? "#78716c" : "#d6d3d1"}
          colors={heatmapColors}
          margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
          yearSpacing={40}
          monthBorderColor={isDarkMode ? "#44403c" : "#f5f5f4"}
          dayBorderWidth={3}
          dayBorderColor={isDarkMode ? "#44403c" : "#f5f5f4"}
          theme={{
            fontFamily: "Source Sans Pro, sans-serif",
            fontSize: 12,
            labels: {
              text: { fontSize: 12, fill: isDarkMode ? "#bbb" : "#444" },
            },
            legends: {
              text: { fontSize: 12, fill: isDarkMode ? "#bbb" : "#444" },
            },
            axis: {
              legend: {
                text: { fontSize: 12, fill: isDarkMode ? "#bbb" : "#444" },
              },
              ticks: {
                text: { fontSize: 12, fill: isDarkMode ? "#bbb" : "#444" },
              },
            },
          }}
          legends={[
            {
              anchor: "bottom-right",
              direction: "row",
              translateY: 36,
              itemCount: 5,
              itemWidth: 42,
              itemHeight: 36,
              itemsSpacing: 14,
              itemDirection: "right-to-left",
            },
          ]}
          tooltip={({ day, value }) => (
            <div
              style={{
                background: "white",
                padding: "6px 8px",
                borderRadius: "4px",
                boxShadow: "0px 0px 4px rgba(0,0,0,0.2)",
              }}
              className="text-nowrap"
            >
              <span className="font-purity text-stone-600 text-xl">
                {day} :
              </span>{" "}
              <span className="font-purity text-xl">
                {value} {Number(value) > 1 ? "Logs" : "Log"}
              </span>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default HeatChart;
