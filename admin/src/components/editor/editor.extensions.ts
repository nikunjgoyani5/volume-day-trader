import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import type { Extensions } from "@tiptap/react";

export const richTextEditorExtensions: Extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
  }),
  Underline,
  Highlight.configure({ multicolor: false }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-tab-active underline underline-offset-2",
    },
  }),
  Image.configure({
    HTMLAttributes: {
      class: "rounded-xl border border-white/[0.08] max-w-full h-auto",
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];
