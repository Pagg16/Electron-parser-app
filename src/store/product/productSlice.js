import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productInfo: null,
  comments: null,
  isLoadingProductInfo: false,
  isLoadingComments: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductInfo: (state, action) => {
      state.productInfo = action.payload;
    },
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    setLoadingComments: (state, action) => {
      state.isLoadingComments = action.payload;
    },
    setLoadingProductInfo: (state, action) => {
      state.isLoadingProductInfo = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearProductData: (state) => {
      state.productInfo = null;
      state.comments = null;
      state.isLoadingProductInfo = false;
      state.isLoadingComments = false;
      state.error = null;
    },
  },
});

export const {
  setProductInfo,
  setComments,
  setLoadingComments,
  setLoadingProductInfo,
  setError,
  clearProductData,
} = productSlice.actions;

export default productSlice.reducer;
