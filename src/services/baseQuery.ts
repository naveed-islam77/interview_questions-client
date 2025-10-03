import { fetchBaseQuery as rtkFetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = rtkFetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  credentials: "include",
  responseHandler: async (response) => {
    const data = await response.json();
    return data;
  },
});
