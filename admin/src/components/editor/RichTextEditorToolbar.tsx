import type { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: ReactNode;
};

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-lg px-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        isActive
          ? "bg-tab-active text-white"
          : "text-secondary-text hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return (
    <span
      className="mx-1 h-5 w-px shrink-0 bg-white/[0.1]"
      aria-hidden
    />
  );
}

type RichTextEditorToolbarProps = {
  editor: Editor | null;
};

export default function RichTextEditorToolbar({
  editor,
}: RichTextEditorToolbarProps) {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      forceUpdate({});
    };

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    editor.on("update", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
      editor.off("update", update);
    };
  }, [editor]);

  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;

    const url = window.prompt("Link URL", previous ?? "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");

    if (url?.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  };

  return (
    <div
      className="flex flex-wrap items-center gap-0.5 border-b border-white/[0.08] bg-white/[0.02] px-2 py-2"
      role="toolbar"
      aria-label="Formatting"
    >
      <ToolbarButton
        title="Bold"
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </ToolbarButton>

      <ToolbarButton
        title="Italic"
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em className="not-italic font-serif italic">I</em>
      </ToolbarButton>

      <ToolbarButton
        title="Underline"
        isActive={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>

      <ToolbarButton
        title="Highlight"
        isActive={editor.isActive("highlight")}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        H
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Heading 1"
        isActive={editor.isActive("heading", { level: 1 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        H1
      </ToolbarButton>

      <ToolbarButton
        title="Heading 2"
        isActive={editor.isActive("heading", { level: 2 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        H2
      </ToolbarButton>

      <ToolbarButton
        title="Heading 3"
        isActive={editor.isActive("heading", { level: 3 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        H3
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Bullet list"
        isActive={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </ToolbarButton>

      <ToolbarButton
        title="Numbered list"
        isActive={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </ToolbarButton>

      <ToolbarButton
        title="Blockquote"
        isActive={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        &ldquo;
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Align left"
        isActive={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        ⫷
      </ToolbarButton>

      <ToolbarButton
        title="Align center"
        isActive={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        ≡
      </ToolbarButton>

      <ToolbarButton
        title="Align right"
        isActive={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        ⫸
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Insert link"
        isActive={editor.isActive("link")}
        onClick={setLink}
      >
        Link
      </ToolbarButton>

      <ToolbarButton
        title="Insert image"
        onClick={addImage}
      >
        Img
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        ↶
      </ToolbarButton>

      <ToolbarButton
        title="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        ↷
      </ToolbarButton>
    </div>
  );
}