import { blogApi } from "@/api/blog.api";
import type {
  ApiBlog,
  BlogListParams,
  BlogPost,
  CreateBlogPayload,
  DeleteBlogResponse,
  FeaturedImage,
  GenerateImageRequest,
  UpdateBlogPayload,
  UpdateBlogStatusPayload,
} from "@/types/blog.types";
import {
  featuredImageFromApi,
  featuredImageFromDetail,
  getBlogCoverUrl,
  parseGenerateImageResponse,
} from "@/utils/blogImage.utils";
import { prepareBlogUpdatePayload } from "@/utils/blogUpdate.utils";
import { extractTitleFromHtml } from "@/utils/blog.utils";
import { normalizeBlogStatus } from "@/utils/blogStatus.utils";

export { getBlogCoverUrl, featuredImageFromApi };

export function getEditorStateFromBlog(raw: ApiBlog) {
  const featuredImage = featuredImageFromDetail(raw);
  return {
    title: raw.title?.trim() || "Untitled Blog",
    content: raw.content ?? "",
    coverUrl: getBlogCoverUrl(raw),
    featuredImage,
  };
}

export function mapApiBlogToPost(raw: ApiBlog): BlogPost {
  return {
    id: String(raw._id ?? raw.id ?? ""),
    title: raw.title,
    slug: raw.slug,
    status: normalizeBlogStatus(raw.status),
    coverUrl: getBlogCoverUrl(raw),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export type BlogDetail = ApiBlog & {
  id: string;
  coverUrl: string | null;
  featuredImage: FeaturedImage | null;
  editorState: ReturnType<typeof getEditorStateFromBlog>;
};

function mapApiBlogToDetail(raw: ApiBlog): BlogDetail {
  const editorState = getEditorStateFromBlog(raw);
  return {
    ...raw,
    id: String(raw._id ?? raw.id ?? ""),
    coverUrl: editorState.coverUrl,
    featuredImage: featuredImageFromDetail(raw),
    editorState,
  };
}

export const blogService = {
  listPosts(params: BlogListParams) {
    return blogApi.list(params).then((res) => ({
      ...res,
      blogs: res.blogs.map(mapApiBlogToPost),
    }));
  },

  getPost(identifier: string) {
    return blogApi.getByIdentifier(identifier).then(mapApiBlogToDetail);
  },

  create(payload: CreateBlogPayload) {
    const title =
      payload.title?.trim() ||
      extractTitleFromHtml(payload.content) ||
      "Untitled Blog";
    const body: CreateBlogPayload = {
      title,
      content: payload.content,
    };
    if (payload.slug?.trim()) body.slug = payload.slug.trim();
    if (payload.featuredImage) body.featuredImage = payload.featuredImage;
    return blogApi.create(body).then(mapApiBlogToDetail);
  },

  createWithCoverFile(payload: CreateBlogPayload, file: File) {
    const title =
      payload.title?.trim() ||
      extractTitleFromHtml(payload.content) ||
      "Untitled Blog";
    const body: CreateBlogPayload = {
      title,
      content: payload.content,
    };
    if (payload.slug?.trim()) body.slug = payload.slug.trim();
    return blogApi.createWithFormData(body, file).then(mapApiBlogToDetail);
  },

  update(
    identifier: string,
    payload: UpdateBlogPayload,
    options?: { savedFeaturedImage?: FeaturedImage | null },
  ) {
    const body = prepareBlogUpdatePayload(
      {
        title: payload.title,
        slug: payload.slug,
        content: payload.content,
        featuredImage: payload.featuredImage,
      },
      {
        featuredImage: payload.featuredImage,
        savedFeaturedImage: options?.savedFeaturedImage,
        pendingCoverFile: false,
      },
    );
    if (payload.status) body.status = payload.status;
    return blogApi.update(identifier, body).then(mapApiBlogToDetail);
  },

  updateWithCoverFile(
    identifier: string,
    payload: UpdateBlogPayload,
    file: File,
    options?: { savedFeaturedImage?: FeaturedImage | null },
  ) {
    const body = prepareBlogUpdatePayload(
      {
        title: payload.title,
        slug: payload.slug,
        content: payload.content,
      },
      {
        savedFeaturedImage: options?.savedFeaturedImage,
        pendingCoverFile: true,
      },
    );
    if (payload.status) body.status = payload.status;
    return blogApi
      .updateWithFormData(identifier, body, file)
      .then(mapApiBlogToDetail);
  },

  delete(identifier: string) {
    return blogApi.delete(identifier) as Promise<DeleteBlogResponse>;
  },

  updateStatus(
    identifier: string,
    status: UpdateBlogStatusPayload["status"],
  ) {
    return blogApi
      .updateStatus(identifier, { status })
      .then(mapApiBlogToDetail);
  },

  getStats() {
    return blogApi.getStats();
  },

  generateContent(prompt: string, targetWordCount?: number) {
    return blogApi.generateContent(prompt, targetWordCount);
  },

  generateCoverImage(request: GenerateImageRequest) {
    return blogApi.generateImage(request).then(parseGenerateImageResponse);
  },
};
