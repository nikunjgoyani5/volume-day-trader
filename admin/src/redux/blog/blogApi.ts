import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { ApiError } from "@/api/http.client";
import type {
  GenerateBlogRequest,
  GenerateImageMutationArg,
} from "@/redux/blog/types";
import type { FeaturedImage } from "@/types/blog.types";
import type { BlogDetail } from "@/services/blog.service";
import { blogService } from "@/services/blog.service";
import type {
  BlogListParams,
  BlogStatsResponse,
  CreateBlogPayload,
  UpdateBlogPayload,
  UpdateBlogStatusPayload,
} from "@/types/blog.types";
import { extractTitleFromHtml, slugifyTitle } from "@/utils/blog.utils";

export const BLOG_TAG = "Blog" as const;
export const BLOG_LIST_TAG = "BlogList" as const;
export const BLOG_STATS_TAG = "BlogStats" as const;

type BlogListResult = Awaited<ReturnType<typeof blogService.listPosts>>;

type BlogQueryError = {
  status: number | "FETCH_ERROR";
  data: string;
};

function toQueryError(error: unknown): BlogQueryError {
  if (error instanceof ApiError) {
    return { status: error.status, data: error.message };
  }
  if (error instanceof Error) {
    return { status: "FETCH_ERROR", data: error.message };
  }
  return { status: "FETCH_ERROR", data: "Request failed" };
}

async function runQuery<T>(fn: () => Promise<T>) {
  try {
    return { data: await fn() };
  } catch (error) {
    return { error: toQueryError(error) };
  }
}

export const blogRtkApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fakeBaseQuery<BlogQueryError>(),
  tagTypes: [BLOG_TAG, BLOG_LIST_TAG, BLOG_STATS_TAG],
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogListResult, BlogListParams>({
      queryFn: (params) => runQuery(() => blogService.listPosts(params)),
      providesTags: [{ type: BLOG_LIST_TAG, id: "LIST" }],
    }),

    getBlogStats: builder.query<BlogStatsResponse, void>({
      queryFn: () => runQuery(() => blogService.getStats()),
      providesTags: [{ type: BLOG_STATS_TAG, id: "STATS" }],
    }),

    getBlog: builder.query<BlogDetail, string>({
      queryFn: (id) => runQuery(() => blogService.getPost(id)),
      providesTags: (_result, _error, id) => [{ type: BLOG_TAG, id }],
    }),

    createBlog: builder.mutation<BlogDetail, CreateBlogPayload>({
      queryFn: (payload) => runQuery(() => blogService.create(payload)),
      invalidatesTags: [
        { type: BLOG_LIST_TAG, id: "LIST" },
        { type: BLOG_STATS_TAG, id: "STATS" },
      ],
    }),

    updateBlog: builder.mutation<
      BlogDetail,
      {
        id: string;
        payload: UpdateBlogPayload;
        savedFeaturedImage?: FeaturedImage | null;
      }
    >({
      queryFn: ({ id, payload, savedFeaturedImage }) =>
        runQuery(() =>
          blogService.update(id, payload, { savedFeaturedImage }),
        ),
      invalidatesTags: (_r, _e, { id }) => [
        { type: BLOG_TAG, id },
        { type: BLOG_LIST_TAG, id: "LIST" },
        { type: BLOG_STATS_TAG, id: "STATS" },
      ],
    }),

    updateBlogStatus: builder.mutation<
      BlogDetail,
      {
        id: string;
        status: Extract<
          UpdateBlogStatusPayload["status"],
          "draft" | "published" | "archived"
        >;
      }
    >({
      queryFn: ({ id, status }) =>
        runQuery(() => blogService.updateStatus(id, status)),
      invalidatesTags: (_r, _e, { id }) => [
        { type: BLOG_TAG, id },
        { type: BLOG_LIST_TAG, id: "LIST" },
        { type: BLOG_STATS_TAG, id: "STATS" },
      ],
    }),

    deleteBlog: builder.mutation<{ message: string }, string>({
      queryFn: (id) => runQuery(() => blogService.delete(id)),
      invalidatesTags: [
        { type: BLOG_LIST_TAG, id: "LIST" },
        { type: BLOG_STATS_TAG, id: "STATS" },
      ],
    }),

    generateContent: builder.mutation<
      { content: string },
      { prompt: string; targetWordCount?: number }
    >({
      queryFn: ({ prompt, targetWordCount }) =>
        runQuery(() =>
          blogService.generateContent(prompt, targetWordCount),
        ),
    }),

    generateImage: builder.mutation<
      { previewUrl: string; featuredImage: FeaturedImage },
      GenerateImageMutationArg
    >({
      queryFn: ({ prompt, previousPublicId }) =>
        runQuery(() =>
          blogService.generateCoverImage({
            prompt,
            previousPublicId,
          }),
        ),
    }),

    generateBlog: builder.mutation<BlogDetail, GenerateBlogRequest>({
      queryFn: ({ prompt, targetWordCount }) =>
        runQuery(async () => {
          const generated = await blogService.generateContent(
            prompt,
            targetWordCount,
          );
          const title =
            (extractTitleFromHtml(generated.content) ?? prompt.trim()) ||
            "Untitled Blog";
          return blogService.create({
            title,
            slug: slugifyTitle(title),
            content: generated.content,
            status: "draft",
          });
        }),
      invalidatesTags: [
        { type: BLOG_LIST_TAG, id: "LIST" },
        { type: BLOG_STATS_TAG, id: "STATS" },
      ],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogStatsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useUpdateBlogStatusMutation,
  useDeleteBlogMutation,
  useGenerateContentMutation,
  useGenerateImageMutation,
  useGenerateBlogMutation,
} = blogRtkApi;
