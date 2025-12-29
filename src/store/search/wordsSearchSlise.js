import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wordsSearch: [],
};

const wordsSearchSlise = createSlice({
  name: "wordsSearch",
  initialState,
  reducers: {
    addWords: (state, action) => {
      state.wordsSearch = action.payload;
    },
    removeWords: (state, action) => {
      state.wordsSearch = state.wordsSearch.filter((elem) => {
        for (const key in elem) {
          return elem[key].color !== action.payload;
        }
        return elem;
      });
    }, 
  },
});

export const { addWords, removeWords } = wordsSearchSlise.actions;

export default wordsSearchSlise.reducer;
