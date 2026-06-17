import PageHeader from "@/components/dashboard/PageHeader";
import DashboardInquiryList from "@/components/dashboard/DashboardInquiryList";
import DashboardPanel from "@/components/dashboard/DashboardPanel";
import MessageSummaryCards from "@/components/dashboard/MessageSummaryCards";
import DashboardSectionHeading from "@/components/dashboard/DashboardSectionHeading";
import QuickActionLink from "@/components/dashboard/QuickActionLink";
import StatsCards from "@/components/dashboard/StatsCards";
import BlogStatusBadge from "@/components/blogs/BlogStatusBadge";
import AppIcon from "@/components/ui/app-icon";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { inquiryService } from "@/services/inquiry.service";
import type { ContactSubmission } from "@/types/contact.types";
import {
  computeContactStats,
} from "@/utils/contact.utils";
import {
  useGetBlogsQuery,
  useGetBlogStatsQuery,
} from "@/redux/blog/blogApi";

function EmptyPanelState({
  icon,
  message,
  action,
}: {
  icon: "document" | "chat";
  message: string;
  action?: { label: string; to: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-muted-text">
        <AppIcon name={icon} className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <p className="mt-4 text-sm text-secondary-text">{message}</p>
      {action && (
        <Link
          to={action.to}
          className="blog-btn-primary mt-4 inline-flex rounded-xl px-4 py-2 text-sm font-semibold no-underline"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

function LoadingPanelState({ message }: { message: string }) {
  return (
    <div className="flex h-36 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-secondary-text">
      {message}
    </div>
  );
}

export default function DashboardPage() {
  const { data: blogStats } = useGetBlogStatsQuery();

  const { data: recentBlogs, isFetching: loadingBlogs } = useGetBlogsQuery({
    page: 1,
    limit: 5,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoadingInquiries(true);
    setInquiryError(null);
    inquiryService
      .listInquiries()
      .then((res) => {
        if (!alive) return;
        setInquiries(res);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setInquiryError(e instanceof Error ? e.message : "Failed to load inquiries");
      })
      .finally(() => {
        if (!alive) return;
        setLoadingInquiries(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const contactStats = useMemo(() => computeContactStats(inquiries), [inquiries]);

  const recentInquiries = useMemo(() => {
    return [...inquiries]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [inquiries]);

  const blogStatCards = useMemo(
    () => [
      {
        label: "Total Blogs",
        value: blogStats?.total ?? "-",
        icon: "document" as const,
        hint: "All posts",
      },
      {
        label: "Drafts",
        value: blogStats?.draft ?? "-",
        icon: "pencil" as const,
        hint: "Not published yet",
      },
      {
        label: "Published",
        value: blogStats?.published ?? "-",
        icon: "check-circle" as const,
        hint: "Live on site",
      },
      {
        label: "Archived",
        value: blogStats?.archived ?? "-",
        icon: "archive" as const,
        hint: "Hidden posts",
      },
    ],
    [blogStats],
  );

  const messageStatCards = useMemo(
    () => [
      {
        label: "Total inquiries",
        value: loadingInquiries ? "-" : contactStats.total,
        icon: "chat" as const,
        variant: "sky" as const,
      },
      {
        label: "Open",
        value: loadingInquiries ? "-" : contactStats.open,
        icon: "mail" as const,
        variant: "amber" as const,
      },
    ],
    [contactStats, loadingInquiries],
  );

  return (
    <div className="dashboard-page space-y-8">
      <PageHeader
        title="Dashboard"
        description="Track blog content, read new contact messages, and open common admin tasks from one place."
      />

      <section>
        <DashboardSectionHeading
          title="Blog content"
          description="How many posts you have in each status."
        />
        <StatsCards stats={blogStatCards} />
      </section>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <DashboardPanel
            title="Recent blog posts"
            description="Latest updates to your blog content."
            icon="document"
            action={{ label: "All blogs", to: "/dashboard/blogs" }}
          >
            {loadingBlogs ? (
              <LoadingPanelState message="Loading blog posts…" />
            ) : recentBlogs?.blogs?.length ? (
              <ul className="space-y-2">
                {recentBlogs.blogs.map((blog) => (
                  <li key={blog.id}>
                    <Link
                      to={`/dashboard/blogs/view/${blog.id}`}
                      className="group flex cursor-pointer items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 no-underline transition-colors hover:border-tab-active/30 hover:bg-white/[0.04]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted-text transition-colors group-hover:border-tab-active/20 group-hover:text-tab-active">
                        <AppIcon name="document" className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                          {blog.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-text">
                          /{blog.slug}
                        </p>
                      </div>
                      <BlogStatusBadge status={blog.status} className="hidden shrink-0 sm:inline-flex" />
                      <AppIcon
                        name="chevron-down"
                        className="h-4 w-4 shrink-0 -rotate-90 text-muted-text opacity-0 transition-opacity group-hover:opacity-100"
                        strokeWidth={2}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyPanelState
                icon="document"
                message="No blog posts yet. Create your first post to get started."
                action={{ label: "Create blog", to: "/dashboard/blogs/create" }}
              />
            )}
          </DashboardPanel>
        </div>

        <div className="flex flex-col gap-6 xl:col-span-5">
          <DashboardPanel
            title="Latest messages"
            description="Most recent contact form submissions."
            icon="mail"
            action={{ label: "All messages", to: "/dashboard/contacts" }}
          >
            <div className="space-y-4">
              <MessageSummaryCards stats={messageStatCards} />
            
              {loadingInquiries ? (
                <LoadingPanelState message="Loading messages…" />
              ) : inquiryError ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                  {inquiryError}
                </div>
              ) : recentInquiries.length ? (
                <DashboardInquiryList inquiries={recentInquiries} />
              ) : (
                <EmptyPanelState
                  icon="chat"
                  message="No contact messages yet. New form submissions will show up here."
                />
              )}
            </div>
          </DashboardPanel>

          <DashboardPanel
            title="Quick actions"
            description="Common tasks admins use every day."
            icon="layout-grid"
          >
            <div className="space-y-2">
              <QuickActionLink
                to="/dashboard/blogs/create"
                icon="sparkles"
                title="Create a blog"
                description="Generate AI content and publish a new post"
              />
              <QuickActionLink
                to="/dashboard/blogs"
                icon="document"
                title="Manage blogs"
                description="Edit, publish, or archive existing posts"
              />
              <QuickActionLink
                to="/dashboard/contacts"
                icon="mail"
                title="View contact messages"
                description="Read and reply to website inquiries"
              />
            </div>
          </DashboardPanel>
        </div>
      </div>
    </div>
  );
}
