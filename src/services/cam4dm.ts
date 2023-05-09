import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cam4dmApi = createApi({
  reducerPath: 'cam4dmApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/' }),
  endpoints: (builder) => ({
    getVersions: builder.query({
      query: () => 'versions',
    }),
    setVersion: builder.mutation({
      query: (name) => ({
        url: `versions/${name}`,
        method: 'POST',
      }),
    }),
    getGroups: builder.query({
      query: () => 'groups',
    }),
    getLayouts: builder.query({
      query: (version) => ({ url: `layout/${version}` }),
    }),
    getLayout: builder.query({
      query: ({ version, name }) => ({ url: `layout/${version}/${name}` }),
    }),
    saveLayout: builder.mutation({
      query: ({ version, name, body }) => ({
        url: `layout/${version}/${name}`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetVersionsQuery,
  useSetVersionMutation,
  useGetGroupsQuery,
  useLazyGetLayoutsQuery,
  useSaveLayoutMutation,
  useLazyGetLayoutQuery,
} = cam4dmApi;
