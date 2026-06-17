import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BlogExamplePrompts from "@/components/blogs/BlogExamplePrompts";
import BlogGenerationForm from "@/components/blogs/BlogGenerationForm";
import PageHeader from "@/components/dashboard/PageHeader";
import { useGenerateBlogMutation } from "@/redux/blog/blogApi";
import { setCurrentBlog } from "@/redux/blog/blogSlice";
import { useAppDispatch } from "@/redux/hooks";

export default function CreateBlogPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [generateBlog, { isLoading, error }] = useGenerateBlogMutation();

  const [topic, setTopic] = useState("");
  const [wordCount, setWordCount] = useState("1000");

  const errorMessage =
    error && "data" in error ? String(error.data) : null;

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    try {
      const blog = await generateBlog({
        prompt: topic.trim(),
        targetWordCount: parseInt(wordCount, 10) || undefined,
      }).unwrap();
      dispatch(setCurrentBlog(blog));
      navigate(`/dashboard/blogs/edit/${blog.id}`, { replace: true });
    } catch {
      /* error shown via errorMessage */
    }
  };

  return (
    <div className="blog-page-enter blog-create-layout mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Create Blog"
        description="Generate AI content and create a blog post."
        className="[&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_p]:leading-relaxed"
      />

      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
        <BlogGenerationForm
          topic={topic}
          onTopicChange={setTopic}
          wordCount={wordCount}
          onWordCountChange={setWordCount}
          isGenerating={isLoading}
          onGenerate={() => void handleGenerate()}
        />

        <BlogExamplePrompts
          topic={topic}
          onSelect={setTopic}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
