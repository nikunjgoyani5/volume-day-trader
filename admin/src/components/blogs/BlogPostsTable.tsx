import { Link } from "react-router-dom";
import DataTable, { type TableColumn } from "react-data-table-component";

import BlogStatusBadge from "@/components/blogs/BlogStatusBadge";
import BlogTableThumb from "@/components/blogs/BlogTableThumb";
import AppIcon from "@/components/ui/app-icon";
import { useAlertDialog } from "@/components/ui/alert-dialog-provider";
import type { BlogPost } from "@/types/blog.types";
import { formatBlogDate } from "@/utils/blog.utils";

const ROW_MIN_HEIGHT = "72px";

const tableCustomStyles = {
  table: { style: { backgroundColor: "transparent" } },
  tableWrapper: {
    style: { display: "block", overflow: "visible" },
  },
  headRow: {
    style: {
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      minHeight: "44px",
    },
  },
  headCells: {
    style: {
      color: "var(--color-muted-text)",
      fontSize: "13px",
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "0.06em",
      paddingTop: "12px",
      paddingBottom: "12px",
    },
  },
  rows: {
    style: {
      backgroundColor: "transparent",
      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
      minHeight: ROW_MIN_HEIGHT,
      transition: "background-color 0.15s ease",
    },
    highlightOnHoverStyle: {
      backgroundColor: "rgba(255, 255, 255, 0.02)",
      borderBottomColor: "rgba(255, 255, 255, 0.06)",
      outline: "none",
      boxShadow: "none",
    },
  },
  cells: {
    style: {
      color: "var(--color-feature-text)",
      fontSize: "15px",
      paddingTop: "12px",
      paddingBottom: "12px",
      minHeight: ROW_MIN_HEIGHT,
    },
  },
  noData: { style: { backgroundColor: "transparent", color: "var(--color-secondary-text)" } },
};

type BlogPostsTableProps = {
  posts: BlogPost[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
};

function IconView() {
  return <AppIcon name="eye" className="h-4 w-4" />;
}

function IconEdit() {
  return <AppIcon name="pencil" className="h-4 w-4" />;
}

function IconPublish() {
  return <AppIcon name="publish" className="h-4 w-4" />;
}

function IconArchive() {
  return <AppIcon name="archive" className="h-4 w-4" />;
}

function IconRestore() {
  return <AppIcon name="restore" className="h-4 w-4" />;
}

function IconDelete() {
  return <AppIcon name="trash" className="h-4 w-4" />;
}

function BlogRowActions({
  post,
  onDelete,
  onPublish,
  onArchive,
  onRestore,
}: {
  post: BlogPost;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}) {
  const { confirm } = useAlertDialog();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete blog?",
      description: `"${post.title}" will be permanently removed, including its cover image.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      variant: "destructive",
    });
    if (confirmed) onDelete(post.id);
  };

  const baseBtn = "blog-table-action-btn cursor-pointer";
  const standardBtn = `${baseBtn} blog-table-action-btn--standard`;

  return (
    <div
      className="blog-table-actions"
      role="group"
      aria-label={`Actions for ${post.title}`}
    >
      {post.status === "draft" && (
        <>
          <Link
            to={`/dashboard/blogs/edit/${post.id}`}
            title="Edit blog"
            aria-label={`Edit ${post.title}`}
            className={`${standardBtn} no-underline`}
          >
            <IconEdit />
          </Link>
          <button
            type="button"
            title="Publish blog"
            aria-label={`Publish ${post.title}`}
            onClick={() => onPublish(post.id)}
            className={`${baseBtn} blog-table-action-btn--publish`}
          >
            <IconPublish />
          </button>
          <button
            type="button"
            title="Delete blog"
            aria-label={`Delete ${post.title}`}
            onClick={() => void handleDelete()}
            className={`${baseBtn} blog-table-action-btn--danger`}
          >
            <IconDelete />
          </button>
        </>
      )}

      {post.status === "published" && (
        <>
          <Link
            to={`/dashboard/blogs/view/${post.id}`}
            title="View blog"
            aria-label={`View ${post.title}`}
            className={`${standardBtn} no-underline`}
          >
            <IconView />
          </Link>
          <Link
            to={`/dashboard/blogs/edit/${post.id}`}
            title="Edit blog"
            aria-label={`Edit ${post.title}`}
            className={`${standardBtn} no-underline`}
          >
            <IconEdit />
          </Link>
          <button
            type="button"
            title="Archive blog"
            aria-label={`Archive ${post.title}`}
            onClick={() => onArchive(post.id)}
            className={`${baseBtn} blog-table-action-btn--archive`}
          >
            <IconArchive />
          </button>
        </>
      )}

      {post.status === "archived" && (
        <>
          <Link
            to={`/dashboard/blogs/view/${post.id}`}
            title="View blog"
            aria-label={`View ${post.title}`}
            className={`${standardBtn} no-underline`}
          >
            <IconView />
          </Link>
          <button
            type="button"
            title="Restore blog"
            aria-label={`Restore ${post.title}`}
            onClick={() => onRestore(post.id)}
            className={`${baseBtn} blog-table-action-btn--restore`}
          >
            <IconRestore />
          </button>
          <button
            type="button"
            title="Delete blog"
            aria-label={`Delete ${post.title}`}
            onClick={() => void handleDelete()}
            className={`${baseBtn} blog-table-action-btn--danger`}
          >
            <IconDelete />
          </button>
        </>
      )}
    </div>
  );
}

export default function BlogPostsTable({
  posts,
  loading = false,
  onDelete,
  onPublish,
  onArchive,
  onRestore,
}: BlogPostsTableProps) {
  const columns: TableColumn<BlogPost>[] = [
    {
      name: "Cover",
      grow: 0,
      width: "100px",
      minWidth: "100px",
      cell: (row) => (
        <BlogTableThumb src={row.coverUrl} title={row.title} />
      ),
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      grow: 4,
      minWidth: "170px",
      cell: (row) => (
        <div className="blog-table-title-text">
          <p className="blog-table-title">{row.title}</p>
          <p className="blog-table-slug">{row.slug}</p>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      grow: 0,
      width: "130px",
      minWidth: "130px",
      center: true,
      cell: (row) => <BlogStatusBadge status={row.status} />,
    },
    {
      name: "Created At",
      selector: (row) => row.createdAt,
      grow: 1.2,
      minWidth: "100px",
      cell: (row) => (
        <span className="blog-table-date">{formatBlogDate(row.createdAt)}</span>
      ),
    },
    {
      name: "Updated At",
      selector: (row) => row.updatedAt,
      grow: 1.2,
      minWidth: "100px",
      cell: (row) => (
        <span className="blog-table-date">{formatBlogDate(row.updatedAt)}</span>
      ),
    },
    {
      name: "Actions",
      grow: 1.8,
      minWidth: "148px",
 
      cell: (row) => (
        <BlogRowActions
          post={row}
          onDelete={onDelete}
          onPublish={onPublish}
          onArchive={onArchive}
          onRestore={onRestore}
        />
      ),
      ignoreRowClick: true,
      button: true,
    },
  ];

  return (
    <div className="blog-datatable-scroll">
      <div className="blog-datatable blog-datatable--lifecycle">
        <DataTable
          columns={columns}
          data={posts}
          customStyles={tableCustomStyles}
          progressPending={loading}
          pagination={false}
          highlightOnHover
          responsive={false}
          noDataComponent={
            <p className="py-12 text-center text-sm text-secondary-text">
              No blogs match your search or filter.
            </p>
          }
        />
      </div>
    </div>
  );
}
