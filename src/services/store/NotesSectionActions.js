import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchTitle: "",
  tags: [],
  selectedTags: [],
};

const NotesSectionSlice = createSlice({
  name: "filterSearch",
  initialState: initialState,
  reducers: {
    setTagsList: (state, action) => {
      const tagExists = state.tags.some((tag) => tag.id === action.payload.id);
      if (!tagExists) {
        state.tags.push({ ...action.payload, selected: false });
      }
    },
    selectTag: (state, action) => {
      const tg = state.tags.find((tag) => tag.id === action.payload);

      if (tg) {
        tg.selected = true;
        if (!state.selectedTags.some((t) => t.id === tg.id)) {
          state.selectedTags.push(tg);
        }
      }
    },
    unselectTag: (state, action) => {
      const tg = state.tags.find((tag) => tag.id === action.payload);

      if (tg) {
        tg.selected = false;
        state.selectedTags = state.selectedTags.filter(
          (t) => t.id !== action.payload
        );
      }
    },
    unselectAllTags: (state) => {
      state.tags.forEach((tag) => (tag.selected = false));
      state.selectedTags = [];
    },
    setSearchTitleValue: (state, action) => {
      state.searchTitle = action.payload;
    },
    deleteTagsFromNotes: (state, action) => {
      const noteTags = action.payload;
      state.tags = state.tags.filter(
        (tag) => !noteTags.some((noteTag) => noteTag.id === tag.id)
      );
    },
  },
});

export const {
  setTagsList,
  selectTag,
  unselectTag,
  setSearchTitleValue,
  unselectAllTags,
  deleteTagsFromNotes,
} = NotesSectionSlice.actions;

export default NotesSectionSlice.reducer;
