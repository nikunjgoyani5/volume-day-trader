import type { RootState } from "@/redux/store";

export const selectCurrentBlog = (state: RootState) => state.blog.currentBlog;
export const selectGeneratedContent = (state: RootState) =>
  state.blog.generatedContent;
export const selectGeneratedFeaturedImage = (state: RootState) =>
  state.blog.generatedFeaturedImage;
export const selectBlogListStale = (state: RootState) => state.blog.stale;
