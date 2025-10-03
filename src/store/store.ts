import { configureStore } from "@reduxjs/toolkit";
import { rootReducers } from "./reducers";
import { questionApiMiddleware } from "@/services/questionApi";
import { categoryApiMiddleware } from "@/services/categoryApi";

export const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(questionApiMiddleware)
    .concat(categoryApiMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
