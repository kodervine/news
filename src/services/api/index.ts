import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  SignUpParams,
  SignInParams,
  Post,
  Comment,
  PostsResponse,
  CommentsResponse,
  User,
  AuthResponse,
} from '@/services/types';
import { RootState } from '@/redux/store';
import { BASE_URL, ENDPOINTS, VERSION } from '@/services/api/endpoints';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/${VERSION}`,
    prepareHeaders: (headers, { getState }) => {
      // Add auth token to headers if it exists
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Post', 'Comment', 'Auth'],
  endpoints: (builder) => ({
    signUp: builder.mutation<AuthResponse, SignUpParams>({
      query: (credentials) => ({
        url: ENDPOINTS.REGISTER,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
      transformResponse: (response: AuthResponse) => {
        localStorage.setItem('token', response.token);
        return response;
      },
    }),

    signIn: builder.mutation<AuthResponse, SignInParams>({
      query: (credentials) => ({
        url: ENDPOINTS.LOGIN,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
      transformResponse: (response: AuthResponse) => {
        localStorage.setItem('token', response.token);
        return response;
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: ENDPOINTS.LOGOUT,
        method: 'POST',
      }),
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => ENDPOINTS.ACCOUNT,
      providesTags: ['Auth'],
    }),

    // Posts endpoints
    getPosts: builder.query<PostsResponse, { page: number; size: number }>({
      query: ({ page, size }) => `posts?page=${page}&size=${size}`,
      providesTags: ['Post'],
    }),

    getPost: builder.query<Post, string>({
      query: (id) => `posts/${id}`,
      providesTags: ['Post'],
    }),

    createPost: builder.mutation<Post, { title: string; content: string }>({
      query: (post) => ({
        url: 'posts',
        method: 'POST',
        body: post,
      }),
      invalidatesTags: ['Post'],
    }),

    updatePost: builder.mutation<
      Post,
      { id: string; title: string; content: string }
    >({
      query: ({ id, ...post }) => ({
        url: `posts/${id}`,
        method: 'PUT',
        body: post,
      }),
      invalidatesTags: ['Post'],
    }),

    deletePost: builder.mutation<boolean, string>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    // Comments endpoints
    getComments: builder.query<
      CommentsResponse,
      { postId: string; page: number; size: number }
    >({
      query: ({ postId, page, size }) =>
        `posts/${postId}/comments?page=${page}&size=${size}`,
      providesTags: ['Comment'],
    }),

    addComment: builder.mutation<Comment, { postId: string; content: string }>({
      query: ({ postId, content }) => ({
        url: `posts/${postId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['Comment'],
    }),

    deleteComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `/posts/${postId}/comments/${commentId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useGetCurrentUserQuery,
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} = api;
