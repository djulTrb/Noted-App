import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setNewNote: (state, action) => {
      state.push({
        id: action.payload.id,
        gradient_id: action.payload.gradient_id,
        created_on: action.payload.created_on,
        updated_last_on: action.payload.updated_last_on,
        title: action.payload.title,
        tags: action.payload.tags,
        text_value: action.payload.text_value,
      });
    },
    updateNote: (state, action) => {
      const updatedNote = state.filter((note) => note.id === action.payload.id);
      updatedNote[0].updated_last_on = action.payload.updated_last_on;
      updatedNote[0].title = action.payload.title;
      updatedNote[0].tags = action.payload.tags;
      updatedNote[0].text_value = action.payload.text_value;
    },
    deleteNote: (state, action) => {
      return state.filter((note) => note.id !== action.payload);
    },
    clearNotes: () => {
      return initialState;
    },
  },
});

export const { setNewNote, updateNote, deleteNote, clearNotes } =
  noteSlice.actions;
export default noteSlice.reducer;
