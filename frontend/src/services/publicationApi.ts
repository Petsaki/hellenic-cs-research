import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Apis } from '../models/api/apis.enum';
import {
    PublicationsData,
    PublicationsYear,
} from '../models/api/response/publications/publications.data';
import { ResponseData } from '../models/api/response/response.data';

export const publicationApi = createApi({
    reducerPath: 'publicationApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
    endpoints: (builder) => ({
        getPublications: builder.query<ResponseData<PublicationsData[]>, void>({
            query: () => Apis.getPublications,
        }),
        getPublicationsYears: builder.query<
            ResponseData<PublicationsYear[]>,
            void
        >({
            query: () => Apis.getPublicationsYears,
        }),
    }),
});

export const { useGetPublicationsQuery, useGetPublicationsYearsQuery } =
    publicationApi;
