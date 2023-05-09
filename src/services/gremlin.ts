import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const gremlinApi = createApi({
  reducerPath: 'gremlinApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/' }),
  endpoints: (builder) => ({
    query: builder.mutation({
      query: (data) => ({
        url: 'query',
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/json' },
      })
    })
  })
});

export const { useQueryMutation } = gremlinApi;