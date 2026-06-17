export type NavIconName = "dashboard" | "mail" | "blog-content" | "document" | "sparkles";

export type NavLinkConfig = {
  label: string;
  path: string;
  icon: NavIconName;
  subtitle?: string;
};

export type NavGroupConfig = {
  label: string;
  icon: NavIconName;
  sectionLabel?: string;
  sectionBadge?: string;
  children: NavLinkConfig[];
};

export type DashboardNavEntry =
  | ({ type: "link" } & NavLinkConfig)
  | ({ type: "group" } & NavGroupConfig);

export const DASHBOARD_NAV: DashboardNavEntry[] = [
  {
    type: "link",
    label: "Dashboard",
    path: "/dashboard",
    icon: "dashboard",
    subtitle: "Overview of your admin platform",
  },
  {
    type: "link",
    label: "Contact Inquiries",
    path: "/dashboard/contacts",
    icon: "mail",
    subtitle:
      "Manage and review incoming contact requests from website visitors.",
  },
  {
    type: "group",
    label: "Content Management",
    icon: "blog-content",
    sectionLabel: "Blogs",
    children: [
      {
        label: "All Blogs",
        path: "/dashboard/blogs",
        icon: "document",
        subtitle: "View and manage all blog posts.",
      },
      {
        label: "Create Blog",
        path: "/dashboard/blogs/create",
        icon: "sparkles",
        subtitle: "Generate AI content and create a blog via the API.",
      },
    ],
  },
];
