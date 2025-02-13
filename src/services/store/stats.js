import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nbrNotes: 0,
  creation_date: "",
  areaData: [],
  heatData: [],
  datesTable: [],
};

const StatsSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {
    setInitStats: (state, action) => {
      state.nbrNotes = 0;
      state.creation_date = action.payload;
      state.datesTable = [];
    },
    setNotesNumber: (state, action) => {
      state.nbrNotes = action.payload;
    },
    incrementNotesNumber: (state) => {
      state.nbrNotes++;
    },
    setCreationDate: (state, action) => {
      state.creation_date = action.payload;
    },
    addNewDate: (state, action) => {
      const dateString = action.payload;
      const dateTimestamp = new Date(dateString).getTime();

      const dateObjArea = state.areaData.find((obj) => obj.x === dateTimestamp);
      if (dateObjArea) {
        dateObjArea.y += 1;
      } else {
        state.areaData.push({ x: dateTimestamp, y: 1 });
      }

      const dateObjHeat = state.heatData.find((obj) => obj.day === dateString);
      if (dateObjHeat) {
        dateObjHeat.value += 1;
      } else {
        state.heatData.push({ day: dateString, value: 1 });
      }
    },

    setDatesTable: (state, action) => {
      state.datesTable = action.payload;
    },

    setHeatChartData: (state, action) => {
      const dateCountHeatChartMap = new Map();

      action.payload.forEach((date) => {
        if (dateCountHeatChartMap.has(date)) {
          dateCountHeatChartMap.set(date, dateCountHeatChartMap.get(date) + 1);
        } else {
          dateCountHeatChartMap.set(date, 1);
        }
      });

      const resultHeat = [];
      dateCountHeatChartMap.forEach((value, day) => {
        resultHeat.push({ value: value, day: day });
      });

      state.heatData = resultHeat;
    },

    setAreaChartData: (state, action) => {
      const dateCountAreaChartMap = new Map(
        state.areaData.map((d) => [d.x, d.y])
      );

      action.payload.forEach((date) => {
        const dateTimestamp = new Date(date).getTime();
        if (dateCountAreaChartMap.has(dateTimestamp)) {
          dateCountAreaChartMap.set(
            dateTimestamp,
            dateCountAreaChartMap.get(dateTimestamp) + 1
          );
        } else {
          dateCountAreaChartMap.set(dateTimestamp, 1);
        }
      });

      state.areaData = Array.from(dateCountAreaChartMap, ([x, y]) => ({
        x,
        y,
      }));
    },
    clearStats: (state) => {
      state.nbrNotes = 0;
      state.creation_date = "";
      state.areaData = [];
      state.heatData = [];
      state.datesTable = [];
    },
  },
});

export const {
  setNotesNumber,
  setCreationDate,
  setInitStats,
  incrementNotesNumber,
  addNewDate,
  setDatesTable,
  setAreaChartData,
  setHeatChartData,
  clearStats,
} = StatsSlice.actions;
export default StatsSlice.reducer;
