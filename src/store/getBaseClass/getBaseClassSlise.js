import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSuccessfully: false,
  isLoadingBaseClass: false,
  isError: false,
};

const getBaseClassSlice = createSlice({
  name: "getBaseClass",
  initialState,
  reducers: {
    setLoadBaseClass: (state, action) => {
      state.isSuccessfully = action.payload;
    },

    setLoadingBaseClass: (state, action) => {
      state.isLoadingBaseClass = action.payload;
    },
    setError: (state, action) => {
      state.isError = action.payload;
    },
  },
});

export const { setLoadBaseClass, setLoadingBaseClass, setError } =
  getBaseClassSlice.actions;

export default getBaseClassSlice.reducer;
