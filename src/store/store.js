import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./product/productSlice";
import wordsSearchReduser from "./search/wordsSearchSlise";
import getBaseClassReduser from "./getBaseClass/getBaseClassSlise";
import setUrlReduser from "./url/urlsSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    wordsSearch: wordsSearchReduser,
    getBaseClass: getBaseClassReduser,
    saveUrl: setUrlReduser,
  },
});
