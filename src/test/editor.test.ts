import { afterEach, describe, expect, it } from "vitest";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { Markdown } from "@tiptap/markdown";
import { extractMarkdownHeadings } from "../lib/markdown";
import {coverTypeForMedia,sourceLabel} from '../garden/media';
import { markdownDocument } from '../garden/editor-document';
const editors: Editor[] = [];
afterEach(() => {
  editors.forEach((e) => e.destroy());
  editors.length = 0;
});
describe("visual editor documents", () => {
  it('converts source-only edits into the same structured document schema', () => {
    const document = markdownDocument('## 源码编辑\n\n正文与 **重点**。\n\n![图](/garden/aya-avatar-choice-480.webp)');
    expect(document.type).toBe('doc');
    expect(document.content?.map(node => node.type)).toEqual(expect.arrayContaining(['heading', 'paragraph', 'image']));
  });
  it('does not label generated or unclassified media as real screenshots',()=>{expect(coverTypeForMedia('generated')).toBe('concept');expect(coverTypeForMedia('upload')).toBe('upload');expect(sourceLabel('design')).toBe('设计稿');expect(coverTypeForMedia('screenshot')).toBe('screenshot')});
  it("round-trips headings, images, tables, quotes, lists and code", () => {
    const source =
      "## 开发记录\n\n这是一段中文。\n\n![界面](/garden/avatar-480.webp)\n\n| 任务 | 状态 |\n| --- | --- |\n| 编辑 | 完成 |\n\n> 留下当时的判断\n\n- 第一项\n- 第二项\n\n```js\nconst a = 1\n```";
    const editor = new Editor({
      element: document.createElement("div"),
      extensions: [StarterKit, Image, TableKit, Markdown],
      content: source,
      contentType: "markdown",
    });
    editors.push(editor);
    const json = editor.getJSON();
    expect(json.content?.map((n) => n.type)).toEqual(
      expect.arrayContaining([
        "heading",
        "image",
        "table",
        "blockquote",
        "bulletList",
        "codeBlock",
      ]),
    );
    const output = editor.getMarkdown();
    expect(output).toContain("开发记录");
    expect(output).toContain("/garden/avatar-480.webp");
    expect(output).toMatch(/\| 任务\s+\| 状态\s+\|/);
    // Tiptap adds an editable trailing paragraph after a terminal code block.
    editor.commands.setContent(json);
    expect(editor.getMarkdown().trimEnd()).toBe(output.trimEnd());
  });
  it("keeps duplicate heading IDs unique and ignores fenced examples", () => {
    const result = extractMarkdownHeadings(
      "## 测试\n\n```md\n## 不应进入目录\n```\n\n## 测试",
    );
    expect(result.map((h) => h.id)).toEqual(["测试", "测试-1"]);
  });
});
