import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery,
  endpoints: (builder) => ({
   getAllCategories: builder.query({
    query: () => `/all/categories`,
   })
  }),
});

export const {
  useGetAllCategoriesQuery,
  middleware: categoryApiMiddleware,
  reducerPath: categoryApiReducerPath,
  reducer: categoryApiReducer,
} = categoryApi;
