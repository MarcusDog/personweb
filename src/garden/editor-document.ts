import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { Markdown } from "@tiptap/markdown";

export function editorExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      link: { openOnClick: false },
    }),
    Image.configure({ allowBase64: false }),
    TableKit,
    Markdown,
  ];
}
export function markdownDocument(markdown: string) {
  const editor = new Editor({
    element: document.createElement("div"),
    extensions: editorExtensions(),
    content: markdown,
    contentType: "markdown",
  });
  try {
    return editor.getJSON();
  } finally {
    editor.destroy();
  }
}
