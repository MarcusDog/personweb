import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { editorExtensions } from './editor-document';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link2,
  ImagePlus,
  Undo2,
  Redo2,
  Table2,
  X,
  FolderOpen,
} from "lucide-react";
import { api } from "./context";
import { uploadImage } from "./components";
import type { Media } from "./types";

export function MediaPicker({
  onSelect,
  onClose,
}: {
  onSelect: (media: Media) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<Media[]>([]),
    [error, setError] = useState(""),
    [query, setQuery] = useState("");
  useEffect(() => {
    ref.current?.showModal();
    void api<Media[]>("/api/admin/media")
      .then(setItems)
      .catch((e) => setError(e.message));
  }, []);
  return (
    <dialog ref={ref} className="media-picker" onCancel={onClose}>
      <div className="editor-header">
        <h2>素材库</h2>
        <button
          className="icon-button"
          aria-label="关闭素材库"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <input
        aria-label="搜索素材"
        placeholder="搜索图注或项目…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {error && <p role="alert">{error}</p>}
      <div className="media-grid">
        {items
          .filter((m) =>
            `${m.caption} ${m.projectId || ""}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          )
          .map((m) => (
            <button
              key={m.id}
              className="media-tile"
              onClick={() => onSelect(m)}
            >
              <img src={m.url} alt={m.caption} loading="lazy" />
              <p>{m.caption}</p>
              <small>
                {m.type} · {m.width}×{m.height}
              </small>
            </button>
          ))}
      </div>
    </dialog>
  );
}
export default function RichEditor({
  value,
  onChange,
  onError,
}: {
  value: string;
  onChange: (markdown: string, document: unknown) => void;
  onError: (error: string) => void;
}) {
  const change = useRef(onChange),
    error = useRef(onError),
    fileRef = useRef<HTMLInputElement>(null);
  const seenValue = useRef(value);
  const [library, setLibrary] = useState(false),
    [uploading, setUploading] = useState(false);
  useEffect(() => {
    change.current = onChange;
    error.current = onError;
  }, [onChange, onError]);
  const editor = useEditor({
    extensions: editorExtensions(),
    content: value,
    contentType: "markdown",
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor: e }) => change.current(e.getMarkdown(), e.getJSON()),
    editorProps: {
      attributes: {
        class: "prose",
        role: "textbox",
        "aria-label": "正文编辑器",
        "aria-multiline": "true",
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files || []).filter((f) =>
          f.type.startsWith("image/"),
        );
        if (!files.length) return false;
        event.preventDefault();
        void insertFile(files[0]);
        return true;
      },
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files || []).filter((f) =>
          f.type.startsWith("image/"),
        );
        if (!files.length) return false;
        event.preventDefault();
        void insertFile(files[0]);
        return true;
      },
    },
  });
  useEffect(() => {
    if (!editor || seenValue.current === value) return;
    seenValue.current = value;
    if (editor && editor.getMarkdown() !== value) {
      editor.commands.setContent(value, {
        contentType: "markdown",
        emitUpdate: false,
      });
      change.current(editor.getMarkdown(), editor.getJSON());
    }
  }, [editor, value]);
  async function insertFile(file: File) {
    if (!editor) return;
    const pos = editor.state.selection.from;
    setUploading(true);
    try {
      const m = await uploadImage(file);
      editor
        .chain()
        .focus()
        .insertContentAt(Math.min(pos, editor.state.doc.content.size), {
          type: "image",
          attrs: { src: m.url, alt: m.caption },
        })
        .run();
    } catch (e) {
      error.current((e as Error).message);
    } finally {
      setUploading(false);
    }
  }
  if (!editor) return <p>编辑器加载中…</p>;
  const commands = [
    {
      label: "加粗",
      icon: Bold,
      active: editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "斜体",
      icon: Italic,
      active: editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "无序列表",
      icon: List,
      active: editor.isActive("bulletList"),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "有序列表",
      icon: ListOrdered,
      active: editor.isActive("orderedList"),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "引用",
      icon: Quote,
      active: editor.isActive("blockquote"),
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "代码块",
      icon: Code2,
      active: editor.isActive("codeBlock"),
      run: () => editor.chain().focus().toggleCodeBlock().run(),
    },
  ];
  return (
    <>
      <div className="rich-editor">
        <div className="rich-toolbar" role="toolbar" aria-label="正文格式">
          <button
            type="button"
            className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
            aria-label="二级标题"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </button>
          <button
            type="button"
            aria-label="三级标题"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H3
          </button>
          {commands.map((c) => (
            <button
              type="button"
              key={c.label}
              title={c.label}
              aria-label={c.label}
              aria-pressed={c.active}
              className={c.active ? "active" : ""}
              onClick={c.run}
            >
              <c.icon size={16} />
            </button>
          ))}
          <button
            type="button"
            aria-label="插入链接"
            onClick={() => {
              const url = window.prompt(
                "链接地址（https://…）",
                editor.getAttributes("link").href || "https://",
              );
              if (url === null) return;
              if (!url) editor.chain().focus().unsetLink().run();
              else if (/^https?:\/\//i.test(url))
                editor.chain().focus().setLink({ href: url }).run();
              else onError("请输入完整的 http 或 https 链接");
            }}
          >
            <Link2 size={16} />
          </button>
          <button
            type="button"
            aria-label="插入表格"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            <Table2 size={16} />
          </button>
          <button
            type="button"
            aria-label="上传正文图片"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            <ImagePlus size={16} />
          </button>
          <button
            type="button"
            aria-label="从素材库插图"
            onClick={() => setLibrary(true)}
          >
            <FolderOpen size={16} />
          </button>
          <button
            type="button"
            aria-label="撤销"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 size={16} />
          </button>
          <button
            type="button"
            aria-label="重做"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 size={16} />
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void insertFile(file);
          e.target.value = "";
        }}
      />
      <div className="editor-footnote">
        <span>
          {uploading
            ? "图片上传中…"
            : "支持粘贴、拖入图片；自动转换为 Markdown。"}
        </span>
        <span>{value.length} 字符</span>
      </div>
      {library && (
        <MediaPicker
          onClose={() => setLibrary(false)}
          onSelect={(m) => {
            editor
              .chain()
              .focus()
              .setImage({ src: m.url, alt: m.caption })
              .run();
            setLibrary(false);
          }}
        />
      )}
    </>
  );
}
