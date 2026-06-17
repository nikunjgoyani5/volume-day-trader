import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useRef } from "react";

import { richTextEditorExtensions } from "@/components/editor/editor.extensions";
import RichTextEditorToolbar from "@/components/editor/RichTextEditorToolbar";

export type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
  className?: string;
  /** When true, editor fills its parent and scrolls content internally */
  fillContainer?: boolean;
  /** Bump when replacing content from outside (e.g. AI generate) */
  contentKey?: string | number;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your blog content…",
  editable = true,
  minHeight = "320px",
  className = "",
  fillContainer = false,
  contentKey,
}: RichTextEditorProps) {
  const isInternalUpdate = useRef(false);

  const editor = useEditor({
    extensions: richTextEditorExtensions,
    content: value || "",
    editable,
    onUpdate: ({ editor: ed }) => {
      isInternalUpdate.current = true;
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: fillContainer
          ? "blog-article-content tiptap-editor-content min-h-[120px] px-4 py-4 sm:px-6 focus:outline-none"
          : "blog-article-content tiptap-editor-content min-h-[280px] px-4 py-4 sm:px-6 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();
    const normalized = value || "<p></p>";
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    if (current !== normalized) {
      editor.commands.setContent(normalized, { emitUpdate: false });
    }
  }, [editor, value, contentKey]);

  return (
    <div
      className={`tiptap-editor overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08111f]/80 ${
        fillContainer ? "flex h-full min-h-0 flex-col" : ""
      } ${className}`}
    >
      {editable && (
        <div className={fillContainer ? "shrink-0" : undefined}>
          <RichTextEditorToolbar editor={editor} />
        </div>
      )}
      <div
        className={
          fillContainer
            ? "blog-edit-scroll relative min-h-0 flex-1 overflow-y-auto overscroll-contain"
            : "relative"
        }
        style={fillContainer ? undefined : { minHeight }}
      >
        <EditorContent editor={editor} />
        {editable && editor?.isEmpty && (
          <p className="pointer-events-none absolute left-4 top-4 text-sm text-muted-text sm:left-6">
            {placeholder}
          </p>
        )}
      </div>
    </div>
  );
}
