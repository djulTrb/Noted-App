import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import ReactApexChart from "react-apexcharts";
import moment from "moment";

import "@fontsource/source-sans-pro";

const AreaChart = () => {
  const navigate = useNavigate();
  const { themeColor } = useSelector((state) => state.parameters);
  const [chartColor, setChartColor] = useState("#00000000");
  const { creation_date, areaData } = useSelector((state) => state.stats);

  const [dataSet, setDataSet] = useState(
    areaData.length > 0 ? areaData : [{ x: creation_date, y: 0 }]
  );

  useEffect(() => {
    const colorMap = {
      orange: "#ea580c",
      violet: "#7c3aed",
      lime: "#65a30d",
      sky: "#0284c7",
      rose: "#e11d48",
    };
    setChartColor(colorMap[themeColor] || "#ea580c");
  }, [themeColor]);

  useEffect(() => {
    if (areaData && areaData.length > 0) {
      setDataSet(areaData);
    }
  }, [areaData]);

  const creationDate = moment.utc(creation_date).startOf("day").valueOf();
  if (isNaN(creationDate)) {
    navigate("/error404");
  }

  const currentDate = moment.utc().startOf("day").valueOf();
  const daysSinceCreation = Math.floor(
    (currentDate - creationDate) / (24 * 60 * 60 * 1000)
  );
  const tickAmount =
    daysSinceCreation === 0 ? 0 : Math.min(daysSinceCreation, 7);

  const generateDates = (start, end) => {
    const dates = [];
    let currentDate = start;
    while (currentDate <= end) {
      dates.push({ x: moment.utc(currentDate).startOf("day").valueOf(), y: 0 });
      currentDate += 24 * 60 * 60 * 1000;
    }
    return dates;
  };

  const fillMissingDays = useMemo(() => {
    const filledData = generateDates(creationDate, currentDate);

    dataSet.forEach((contribution) => {
      const index = filledData.findIndex(
        (day) => day.x === moment.utc(contribution.x).startOf("day").valueOf()
      );
      if (index !== -1) {
        filledData[index] = {
          x: moment.utc(contribution.x).startOf("day").valueOf(),
          y: contribution.y,
        };
      }
    });

    if (filledData.length === 1) {
      filledData.push({
        x: filledData[0].x + 24 * 60 * 60 * 1000,
        y: filledData[0].y,
      });
    }

    return filledData;
  }, [dataSet, creationDate, currentDate]);

  const highestY = Math.max(...fillMissingDays.map((d) => d.y));
  const yTickAmount = Math.min(highestY, 7);

  const [chartState, setChartState] = useState({
    series: [
      {
        name: "Notes Logs",
        data: fillMissingDays,
      },
    ],
    options: {
      chart: {
        type: "area",
        stacked: false,
        height: 350,
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      stroke: {
        curve: "smooth",
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.2,
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [20, 100, 100, 100],
        },
      },
      colors: [chartColor],
      grid: {
        borderColor: "#999",
      },
      yaxis: {
        min: 0,
        tickAmount: yTickAmount,
        labels: {
          style: {
            colors: "#888",
            fontFamily: "Source Sans Pro, sans-serif",
          },
          formatter: (val) => val,
        },
        axisBorder: { show: false },
        axisTicks: {
          show: false,
        },
      },
      xaxis: {
        type: "datetime",
        tickAmount: tickAmount,
        min: Math.min(...fillMissingDays.map((d) => d.x)),
        max: Math.max(...fillMissingDays.map((d) => d.x)),
        labels: {
          rotateAlways: true,
          formatter: (val) => moment(val).format("DD MMM"),
          style: {
            colors: "#888",
            fontSize: "12px",
            fontFamily: "Source Sans Pro, sans-serif",
          },
        },
      },
      tooltip: {
        shared: true,
        enabled: true,
        style: {
          fontSize: "12px",
          fontFamily: "Source Sans Pro, sans-serif",
        },
        x: {
          format: "dd MMM yyyy",
        },
        y: {
          formatter: (val) => val,
        },
      },
      legend: { position: "top", horizontalAlign: "right", offsetX: -10 },
    },
  });

  useEffect(() => {
    setChartState((prev) => ({
      ...prev,
      options: { ...prev.options, colors: [chartColor] },
    }));
  }, [chartColor]);

  return (
    <div className="lg:col-start-4 lg:col-span-full row-start-1 md_to_lg:col-start-1 xs:rounded-2xl relative bg-stone-100 shadow border cursor-default border-stone-300 p-2 dark:bg-stone-700 dark:border-stone-600 overflow-x-auto hiddenScroll">
      <div style={{ minWidth: "600px" }}>
        <h2 className="font-sourceSans_bold text-[1.2rem] text-stone-700 dark:text-stone-300 xxxs:max-sm:sticky xxxs:max-sm:left-2 ">
          Activity Chart
        </h2>

        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="area"
          height={220}
        />
      </div>
    </div>
  );
};

export default AreaChart;
