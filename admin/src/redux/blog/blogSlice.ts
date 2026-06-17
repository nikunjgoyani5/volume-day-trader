import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { BlogDetail } from "@/services/blog.service";
import type { FeaturedImage } from "@/types/blog.types";
import type { BlogUiState } from "@/redux/blog/types";

const initialState: BlogUiState = {
  currentBlog: null,
  generatedContent: null,
  generatedFeaturedImage: null,
  stale: false,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setCurrentBlog(state, action: PayloadAction<BlogDetail | null>) {
      state.currentBlog = action.payload;
    },
    clearCurrentBlog(state) {
      state.currentBlog = null;
    },
    setGeneratedContent(state, action: PayloadAction<string | null>) {
      state.generatedContent = action.payload;
    },
    clearGeneratedContent(state) {
      state.generatedContent = null;
    },
    setGeneratedFeaturedImage(
      state,
      action: PayloadAction<FeaturedImage | null>,
    ) {
      state.generatedFeaturedImage = action.payload;
    },
    clearGeneratedFeaturedImage(state) {
      state.generatedFeaturedImage = null;
    },
    markStale(state) {
      state.stale = true;
    },
    clearStale(state) {
      state.stale = false;
    },
  },
});

export const {
  setCurrentBlog,
  clearCurrentBlog,
  setGeneratedContent,
  clearGeneratedContent,
  setGeneratedFeaturedImage,
  clearGeneratedFeaturedImage,
  markStale,
  clearStale,
} = blogSlice.actions;

export default blogSlice.reducer;
