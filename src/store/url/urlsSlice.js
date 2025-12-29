import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  url: "",
};

const urlSlice = createSlice({
  name: "url",
  initialState,
  reducers: {
    saveUrl: (state, action) => {
      state.url = action.payload;
    },
  },
});

export const { saveUrl } = urlSlice.actions;

export default urlSlice.reducer;
