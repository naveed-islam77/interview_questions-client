import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

const questionApi = createApi({
  reducerPath: "questionApi",
  baseQuery,
  endpoints: (builder) => ({
    getQuestions: builder.query({
      query: ({category}) => `/category/${category}`,
    }),
    getQuestionsCount : builder.query({
      query: () => `/questions/count`,
    }),
    getQuestionById: builder.query({
      query: (id) => `/${id}`,
    })
  }),
});

export const {
  useGetQuestionsQuery,
  useGetQuestionsCountQuery,
  useGetQuestionByIdQuery,
  middleware: questionApiMiddleware,
  reducerPath: questionApiReducerPath ,
  reducer: questionApiReducer,
} = questionApi;
